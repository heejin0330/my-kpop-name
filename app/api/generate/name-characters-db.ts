// app/api/generate/name-characters-db.ts
// CSV 데이터를 파싱하여 이름 생성에 사용할 글자 데이터베이스

export type NameCharacter = {
  character: string;        // 한글 글자 (예: "시", "준")
  romanized: string;         // 영문 표기 (예: "Si", "Jun")
  type: 'Month' | 'Day';     // 유형
  meanings: {
    ko: string;  // 한국어 의미
    en: string;  // 영어 의미
    ja: string;  // 일본어 의미
    ar: string;  // 아랍어 의미
    th: string;  // 태국어 의미
  };
};

// Month 글자 (12개)
export const MONTH_CHARACTERS: NameCharacter[] = [
  { character: '시', romanized: 'Si', type: 'Month', meanings: { ko: '시작과 새로운 활기', en: 'Beginning and new vitality', ja: '始まりと新しい活力', ar: 'بداية وحيوية جديدة', th: 'จุดเริ่มต้นและความมีชีวิตชีวาใหม่' } },
  { character: '하', romanized: 'Ha', type: 'Month', meanings: { ko: '맑고 빛나는 하늘', en: 'Clear and shining sky', ja: '澄み渡る輝く空', ar: 'سماء صافية ومشرقة', th: 'ท้องฟ้าที่แจ่มใสและส่องประกาย' } },
  { character: '연', romanized: 'Yeon', type: 'Month', meanings: { ko: '피어나는 꽃과 인연', en: 'Blooming flowers and precious connections', ja: '咲き誇る花と大切な縁', ar: 'زهور متفتحة وروابط غالية', th: 'ดอกไม้ที่เบ่งบานและสายสัมพันธ์ที่ล้ำค่า' } },
  { character: '서', romanized: 'Seo', type: 'Month', meanings: { ko: '차분하고 상서로운 기운', en: 'Calm and auspicious energy', ja: '穏やかで縁起の良い気運', ar: 'طاقة هادئة وميمونة', th: 'พลังที่สงบและเป็นมงคล' } },
  { character: '유', romanized: 'Yu', type: 'Month', meanings: { ko: '부드럽고 여유로운 마음', en: 'Gentle and relaxed mind', ja: '優しくゆとりのある心', ar: 'قلب لطيف ومرتاح', th: 'จิตใจที่อ่อนโยนและผ่อนคลาย' } },
  { character: '지', romanized: 'Ji', type: 'Month', meanings: { ko: '지혜롭고 확고한 의지', en: 'Wise and firm willpower', ja: '賢明で確かな意志', ar: 'إرادة حكيمة وثابتة', th: 'เจตจำนงที่ชาญฉลาดและมั่นคง' } },
  { character: '해', romanized: 'Hae', type: 'Month', meanings: { ko: '시원하고 넓은 바다', en: 'Cool and vast sea', ja: '涼しく広大な海', ar: 'بحر بارد وواسع', th: 'ทะเลที่เย็นสบายและกว้างใหญ่' } },
  { character: '주', romanized: 'Ju', type: 'Month', meanings: { ko: '반짝이는 보석의 광채', en: 'Brilliance of a sparkling gem', ja: '輝く宝石の光彩', ar: 'تألق جوهرة براقة', th: 'ความเปล่งประกายของอัญมณีที่ระยิบระยับ' } },
  { character: '윤', romanized: 'Yoon', type: 'Month', meanings: { ko: '윤택하고 빛나는 삶', en: 'Prosperous and shining life', ja: '豊かで輝かしい人生', ar: 'حياة مزدهرة ومشرقة', th: 'ชีวิตที่รุ่งเรืองและรุ่งโรจน์' } },
  { character: '가', romanized: 'Ga', type: 'Month', meanings: { ko: '아름다운 노래와 기쁨', en: 'Beautiful song and joy', ja: '美しい歌と喜び', ar: 'أغنية جميلة وفرح', th: 'บทเพลงที่ไพเราะและความสุข' } },
  { character: '은', romanized: 'Eun', type: 'Month', meanings: { ko: '따뜻한 은혜와 사랑', en: 'Warm grace and love', ja: '温かい恵みと愛', ar: 'نعمة وود وحب', th: 'ความเมตตาและความรักที่อบอุ่น' } },
  { character: '도', romanized: 'Do', type: 'Month', meanings: { ko: '깊이 있는 도리와 원칙', en: 'Deep principles and integrity', ja: '深みのある道理と原則', ar: 'مبادئ عميقة ونزاهة', th: 'หลักการและความซื่อสัตย์ที่ลึกซึ้ง' } },
];

