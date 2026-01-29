'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Volume2, VolumeX, Loader2, Music, Heart, Download, Share2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';

export default function Home() {
  const [inputs, setInputs] = useState({ userName: '', userBirthday: '', userGender: 'Female', idolName: '', language: 'en' });
  const [birthday, setBirthday] = useState({ year: '', month: '', day: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [idolData, setIdolData] = useState({ image: '', track: '', previewUrl: '' });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
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
      btn: "Check Chemistry & Get Name ✨", 
      loading: "Asking your Bias...",
      // 결과창 라벨
      resScore: "MATCH SCORE",
      resReason: "Why this match? 🔥",
      resMeaning: "Name Meaning",
      // 하단 안내
      footerPrivacy: "This service does not store any personal information entered.",
      footerDesc: "This service uses AI to create Korean names with the same surname as your ultimate bias.",
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
      kofiText: "Enjoyed? Support the developer! ☕"
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
      btn: "궁합 보고 이름 짓기 ✨", 
      loading: "최애에게 허락받는 중...",
      resScore: "궁합 점수",
      resReason: "우리가 천생연분인 이유 🔥",
      resMeaning: "이름의 뜻",
      footerPrivacy: "본 서비스는 입력된 개인 정보를 저장하지 않습니다.",
      footerDesc: "본 서비스는 AI를 활용하여 최애의 성과 같은 성으로 한국 이름을 지어주는 서비스입니다.",
      shareTitle: "결과 공유하기",
      shareDownload: "이미지 저장",
      shareCopy: "복사",
      shareAlert: "클립보드에 복사되었습니다!",
      shareMeta: "당신의 최애와 같은 성을 가진 한국 이름을 만들어 보세요!!!!!!😍🎶💖🥰",
      searchResults: "검색 결과",
      searchNoResults: "검색 결과가 없습니다",
      searchSelect: "선택",
      sameSurname: "같은 성씨",
      kofiText: "재밌으셨나요? 개발자에게 커피 한잔! ☕"
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
      btn: "相性チェック & 名前作成 ✨",
      loading: "推しに許可をもらっています...",
      resScore: "相性スコア",
      resReason: "相性抜群の理由 🔥",
      resMeaning: "名前の意味",
      footerPrivacy: "本サービスは入力された個人情報を保存しません。",
      footerDesc: "本サービスはAIを活用して、推しと同じ苗字の韓国名を作成するサービスです。",
      shareTitle: "結果をシェア",
      shareDownload: "画像保存",
      shareCopy: "コピー",
      shareAlert: "コピーしました！",
      shareMeta: "推しと同じ苗字の韓国語の名前を作ってみよう!!!!!!😍🎶💖🥰",
      searchResults: "検索結果",
      searchNoResults: "結果が見つかりません",
      searchSelect: "選択",
      sameSurname: "同じ姓",
      kofiText: "楽しんでいただけましたか？開発者にコーヒーを一杯！ ☕"
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
      btn: "เช็คความเข้ากัน & ตั้งชื่อ ✨",
      loading: "กำลังขออนุญาตเมนของคุณ...",
      resScore: "คะแนนความเข้ากัน",
      resReason: "ทำไมถึงเข้ากันได้ดี? 🔥",
      resMeaning: "ความหมายของชื่อ",
      footerPrivacy: "บริการนี้ไม่เก็บข้อมูลส่วนบุคคลที่ป้อน",
      footerDesc: "บริการนี้ใช้ AI เพื่อสร้างชื่อเกาหลีที่มีนามสกุลเดียวกับเมนของคุณ",
      shareTitle: "แชร์ผลลัพธ์",
      shareDownload: "บันทึกรูป",
      shareCopy: "คัดลอก",
      shareAlert: "คัดลอกแล้ว!",
      shareMeta: "สร้างชื่อเกาหลีที่ใช้นามสกุลเดียวกับเมนของคุณเลย!!!!!!😍🎶💖🥰",
      searchResults: "ผลการค้นหา",
      searchNoResults: "ไม่พบผลลัพธ์",
      searchSelect: "เลือก",
      sameSurname: "นามสกุลเดียวกัน",
      kofiText: "สนุกไหม? รองรับนักพัฒนา! ☕"
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
      btn: "Ver Química y Obtener Nombre ✨",
      loading: "Pidiendo permiso a tu Bias...",
      resScore: "PUNTUACIÓN",
      resReason: "¿Por qué hacemos match? 🔥",
      resMeaning: "Significado del nombre",
      footerPrivacy: "Este servicio no almacena ninguna información personal ingresada.",
      footerDesc: "Este servicio utiliza IA para crear nombres coreanos con el mismo apellido que tu Bias.",
      shareTitle: "Compartir resultado",
      shareDownload: "Guardar imagen",
      shareCopy: "Copiar",
      shareAlert: "¡Copiado!",
      shareMeta: "¡Crea un nombre coreano con el mismo apellido que tu Bias definitivo!!!!!!😍🎶💖🥰",
      searchResults: "Resultados de búsqueda",
      searchNoResults: "No se encontraron resultados",
      searchSelect: "Seleccionar",
      sameSurname: "Mismo apellido",
      kofiText: "¿Te gustó? ¡Apoya al desarrollador! ☕"
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
      btn: "تحقق من التوافق واحصل على الاسم ✨",
      loading: "جاري طلب الإذن من البايس...",
      resScore: "نتيجة التوافق",
      resReason: "لماذا هذا التوافق؟ 🔥",
      resMeaning: "معنى الاسم",
      footerPrivacy: "هذه الخدمة لا تخزن أي معلومات شخصية تم إدخالها.",
      footerDesc: "تستخدم هذه الخدمة الذكاء الاصطناعي لإنشاء أسماء كورية بنفس لقب البايس الخاص بك.",
      shareTitle: "مشاركة النتيجة",
      shareDownload: "حفظ الصورة",
      shareCopy: "نسخ",
      shareAlert: "تم النسخ!",
      shareMeta: "اصنع اسم كيبوب كوريًا بنفس لقب البايس الخاص بك!!!!!!😍🎶💖🥰",
      searchResults: "نتائج البحث",
      searchNoResults: "لم يتم العثور على نتائج",
      searchSelect: "اختر",
      sameSurname: "نفس اللقب",
      kofiText: "استمتعت؟ ادعم المطور! ☕"
    }
  };
  
  const txt = t[inputs.language] || t.en;

  // 아랍어일 경우 RTL(오른쪽 정렬) 적용
  const isRTL = inputs.language === 'ar';

  // 🔍 최애 검색 (여러 결과 표시)
  const searchIdol = async () => {
    if (inputs.idolName.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setSearching(true);
    setShowSearchResults(true);
    
    try {
      // 🇰🇷 한국 K-POP 위주로 검색 (KR 스토어 + 음악 + 곡 기준)
      // 최애 이름으로만 검색하면 다른 국가/장르가 섞일 수 있어 "이름 + kpop" 형태로 검색어를 구성
      const term = `${inputs.idolName} kpop`;
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          term
        )}&entity=song&media=music&country=KR&limit=25`
      );
      const data = await res.json();
      
      if (data.resultCount > 0) {
        // 아티스트별로 그룹화 (같은 아티스트의 여러 곡 중 첫 번째만)
        const artistMap = new Map();
        data.results.forEach((song: any) => {
          // 1차: K-POP / 한국 아티스트 우선 필터링
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

        // 2차: K-POP 필터로 아무 것도 안 남으면, 전체 결과에서 다시 한 번 구성 (fallback)
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

        setSearchResults(Array.from(artistMap.values()));
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error('Search error:', e);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ✅ 최애 선택
  const selectIdol = (selected: any) => {
    setIdolData({
      image: selected.artworkUrl,
      track: `${selected.trackName} - ${selected.artistName}`,
      previewUrl: selected.previewUrl
    });
    setInputs({ ...inputs, idolName: selected.artistName });
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const generateName = async () => {
    if (!inputs.userName || !inputs.idolName) return alert("Please fill in all fields!");
    setLoading(true);
    setResult(null);
    
    // 바로 직전에 나온 한국 이름을 함께 보내서, 같은 이름이 연속으로 나오지 않도록 힌트 제공
    const payload = {
      ...inputs,
      lastKoreanName: result?.korean_name || '',
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.error) { alert("Error: " + data.error); return; }
      
      setResult(data);
      
      // 음악 자동 재생 (사용자 상호작용 후이므로 가능)
      if (idolData.previewUrl && audioRef.current) {
        const audio = audioRef.current;
        audio.pause(); // 기존 재생 먼저 중지
        audio.currentTime = 0;
        audio.src = idolData.previewUrl;
        audio.volume = 0.3;
        
        // play() Promise 안전 처리
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.log('Audio autoplay blocked:', err.message);
              setIsPlaying(false);
            });
        }
      }
    } catch (e) { alert("Something went wrong. Please try again!"); } 
    finally { setLoading(false); }
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
    <div className={`min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white ${isRTL ? 'font-arabic' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* 폰트 로드 (Next.js 방식이 아니므로 HTML style 태그 활용) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+Thai&family=Noto+Sans+Arabic&display=swap');
        .font-arabic { font-family: 'Noto Sans Arabic', sans-serif; }
      `}</style>

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
                  
                  {/* 한국 이름 + 듣기 버튼 */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h2 className="text-5xl font-black text-white drop-shadow-md tracking-tight">{result.korean_name}</h2>
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
                
                {/* Ko-fi 후원 버튼 */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-gray-400 mb-3">{txt.kofiText}</p>
                  <a
                    href="https://ko-fi.com/YOUR_USERNAME"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#29ABE0] hover:bg-[#2389C4] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#29ABE0]/30"
                  >
                    <span>☕</span>
                    <span>Buy me a coffee</span>
                  </a>
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
        </footer>
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}