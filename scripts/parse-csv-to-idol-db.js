// CSV 파일을 파싱하여 IDOL_DB 형식으로 변환하는 스크립트
const fs = require('fs');
const path = require('path');

// CSV 파일 읽기
const csvPath = path.join(__dirname, '../../Downloads/아이돌_본명정보_수정본.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// 한글 성씨를 영문으로 변환하는 매핑
const surnameMap = {
  '김': 'Kim', '이': 'Lee', '박': 'Park', '최': 'Choi', '정': 'Jung', '강': 'Kang',
  '조': 'Cho', '윤': 'Yoon', '장': 'Jang', '임': 'Im', '한': 'Han', '오': 'Oh',
  '서': 'Seo', '신': 'Shin', '권': 'Kwon', '황': 'Hwang', '안': 'An', '송': 'Song',
  '전': 'Jeon', '홍': 'Hong', '유': 'Yu', '문': 'Moon', '양': 'Yang', '손': 'Son',
  '배': 'Bae', '조': 'Jo', '백': 'Baek', '허': 'Heo', '유': 'Yoo', '남': 'Nam',
  '심': 'Shim', '노': 'Noh', '정': 'Jeong', '하': 'Ha', '곽': 'Kwak', '성': 'Sung',
  '차': 'Cha', '주': 'Joo', '우': 'Woo', '구': 'Koo', '신': 'Shin', '임': 'Lim',
  '나': 'Na', '전': 'Jeon', '민': 'Min', '유': 'Yu', '류': 'Ryu', '오': 'O',
  '진': 'Jin', '지': 'Ji', '방': 'Bang', '마': 'Ma', '남': 'Nam', '도': 'Do',
  '라': 'La', '로': 'Ro', '부': 'Boo', '사': 'Sa', '아': 'Ah', '예': 'Ye',
  '원': 'Won', '팜': 'Pham', '모': 'Mo', '닝': 'Ning', '휴': 'Huening', '종': 'Jong',
  '석': 'Seok', '와': 'Watanabe', '하마다': 'Hamada', '카네모토': 'Kanemoto', '니시무라': 'Nishimura',
  '나카모토': 'Nakamoto', '사카모토': 'Sakamoto', '에자키': 'Ezaki', '미야와키': 'Miyawaki',
  '나카무라': 'Nakamura', '호카조노': 'Hokazono', '사카이': 'Sakai', '오사키': 'Osaki',
  '우치나가': 'Uchinaga', '카와이': 'Kawai', '에나미': 'Enami', '리라차': 'Lilacha',
  '파리타': 'Parita', '안나차야': 'Annachaya', '바히에': 'Bahiyyih', '션취안': 'Shen',
  '와타나베': 'Watanabe', '종천러': 'Zhong', '니차': 'Nicha', '예': 'Ye',
  '종': 'Jong', '신': 'Shin', '심': 'Shim', '원': 'Won', '한': 'Han'
};

// 본명에서 성씨 추출 (한글 이름인 경우 첫 글자, 외국인 이름인 경우 처리)
function extractSurname(realName) {
  if (!realName) return { surname: '', surname_en: '' };
  
  // 한글이 포함된 경우
  const koreanMatch = realName.match(/^([가-힣])/);
  if (koreanMatch) {
    const surname = koreanMatch[1];
    const surname_en = surnameMap[surname] || surname;
    return { surname, surname_en };
  }
  
  // 영문 이름인 경우 (예: Mark Tuan, Jackson Wang)
  const englishMatch = realName.match(/^([A-Za-z]+)/);
  if (englishMatch) {
    const surname_en = englishMatch[1];
    // 영문 성씨를 한글로 변환 (일부만)
    const reverseMap = {
      'Kim': '김', 'Lee': '이', 'Park': '박', 'Choi': '최', 'Jung': '정',
      'Kang': '강', 'Cho': '조', 'Yoon': '윤', 'Jang': '장', 'Im': '임',
      'Han': '한', 'Oh': '오', 'Seo': '서', 'Shin': '신', 'Kwon': '권',
      'Hwang': '황', 'An': '안', 'Song': '송', 'Jeon': '전', 'Hong': '홍',
      'Yu': '유', 'Moon': '문', 'Yang': '양', 'Son': '손', 'Bae': '배',
      'Jo': '조', 'Baek': '백', 'Heo': '허', 'Yoo': '유', 'Nam': '남',
      'Shim': '심', 'Noh': '노', 'Jeong': '정', 'Ha': '하', 'Kwak': '곽',
      'Sung': '성', 'Cha': '차', 'Joo': '주', 'Woo': '우', 'Koo': '구',
      'Lim': '임', 'Na': '나', 'Min': '민', 'Ryu': '류', 'O': '오',
      'Jin': '진', 'Ji': '지', 'Bang': '방', 'Ma': '마', 'Do': '도',
      'La': '라', 'Ro': '로', 'Boo': '부', 'Sa': '사', 'Ah': '아',
      'Ye': '예', 'Won': '원', 'Pham': '팜', 'Mo': '모', 'Ning': '닝',
      'Huening': '휴', 'Jong': '종', 'Seok': '석', 'Watanabe': '와', 'Hamada': '하마다',
      'Kanemoto': '카네모토', 'Nishimura': '니시무라', 'Nakamoto': '나카모토', 'Sakamoto': '사카모토',
      'Ezaki': '에자키', 'Miyawaki': '미야와키', 'Nakamura': '나카무라', 'Hokazono': '호카조노',
      'Sakai': '사카이', 'Osaki': '오사키', 'Uchinaga': '우치나가', 'Kawai': '카와이',
      'Enami': '에나미', 'Lilacha': '리라차', 'Parita': '파리타', 'Annachaya': '안나차야',
      'Bahiyyih': '바히에', 'Shen': '션취안', 'Zhong': '종천러', 'Nicha': '니차'
    };
    const surname = reverseMap[surname_en] || surname_en;
    return { surname, surname_en };
  }
  
  // 일본어/태국어 등 외국 이름인 경우 (예: 나카모토 유타)
  const japaneseMatch = realName.match(/^([가-힣A-Za-z]+)\s+([가-힣A-Za-z]+)/);
  if (japaneseMatch) {
    const firstPart = japaneseMatch[1];
    // 한글이면 첫 글자
    if (/[가-힣]/.test(firstPart)) {
      const surname = firstPart.charAt(0);
      const surname_en = surnameMap[surname] || surname;
      return { surname, surname_en };
    }
    // 영문이면 첫 단어
    const surname_en = firstPart;
    const reverseMap = {
      'Nakamoto': '나카모토', 'Sakamoto': '사카모토', 'Ezaki': '에자키',
      'Miyawaki': '미야와키', 'Nakamura': '나카무라', 'Hokazono': '호카조노',
      'Sakai': '사카이', 'Osaki': '오사키', 'Uchinaga': '우치나가', 'Kawai': '카와이',
      'Enami': '에나미', 'Watanabe': '와타나베', 'Hamada': '하마다', 'Kanemoto': '카네모토',
      'Nishimura': '니시무라', 'Hirai': '히라이', 'Moi': '묘이', 'Minatozaki': '미나토자키',
      'Zhou': '저우', 'Lilacha': '리라차', 'Parita': '파리타', 'Annachaya': '안나차야',
      'Bahiyyih': '바히에', 'Shen': '션취안', 'Zhong': '종천러', 'Nicha': '니차',
      'Pham': '팜', 'Marsh': '마쉬', 'Tuan': '투안', 'BamBam': '뱀뱀', 'Wang': '왕'
    };
    const surname = reverseMap[surname_en] || surname_en;
    return { surname, surname_en };
  }
  
  return { surname: '', surname_en: '' };
}

// 활동명 정규화 (소문자, 띄어쓰기 제거, 특수문자 처리)
function normalizeStageName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w가-힣]/g, '')
    .trim();
}