// Day 글자 (31개)
export const DAY_CHARACTERS: NameCharacter[] = [
  { character: '준', romanized: 'Jun', type: 'Day', meanings: { ko: '재능이 뛰어난', en: 'Talented and outstanding', ja: '才能あふれる優れた', ar: 'موهوب ومتميز', th: 'มีความสามารถและโดดเด่น' } },
  { character: '찬', romanized: 'Chan', type: 'Day', meanings: { ko: '찬란하게 빛나는', en: 'Shining brilliantly', ja: '燦然と輝く', ar: 'متألق ببراعة', th: 'ส่องประกายอย่างเจิดจรัส' } },
  { character: '빈', romanized: 'Bin', type: 'Day', meanings: { ko: '세련되고 품격 있는', en: 'Refined and classy', ja: '洗練された気品のある', ar: 'مكرر وراقي', th: 'หรูหราและมีระดับ' } },
  { character: '혁', romanized: 'Hyeok', type: 'Day', meanings: { ko: '혁신적이고 밝은', en: 'Innovative and bright', ja: '革新的で明るい', ar: 'مبتكر ومشرق', th: 'นวัตกรรมและสดใส' } },
  { character: '휘', romanized: 'Hwi', type: 'Day', meanings: { ko: '눈부시게 화려한', en: 'Dazzling and splendid', ja: 'まばゆいほど華やかな', ar: 'مبهر ورائع', th: 'เจิดจ้าและงดงาม' } },
  { character: '호', romanized: 'Ho', type: 'Day', meanings: { ko: '용기 있고 당당한', en: 'Brave and confident', ja: '勇気があり堂々とした', ar: 'شجاع وواثق', th: 'กล้าหาญและมั่นใจ' } },
  { character: '욱', romanized: 'Uk', type: 'Day', meanings: { ko: '솟아오르는 해처럼 정열적인', en: 'Passionate like the rising sun', ja: '昇る太陽のように情熱的な', ar: 'عاطفي مثل الشمس المشرقة', th: 'หลงใหลเหมือนดวงอาทิตย์ที่กำลังขึ้น' } },
  { character: '민', romanized: 'Min', type: 'Day', meanings: { ko: '영리하고 기민한', en: 'Smart and agile', ja: '賢く機敏な', ar: 'ذكي ورشيق', th: 'ฉลาดและว่องไว' } },
  { character: '건', romanized: 'Geon', type: 'Day', meanings: { ko: '건강하고 튼튼한', en: 'Strong and healthy', ja: '強く健康な', ar: 'قوي وصحي', th: 'แข็งแรงและมีสุขภาพดี' } },
  { character: '성', romanized: 'Seong', type: 'Day', meanings: { ko: '성실하게 결실을 맺는', en: 'Diligently achieving results', ja: '誠実に実を結ぶ', ar: 'تحقيق النتائج باجتهاد', th: 'บรรลุผลสำเร็จอย่างขยันแข็ง' } },
  { character: '현', romanized: 'Hyeon', type: 'Day', meanings: { ko: '어진 마음과 현명함', en: 'Virtuous heart and wisdom', ja: '仁徳のある心と賢明さ', ar: 'قلب فاضل وحكمة', th: 'จิตใจที่มีคุณธรรมและภูมิปัญญา' } },
  { character: '진', romanized: 'Jin', type: 'Day', meanings: { ko: '진실하고 소중한', en: 'Truthful and precious', ja: '真実で大切な', ar: 'صادق وثمين', th: 'จริงใจและล้ำค่า' } },
  { character: '안', romanized: 'An', type: 'Day', meanings: { ko: '편안하고 평화로운', en: 'Peaceful and comfortable', ja: '安らかで心地よい', ar: 'سلمي ومريح', th: 'สงบสุขและสะดวกสบาย' } },
  { character: '원', romanized: 'Won', type: 'Day', meanings: { ko: '근원이 되는 깊은', en: 'Deep and fundamental', ja: '根源となる深い', ar: 'عميق وجوهري', th: 'ลึกซึ้งและเป็นรากฐาน' } },
  { character: '우', romanized: 'U', type: 'Day', meanings: { ko: '다정하고 포근한', en: 'Friendly and cozy', ja: '親しみやすく居心地の良い', ar: 'ودي ومريح', th: 'เป็นกันเองและอบอุ่น' } },
  { character: '재', romanized: 'Jae', type: 'Day', meanings: { ko: '재주가 많고 영특한', en: 'Multi-talented and clever', ja: '多才で聡明な', ar: 'متعدد المواهب وذكي', th: 'มีความสามารถหลากหลายและเฉลียวฉลาด' } },
  { character: '명', romanized: 'Myeong', type: 'Day', meanings: { ko: '밝고 깨끗한', en: 'Bright and clear', ja: '明るく清らかな', ar: 'مشرق وصافٍ', th: 'สดใสและชัดเจน' } },
  { character: '정', romanized: 'Jeong', type: 'Day', meanings: { ko: '올바르고 정직한', en: 'Upright and honest', ja: '正しく正直な', ar: 'مستقيم وصادق', th: 'ซื่อตรงและซื่อสัตย์' } },
  { character: '신', romanized: 'Sin', type: 'Day', meanings: { ko: '믿음직하고 신뢰감 있는', en: 'Reliable and trustworthy', ja: '頼もしく信頼できる', ar: 'موثوق به وجدير بالثقة', th: 'น่าเชื่อถือและไว้วางใจได้' } },
  { character: '겸', romanized: 'Gyeom', type: 'Day', meanings: { ko: '겸손하고 예의 바른', en: 'Humble and polite', ja: '謙虚で礼儀正しい', ar: 'متواضع ومهذب', th: 'อ่อนน้อมถ่อมตนและสุภาพ' } },
  { character: '율', romanized: 'Yul', type: 'Day', meanings: { ko: '선율처럼 아름다운', en: 'Beautiful like a melody', ja: '旋律のように美しい', ar: 'جميل مثل لحن', th: 'ไพเราะเหมือนท่วงทำนอง' } },
  { character: '슬', romanized: 'Seul', type: 'Day', meanings: { ko: '슬기롭고 예쁜', en: 'Wise and pretty', ja: '賢く可愛らしい', ar: 'حكيم وجميل', th: 'ฉลาดและน่ารัก' } },
  { character: '희', romanized: 'Hee', type: 'Day', meanings: { ko: '기쁨이 가득한', en: 'Full of joy', ja: '喜びに満ちた', ar: 'مليء بالفرح', th: 'เต็มไปด้วยความสุข' } },
  { character: '하', romanized: 'Ha', type: 'Day', meanings: { ko: '여름처럼 싱그러운', en: 'Fresh like summer', ja: '夏のように清々しい', ar: 'نقي مثل الصيف', th: 'สดชื่นเหมือนฤดูร้อน' } },
  { character: '린', romanized: 'Rin', type: 'Day', meanings: { ko: '맑고 영롱한', en: 'Clear and translucent', ja: '清らかで透明感のある', ar: 'صافٍ وشفاف', th: 'ใสและโปร่งแสง' } },
  { character: '아', romanized: 'A', type: 'Day', meanings: { ko: '우아하고 고운', en: 'Elegant and fine', ja: '優雅で美しい', ar: 'أنيق وجميل', th: 'สง่างามและประณีต' } },
  { character: '나', romanized: 'Na', type: 'Day', meanings: { ko: '나풀거리는 나비처럼 자유로운', en: 'Free like a fluttering butterfly', ja: 'ひらひら舞う蝶のように自由な', ar: 'حر مثل فراشة ترفرف', th: 'อิสระเหมือนผีเสื้อที่โบยบิน' } },
  { character: '봄', romanized: 'Bom', type: 'Day', meanings: { ko: '봄날처럼 따뜻한', en: 'Warm like a spring day', ja: '春の日のように温かい', ar: 'دافئ مثل يوم ربيع', th: 'อบอุ่นเหมือนวันในฤดูใบไม้ผลิ' } },
  { character: '솔', romanized: 'Sol', type: 'Day', meanings: { ko: '소나무처럼 변치 않는', en: 'Unchanging like a pine tree', ja: '松のように変わらない', ar: 'ثابت كشجرة صنوبر', th: 'ไม่เปลี่ยนแปลงเหมือนต้นสน' } },
  { character: '결', romanized: 'Gyeol', type: 'Day', meanings: { ko: '순수하고 곧은', en: 'Pure and straight', ja: '純粋で真っ直ぐな', ar: 'نقي ومستقيم', th: 'บริสุทธิ์และเที่ยงตรง' } },
  { character: '온', romanized: 'On', type: 'Day', meanings: { ko: '온화하고 따스한', en: 'Gentle and warm', ja: '穏やかで温かい', ar: 'لطيف ودافئ', th: 'อ่อนโยนและอบอุ่น' } },
];

