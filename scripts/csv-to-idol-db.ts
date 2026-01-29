// CSV 데이터를 IDOL_DB 형식으로 변환하는 스크립트
// 이 스크립트는 CSV 데이터를 파싱하여 IDOL_DB에 추가할 코드를 생성합니다.

const csvData = `분류,그룹명,활동명,본명,성별
그룹,(G)I-DLE,미연,조미연,여
그룹,(G)I-DLE,민니,니차 욘따라락,여
그룹,(G)I-DLE,소연,전소연,여
그룹,(G)I-DLE,슈화,예슈화,여
그룹,(G)I-DLE,우기,송우기,여
그룹,ATEEZ,민기,송민기,남
그룹,ATEEZ,산,최산,남
그룹,ATEEZ,성화,박성화,남
그룹,ATEEZ,여상,강여상,남
그룹,ATEEZ,우영,정우영,남
그룹,ATEEZ,윤호,정윤호,남
그룹,ATEEZ,종호,최종호,남
그룹,ATEEZ,홍중,김홍중,남
그룹,BABYMONSTER,라미,신하람,여
그룹,BABYMONSTER,로라,이다인,여
그룹,BABYMONSTER,루카,카와이 루카,여
그룹,BABYMONSTER,아사,에나미 아사,여
그룹,BABYMONSTER,아현,정아현,여
그룹,BABYMONSTER,치키타,리라차 폰데차피팟,여
그룹,BABYMONSTER,파리타,파리타 분팍디트라웰,여
그룹,BLACKPINK,로제,박채영,여
그룹,BLACKPINK,리사,라리사 마노반,여
그룹,BLACKPINK,제니,김제니,여
그룹,BLACKPINK,지수,김지수,여
그룹,BOYNEXTDOOR,리우,이상혁,남
그룹,BOYNEXTDOOR,명재현,명재현,남
그룹,BOYNEXTDOOR,성호,박성호,남
그룹,BOYNEXTDOOR,운학,김운학,남
그룹,BOYNEXTDOOR,이한,김동현,남
그룹,BOYNEXTDOOR,태산,한동민,남
그룹,BTS,RM,김남준,남
그룹,BTS,V,김태형,남
그룹,BTS,슈가,민윤기,남
그룹,BTS,정국,전정국,남
그룹,BTS,제이홉,정호석,남
그룹,BTS,지민,박지민,남
그룹,BTS,진,김석진,남
그룹,DAY6,Young K,강영현,남
그룹,DAY6,도운,윤도운,남
그룹,DAY6,성진,박성진,남
그룹,DAY6,원필,김원필,남
그룹,ENHYPEN,니키,니시무라 리키,남
그룹,ENHYPEN,선우,김선우,남
그룹,ENHYPEN,성훈,박성훈,남
그룹,ENHYPEN,정원,양정원,남
그룹,ENHYPEN,제이,박종성,남
그룹,ENHYPEN,제이크,심재윤,남
그룹,ENHYPEN,희승,이희승,남
그룹,EXO,디오,도경수,남
그룹,EXO,백현,변백현,남
그룹,EXO,세훈,오세훈,남
그룹,EXO,수호,김준면,남
그룹,EXO,시우민,김민석,남
그룹,EXO,찬열,박찬열,남
그룹,EXO,첸,김종대,남
그룹,EXO,카이,김종인,남
그룹,GOT7,마크,마크 투안,남
그룹,GOT7,뱀뱀,깐삐묵 뿌와꾼,남
그룹,GOT7,영재,최영재,남
그룹,GOT7,유겸,김유겸,남
그룹,GOT7,잭슨,잭슨 왕,남
그룹,GOT7,제이비,임재범,남
그룹,GOT7,진영,박진영,남
그룹,ILLIT,모카,사카이 모카,여
그룹,ILLIT,민주,박민주,여
그룹,ILLIT,원희,이원희,여
그룹,ILLIT,윤아,노윤아,여
그룹,ILLIT,이로하,호카조노 이로하,여
그룹,ITZY,류진,신류진,여
그룹,ITZY,리아,최지수,여
그룹,ITZY,예지,황예지,여
그룹,ITZY,유나,신유나,여
그룹,ITZY,채령,이채령,여
그룹,IVE,가을,김가을,여
그룹,IVE,레이,나오이 레이,여
그룹,IVE,리즈,김지원,여
그룹,IVE,안유진,안유진,여
그룹,IVE,이서,이현서,여
그룹,IVE,장원영,장원영,여
그룹,KISS OF LIFE,나띠,안나차야 수완차이,여
그룹,KISS OF LIFE,벨,심혜원,여
그룹,KISS OF LIFE,쥴리,한 쥴리,여
그룹,KISS OF LIFE,하늘,원하늘,여
그룹,Kep1er,강예서,강예서,여
그룹,Kep1er,김다연,김다연,여
그룹,Kep1er,김채현,김채현,여
그룹,Kep1er,마시로,사카모토 마시로,여
그룹,Kep1er,샤오팅,선샤오팅,여
그룹,Kep1er,서영은,서영은,여
그룹,Kep1er,최유진,최유진,여
그룹,Kep1er,휴닝바히에,바히에 정 휴닝,여
그룹,Kep1er,히카루,에자키 히카루,여
그룹,LE SSERAFIM,김채원,김채원,여
그룹,LE SSERAFIM,사쿠라,미야와키 사쿠라,여
그룹,LE SSERAFIM,카즈하,나카무라 카즈하,여
그룹,LE SSERAFIM,허윤진,허윤진,여
그룹,LE SSERAFIM,홍은채,홍은채,여
그룹,MONSTA X,기현,유기현,남
그룹,MONSTA X,민혁,이민혁,남
그룹,MONSTA X,셔누,손현우,남
그룹,MONSTA X,아이엠,임창균,남
그룹,MONSTA X,주헌,이주헌,남
그룹,MONSTA X,형원,채형원,남
그룹,NCT 127,도영,김동영,남
그룹,NCT 127,마크,이마크,남
그룹,NCT 127,유타,나카모토 유타,남
그룹,NCT 127,재현,정윤오,남
그룹,NCT 127,쟈니,서영호,남
그룹,NCT 127,정우,김정우,남
그룹,NCT 127,태용,이태용,남
그룹,NCT 127,태일,문태일,남
그룹,NCT 127,해찬,이동혁,남
그룹,NCT DREAM,런쥔,황인준,남
그룹,NCT DREAM,마크,이마크,남
그룹,NCT DREAM,재민,나재민,남
그룹,NCT DREAM,제노,이제노,남
그룹,NCT DREAM,지성,박지성,남
그룹,NCT DREAM,천러,종천러,남
그룹,NCT DREAM,해찬,이동혁,남
그룹,NMIXX,규진,장규진,여
그룹,NMIXX,릴리,릴리 진 머로우,여
그룹,NMIXX,배이,배진솔,여
그룹,NMIXX,설윤,설윤아,여
그룹,NMIXX,지우,김지우,여
그룹,NMIXX,해원,오해원,여
그룹,NewJeans,다니엘,다니엘 마쉬,여
그룹,NewJeans,민지,김민지,여
그룹,NewJeans,하니,팜 하니,여
그룹,NewJeans,해린,강해린,여
그룹,NewJeans,혜인,이혜인,여
그룹,RIIZE,성찬,정성찬,남
그룹,RIIZE,소희,이소희,남
그룹,RIIZE,쇼타로,오사키 쇼타로,남
그룹,RIIZE,앤톤,이찬영,남
그룹,RIIZE,원빈,박원빈,남
그룹,RIIZE,은석,송은석,남
그룹,Red Velvet,슬기,강슬기,여
그룹,Red Velvet,아이린,배주현,여
그룹,Red Velvet,예리,김예림,여
그룹,Red Velvet,웬디,손승완,여
그룹,Red Velvet,조이,박수영,여
그룹,SEVENTEEN,도겸,이석민,남
그룹,SEVENTEEN,디노,이찬,남
그룹,SEVENTEEN,디에잇,서명호,남
그룹,SEVENTEEN,민규,김민규,남
그룹,SEVENTEEN,버논,최한솔,남
그룹,SEVENTEEN,승관,부승관,남
그룹,SEVENTEEN,에스쿱스,최승철,남
그룹,SEVENTEEN,우지,이지훈,남
그룹,SEVENTEEN,원우,전원우,남
그룹,SEVENTEEN,정한,윤정한,남
그룹,SEVENTEEN,조슈아,홍지수,남
그룹,SEVENTEEN,준,문준휘,남
그룹,SEVENTEEN,호시,권순영,남
그룹,SHINee,민호,최민호,남
그룹,SHINee,온유,이진기,남
그룹,SHINee,키,김기범,남
그룹,SHINee,태민,이태민,남
그룹,STAYC,세은,윤세은,여
그룹,STAYC,수민,배수민,여
그룹,STAYC,시은,박시은,여
그룹,STAYC,아이사,이채영,여
그룹,STAYC,윤,심자윤,여
그룹,STAYC,재이,장예은,여
그룹,Stray Kids,리노,이민호,남
그룹,Stray Kids,방찬,방찬,남
그룹,Stray Kids,승민,김승민,남
그룹,Stray Kids,아이엔,양정인,남
그룹,Stray Kids,창빈,서창빈,남
그룹,Stray Kids,필릭스,이용복,남
그룹,Stray Kids,한,한지성,남
그룹,Stray Kids,현진,황현진,남
그룹,THE BOYZ,뉴,최찬희,남
그룹,THE BOYZ,상연,이상연,남
그룹,THE BOYZ,선우,김선우,남
그룹,THE BOYZ,에릭,손영재,남
그룹,THE BOYZ,영훈,김영훈,남
그룹,THE BOYZ,제이콥,배준영,남
그룹,THE BOYZ,주연,이주연,남
그룹,THE BOYZ,주학년,주학년,남
그룹,THE BOYZ,케빈,문형서,남
그룹,THE BOYZ,큐,지창민,남
그룹,THE BOYZ,현재,이재현,남
그룹,TREASURE,도영,김도영,남
그룹,TREASURE,박정우,박정우,남
그룹,TREASURE,소정환,소정환,남
그룹,TREASURE,아사히,하마다 아사히,남
그룹,TREASURE,요시,카네모토 요시노리,남
그룹,TREASURE,윤재혁,윤재혁,남
그룹,TREASURE,준규,김준규,남
그룹,TREASURE,지훈,박지훈,남
그룹,TREASURE,최현석,최현석,남
그룹,TREASURE,하루토,와타나베 하루토,남
그룹,TWICE,나연,임나연,여
그룹,TWICE,다현,김다현,여
그룹,TWICE,모모,히라이 모모,여
그룹,TWICE,미나,묘이 미나,여
그룹,TWICE,사나,미나토자키 사나,여
그룹,TWICE,정연,유정연,여
그룹,TWICE,지효,박지효,여
그룹,TWICE,쯔위,저우쯔위,여
그룹,TWICE,채영,손채영,여
그룹,TWS,경민,임경민,남
그룹,TWS,도훈,최도훈,남
그룹,TWS,신유,신정환,남
그룹,TWS,영재,최영재,남
그룹,TWS,지훈,한지훈,남
그룹,TWS,한진,한진,남
그룹,TXT,범규,최범규,남
그룹,TXT,수빈,최수빈,남
그룹,TXT,연준,최연준,남
그룹,TXT,태현,강태현,남
그룹,TXT,휴닝카이,카이 카말 휴닝,남
그룹,VIVIZ,신비,황은비,여
그룹,VIVIZ,엄지,김예원,여
그룹,VIVIZ,은하,정은비,여
그룹,ZEROBASEONE,김규빈,김규빈,남
그룹,ZEROBASEONE,김지웅,김지웅,남
그룹,ZEROBASEONE,김태래,김태래,남
그룹,ZEROBASEONE,리키,션취안루이,남
그룹,ZEROBASEONE,박건욱,박건욱,남
그룹,ZEROBASEONE,석매튜,석우현,남
그룹,ZEROBASEONE,성한빈,성한빈,남
그룹,ZEROBASEONE,장하오,장하오,남
그룹,ZEROBASEONE,한유진,한유진,남
그룹,aespa,닝닝,닝이줘,여
그룹,aespa,윈터,김민정,여
그룹,aespa,지젤,우치나가 에리,여
그룹,aespa,카리나,유지민,여
솔로,IU,아이유,이지은,여
솔로,PSY,싸이,박재상,남
솔로,강다니엘,강다니엘,강다니엘,남
솔로,권은비,권은비,권은비,여
솔로,선미,선미,이선미,여
솔로,이무진,이무진,이무진,남
솔로,임영웅,임영웅,임영웅,남
솔로,전소미,전소미,에닉 소미 다우마,여
솔로,지코,지코,우지호,남
솔로,청하,청하,김찬미,여
솔로,최예나,최예나,최예나,여`;

