'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Volume2, VolumeX, Loader2, Music, Heart, Download, Share2, Copy, Sparkles, PenTool, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';

// '○○의 해' 한글 → 설정 언어 번역 (결과 문장 이중 표시용)
const YEAR_COLORS: Record<string, Record<string, string>> = {
  ko: { '푸른': '푸른', '붉은': '붉은', '노란': '노란', '흰': '흰', '검은': '검은' },
  en: { '푸른': 'Blue', '붉은': 'Red', '노란': 'Yellow', '흰': 'White', '검은': 'Black' },
  jp: { '푸른': '青', '붉은': '赤', '노란': '黄', '흰': '白', '검은': '黒' },
  th: { '푸른': 'น้ำเงิน', '붉은': 'แดง', '노란': 'เหลือง', '흰': 'ขาว', '검은': 'ดำ' },
  es: { '푸른': 'Azul', '붉은': 'Rojo', '노란': 'Amarillo', '흰': 'Blanco', '검은': 'Negro' },
  ar: { '푸른': 'أزرق', '붉은': 'أحمر', '노란': 'أصفر', '흰': 'أبيض', '검은': 'أسود' },
};
const YEAR_ANIMALS: Record<string, Record<string, string>> = {
  ko: { '쥐': '쥐', '소': '소', '호랑이': '호랑이', '토끼': '토끼', '용': '용', '뱀': '뱀', '말': '말', '양': '양', '원숭이': '원숭이', '닭': '닭', '개': '개', '돼지': '돼지' },
  en: { '쥐': 'Rat', '소': 'Ox', '호랑이': 'Tiger', '토끼': 'Rabbit', '용': 'Dragon', '뱀': 'Snake', '말': 'Horse', '양': 'Sheep', '원숭이': 'Monkey', '닭': 'Rooster', '개': 'Dog', '돼지': 'Pig' },
  jp: { '쥐': '鼠', '소': '牛', '호랑이': '虎', '토끼': '兔', '용': '龍', '뱀': '蛇', '말': '馬', '양': '羊', '원숭이': '猿', '닭': '鶏', '개': '犬', '돼지': '豚' },
  th: { '쥐': 'หนู', '소': 'วัว', '호랑이': 'เสือ', '토끼': 'กระต่าย', '용': 'มังกร', '뱀': 'งู', '말': 'ม้า', '양': 'แกะ', '원숭이': 'ลิง', '닭': 'ไก่', '개': 'สุนัข', '돼지': 'หมู' },
  es: { '쥐': 'Rata', '소': 'Buey', '호랑이': 'Tigre', '토끼': 'Conejo', '용': 'Dragón', '뱀': 'Serpiente', '말': 'Caballo', '양': 'Oveja', '원숭이': 'Mono', '닭': 'Gallo', '개': 'Perro', '돼지': 'Cerdo' },
  ar: { '쥐': 'جرذ', '소': 'ثور', '호랑이': 'نمر', '토끼': 'أرنب', '용': 'تنين', '뱀': 'ثعبان', '말': 'حصان', '양': 'خروف', '원숭이': 'قرد', '닭': 'ديك', '개': 'كلب', '돼지': 'خنزير' },
};
function getYearPhraseInLanguage(koreanPhrase: string, lang: string): string {
  const key = (lang === 'kr' || lang === 'korean') ? 'ko' : lang;
  const colors = YEAR_COLORS[key] || YEAR_COLORS.en;
  const animals = YEAR_ANIMALS[key] || YEAR_ANIMALS.en;
  const match = koreanPhrase.match(/^(.+?)\s+(.+?)의 해$/);
  if (!match) return koreanPhrase;
  const colorKo = match[1];
  const animalKo = match[2];
  const color = colors[colorKo] ?? colorKo;
  const animal = animals[animalKo] ?? animalKo;
  if (key === 'ko') return `${color} ${animal}의 해`;
  if (key === 'en') return `${color} ${animal}`;
  if (key === 'jp') return `${color}${animal}`;
  if (key === 'es' || key === 'ar') return `${animal} ${color}`; // 스페인어·아랍어: 동물+색
  return `${color} ${animal}`;
}

       export default function Home() {
  const [inputs, setInputs] = useState({ userName: '', userBirthday: '', userGender: 'Female', idolName: '', language: 'en' });
  const [birthday, setBirthday] = useState({ year: '', month: '', day: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [idolData, setIdolData] = useState({ image: '', track: '', previewUrl: '', displayName: '' });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [resolvedIdol, setResolvedIdol] = useState<{ group?: string; searchTerm?: string; surname?: string; surnameEn?: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
         const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [openChangelog, setOpenChangelog] = useState<number | null>(0);

  const CHANGELOG_SEEN_KEY = 'myKpopNameChangelogSeen';
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem(CHANGELOG_SEEN_KEY);
    if (!seen || seen < '260306') setShowChangelogModal(true);
  }, []);
  
  // 생일 입력 자동 이동을 위한 refs
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const idolInputRef = useRef<HTMLInputElement>(null);
  
  // 생일 입력 핸들러 (자동 다음 필드 이동)
  const handleBirthdayChange = (field: 'year' | 'month' | 'day', value: string) => {
    // 숫자만 허용
    const numValue = value.replace(/\D/g, '');
    
    const newBirthday = { ...birthday, [field]: numValue };
    setBirthday(newBirthday);
    
    // 완성된 생일을 inputs에 저장 (YYYY-MM-DD 형식)
    if (newBirthday.year.length === 4 && newBirthday.month.length >= 1 && newBirthday.day.length >= 1) {
      const formattedDate = `${newBirthday.year}-${newBirthday.month.padStart(2, '0')}-${newBirthday.day.padStart(2, '0')}`;
      setInputs(prev => ({ ...prev, userBirthday: formattedDate }));
    }
    
    // 자동 다음 필드 이동
    if (field === 'year' && numValue.length === 4) {
      monthRef.current?.focus();
    } else if (field === 'month' && numValue.length === 2) {
      dayRef.current?.focus();
    } else if (field === 'day' && numValue.length === 2) {
      genderRef.current?.focus();
    }
  };

  // 외부 클릭 시 검색 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSearchResults &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        idolInputRef.current &&
        !idolInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  // 📸 이미지로 저장하기 (인스타그램 공유용)
  const downloadAsImage = async () => {
    if (!resultCardRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(resultCardRef.current, {
        cacheBust: true,
        backgroundColor: '#0a0a0a',
      });

      const link = document.createElement('a');
      link.download = `my-kpop-name-${result.korean_name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Image download failed:', err);
    }
  };

  // 📋 텍스트 복사하기
  const copyToClipboard = async () => {
    if (!result) return;
    
    const text = `${txt.shareMeta}\n\n✨ ${txt.title} ✨\n\n${result.korean_name} (${result.romanized})\n${txt.resScore}: ${result.compatibility_score}%\n${txt.resReason}: ${result.compatibility_reason}\n\n#MyKpopName #${inputs.idolName.replace(/\s/g, '')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert(txt.shareAlert || 'Copied!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // 📤 네이티브 공유 (모바일)
  const shareResult = async () => {
    if (!result) return;
    
    const shareData = {
      title: txt.title,
      text: `${txt.shareMeta}\n\n${result.korean_name} (${result.romanized}) - ${txt.resScore}: ${result.compatibility_score}%`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  // 📝 6개 국어 완벽 번역 데이터 (질문 + 버튼 + 결과 라벨 + 플레이스홀더)
  const t: any = {
    en: { 
      title: "My K-POP Name", 
      subtitle: "Find a name perfectly compatible with your Bias! 💘", 
      lblLanguage: "Select Language",
      lblName: "What is your name?", 
      phName: "e.g. Emily",
      lblBirthday: "When is your birthday? 🎂",
      lblGender: "Select your Gender", 
      optFemale: "Girl 👧", optMale: "Boy 👦", optUnisex: "Unisex ✨",
      lblBias: "Who is your Ultimate Bias?", 
      phBias: "e.g. Jennie, RM",
      btn: "Get My Zodiac & Korean Name ✨", 
      loading: "Asking your Bias...",
      // 결과창 라벨
      resScore: "MATCH SCORE",
      resReason: "Why this match? 🔥",
      resMeaning: "Name Meaning",
      // 하단 안내
      footerPrivacy: "This service does not store any personal information entered.",
      footerDesc: "This service uses AI to create Korean names with the same surname as your ultimate bias.",
             footerMore: "More details",
             footerModalTitle: "Privacy & Cookies",
             footerModalBody: "DATA COLLECTION & STORAGE:\n• This service does NOT permanently store any personal information you enter (name, birthday, gender, idol preference).\n• All inputs are processed in real-time via Google Gemini AI API to generate your K-POP name and are immediately discarded after generation.\n• No user data is saved to our servers or databases.\n\nTHIRD-PARTY SERVICES:\n• Google Analytics: Used to collect anonymized usage statistics (page views, device type, approximate region). Uses cookies for this purpose.\n• Google Gemini AI: Processes your inputs to generate Korean names. Data is sent to Google's servers but not stored by us.\n• iTunes Search API: Used to search for K-POP idols and music previews. Your search queries may be processed by Apple's servers.\n• Ko-fi: If you choose to support via the Ko-fi button, you will be redirected to Ko-fi's website. Ko-fi's privacy policy applies to any transactions.\n\nCOOKIES:\n• We use cookies only for analytics purposes (Google Analytics).\n• These cookies collect anonymized data and do not personally identify you.\n• You can disable cookies in your browser settings, though this may affect some functionality.\n\nYOUR RIGHTS:\n• You can use this service without providing any personal information (birthday is optional).\n• All data processing happens in real-time and is not retained.\n• If you have concerns, please contact us or avoid using the service.",
      // 공유
      shareTitle: "Share Result",
      shareDownload: "Save Image",
      shareCopy: "Copy",
      shareAlert: "Copied to clipboard!",
      shareMeta: "Make a Korean name with the same family name as your ultimate bias!!!!!!😍🎶💖🥰",
      // 검색
      searchResults: "Search Results",
      searchNoResults: "No results found",
      searchSelect: "Select",
      // 성씨
      sameSurname: "Same Family Name",
      // Ko-fi
      kofiText: "Enjoyed? Support the developer! ☕",
      // 로딩 단계
      loadingStep1: "Extracting your bias's surname...",
      loadingStep2: "Creating Korean name...",
      loadingStep3: "Calculating compatibility...",
      yearNameIntro: "Your Korean name born in the year of the {0} is",
      yearNameEnd: "."
    },
    ko: { 
      title: "나의 케이팝 이름", 
      subtitle: "최애와 찰떡궁합인 내 이름은? 💘", 
      lblLanguage: "언어 선택",
      lblName: "당신의 이름은 무엇인가요?", 
      phName: "예: 김이름",
      lblBirthday: "생일이 언제인가요? 🎂",
      lblGender: "성별을 선택해주세요", 
      optFemale: "여성 👧", optMale: "남성 👦", optUnisex: "무관 ✨",
      lblBias: "당신의 '최애'는 누구인가요?", 
      phBias: "예: 제니, RM",
      btn: "나의 띠와 한국이름 보기 ✨", 
      loading: "최애에게 허락받는 중...",
      resScore: "궁합 점수",
      resReason: "우리가 천생연분인 이유 🔥",
      resMeaning: "이름의 뜻",
      footerPrivacy: "본 서비스는 입력된 개인 정보를 저장하지 않습니다.",
      footerDesc: "본 서비스는 AI를 활용하여 최애의 성과 같은 성으로 한국 이름을 지어주는 서비스입니다.",
             footerMore: "자세히 보기",
             footerModalTitle: "개인정보 및 쿠키 안내",
             footerModalBody: "데이터 수집 및 저장:\n• 본 서비스는 사용자가 입력한 이름, 생년월일, 성별, 최애 정보 등 개인 정보를 서버에 영구 저장하지 않습니다.\n• 모든 입력 정보는 Google Gemini AI API를 통해 실시간으로 처리되어 K-POP 이름을 생성하며, 생성 후 즉시 폐기됩니다.\n• 사용자 데이터는 서버나 데이터베이스에 저장되지 않습니다.\n\n외부 서비스 사용:\n• Google Analytics: 익명화된 이용 통계(페이지 조회수, 기기 유형, 대략적 지역) 수집을 위해 사용됩니다. 쿠키를 사용합니다.\n• Google Gemini AI: 입력 정보를 처리하여 한국 이름을 생성합니다. 데이터는 Google 서버로 전송되지만, 저희가 저장하지는 않습니다.\n• iTunes Search API: K-POP 아이돌 및 음악 미리듣기 검색에 사용됩니다. 검색어는 Apple 서버에서 처리될 수 있습니다.\n• Ko-fi: Ko-fi 버튼을 통해 후원하시는 경우, Ko-fi 웹사이트로 이동합니다. 거래 관련 사항은 Ko-fi의 개인정보 처리방침이 적용됩니다.\n\n쿠키:\n• 분석 목적(Google Analytics)으로만 쿠키를 사용합니다.\n• 이러한 쿠키는 익명화된 데이터를 수집하며, 개인을 식별하지 않습니다.\n• 브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능에 영향을 줄 수 있습니다.\n\n사용자 권리:\n• 개인 정보 없이도 서비스를 이용할 수 있습니다(생년월일은 선택 사항).\n• 모든 데이터 처리는 실시간으로 이루어지며 보관되지 않습니다.\n• 문의사항이 있으시면 연락 주시거나 서비스 이용을 중단하실 수 있습니다.",
      shareTitle: "결과 공유하기",
      shareDownload: "이미지 저장",
      shareCopy: "복사",
      shareAlert: "클립보드에 복사되었습니다!",
      shareMeta: "당신의 최애와 같은 성을 가진 한국 이름을 만들어 보세요!!!!!!😍🎶💖🥰",
      searchResults: "검색 결과",
      searchNoResults: "검색 결과가 없습니다",
      searchSelect: "선택",
      sameSurname: "같은 성씨",
      kofiText: "재밌으셨나요? 개발자에게 커피 한잔! ☕",
      // 로딩 단계
      loadingStep1: "최애의 성 추출중...",
      loadingStep2: "한국이름 짓는중...",
      loadingStep3: "궁합보는중...",
      yearNameIntro: "{0}에 태어난 당신의 한국 이름은",
      yearNameEnd: "입니다."
    },
    jp: {
      title: "私のK-POP名",
      subtitle: "推しと相性ぴったりの名前は？ 💘",
      lblLanguage: "言語選択",
      lblName: "あなたの名前は何ですか？",
      phName: "例: 田中",
      lblBirthday: "誕生日はいつですか？ 🎂",
      lblGender: "性別を選択してください",
      optFemale: "女性 👧", optMale: "男性 👦", optUnisex: "性別なし ✨",
      lblBias: "あなたの「最推し」は誰ですか？",
      phBias: "例: Jennie, RM",
      btn: "私の干支と韓国名を見る ✨",
      loading: "推しに許可をもらっています...",
      resScore: "相性スコア",
      resReason: "相性抜群の理由 🔥",
      resMeaning: "名前の意味",
      footerPrivacy: "本サービスは入力された個人情報を保存しません。",
      footerDesc: "本サービスはAIを活用して、推しと同じ苗字の韓国名を作成するサービスです。",
             footerMore: "詳細を見る",
             footerModalTitle: "プライバシーとクッキーについて",
             footerModalBody: "データの収集と保存:\n• 本サービスは、入力された名前、誕生日、性別、推しの情報などの個人情報をサーバーに永続的に保存しません。\n• すべての入力情報は、Google Gemini AI APIを通じてリアルタイムで処理され、K-POP名を生成した後、即座に破棄されます。\n• ユーザーデータはサーバーやデータベースに保存されません。\n\n外部サービスの利用:\n• Google Analytics: 匿名化された利用統計（ページビュー、デバイスタイプ、おおよその地域）を収集するために使用されます。この目的でクッキーを使用します。\n• Google Gemini AI: 入力情報を処理して韓国名を生成します。データはGoogleのサーバーに送信されますが、当社が保存することはありません。\n• iTunes Search API: K-POPアイドルや音楽プレビューの検索に使用されます。検索クエリはAppleのサーバーで処理される場合があります。\n• Ko-fi: Ko-fiボタンを通じてサポートする場合、Ko-fiのウェブサイトにリダイレクトされます。取引に関する事項はKo-fiのプライバシーポリシーが適用されます。\n\nクッキー:\n• 分析目的（Google Analytics）でのみクッキーを使用します。\n• これらのクッキーは匿名化されたデータを収集し、個人を特定しません。\n• ブラウザ設定でクッキーを無効にすることができますが、一部の機能に影響を与える可能性があります。\n\nユーザーの権利:\n• 個人情報を提供せずにサービスを利用できます（誕生日は任意）。\n• すべてのデータ処理はリアルタイムで行われ、保持されません。\n• ご不明な点がございましたら、お問い合わせいただくか、サービスの利用を中止してください。",
      shareTitle: "結果をシェア",
      shareDownload: "画像保存",
      shareCopy: "コピー",
      shareAlert: "コピーしました！",
      shareMeta: "推しと同じ苗字の韓国語の名前を作ってみよう!!!!!!😍🎶💖🥰",
      searchResults: "検索結果",
      searchNoResults: "結果が見つかりません",
      searchSelect: "選択",
      sameSurname: "同じ姓",
      kofiText: "楽しんでいただけましたか？開発者にコーヒーを一杯！ ☕",
      // 로딩 단계
      loadingStep1: "推しの姓を抽出中...",
      loadingStep2: "韓国名を作成中...",
      loadingStep3: "相性を計算中...",
      yearNameIntro: "{0}の年に生まれたあなたの韓国名は",
      yearNameEnd: "です。"
    },
    th: {
      title: "ชื่อ K-POP ของฉัน",
      subtitle: "ค้นหาชื่อที่เข้ากับเมนของคุณที่สุด! 💘",
      lblLanguage: "เลือกภาษา",
      lblName: "คุณชื่ออะไร?",
      phName: "เช่น สมชาย",
      lblBirthday: "วันเกิดของคุณคือเมื่อไหร่? 🎂",
      lblGender: "เลือกเพศของคุณ",
      optFemale: "หญิง 👧", optMale: "ชาย 👦", optUnisex: "ไม่ระบุ ✨",
      lblBias: "เมน (Ultimate Bias) ของคุณคือใคร?",
      phBias: "เช่น Lisa, BamBam",
      btn: "ดูนักษัตรและชื่อเกาหลีของฉัน ✨",
      loading: "กำลังขออนุญาตเมนของคุณ...",
      resScore: "คะแนนความเข้ากัน",
      resReason: "ทำไมถึงเข้ากันได้ดี? 🔥",
      resMeaning: "ความหมายของชื่อ",
      footerPrivacy: "บริการนี้ไม่เก็บข้อมูลส่วนบุคคลที่ป้อน",
      footerDesc: "บริการนี้ใช้ AI เพื่อสร้างชื่อเกาหลีที่มีนามสกุลเดียวกับเมนของคุณ",
             footerMore: "ดูรายละเอียด",
             footerModalTitle: "ข้อมูลส่วนบุคคลและคุกกี้",
             footerModalBody: "การเก็บรวบรวมและจัดเก็บข้อมูล:\n• บริการนี้จะไม่เก็บข้อมูลส่วนบุคคลที่คุณป้อน (ชื่อ วันเกิด เพศ ความชอบในไอดอล) ไว้บนเซิร์ฟเวอร์อย่างถาวร\n• ข้อมูลที่ป้อนทั้งหมดจะถูกประมวลผลแบบเรียลไทม์ผ่าน Google Gemini AI API เพื่อสร้างชื่อ K-POP และจะถูกทิ้งทันทีหลังจากการสร้าง\n• ไม่มีการบันทึกข้อมูลผู้ใช้ไว้บนเซิร์ฟเวอร์หรือฐานข้อมูลของเรา\n\nบริการของบุคคลที่สาม:\n• Google Analytics: ใช้เพื่อรวบรวมสถิติการใช้งานแบบไม่ระบุตัวตน (จำนวนการดูหน้า ประเภทอุปกรณ์ ภูมิภาคโดยประมาณ) ใช้คุกกี้เพื่อจุดประสงค์นี้\n• Google Gemini AI: ประมวลผลข้อมูลที่คุณป้อนเพื่อสร้างชื่อเกาหลี ข้อมูลจะถูกส่งไปยังเซิร์ฟเวอร์ของ Google แต่เราไม่ได้เก็บไว้\n• iTunes Search API: ใช้เพื่อค้นหาไอดอล K-POP และตัวอย่างเพลง คำค้นหาของคุณอาจถูกประมวลผลโดยเซิร์ฟเวอร์ของ Apple\n• Ko-fi: หากคุณเลือกสนับสนุนผ่านปุ่ม Ko-fi คุณจะถูกเปลี่ยนเส้นทางไปยังเว็บไซต์ Ko-fi นโยบายความเป็นส่วนตัวของ Ko-fi จะใช้กับธุรกรรมใดๆ\n\nคุกกี้:\n• เราใช้คุกกี้เพื่อการวิเคราะห์เท่านั้น (Google Analytics)\n• คุกกี้เหล่านี้รวบรวมข้อมูลแบบไม่ระบุตัวตนและไม่ระบุตัวตนของคุณ\n• คุณสามารถปิดการใช้งานคุกกี้ในการตั้งค่าเบราว์เซอร์ของคุณได้ แม้ว่านี่อาจส่งผลกระทบต่อฟังก์ชันการทำงานบางอย่าง\n\nสิทธิ์ของคุณ:\n• คุณสามารถใช้บริการนี้ได้โดยไม่ต้องให้ข้อมูลส่วนบุคคล (วันเกิดเป็นทางเลือก)\n• การประมวลผลข้อมูลทั้งหมดเกิดขึ้นแบบเรียลไทม์และไม่ถูกเก็บไว้\n• หากคุณมีข้อกังวล โปรดติดต่อเราหรือหลีกเลี่ยงการใช้บริการ",
      shareTitle: "แชร์ผลลัพธ์",
      shareDownload: "บันทึกรูป",
      shareCopy: "คัดลอก",
      shareAlert: "คัดลอกแล้ว!",
      shareMeta: "สร้างชื่อเกาหลีที่ใช้นามสกุลเดียวกับเมนของคุณเลย!!!!!!😍🎶💖🥰",
      searchResults: "ผลการค้นหา",
      searchNoResults: "ไม่พบผลลัพธ์",
      searchSelect: "เลือก",
      sameSurname: "นามสกุลเดียวกัน",
      kofiText: "สนุกไหม? รองรับนักพัฒนา! ☕",
      // 로딩 단계
      loadingStep1: "กำลังดึงนามสกุลของเมน...",
      loadingStep2: "กำลังสร้างชื่อเกาหลี...",
      loadingStep3: "กำลังคำนวณความเข้ากัน...",
      yearNameIntro: "ชื่อเกาหลีของคุณที่เกิดในปี{0} คือ",
      yearNameEnd: ""
    },
    es: {
      title: "Mi Nombre K-POP",
      subtitle: "¡Encuentra un nombre compatible con tu Bias! 💘",
      lblLanguage: "Seleccionar idioma",
      lblName: "¿Cómo te llamas?",
      phName: "ej. Maria",
      lblBirthday: "¿Cuándo es tu cumpleaños? 🎂",
      lblGender: "Selecciona tu género",
      optFemale: "Mujer 👧", optMale: "Hombre 👦", optUnisex: "Unisex ✨",
      lblBias: "¿Quién es tu Bias Supremo?",
      phBias: "ej. V, Karina",
      btn: "Ver Mi Zodíaco y Nombre Coreano ✨",
      loading: "Pidiendo permiso a tu Bias...",
      resScore: "PUNTUACIÓN",
      resReason: "¿Por qué hacemos match? 🔥",
      resMeaning: "Significado del nombre",
      footerPrivacy: "Este servicio no almacena ninguna información personal ingresada.",
      footerDesc: "Este servicio utiliza IA para crear nombres coreanos con el mismo apellido que tu Bias.",
             footerMore: "Ver más detalles",
             footerModalTitle: "Privacidad y cookies",
             footerModalBody: "RECOPILACIÓN Y ALMACENAMIENTO DE DATOS:\n• Este servicio NO almacena de forma permanente ninguna información personal que ingreses (nombre, fecha de nacimiento, género, preferencia de ídolo).\n• Todas las entradas se procesan en tiempo real a través de la API de Google Gemini AI para generar tu nombre K-POP y se descartan inmediatamente después de la generación.\n• No se guardan datos de usuario en nuestros servidores o bases de datos.\n\nSERVICIOS DE TERCEROS:\n• Google Analytics: Se utiliza para recopilar estadísticas de uso anonimizadas (vistas de página, tipo de dispositivo, región aproximada). Utiliza cookies para este propósito.\n• Google Gemini AI: Procesa tus entradas para generar nombres coreanos. Los datos se envían a los servidores de Google pero no los almacenamos.\n• API de búsqueda de iTunes: Se utiliza para buscar ídolos K-POP y vistas previas de música. Tus consultas de búsqueda pueden ser procesadas por los servidores de Apple.\n• Ko-fi: Si eliges apoyar a través del botón Ko-fi, serás redirigido al sitio web de Ko-fi. La política de privacidad de Ko-fi se aplica a cualquier transacción.\n\nCOOKIES:\n• Solo utilizamos cookies con fines analíticos (Google Analytics).\n• Estas cookies recopilan datos anonimizados y no te identifican personalmente.\n• Puedes desactivar las cookies en la configuración de tu navegador, aunque esto puede afectar algunas funcionalidades.\n\nTUS DERECHOS:\n• Puedes usar este servicio sin proporcionar información personal (la fecha de nacimiento es opcional).\n• Todo el procesamiento de datos ocurre en tiempo real y no se retiene.\n• Si tienes inquietudes, contáctanos o evita usar el servicio.",
      shareTitle: "Compartir resultado",
      shareDownload: "Guardar imagen",
      shareCopy: "Copiar",
      shareAlert: "¡Copiado!",
      shareMeta: "¡Crea un nombre coreano con el mismo apellido que tu Bias definitivo!!!!!!😍🎶💖🥰",
      searchResults: "Resultados de búsqueda",
      searchNoResults: "No se encontraron resultados",
      searchSelect: "Seleccionar",
      sameSurname: "Mismo apellido",
      kofiText: "¿Te gustó? ¡Apoya al desarrollador! ☕",
      // 로딩 단계
      loadingStep1: "Extrayendo el apellido de tu Bias...",
      loadingStep2: "Creando nombre coreano...",
      loadingStep3: "Calculando compatibilidad...",
      yearNameIntro: "Tu nombre coreano nacido en el año del {0} es",
      yearNameEnd: "."
    },
    ar: {
      title: "اسم الكيبوب الخاص بي",
      subtitle: "اعثر على اسم متوافق تمامًا مع البايس الخاص بك! 💘",
      lblLanguage: "اختار اللغة",
      lblName: "ما هو اسمك؟",
      phName: "مثال: مريم",
      lblBirthday: "متى عيد ميلادك؟ 🎂",
      lblGender: "اختر جنسك",
      optFemale: "أنثى 👧", optMale: "ذكر 👦", optUnisex: "غير محدد ✨",
      lblBias: "من هو البايس الخاص بك؟",
      phBias: "مثال: Jimin, RM",
      btn: "اكتشف برجي واسمي الكوري ✨",
      loading: "جاري طلب الإذن من البايس...",
      resScore: "نتيجة التوافق",
      resReason: "لماذا هذا التوافق؟ 🔥",
      resMeaning: "معنى الاسم",
      footerPrivacy: "هذه الخدمة لا تخزن أي معلومات شخصية تم إدخالها.",
      footerDesc: "تستخدم هذه الخدمة الذكاء الاصطناعي لإنشاء أسماء كورية بنفس لقب البايس الخاص بك.",
             footerMore: "مزيد من التفاصيل",
             footerModalTitle: "الخصوصية وملفات تعريف الارتباط",
             footerModalBody: "جمع البيانات والتخزين:\n• لا تقوم هذه الخدمة بتخزين أي معلومات شخصية تدخلها (الاسم، تاريخ الميلاد، الجنس، تفضيل الأيدول) بشكل دائم.\n• تتم معالجة جميع المدخلات في الوقت الفعلي عبر واجهة برمجة تطبيقات Google Gemini AI لإنشاء اسم K-POP الخاص بك ويتم التخلص منها فورًا بعد الإنشاء.\n• لا يتم حفظ بيانات المستخدم على خوادمنا أو قواعد البيانات.\n\nخدمات الطرف الثالث:\n• Google Analytics: يُستخدم لجمع إحصائيات الاستخدام المجهولة (مشاهدات الصفحة، نوع الجهاز، المنطقة التقريبية). يستخدم ملفات تعريف الارتباط لهذا الغرض.\n• Google Gemini AI: يعالج مدخلاتك لإنشاء أسماء كورية. يتم إرسال البيانات إلى خوادم Google لكننا لا نخزنها.\n• واجهة برمجة تطبيقات بحث iTunes: تُستخدم للبحث عن أيدولات K-POP ومعاينات الموسيقى. قد تتم معالجة استعلامات البحث الخاصة بك بواسطة خوادم Apple.\n• Ko-fi: إذا اخترت الدعم عبر زر Ko-fi، سيتم إعادة توجيهك إلى موقع Ko-fi. تنطبق سياسة خصوصية Ko-fi على أي معاملات.\n\nملفات تعريف الارتباط:\n• نستخدم ملفات تعريف الارتباط فقط لأغراض التحليل (Google Analytics).\n• تجمع ملفات تعريف الارتباط هذه بيانات مجهولة ولا تحدد هويتك شخصيًا.\n• يمكنك تعطيل ملفات تعريف الارتباط في إعدادات المتصفح الخاص بك، على الرغم من أن هذا قد يؤثر على بعض الوظائف.\n\nحقوقك:\n• يمكنك استخدام هذه الخدمة دون تقديم أي معلومات شخصية (تاريخ الميلاد اختياري).\n• تحدث جميع معالجة البيانات في الوقت الفعلي ولا يتم الاحتفاظ بها.\n• إذا كانت لديك مخاوف، يرجى الاتصال بنا أو تجنب استخدام الخدمة.",
      shareTitle: "مشاركة النتيجة",
      shareDownload: "حفظ الصورة",
      shareCopy: "نسخ",
      shareAlert: "تم النسخ!",
      shareMeta: "اصنع اسم كيبوب كوريًا بنفس لقب البايس الخاص بك!!!!!!😍🎶💖🥰",
      searchResults: "نتائج البحث",
      searchNoResults: "لم يتم العثور على نتائج",
      searchSelect: "اختر",
      sameSurname: "نفس اللقب",
      kofiText: "استمتعت؟ ادعم المطور! ☕",
      // 로딩 단계
      loadingStep1: "جارٍ استخراج لقب البايس...",
      loadingStep2: "جارٍ إنشاء الاسم الكوري...",
      loadingStep3: "جارٍ حساب التوافق...",
      yearNameIntro: "اسمك الكوري المولود في عام {0} هو",
      yearNameEnd: "."
    }
  };
  
  const txt = t[inputs.language] || t.en;

  // 아랍어일 경우 RTL(오른쪽 정렬) 적용
  const isRTL = inputs.language === 'ar';

  // iTunes 검색 공통 로직
  const searchItunes = async (searchTerm: string, limit: number = 25) => {
    const term = `${searchTerm} kpop`;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        term
      )}&entity=song&media=music&country=KR&limit=${limit}`
    );
    const data = await res.json();
    
    if (data.resultCount === 0) return [];
    
    const artistMap = new Map();
    data.results.forEach((song: any) => {
      const genre = (song.primaryGenreName || '').toLowerCase();
      const collection = (song.collectionName || '').toLowerCase();
      const isKoreanKpop =
        genre.includes('k-pop') ||
        collection.includes('k-pop') ||
        collection.includes('korea') ||
        collection.includes('korean');

      if (!isKoreanKpop) return;

      const artistName = song.artistName.toLowerCase();
      if (!artistMap.has(artistName)) {
        artistMap.set(artistName, {
          artistName: song.artistName,
          trackName: song.trackName,
          artworkUrl: song.artworkUrl100.replace('100x100', '600x600'),
          previewUrl: song.previewUrl,
          collectionName: song.collectionName || ''
        });
      }
    });

    if (artistMap.size === 0) {
      data.results.forEach((song: any) => {
        if (!song.previewUrl) return;
        const artistName = song.artistName.toLowerCase();
        if (!artistMap.has(artistName)) {
          artistMap.set(artistName, {
            artistName: song.artistName,
            trackName: song.trackName,
            artworkUrl: song.artworkUrl100.replace('100x100', '600x600'),
            previewUrl: song.previewUrl,
            collectionName: song.collectionName || ''
          });
        }
      });
    }

    return Array.from(artistMap.values());
  };

  // 🔍 최애 검색: resolve-idol → 그룹명 확인 → 그룹명으로 iTunes 검색
  const searchIdol = async () => {
    if (inputs.idolName.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setSearching(true);
    setShowSearchResults(true);
    
    try {
      // 1단계: resolve-idol API로 아이돌 그룹 확인
      let searchTerm = inputs.idolName;
      try {
        const resolveRes = await fetch('/api/resolve-idol', {
          method: 'POST',
          body: JSON.stringify({ idolName: inputs.idolName }),
        });
        const resolveData = await resolveRes.json();
        
        if (resolveData.found && resolveData.searchTerm) {
          searchTerm = resolveData.searchTerm;
          setResolvedIdol({
            group: resolveData.group,
            searchTerm: resolveData.searchTerm,
            surname: resolveData.surname,
            surnameEn: resolveData.surnameEn,
          });
          console.log(`✅ Resolved idol: "${inputs.idolName}" → group: "${resolveData.group}", searchTerm: "${resolveData.searchTerm}"`);
        } else {
          setResolvedIdol(null);
        }
      } catch (resolveError) {
        console.warn('⚠️ resolve-idol failed, using original name:', resolveError);
        setResolvedIdol(null);
      }
      
      // 2단계: 확인된 그룹명(또는 원래 이름)으로 iTunes 검색
      const results = await searchItunes(searchTerm);
      
      // 그룹명으로 검색했는데 결과가 없으면 원래 이름으로 재시도
      if (results.length === 0 && searchTerm !== inputs.idolName) {
        console.log(`⚠️ No results for "${searchTerm}", retrying with "${inputs.idolName}"`);
        const fallbackResults = await searchItunes(inputs.idolName);
        setSearchResults(fallbackResults);
      } else {
        setSearchResults(results);
      }
    } catch (e) {
      console.error('Search error:', e);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ✅ 최애 선택
  // IMPORTANT: inputs.idolName(사용자가 입력한 편애 멤버 이름)은 절대 덮어쓰지 않는다.
  // iTunes 검색 결과의 artistName(그룹명 등)은 idolData에만 저장해 표시/미리듣기용으로 쓴다.
  // 이렇게 해야 "지민"을 입력했는데 "방탄소년단"으로 치환되어 다른 멤버가 매칭되는 사고를 방지한다.
  const selectIdol = (selected: any) => {
    setIdolData({
      image: selected.artworkUrl,
      track: `${selected.trackName} - ${selected.artistName}`,
      previewUrl: selected.previewUrl,
      displayName: selected.artistName
    });
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const generateName = async () => {
    if (!inputs.userName || !inputs.idolName) return alert("Please fill in all fields!");
    setLoading(true);
    setResult(null);
    setShowLoadingModal(true);
    setLoadingStep(0);
    
    // idolData가 없으면 아이돌 검색 시도 (previewUrl을 얻기 위해)
    let currentPreviewUrl = idolData.previewUrl;
    let currentIdolData = { ...idolData };
    
    if (!currentPreviewUrl && inputs.idolName) {
      console.log('🔍 No previewUrl found, attempting to search for idol:', inputs.idolName);
      try {
        // resolve-idol로 그룹명 확인 후 그룹명으로 iTunes 검색
        let searchTerm = inputs.idolName;
        if (resolvedIdol?.searchTerm) {
          searchTerm = resolvedIdol.searchTerm;
        } else {
          try {
            const resolveRes = await fetch('/api/resolve-idol', {
              method: 'POST',
              body: JSON.stringify({ idolName: inputs.idolName }),
            });
            const resolveData = await resolveRes.json();
            if (resolveData.found && resolveData.searchTerm) {
              searchTerm = resolveData.searchTerm;
              setResolvedIdol({
                group: resolveData.group,
                searchTerm: resolveData.searchTerm,
                surname: resolveData.surname,
                surnameEn: resolveData.surnameEn,
              });
            }
          } catch { /* fallback to original name */ }
        }

        const results = await searchItunes(searchTerm, 5);
        
        // 그룹명으로 못 찾으면 원래 이름으로 재시도
        let songs = results;
        if (songs.length === 0 && searchTerm !== inputs.idolName) {
          songs = await searchItunes(inputs.idolName, 5);
        }
        
        if (songs.length > 0) {
          const firstSong = songs[0];
          if (firstSong.previewUrl) {
            currentIdolData = {
              image: firstSong.artworkUrl,
              track: `${firstSong.trackName} - ${firstSong.artistName}`,
              previewUrl: firstSong.previewUrl,
              displayName: firstSong.artistName
            };
            currentPreviewUrl = firstSong.previewUrl;
            setIdolData(currentIdolData);
            console.log('✅ Found previewUrl for idol via group search:', firstSong.previewUrl);
          }
        }
      } catch (searchError) {
        console.warn('⚠️ Failed to search for idol music:', searchError);
      }
    }
    
    // 바로 직전에 나온 한국 이름을 함께 보내서, 같은 이름이 연속으로 나오지 않도록 힌트 제공
    const payload = {
      ...inputs,
      lastKoreanName: result?.korean_name || '',
    };

    // 단계별 시뮬레이션
    const stepTimer1 = setTimeout(() => {
      setLoadingStep(1);
    }, 1000);
    
    const stepTimer2 = setTimeout(() => {
      setLoadingStep(2);
    }, 2500);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      // 타이머 정리
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      
      if (data.error) { 
        setShowLoadingModal(false);
        alert("Error: " + data.error); 
        return; 
      }
      
      // 마지막 단계로 설정 후 잠시 대기
      setLoadingStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResult(data);
      setShowLoadingModal(false);

      // generate API에서 반환한 idol_group으로 resolvedIdol 업데이트
      if (data.idol_group) {
        setResolvedIdol(prev => ({ ...prev, group: data.idol_group, searchTerm: data.idol_group }));
      }
      
      // idol_group이 있는데 previewUrl이 없으면 그룹명으로 iTunes 재검색
      if (!currentPreviewUrl && data.idol_group) {
        try {
          const groupSongs = await searchItunes(data.idol_group, 5);
          if (groupSongs.length > 0 && groupSongs[0].previewUrl) {
            currentIdolData = {
              image: groupSongs[0].artworkUrl,
              track: `${groupSongs[0].trackName} - ${groupSongs[0].artistName}`,
              previewUrl: groupSongs[0].previewUrl,
              displayName: groupSongs[0].artistName
            };
            currentPreviewUrl = groupSongs[0].previewUrl;
            setIdolData(currentIdolData);
          }
        } catch { /* ignore */ }
      }
      
      // 음악 자동 재생 (사용자 상호작용 후이므로 가능)
      const previewUrlToUse = currentPreviewUrl || idolData.previewUrl;
      
      console.log('🎵 Music playback check:', {
        hasPreviewUrl: !!previewUrlToUse,
        previewUrl: previewUrlToUse,
        hasAudioRef: !!audioRef.current,
        currentIdolData: currentIdolData,
        idolData: idolData
      });
      
      if (previewUrlToUse && audioRef.current) {
        const audio = audioRef.current;
        try {
          audio.pause(); // 기존 재생 먼저 중지
          audio.currentTime = 0;
          audio.src = previewUrlToUse;
          audio.volume = 0.3;
          
          console.log('🎵 Attempting to play music:', previewUrlToUse);
          
          // play() Promise 안전 처리
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('✅ Music playback started successfully');
                setIsPlaying(true);
              })
              .catch((err) => {
                console.error('❌ Audio autoplay blocked or failed:', err.message, err);
                setIsPlaying(false);
              });
          } else {
            console.warn('⚠️ play() returned undefined');
            setIsPlaying(false);
          }
        } catch (error: any) {
          console.error('❌ Error setting up audio:', error.message, error);
          setIsPlaying(false);
        }
      } else {
        console.warn('⚠️ Cannot play music:', {
          reason: !previewUrlToUse ? 'No previewUrl' : 'No audioRef',
          previewUrl: previewUrlToUse,
          audioRef: !!audioRef.current
        });
      }
    } catch (e) { 
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setShowLoadingModal(false);
      alert("Something went wrong. Please try again!"); 
    } 
    finally { 
      setLoading(false);
      setLoadingStep(0);
    }
  };

  // 🔊 한국어 이름 발음 듣기 (TTS) - 한 글자씩 천천히 (버벅거림 없이)
  const speakKoreanName = (name: string) => {
    if (!('speechSynthesis' in window)) {
      alert('죄송합니다. 이 브라우저에서는 음성 기능을 지원하지 않습니다.');
      return;
    }

    // 배경 음악 일시정지 (충돌 방지)
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    // 기존 TTS 재생 중지
    window.speechSynthesis.cancel();
    
    // 이름을 한 글자씩 분리 + 마지막에 전체 이름 추가
    const characters = [...name.split(''), name];
    let currentIndex = 0;
    
    const speakNext = () => {
      if (currentIndex >= characters.length) return;
      
      const char = characters[currentIndex];
      const isLastFullName = currentIndex === characters.length - 1;
      
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ko-KR';
      utterance.rate = isLastFullName ? 0.85 : 0.7;  // 전체 이름은 약간 빠르게
      utterance.pitch = 1.1;
      
      // 현재 발음이 끝나면 다음 글자 읽기
      utterance.onend = () => {
        currentIndex++;
        // 글자 사이에 짧은 휴식
        setTimeout(speakNext, isLastFullName ? 0 : 400);
      };
      
      window.speechSynthesis.speak(utterance);
    };
    
    // 첫 글자 시작
    speakNext();
  };

  return (
    <div className={`relative min-h-screen bg-[#050505] text-white font-sans flex items-start md:items-center justify-center pt-44 md:pt-4 p-4 selection:bg-pink-500 selection:text-white overflow-hidden ${isRTL ? 'font-arabic' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+Thai&family=Noto+Sans+Arabic&display=swap');
        .font-arabic { font-family: 'Noto Sans Arabic', sans-serif; }
      `}</style>

      <div
        className="absolute inset-0 bg-contain bg-top md:bg-cover md:bg-center bg-no-repeat opacity-50 pointer-events-none"
        style={{ backgroundImage: "url('/hanbok-silhouettes-bg.png')" }}
      />

      <div className="fixed top-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-pink-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              {txt.title}
            </h1>
            <p className="text-pink-200/60 text-sm font-light">{txt.subtitle}</p>
          </div>

          <div className="space-y-6">
            
            {/* 1. 언어 선택 */}
            <div className={`flex flex-col gap-1 ${isRTL ? 'items-start' : 'items-end'}`}>
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{txt.lblLanguage}</label>
               <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
                <Globe className="w-3 h-3 text-pink-400 mx-2" />
                <select 
                  value={inputs.language}
                  onChange={(e) => setInputs({...inputs, language: e.target.value})}
                  className="bg-transparent text-xs text-gray-200 outline-none appearance-none cursor-pointer px-2 font-medium"
                >
                  <option value="en" className="bg-gray-900">English</option>
                  <option value="jp" className="bg-gray-900">日本語</option>
                  <option value="th" className="bg-gray-900">ภาษาไทย</option>
                  <option value="es" className="bg-gray-900">Español</option>
                  <option value="ar" className="bg-gray-900">العربية</option>
                  <option value="ko" className="bg-gray-900">한국어</option>
                </select>
              </div>
            </div>

            {/* 2. 이름 입력 */}
            <div className="group">
              <label className="text-sm font-bold text-pink-200 mb-2 block mx-1">{txt.lblName}</label>
              <input 
                type="text" 
                placeholder={txt.phName}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                onChange={(e) => setInputs({...inputs, userName: e.target.value})}
              />
            </div>

            {/* 2.5. 생일 입력 (년/월/일 분리, 자동 이동) */}
            <div className="group">
              <label className="text-sm font-bold text-pink-200 mb-2 block mx-1">{txt.lblBirthday}</label>
              <div className="flex gap-2">
                {/* 년도 (4자리) */}
                <input 
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="YYYY"
                  value={birthday.year}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  onChange={(e) => handleBirthdayChange('year', e.target.value)}
                />
                <span className="text-gray-500 self-center">/</span>
                {/* 월 (2자리) */}
                <input 
                  ref={monthRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="MM"
                  value={birthday.month}
                  className="w-16 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  onChange={(e) => handleBirthdayChange('month', e.target.value)}
                />
                <span className="text-gray-500 self-center">/</span>
                {/* 일 (2자리) */}
                <input 
                  ref={dayRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="DD"
                  value={birthday.day}
                  className="w-16 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  onChange={(e) => handleBirthdayChange('day', e.target.value)}
                />
              </div>
            </div>

            {/* 3. 성별 & 최애 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-pink-200 mb-2 block mx-1">{txt.lblGender}</label>
                <select 
                  ref={genderRef}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none appearance-none cursor-pointer"
                  onChange={(e) => setInputs({...inputs, userGender: e.target.value})}
                >
                  <option value="Female" className="bg-gray-900">{txt.optFemale}</option>
                  <option value="Male" className="bg-gray-900">{txt.optMale}</option>
                  <option value="Non-binary" className="bg-gray-900">{txt.optUnisex}</option>
                </select>
              </div>
              
              <div className="relative">
                <label className="text-sm font-bold text-pink-400 mb-2 block mx-1">{txt.lblBias}</label>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800 border-2 border-pink-500/50 bg-cover bg-center transition-all ${idolData.image ? 'opacity-100' : 'opacity-0'} ${isRTL ? 'right-3' : 'left-3'}`} 
                       style={{ backgroundImage: `url(${idolData.image})` }} />
                  <input 
                    ref={idolInputRef}
                    type="text" 
                    placeholder={txt.phBias}
                    value={inputs.idolName}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-all ${idolData.image ? (isRTL ? 'pr-16' : 'pl-16') : (isRTL ? 'pr-4' : 'pl-4')}`}
                    onChange={(e) => {
                      setInputs({...inputs, idolName: e.target.value});
                      if (e.target.value.length >= 2) {
                        searchIdol();
                      } else {
                        setSearchResults([]);
                        setShowSearchResults(false);
                      }
                    }}
                    onFocus={() => {
                      if (inputs.idolName.length >= 2) {
                        searchIdol();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        selectIdol(searchResults[0]);
                      }
                    }}
                  />
                  {searching ? (
                    <Loader2 className={`absolute top-1/2 -translate-y-1/2 animate-spin text-pink-500 w-4 h-4 ${isRTL ? 'left-4' : 'right-4'}`} />
                  ) : (
                    <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 ${isRTL ? 'left-4' : 'right-4'}`} />
                  )}
                </div>
                
                {/* 검색 결과 리스트 */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      ref={searchResultsRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-lg border border-pink-500/30 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto"
                    >
                      <div className="p-2">
                        <p className="text-xs text-pink-400/80 px-3 py-2 font-semibold">{txt.searchResults}</p>
                        {searchResults.map((item, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectIdol(item)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                          >
                            <img 
                              src={item.artworkUrl.replace('600x600', '100x100')} 
                              alt={item.artistName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm truncate">{item.artistName}</p>
                              <p className="text-gray-400 text-xs truncate">
                                {item.collectionName || item.trackName}
                              </p>
                            </div>
                            <span className="text-pink-400 text-xs font-medium px-2 py-1 bg-pink-500/20 rounded">{txt.searchSelect}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {showSearchResults && searchResults.length === 0 && !searching && inputs.idolName.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4 text-center text-gray-400 text-sm z-50"
                  >
                    {txt.searchNoResults}
                  </motion.div>
                )}
              </div>
            </div>

            <button 
              onClick={generateName}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : txt.btn}
            </button>
          </div>

          <AnimatePresence>
            {result && result.korean_name && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-8 pt-8 border-t border-white/10 relative"
              >
              {idolData.previewUrl && (
                <button 
                  onClick={() => {
                    if (!audioRef.current || !idolData.previewUrl) {
                      alert('미리듣기 음원을 불러오지 못했어요. 최애를 다시 선택해 주세요.');
                      return;
                    }
                    const audio = audioRef.current;
                    // 버튼으로 재생할 때도 항상 src 보장
                    if (!audio.src) {
                      audio.src = idolData.previewUrl;
                      audio.currentTime = 0;
                    }
                    if (isPlaying) {
                      audio.pause();
                      setIsPlaying(false);
                    } else {
                      const p = audio.play();
                      if (p !== undefined) {
                        p.then(() => setIsPlaying(true)).catch(() => {
                          alert('브라우저 설정 때문에 자동 재생이 막혔어요. 한 번 더 눌러주세요.');
                          setIsPlaying(false);
                        });
                      }
                    }
                  }}
                    className={`absolute top-8 bg-white/10 hover:bg-pink-500/50 p-2 rounded-full transition-colors z-20 ${isRTL ? 'left-0' : 'right-0'}`}
                  >
                    {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                )}

                {/* 캡처용 결과 카드 */}
                <div ref={resultCardRef} className="text-center relative z-10 bg-[#0a0a0a] p-6 rounded-2xl">
                  <p className="text-[10px] text-gray-500 mb-3 font-semibold tracking-wider">✨ MY K-POP NAME ✨</p>
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold tracking-wider mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                    {txt.resScore}: {result.compatibility_score}%
                  </motion.div>

                  {idolData.image && (
                    <motion.div 
                      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="w-28 h-28 mx-auto rounded-full border-4 border-gray-900 shadow-[0_0_30px_rgba(236,72,153,0.4)] mb-4 bg-cover bg-center"
                      style={{ backgroundImage: `url(${idolData.image})` }}
                    >
                      <div className="w-3 h-3 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-700" />
                    </motion.div>
                  )}
                  
                  {idolData.track && <p className="text-[10px] text-pink-300/80 mb-2 font-mono flex items-center justify-center gap-1"><Music className="w-3 h-3" /> {idolData.track}</p>}
                  
                  {/* ○○의 해 문구 (생일 입력 시): 한글 + 설정 언어 함께 노출 */}
                  {'year_phrase' in result && result.year_phrase && (
                    <div className="mb-2 space-y-1">
                      <p className="text-sm text-pink-200/90">
                        {result.year_phrase}에 태어난 당신의 한국 이름은
                      </p>
                      {inputs.language !== 'ko' && txt.yearNameIntro && (
                        <p className="text-sm text-purple-200/80">
                          {txt.yearNameIntro.replace('{0}', getYearPhraseInLanguage(result.year_phrase as string, inputs.language))}
                        </p>
                      )}
                    </div>
                  )}
                  {/* 한국 이름 + 듣기 버튼 */}
                  <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-5xl font-black text-white drop-shadow-md tracking-tight">{result.korean_name}</h2>
                    {'year_phrase' in result && result.year_phrase && (
                      <span className="text-2xl text-white/90 font-medium self-end">
                        {inputs.language === 'ko' ? '입니다.' : (txt.yearNameEnd || '.')}
                      </span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => speakKoreanName(result.korean_name)}
                      className="p-2 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/50 hover:to-purple-500/50 rounded-full border border-pink-400/30 transition-all shadow-lg hover:shadow-pink-500/20"
                      title="이름 발음 듣기"
                    >
                      <Volume2 className="w-5 h-5 text-pink-300" />
                    </motion.button>
                  </div>
                  <p className="text-xl text-purple-400 font-medium mb-3">{result.romanized}</p>
                  
                  {/* 최애 정보 표시 - 같은 성씨 강조 */}
                  {result.idol_real_name && result.idol_surname ? (
                    <div className="mb-4 space-y-1">
                      <p className="text-sm text-pink-400/80">💕 with {inputs.idolName}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full">
                        <span className="text-xs text-pink-300/90 font-semibold">
                          {txt.sameSurname || "Same Family Name"}:
                        </span>
                        <span className="text-sm text-pink-200 font-bold">
                          {result.idol_surname}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({result.idol_real_name})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-pink-400/80 mb-4">💕 with {inputs.idolName}</p>
                  )}

                  <div className={`bg-white/5 rounded-xl p-5 border border-white/5 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="pb-4 border-b border-white/5">
                      <p className={`text-[10px] text-red-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                         {txt.resReason}
                      </p>
                      <p className="text-gray-200 text-sm font-medium leading-relaxed">{result.compatibility_reason}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{txt.resMeaning}</p>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">{result.meaning}</p>
                    </div>
                  </div>
                  
                  {/* 글자별 의미 표시 */}
                  {result.character_meanings && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Character Meanings</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-pink-300 font-semibold text-sm">{result.character_meanings.month.character}</span>
                          <span className="text-gray-400 text-xs">({result.character_meanings.month.romanized})</span>
                          <span className="text-gray-300 text-xs ml-auto">:</span>
                          <span className="text-gray-300 text-xs flex-1">{result.character_meanings.month.meaning}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-300 font-semibold text-sm">{result.character_meanings.day.character}</span>
                          <span className="text-gray-400 text-xs">({result.character_meanings.day.romanized})</span>
                          <span className="text-gray-300 text-xs ml-auto">:</span>
                          <span className="text-gray-300 text-xs flex-1">{result.character_meanings.day.meaning}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* 공유 버튼 영역 */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex justify-center gap-3"
                >
                  <button
                    onClick={downloadAsImage}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-pink-500/30"
                  >
                    <Download className="w-4 h-4" />
                    {txt.shareDownload}
                  </button>
                  
                  <button
                    onClick={shareResult}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/10 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/10 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </motion.div>
                
                {/* 후원 버튼 */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-gray-400 mb-3">{txt.kofiText}</p>
                  <div className="flex flex-col items-center gap-4">
                    {/* Send me a passion */}
                    <motion.div whileTap={{ scale: 0.95 }} className="group flex flex-col items-center gap-1.5">
                      <a
                        href="https://www.buymeacoffee.com/padalabs_harang"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative"
                      >
                        <img
                          src="https://img.buymeacoffee.com/button-api/?text=send me a passion&emoji=😘&slug=padalabs_harang&button_colour=FFDD00&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=ffffff"
                          alt="Send me a passion"
                          className="h-10 rounded-lg"
                        />
                        <span className="hidden md:flex pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-11 flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-1 z-50">
                          <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-yellow-400/90" />
                          <span className="whitespace-nowrap text-[11px] font-medium text-gray-900 bg-yellow-400/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                            개발자 데뷔 앨범 펀딩 중! 💿 여러분의 화력으로 1위 시켜주세요!
                          </span>
                        </span>
                      </a>
                      <p className="md:hidden text-[10px] text-yellow-300/70 leading-tight">
                        개발자 데뷔 앨범 펀딩 중! 💿 여러분의 화력으로 1위 시켜주세요!
                      </p>
                    </motion.div>

                    {/* Buy me a coffee */}
                    <motion.div whileTap={{ scale: 0.95 }} className="group flex flex-col items-center gap-1.5 mt-1">
                      <a
                        href="https://ko-fi.com/YOUR_USERNAME"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center gap-2 px-6 py-3 bg-[#29ABE0] hover:bg-[#2389C4] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#29ABE0]/30"
                      >
                        <span>☕</span>
                        <span>Buy me a coffee</span>
                        <span className="hidden md:flex pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-11 flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-1 z-50">
                          <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-sky-400/90" />
                          <span className="whitespace-nowrap text-[11px] font-medium text-white bg-sky-500/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                            다음 업데이트 컴백을 위한 카페인이 필요해요 ☕
                          </span>
                        </span>
                      </a>
                      <p className="md:hidden text-[10px] text-sky-300/70 leading-tight">
                        다음 업데이트 컴백을 위한 카페인이 필요해요 ☕
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* 하단 안내 문구 */}
        <footer className="mt-6 text-center space-y-1">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            🔒 {txt.footerPrivacy}
          </p>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            ✨ {txt.footerDesc}
          </p>
                 <button
                   type="button"
                   onClick={() => setShowPrivacyModal(true)}
                   className="mt-1 text-[11px] text-pink-400 hover:text-pink-300 underline underline-offset-4"
                 >
                   {txt.footerMore}
                 </button>
        </footer>
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

             {/* 업데이트 소식 모달 (첫 진입 시, 영어) */}
             <AnimatePresence>
               {showChangelogModal && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setShowChangelogModal(false)}
                   className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
                 >
                   <motion.div
                     initial={{ scale: 0.9, y: 10 }}
                     animate={{ scale: 1, y: 0 }}
                     exit={{ scale: 0.9, y: 10 }}
                     onClick={(e) => e.stopPropagation()}
                     className="w-full max-w-lg max-h-[85vh] bg-[#0a0a0a] border border-white/20 rounded-2xl shadow-2xl flex flex-col"
                   >
                     <div className="flex items-center justify-between p-5 border-b border-white/10">
                       <h2 className="text-base font-bold text-white">What&apos;s New</h2>
                       <button
                         type="button"
                         onClick={() => setShowChangelogModal(false)}
                         className="text-gray-400 hover:text-white text-lg font-semibold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                         aria-label="Close"
                       >
                         ✕
                       </button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-5 text-gray-300 text-sm leading-relaxed space-y-0">
                       {[
                         {
                           id: 0,
                           date: '2026.03.06',
                           title: 'Improved idol search accuracy',
                           body: 'Fixed an issue where searching for an idol by their Korean activity name (e.g. "펠릭스" for Felix) would fail to find the correct group and music. The system now resolves the idol\'s group first and searches music by group name.',
                         },
                         {
                           id: 1,
                           date: '2026.02.19',
                           title: 'More diverse name combinations',
                           body: 'Names are now generated from a wider pool of characters each time, so you get more variety instead of the same combinations (e.g. same bias + same birthday no longer always gives the same name).',
                         },
                         {
                           id: 2,
                           date: '2026.02.19',
                           title: 'Birth year zodiac (Korean "띠" / Ganzhi) added',
                           body: 'If you enter your birthday, we show phrases like "year of the White Rabbit" or "Blue Dragon" with your Korean name. The sentence is shown in both Korean and your selected language.',
                         },
                       ].map((item) => (
                         <div key={item.id} className="border-b border-white/5 last:border-b-0">
                           <button
                             type="button"
                             onClick={() => setOpenChangelog(openChangelog === item.id ? null : item.id)}
                             className="w-full flex items-center gap-2 py-3 text-left group"
                           >
                             <ChevronDown className={`w-4 h-4 text-pink-400 shrink-0 transition-transform duration-200 ${openChangelog === item.id ? 'rotate-180' : ''}`} />
                             <span className="font-semibold text-pink-200 group-hover:text-pink-100 transition-colors">{item.title}</span>
                             <span className="text-[10px] text-gray-500 shrink-0 ml-auto">{item.date}</span>
                           </button>
                           <AnimatePresence>
                             {openChangelog === item.id && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.2 }}
                                 className="overflow-hidden"
                               >
                                 <p className="pb-3 pl-6 text-gray-400 text-[13px] leading-relaxed">{item.body}</p>
                               </motion.div>
                             )}
                           </AnimatePresence>
                         </div>
                       ))}
                     </div>
                     <div className="p-5 border-t border-white/10 flex gap-3">
                       <button
                         type="button"
                         onClick={() => setShowChangelogModal(false)}
                         className="flex-1 bg-white/10 text-white font-semibold py-2.5 rounded-xl hover:bg-white/20 transition-all"
                       >
                         Close
                       </button>
                       <button
                         type="button"
                         onClick={() => {
                           try { localStorage.setItem(CHANGELOG_SEEN_KEY, '260306'); } catch (_) {}
                           setShowChangelogModal(false);
                         }}
                         className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all"
                       >
                         Don&apos;t show again
                       </button>
                     </div>
                   </motion.div>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* 개인정보/쿠키 안내 모달 */}
             <AnimatePresence>
               {showPrivacyModal && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setShowPrivacyModal(false)}
                   className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
                 >
                   <motion.div
                     initial={{ scale: 0.9, y: 10 }}
                     animate={{ scale: 1, y: 0 }}
                     exit={{ scale: 0.9, y: 10 }}
                     onClick={(e) => e.stopPropagation()}
                     className={`w-full max-w-lg max-h-[80vh] bg-[#0a0a0a] border border-white/20 rounded-2xl shadow-2xl flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}
                   >
                     {/* 모달 헤더 */}
                     <div className="flex items-center justify-between p-6 border-b border-white/10">
                       <h2 className="text-base font-bold text-white">
                         {txt.footerModalTitle}
                       </h2>
                       <button
                         type="button"
                         onClick={() => setShowPrivacyModal(false)}
                         className="text-gray-400 hover:text-white text-lg font-semibold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                         aria-label="Close"
                       >
                         ✕
                       </button>
                     </div>
                     
                     {/* 모달 본문 (스크롤 가능) */}
                     <div className="flex-1 overflow-y-auto p-6">
                       <p className="text-[12px] leading-relaxed text-gray-300 whitespace-pre-line">
                         {txt.footerModalBody}
                       </p>
                     </div>
                     
                     {/* 모달 푸터 */}
                     <div className="p-6 border-t border-white/10">
                       <button
                         type="button"
                         onClick={() => setShowPrivacyModal(false)}
                         className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all"
                       >
                         {inputs.language === 'ko' ? '확인' : inputs.language === 'jp' ? '了解' : inputs.language === 'th' ? 'เข้าใจ' : inputs.language === 'es' ? 'Entendido' : inputs.language === 'ar' ? 'فهمت' : 'Got it'}
                       </button>
                     </div>
                   </motion.div>
                 </motion.div>
               )}
             </AnimatePresence>

      {/* 로딩 모달 */}
      <AnimatePresence>
        {showLoadingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className={`w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-pink-500/30 rounded-2xl p-8 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div className="text-center space-y-6">
                {/* 단계별 아이콘 및 메시지 */}
                <div className="space-y-4">
                  {/* 단계 1: 성 추출중 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: loadingStep === 0 ? 1 : loadingStep > 0 ? 0.3 : 0,
                      y: loadingStep === 0 ? 0 : 10,
                      scale: loadingStep === 0 ? 1 : 0.9
                    }}
                    className="flex items-center justify-center gap-3"
                  >
                    <div className={`p-3 rounded-full ${loadingStep === 0 ? 'bg-pink-500/20 border-2 border-pink-500' : 'bg-gray-700/50 border-2 border-gray-600'}`}>
                      <Search className={`w-6 h-6 ${loadingStep === 0 ? 'text-pink-400' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-lg font-semibold ${loadingStep === 0 ? 'text-pink-300' : 'text-gray-500'}`}>
                      {txt.loadingStep1}
                    </span>
                    {loadingStep === 0 && (
                      <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />
                    )}
                  </motion.div>

                  {/* 단계 2: 이름 짓는중 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: loadingStep === 1 ? 1 : loadingStep > 1 ? 0.3 : 0,
                      y: loadingStep === 1 ? 0 : 10,
                      scale: loadingStep === 1 ? 1 : 0.9
                    }}
                    className="flex items-center justify-center gap-3"
                  >
                    <div className={`p-3 rounded-full ${loadingStep === 1 ? 'bg-purple-500/20 border-2 border-purple-500' : 'bg-gray-700/50 border-2 border-gray-600'}`}>
                      <PenTool className={`w-6 h-6 ${loadingStep === 1 ? 'text-purple-400' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-lg font-semibold ${loadingStep === 1 ? 'text-purple-300' : 'text-gray-500'}`}>
                      {txt.loadingStep2}
                    </span>
                    {loadingStep === 1 && (
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    )}
                  </motion.div>

                  {/* 단계 3: 궁합보는중 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: loadingStep === 2 ? 1 : 0,
                      y: loadingStep === 2 ? 0 : 10,
                      scale: loadingStep === 2 ? 1 : 0.9
                    }}
                    className="flex items-center justify-center gap-3"
                  >
                    <div className={`p-3 rounded-full ${loadingStep === 2 ? 'bg-red-500/20 border-2 border-red-500' : 'bg-gray-700/50 border-2 border-gray-600'}`}>
                      <Heart className={`w-6 h-6 ${loadingStep === 2 ? 'text-red-400 fill-red-400' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-lg font-semibold ${loadingStep === 2 ? 'text-red-300' : 'text-gray-500'}`}>
                      {txt.loadingStep3}
                    </span>
                    {loadingStep === 2 && (
                      <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                    )}
                  </motion.div>
                </div>

                {/* 진행 바 */}
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: loadingStep === 0 ? '33%' : loadingStep === 1 ? '66%' : '100%'
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 rounded-full"
                  />
                </div>

                {/* 스파클 효과 */}
                {loadingStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}