// Day 글자 인덱스: 여성 이름에 자주 쓰이는 글자 (은혁·준혁 등 남성형 이름 방지)
const DAY_INDICES_FEMALE = [2, 12, 13, 14, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30]; // 빈,안,원,우,명,정,율,슬,희,하,린,아,나,봄,결,온
// Day 글자 인덱스: 남성 이름에 자주 쓰이는 글자
const DAY_INDICES_MALE = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 18, 19, 28]; // 준,찬,혁,휘,호,욱,민,건,성,현,진,재,신,겸,솔

// 언어 코드 매핑 (API language 파라미터 → CSV 언어)
export const LANGUAGE_MAP: Record<string, keyof NameCharacter['meanings']> = {
  'ko': 'ko',
  'kr': 'ko',
  'korean': 'ko',
  'en': 'en',
  'english': 'en',
  'ja': 'ja',
  'jp': 'ja',
  'japanese': 'ja',
  'ar': 'ar',
  'arabic': 'ar',
  'th': 'th',
  'thai': 'th',
};

// 생일 정보로부터 글자 선택 함수
export function selectNameCharacters(month: number, day: number): { month: NameCharacter; day: NameCharacter } | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  
  const monthChar = MONTH_CHARACTERS[month - 1];
  const dayChar = DAY_CHARACTERS[day - 1];
  
  if (!monthChar || !dayChar) {
    return null;
  }
  
  return { month: monthChar, day: dayChar };
}

// 랜덤 글자 선택 함수. gender에 따라 Day 글자를 성별에 맞는 풀에서만 선택 (여성→은혁 등 방지)
export function selectRandomNameCharacters(gender?: string): { month: NameCharacter; day: NameCharacter } {
  const randomMonth = Math.floor(Math.random() * MONTH_CHARACTERS.length);
  const normalizedGender = (gender || '').toLowerCase();
  const dayIndices =
    normalizedGender === 'female'
      ? DAY_INDICES_FEMALE
      : normalizedGender === 'male'
        ? DAY_INDICES_MALE
        : [...Array(DAY_CHARACTERS.length)].map((_, i) => i);
  const dayIndex = dayIndices[Math.floor(Math.random() * dayIndices.length)];
  return {
    month: MONTH_CHARACTERS[randomMonth],
    day: DAY_CHARACTERS[dayIndex],
  };
}