// 한글 성씨를 영문으로 변환하는 매핑
const surnameMap: Record<string, string> = {
  '김': 'Kim', '이': 'Lee', '박': 'Park', '최': 'Choi', '정': 'Jung', '강': 'Kang',
  '조': 'Cho', '윤': 'Yoon', '장': 'Jang', '임': 'Im', '한': 'Han', '오': 'Oh',
  '서': 'Seo', '신': 'Shin', '권': 'Kwon', '황': 'Hwang', '안': 'An', '송': 'Song',
  '전': 'Jeon', '홍': 'Hong', '유': 'Yu', '문': 'Moon', '양': 'Yang', '손': 'Son',
  '배': 'Bae', '백': 'Baek', '허': 'Heo', '남': 'Nam', '심': 'Shim', '노': 'Noh',
  '하': 'Ha', '곽': 'Kwak', '성': 'Sung', '차': 'Cha', '주': 'Joo', '우': 'Woo',
  '구': 'Koo', '나': 'Na', '민': 'Min', '류': 'Ryu', '진': 'Jin', '지': 'Ji',
  '방': 'Bang', '마': 'Ma', '도': 'Do', '라': 'La', '로': 'Ro', '부': 'Boo',
  '사': 'Sa', '아': 'Ah', '예': 'Ye', '원': 'Won', '팜': 'Pham', '모': 'Mo',
  '닝': 'Ning', '휴': 'Huening', '종': 'Jong', '석': 'Seok', '와': 'Watanabe',
  '하마다': 'Hamada', '카네모토': 'Kanemoto', '니시무라': 'Nishimura', '나카모토': 'Nakamoto',
  '사카모토': 'Sakamoto', '에자키': 'Ezaki', '미야와키': 'Miyawaki', '나카무라': 'Nakamura',
  '호카조노': 'Hokazono', '사카이': 'Sakai', '오사키': 'Osaki', '우치나가': 'Uchinaga',
  '카와이': 'Kawai', '에나미': 'Enami', '리라차': 'Lilacha', '파리타': 'Parita',
  '안나차야': 'Annachaya', '바히에': 'Bahiyyih', '션취안': 'Shen', '종천러': 'Zhong',
  '니차': 'Nicha', '와타나베': 'Watanabe', '변': 'Byun', '저우': 'Zhou', '히라이': 'Hirai',
  '묘이': 'Moi', '미나토자키': 'Minatozaki', '투안': 'Tuan', '뱀뱀': 'BamBam', '왕': 'Wang',
  '마쉬': 'Marsh', '폰데차피팟': 'Pondecha', '분팍디트라웰': 'Bunphak', '마노반': 'Manoban',
  '다우마': 'Dauma', '에닉': 'Ennik', '깐삐묵': 'Kunpimook', '뿌와꾼': 'Bhuwakul'
};