// CSV 파싱
const lines = csvContent.split('\n').slice(1).filter(l => l.trim());
const idols = [];

lines.forEach(line => {
  const [분류, 그룹명, 활동명, 본명, 성별] = line.split(',');
  if (!활동명 || !본명) return;
  
  const { surname, surname_en } = extractSurname(본명.trim());
  if (!surname) {
    console.warn(`⚠️ Could not extract surname from: ${본명}`);
    return;
  }
  
  const normalized = normalizeStageName(활동명.trim());
  idols.push({
    key: normalized,
    stageName: 활동명.trim(),
    realName: 본명.trim(),
    group: 그룹명.trim(),
    surname,
    surname_en,
    gender: 성별.trim()
  });
});

// 중복 제거 (같은 키가 있으면 나중 것 사용)
const uniqueIdols = {};
idols.forEach(idol => {
  uniqueIdols[idol.key] = idol;
});

// IDOL_DB 형식으로 출력
console.log('// ================= Generated from CSV =================');
Object.values(uniqueIdols).forEach(idol => {
  console.log(`  '${idol.key}': { surname: '${idol.surname}', surname_en: '${idol.surname_en}', group: '${idol.group}' }, // ${idol.realName}`);
});

console.log(`\n// Total: ${Object.keys(uniqueIdols).length} idols`);