// 본명에서 성씨 추출
function extractSurname(realName: string): { surname: string; surname_en: string } {
  if (!realName) return { surname: '', surname_en: '' };
  
  // 한글이 포함된 경우 첫 글자
  const koreanMatch = realName.match(/^([가-힣])/);
  if (koreanMatch) {
    const surname = koreanMatch[1];
    const surname_en = surnameMap[surname] || surname;
    return { surname, surname_en };
  }
  
  // 영문 이름인 경우 첫 단어
  const englishMatch = realName.match(/^([A-Za-z]+)/);
  if (englishMatch) {
    const surname_en = englishMatch[1];
    // 영문 성씨를 한글로 변환 (일부만)
    const reverseMap: Record<string, string> = {
      'Kim': '김', 'Lee': '이', 'Park': '박', 'Choi': '최', 'Jung': '정',
      'Kang': '강', 'Cho': '조', 'Yoon': '윤', 'Jang': '장', 'Im': '임',
      'Han': '한', 'Oh': '오', 'Seo': '서', 'Shin': '신', 'Kwon': '권',
      'Hwang': '황', 'An': '안', 'Song': '송', 'Jeon': '전', 'Hong': '홍',
      'Yu': '유', 'Moon': '문', 'Yang': '양', 'Son': '손', 'Bae': '배',
      'Baek': '백', 'Heo': '허', 'Nam': '남', 'Shim': '심', 'Noh': '노',
      'Jeong': '정', 'Ha': '하', 'Kwak': '곽', 'Sung': '성', 'Cha': '차',
      'Joo': '주', 'Woo': '우', 'Koo': '구', 'Na': '나', 'Min': '민',
      'Ryu': '류', 'Jin': '진', 'Ji': '지', 'Bang': '방', 'Ma': '마',
      'Do': '도', 'La': '라', 'Ro': '로', 'Boo': '부', 'Won': '원',
      'Pham': '팜', 'Mo': '모', 'Ning': '닝', 'Huening': '휴', 'Jong': '종',
      'Seok': '석', 'Watanabe': '와', 'Hamada': '하마다', 'Kanemoto': '카네모토',
      'Nishimura': '니시무라', 'Nakamoto': '나카모토', 'Sakamoto': '사카모토',
      'Ezaki': '에자키', 'Miyawaki': '미야와키', 'Nakamura': '나카무라',
      'Hokazono': '호카조노', 'Sakai': '사카이', 'Osaki': '오사키',
      'Uchinaga': '우치나가', 'Kawai': '카와이', 'Enami': '에나미',
      'Lilacha': '리라차', 'Parita': '파리타', 'Annachaya': '안나차야',
      'Bahiyyih': '바히에', 'Shen': '션취안', 'Zhong': '종천러', 'Nicha': '니차',
      'Tuan': '투안', 'BamBam': '뱀뱀', 'Wang': '왕', 'Marsh': '마쉬',
      'Pondecha': '폰데차피팟', 'Bunphak': '분팍디트라웰', 'Manoban': '마노반',
      'Dauma': '다우마', 'Ennik': '에닉', 'Kunpimook': '깐삐묵', 'Bhuwakul': '뿌와꾼',
      'Zhou': '저우', 'Hirai': '히라이', 'Moi': '묘이', 'Minatozaki': '미나토자키',
      'Byun': '변'
    };
    const surname = reverseMap[surname_en] || surname_en;
    return { surname, surname_en };
  }
  
  return { surname: '', surname_en: '' };
}

// 활동명 정규화
function normalizeStageName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w가-힣]/g, '')
    .trim();
}

// CSV 파싱
const lines = csvData.split('\n').slice(1).filter(l => l.trim());
const idols: Array<{ key: string; stageName: string; realName: string; group: string; surname: string; surname_en: string; gender: string }> = [];

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
const uniqueIdols: Record<string, typeof idols[0]> = {};
idols.forEach(idol => {
  uniqueIdols[idol.key] = idol;
});

// 그룹별로 정렬
const grouped: Record<string, typeof idols> = {};
Object.values(uniqueIdols).forEach(idol => {
  if (!grouped[idol.group]) grouped[idol.group] = [];
  grouped[idol.group].push(idol);
});

// IDOL_DB 형식으로 출력
console.log('// ================= Generated from CSV =================\n');
Object.keys(grouped).sort().forEach(group => {
  console.log(`  // ================= ${group} =================`);
  grouped[group].forEach(idol => {
    console.log(`  '${idol.key}': { surname: '${idol.surname}', surname_en: '${idol.surname_en}', group: '${idol.group}' }, // ${idol.realName}`);
  });
  console.log('');
});

console.log(`// Total: ${Object.keys(uniqueIdols).length} idols`);
