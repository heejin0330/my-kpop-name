// app/lib/idol-db.ts
// K-POP 아이돌 데이터베이스 (활동명 & 본명 & 영문명 통합)
// generate, resolve-idol 등 여러 API에서 공유하는 모듈

export const IDOL_DB: Record<string, { surname: string; surname_en: string; group: string }> = {
  
  // ================= BTS (방탄소년단) =================
  'rm': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'namjoon': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'jin': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'seokjin': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'suga': { surname: '민', surname_en: 'Min', group: 'BTS' },
  'yoongi': { surname: '민', surname_en: 'Min', group: 'BTS' },
  'agustd': { surname: '민', surname_en: 'Min', group: 'BTS' },
  'jhope': { surname: '정', surname_en: 'Jung', group: 'BTS' },
  'hoseok': { surname: '정', surname_en: 'Jung', group: 'BTS' },
  'jimin': { surname: '박', surname_en: 'Park', group: 'BTS' },
  'v': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'taehyung': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'jungkook': { surname: '전', surname_en: 'Jeon', group: 'BTS' },
  '슈가': { surname: '민', surname_en: 'Min', group: 'BTS' },
  '정국': { surname: '전', surname_en: 'Jeon', group: 'BTS' },
  '제이홉': { surname: '정', surname_en: 'Jung', group: 'BTS' },
  '지민': { surname: '박', surname_en: 'Park', group: 'BTS' },
  '뷔': { surname: '김', surname_en: 'Kim', group: 'BTS' },

  // ================= BLACKPINK (블랙핑크) =================
  'jisoo': { surname: '김', surname_en: 'Kim', group: 'BLACKPINK' },
  'jennie': { surname: '김', surname_en: 'Kim', group: 'BLACKPINK' },
  'rose': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' },
  'rosé': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' },
  'chaeyoung': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' },
  'lisa': { surname: '라', surname_en: 'La', group: 'BLACKPINK' },
  'lalisa': { surname: '라', surname_en: 'La', group: 'BLACKPINK' },
  '로제': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' },
  '제니': { surname: '김', surname_en: 'Kim', group: 'BLACKPINK' },
  '리사': { surname: '라', surname_en: 'La', group: 'BLACKPINK' },
  '지수': { surname: '김', surname_en: 'Kim', group: 'BLACKPINK' },

  // ================= SEVENTEEN (세븐틴) =================
  'scoups': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'seungcheol': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'jeonghan': { surname: '윤', surname_en: 'Yoon', group: 'SEVENTEEN' },
  'joshua': { surname: '홍', surname_en: 'Hong', group: 'SEVENTEEN' },
  'jisoo_svt': { surname: '홍', surname_en: 'Hong', group: 'SEVENTEEN' },
  'jun': { surname: '문', surname_en: 'Moon', group: 'SEVENTEEN' },
  'hoshi': { surname: '권', surname_en: 'Kwon', group: 'SEVENTEEN' },
  'soonyoung': { surname: '권', surname_en: 'Kwon', group: 'SEVENTEEN' },
  'wonwoo': { surname: '전', surname_en: 'Jeon', group: 'SEVENTEEN' },
  'woozi': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'jihoon': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'dk': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'dokyeom': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'seokmin': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'mingyu': { surname: '김', surname_en: 'Kim', group: 'SEVENTEEN' },
  'the8': { surname: '서', surname_en: 'Seo', group: 'SEVENTEEN' },
  'minghao': { surname: '서', surname_en: 'Seo', group: 'SEVENTEEN' },
  'seungkwan': { surname: '부', surname_en: 'Boo', group: 'SEVENTEEN' },
  'vernon': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'hansol': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'dino': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  '도겸': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  '디노': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  '디에잇': { surname: '서', surname_en: 'Seo', group: 'SEVENTEEN' },
  '민규': { surname: '김', surname_en: 'Kim', group: 'SEVENTEEN' },
  '버논': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  '에스쿱스': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  '우지': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  '원우': { surname: '전', surname_en: 'Jeon', group: 'SEVENTEEN' },
  '정한': { surname: '윤', surname_en: 'Yoon', group: 'SEVENTEEN' },
  '조슈아': { surname: '홍', surname_en: 'Hong', group: 'SEVENTEEN' },
  '준': { surname: '문', surname_en: 'Moon', group: 'SEVENTEEN' },
  '호시': { surname: '권', surname_en: 'Kwon', group: 'SEVENTEEN' },
  '승관': { surname: '부', surname_en: 'Boo', group: 'SEVENTEEN' },

  // ================= Stray Kids (스트레이 키즈) =================
  'bangchan': { surname: '방', surname_en: 'Bang', group: 'Stray Kids' },
  'leeknow': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  'minho': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  'changbin': { surname: '서', surname_en: 'Seo', group: 'Stray Kids' },
  'hyunjin': { surname: '황', surname_en: 'Hwang', group: 'Stray Kids' },
  'han': { surname: '한', surname_en: 'Han', group: 'Stray Kids' },
  'jisung': { surname: '한', surname_en: 'Han', group: 'Stray Kids' },
  'felix': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  'yongbok': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  'seungmin': { surname: '김', surname_en: 'Kim', group: 'Stray Kids' },
  'in': { surname: '양', surname_en: 'Yang', group: 'Stray Kids' },
  'jeongin': { surname: '양', surname_en: 'Yang', group: 'Stray Kids' },
  '리노': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  '승민': { surname: '김', surname_en: 'Kim', group: 'Stray Kids' },
  '펠릭스': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  '방찬': { surname: '방', surname_en: 'Bang', group: 'Stray Kids' },
  '창빈': { surname: '서', surname_en: 'Seo', group: 'Stray Kids' },
  '현진': { surname: '황', surname_en: 'Hwang', group: 'Stray Kids' },
  '아이엔': { surname: '양', surname_en: 'Yang', group: 'Stray Kids' },

  // ================= NewJeans (뉴진스) =================
  'minji': { surname: '김', surname_en: 'Kim', group: 'NewJeans' },
  'hanni': { surname: '팜', surname_en: 'Pham', group: 'NewJeans' },
  'danielle': { surname: '모', surname_en: 'Mo', group: 'NewJeans' },
  'haerin': { surname: '강', surname_en: 'Kang', group: 'NewJeans' },
  'hyein': { surname: '이', surname_en: 'Lee', group: 'NewJeans' },
  '다니엘': { surname: '다', surname_en: 'Marsh', group: 'NewJeans' },
  '혜인': { surname: '이', surname_en: 'Lee', group: 'NewJeans' },
  '민지': { surname: '김', surname_en: 'Kim', group: 'NewJeans' },
  '하니': { surname: '팜', surname_en: 'Pham', group: 'NewJeans' },
  '해린': { surname: '강', surname_en: 'Kang', group: 'NewJeans' },

  // ================= IVE (아이브) =================
  'yujin': { surname: '안', surname_en: 'An', group: 'IVE' },
  'gaeul': { surname: '김', surname_en: 'Kim', group: 'IVE' },
  'rei': { surname: '나', surname_en: 'Na', group: 'IVE' },
  'wonyoung': { surname: '장', surname_en: 'Jang', group: 'IVE' },
  'liz': { surname: '김', surname_en: 'Kim', group: 'IVE' },
  'leeseo': { surname: '이', surname_en: 'Lee', group: 'IVE' },
  '가을': { surname: '김', surname_en: 'Kim', group: 'IVE' },
  '레이': { surname: '나', surname_en: 'Na', group: 'IVE' },
  '원영': { surname: '장', surname_en: 'Jang', group: 'IVE' },
  '리즈': { surname: '김', surname_en: 'Kim', group: 'IVE' },
  '이서': { surname: '이', surname_en: 'Lee', group: 'IVE' },
  '유진': { surname: '안', surname_en: 'An', group: 'IVE' },

  // ================= NCT (주요 멤버) =================
  'taeyong': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'mark': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'jaehyun': { surname: '정', surname_en: 'Jeong', group: 'NCT' },
  'doyoung': { surname: '김', surname_en: 'Kim', group: 'NCT' },
  'haechan': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'jaemin': { surname: '나', surname_en: 'Na', group: 'NCT' },
  'jeno': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'jisung_nct': { surname: '박', surname_en: 'Park', group: 'NCT' },

  // ================= TXT (투모로우바이투게더) =================
  'soobin': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  'yeonjun': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  'beomgyu': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  'taehyun_txt': { surname: '강', surname_en: 'Kang', group: 'TXT' },
  'hueningkai': { surname: '휴', surname_en: 'Huening', group: 'TXT' },
  '범규': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  '수빈': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  '연준': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  '태현': { surname: '강', surname_en: 'Kang', group: 'TXT' },
  '휴닝카이': { surname: '휴', surname_en: 'Huening', group: 'TXT' },

  // ================= Aespa (에스파) =================
  'karina': { surname: '유', surname_en: 'Yu', group: 'aespa' },
  'giselle': { surname: '김', surname_en: 'Kim', group: 'aespa' },
  'winter': { surname: '김', surname_en: 'Kim', group: 'aespa' },
  'ningning': { surname: '닝', surname_en: 'Ning', group: 'aespa' },
  '카리나': { surname: '유', surname_en: 'Yu', group: 'aespa' },
  '지젤': { surname: '김', surname_en: 'Kim', group: 'aespa' },
  '윈터': { surname: '김', surname_en: 'Kim', group: 'aespa' },
  '닝닝': { surname: '닝', surname_en: 'Ning', group: 'aespa' },

  // ================= (G)I-DLE =================
  '미연': { surname: '조', surname_en: 'Cho', group: '(G)I-DLE' },
  '민니': { surname: '니', surname_en: 'Nicha', group: '(G)I-DLE' },
  '소연': { surname: '전', surname_en: 'Jeon', group: '(G)I-DLE' },
  '슈화': { surname: '예', surname_en: 'Ye', group: '(G)I-DLE' },
  '우기': { surname: '송', surname_en: 'Song', group: '(G)I-DLE' },

  // ================= ATEEZ =================
  '민기': { surname: '송', surname_en: 'Song', group: 'ATEEZ' },
  '산': { surname: '최', surname_en: 'Choi', group: 'ATEEZ' },
  '성화': { surname: '박', surname_en: 'Park', group: 'ATEEZ' },
  '여상': { surname: '강', surname_en: 'Kang', group: 'ATEEZ' },
  '우영': { surname: '정', surname_en: 'Jung', group: 'ATEEZ' },
  '윤호': { surname: '정', surname_en: 'Jung', group: 'ATEEZ' },
  '종호': { surname: '최', surname_en: 'Choi', group: 'ATEEZ' },
  '홍중': { surname: '김', surname_en: 'Kim', group: 'ATEEZ' },

  // ================= BABYMONSTER =================
  '라미': { surname: '신', surname_en: 'Shin', group: 'BABYMONSTER' },
  '로라': { surname: '이', surname_en: 'Lee', group: 'BABYMONSTER' },
  '루카': { surname: '카', surname_en: 'Kawai', group: 'BABYMONSTER' },
  '아사': { surname: '에', surname_en: 'Enami', group: 'BABYMONSTER' },
  '아현': { surname: '정', surname_en: 'Jung', group: 'BABYMONSTER' },
  '치키타': { surname: '리', surname_en: 'Lilacha', group: 'BABYMONSTER' },
  '파리타': { surname: '파', surname_en: 'Parita', group: 'BABYMONSTER' },

  // ================= BOYNEXTDOOR =================
  '리우': { surname: '이', surname_en: 'Lee', group: 'BOYNEXTDOOR' },
  '명재현': { surname: '명', surname_en: 'Myeong', group: 'BOYNEXTDOOR' },
  '성호': { surname: '박', surname_en: 'Park', group: 'BOYNEXTDOOR' },
  '운학': { surname: '김', surname_en: 'Kim', group: 'BOYNEXTDOOR' },
  '이한': { surname: '김', surname_en: 'Kim', group: 'BOYNEXTDOOR' },
  '태산': { surname: '한', surname_en: 'Han', group: 'BOYNEXTDOOR' },

  // ================= DAY6 =================
  'youngk': { surname: '강', surname_en: 'Kang', group: 'DAY6' },
  '도운': { surname: '윤', surname_en: 'Yoon', group: 'DAY6' },
  '성진': { surname: '박', surname_en: 'Park', group: 'DAY6' },
  '원필': { surname: '김', surname_en: 'Kim', group: 'DAY6' },

  // ================= ENHYPEN =================
  '니키': { surname: '니', surname_en: 'Nishimura', group: 'ENHYPEN' },
  '선우': { surname: '김', surname_en: 'Kim', group: 'ENHYPEN' },
  '성훈': { surname: '박', surname_en: 'Park', group: 'ENHYPEN' },
  '정원': { surname: '양', surname_en: 'Yang', group: 'ENHYPEN' },
  '제이': { surname: '박', surname_en: 'Park', group: 'ENHYPEN' },
  '제이크': { surname: '심', surname_en: 'Shim', group: 'ENHYPEN' },
  '희승': { surname: '이', surname_en: 'Lee', group: 'ENHYPEN' },

  // ================= EXO =================
  '디오': { surname: '도', surname_en: 'Do', group: 'EXO' },
  '백현': { surname: '변', surname_en: 'Byun', group: 'EXO' },
  '세훈': { surname: '오', surname_en: 'Oh', group: 'EXO' },
  '수호': { surname: '김', surname_en: 'Kim', group: 'EXO' },
  '시우민': { surname: '김', surname_en: 'Kim', group: 'EXO' },
  '찬열': { surname: '박', surname_en: 'Park', group: 'EXO' },
  '첸': { surname: '김', surname_en: 'Kim', group: 'EXO' },
  '카이': { surname: '김', surname_en: 'Kim', group: 'EXO' },

  // ================= GOT7 =================
  '마크': { surname: '마', surname_en: 'Mark', group: 'GOT7' },
  '뱀뱀': { surname: '깐', surname_en: 'Kunpimook', group: 'GOT7' },
  '영재': { surname: '최', surname_en: 'Choi', group: 'GOT7' },
  '유겸': { surname: '김', surname_en: 'Kim', group: 'GOT7' },
  '잭슨': { surname: '잭', surname_en: 'Jackson', group: 'GOT7' },
  '제이비': { surname: '임', surname_en: 'Im', group: 'GOT7' },
  '진영': { surname: '박', surname_en: 'Park', group: 'GOT7' },

  // ================= ILLIT =================
  '모카': { surname: '사', surname_en: 'Sakai', group: 'ILLIT' },
  '민주': { surname: '박', surname_en: 'Park', group: 'ILLIT' },
  '원희': { surname: '이', surname_en: 'Lee', group: 'ILLIT' },
  '윤아': { surname: '노', surname_en: 'Noh', group: 'ILLIT' },
  '이로하': { surname: '호', surname_en: 'Hokazono', group: 'ILLIT' },

  // ================= ITZY =================
  '류진': { surname: '신', surname_en: 'Shin', group: 'ITZY' },
  '리아': { surname: '최', surname_en: 'Choi', group: 'ITZY' },
  '예지': { surname: '황', surname_en: 'Hwang', group: 'ITZY' },
  '유나': { surname: '신', surname_en: 'Shin', group: 'ITZY' },
  '채령': { surname: '이', surname_en: 'Lee', group: 'ITZY' },

  // ================= KISS OF LIFE =================
  '나띠': { surname: '안', surname_en: 'Annachaya', group: 'KISS OF LIFE' },
  '벨': { surname: '심', surname_en: 'Shim', group: 'KISS OF LIFE' },
  '쥴리': { surname: '한', surname_en: 'Han', group: 'KISS OF LIFE' },
  '하늘': { surname: '원', surname_en: 'Won', group: 'KISS OF LIFE' },

  // ================= Kep1er =================
  '강예서': { surname: '강', surname_en: 'Kang', group: 'Kep1er' },
  '김다연': { surname: '김', surname_en: 'Kim', group: 'Kep1er' },
  '김채현': { surname: '김', surname_en: 'Kim', group: 'Kep1er' },
  '마시로': { surname: '사', surname_en: 'Sakamoto', group: 'Kep1er' },
  '샤오팅': { surname: '선', surname_en: 'Shen', group: 'Kep1er' },
  '서영은': { surname: '서', surname_en: 'Seo', group: 'Kep1er' },
  '최유진': { surname: '최', surname_en: 'Choi', group: 'Kep1er' },
  '휴닝바히에': { surname: '바', surname_en: 'Bahiyyih', group: 'Kep1er' },
  '히카루': { surname: '에', surname_en: 'Ezaki', group: 'Kep1er' },

  // ================= LE SSERAFIM =================
  '김채원': { surname: '김', surname_en: 'Kim', group: 'LE SSERAFIM' },
  '사쿠라': { surname: '미', surname_en: 'Miyawaki', group: 'LE SSERAFIM' },
  '카즈하': { surname: '나', surname_en: 'Nakamura', group: 'LE SSERAFIM' },
  '허윤진': { surname: '허', surname_en: 'Heo', group: 'LE SSERAFIM' },
  '홍은채': { surname: '홍', surname_en: 'Hong', group: 'LE SSERAFIM' },

  // ================= MONSTA X =================
  '기현': { surname: '유', surname_en: 'Yu', group: 'MONSTA X' },
  '민혁': { surname: '이', surname_en: 'Lee', group: 'MONSTA X' },
  '셔누': { surname: '손', surname_en: 'Son', group: 'MONSTA X' },
  '아이엠': { surname: '임', surname_en: 'Im', group: 'MONSTA X' },
  '주헌': { surname: '이', surname_en: 'Lee', group: 'MONSTA X' },
  '형원': { surname: '채', surname_en: 'Chae', group: 'MONSTA X' },

  // ================= NCT 127 =================
  '도영': { surname: '김', surname_en: 'Kim', group: 'NCT 127' },
  '유타': { surname: '나', surname_en: 'Nakamoto', group: 'NCT 127' },
  '재현': { surname: '정', surname_en: 'Jung', group: 'NCT 127' },
  '쟈니': { surname: '서', surname_en: 'Seo', group: 'NCT 127' },
  '정우': { surname: '김', surname_en: 'Kim', group: 'NCT 127' },
  '태용': { surname: '이', surname_en: 'Lee', group: 'NCT 127' },
  '태일': { surname: '문', surname_en: 'Moon', group: 'NCT 127' },
  '해찬': { surname: '이', surname_en: 'Lee', group: 'NCT 127' },

  // ================= NCT DREAM =================
  '런쥔': { surname: '황', surname_en: 'Hwang', group: 'NCT DREAM' },
  '재민': { surname: '나', surname_en: 'Na', group: 'NCT DREAM' },
  '제노': { surname: '이', surname_en: 'Lee', group: 'NCT DREAM' },
  '지성': { surname: '박', surname_en: 'Park', group: 'NCT DREAM' },
  '천러': { surname: '종', surname_en: 'Zhong', group: 'NCT DREAM' },

  // ================= NMIXX =================
  '규진': { surname: '장', surname_en: 'Jang', group: 'NMIXX' },
  '릴리': { surname: '릴', surname_en: 'Lily', group: 'NMIXX' },
  '배이': { surname: '배', surname_en: 'Bae', group: 'NMIXX' },
  '설윤': { surname: '설', surname_en: 'Seol', group: 'NMIXX' },
  '지우': { surname: '김', surname_en: 'Kim', group: 'NMIXX' },
  '해원': { surname: '오', surname_en: 'Oh', group: 'NMIXX' },

  // ================= RIIZE =================
  '성찬': { surname: '정', surname_en: 'Jung', group: 'RIIZE' },
  '소희': { surname: '이', surname_en: 'Lee', group: 'RIIZE' },
  '쇼타로': { surname: '오', surname_en: 'Osaki', group: 'RIIZE' },
  '앤톤': { surname: '이', surname_en: 'Lee', group: 'RIIZE' },
  '원빈': { surname: '박', surname_en: 'Park', group: 'RIIZE' },
  '은석': { surname: '송', surname_en: 'Song', group: 'RIIZE' },

  // ================= Red Velvet =================
  '슬기': { surname: '강', surname_en: 'Kang', group: 'Red Velvet' },
  '아이린': { surname: '배', surname_en: 'Bae', group: 'Red Velvet' },
  '예리': { surname: '김', surname_en: 'Kim', group: 'Red Velvet' },
  '웬디': { surname: '손', surname_en: 'Son', group: 'Red Velvet' },
  '조이': { surname: '박', surname_en: 'Park', group: 'Red Velvet' },

  // ================= SHINee =================
  '민호': { surname: '최', surname_en: 'Choi', group: 'SHINee' },
  '온유': { surname: '이', surname_en: 'Lee', group: 'SHINee' },
  '키': { surname: '김', surname_en: 'Kim', group: 'SHINee' },
  '태민': { surname: '이', surname_en: 'Lee', group: 'SHINee' },

  // ================= STAYC =================
  '세은': { surname: '윤', surname_en: 'Yoon', group: 'STAYC' },
  '수민': { surname: '배', surname_en: 'Bae', group: 'STAYC' },
  '시은': { surname: '박', surname_en: 'Park', group: 'STAYC' },
  '아이사': { surname: '이', surname_en: 'Lee', group: 'STAYC' },
  '윤': { surname: '심', surname_en: 'Shim', group: 'STAYC' },
  '재이': { surname: '장', surname_en: 'Jang', group: 'STAYC' },

  // ================= THE BOYZ =================
  '뉴': { surname: '최', surname_en: 'Choi', group: 'THE BOYZ' },
  '상연': { surname: '이', surname_en: 'Lee', group: 'THE BOYZ' },
  '에릭': { surname: '손', surname_en: 'Son', group: 'THE BOYZ' },
  '영훈': { surname: '김', surname_en: 'Kim', group: 'THE BOYZ' },
  '제이콥': { surname: '배', surname_en: 'Bae', group: 'THE BOYZ' },
  '주연': { surname: '이', surname_en: 'Lee', group: 'THE BOYZ' },
  '주학년': { surname: '주', surname_en: 'Joo', group: 'THE BOYZ' },
  '케빈': { surname: '문', surname_en: 'Moon', group: 'THE BOYZ' },
  '큐': { surname: '지', surname_en: 'Ji', group: 'THE BOYZ' },
  '현재': { surname: '이', surname_en: 'Lee', group: 'THE BOYZ' },

  // ================= TREASURE =================
  '박정우': { surname: '박', surname_en: 'Park', group: 'TREASURE' },
  '소정환': { surname: '소', surname_en: 'So', group: 'TREASURE' },
  '아사히': { surname: '하', surname_en: 'Hamada', group: 'TREASURE' },
  '요시': { surname: '카', surname_en: 'Kanemoto', group: 'TREASURE' },
  '윤재혁': { surname: '윤', surname_en: 'Yoon', group: 'TREASURE' },
  '준규': { surname: '김', surname_en: 'Kim', group: 'TREASURE' },
  '지훈': { surname: '박', surname_en: 'Park', group: 'TREASURE' },
  '최현석': { surname: '최', surname_en: 'Choi', group: 'TREASURE' },
  '하루토': { surname: '와', surname_en: 'Watanabe', group: 'TREASURE' },

  // ================= TWICE =================
  '나연': { surname: '임', surname_en: 'Im', group: 'TWICE' },
  '다현': { surname: '김', surname_en: 'Kim', group: 'TWICE' },
  '모모': { surname: '히', surname_en: 'Hirai', group: 'TWICE' },
  '미나': { surname: '묘', surname_en: 'Moi', group: 'TWICE' },
  '사나': { surname: '미', surname_en: 'Minatozaki', group: 'TWICE' },
  '정연': { surname: '유', surname_en: 'Yu', group: 'TWICE' },
  '지효': { surname: '박', surname_en: 'Park', group: 'TWICE' },
  '쯔위': { surname: '저', surname_en: 'Zhou', group: 'TWICE' },
  '채영': { surname: '손', surname_en: 'Son', group: 'TWICE' },

  // ================= TWS =================
  '경민': { surname: '임', surname_en: 'Im', group: 'TWS' },
  '도훈': { surname: '최', surname_en: 'Choi', group: 'TWS' },
  '신유': { surname: '신', surname_en: 'Shin', group: 'TWS' },
  '한진': { surname: '한', surname_en: 'Han', group: 'TWS' },

  // ================= VIVIZ =================
  '신비': { surname: '황', surname_en: 'Hwang', group: 'VIVIZ' },
  '엄지': { surname: '김', surname_en: 'Kim', group: 'VIVIZ' },
  '은하': { surname: '정', surname_en: 'Jung', group: 'VIVIZ' },

  // ================= ZEROBASEONE =================
  '김규빈': { surname: '김', surname_en: 'Kim', group: 'ZEROBASEONE' },
  '김지웅': { surname: '김', surname_en: 'Kim', group: 'ZEROBASEONE' },
  '김태래': { surname: '김', surname_en: 'Kim', group: 'ZEROBASEONE' },
  '리키': { surname: '션', surname_en: 'Shen', group: 'ZEROBASEONE' },
  '박건욱': { surname: '박', surname_en: 'Park', group: 'ZEROBASEONE' },
  '석매튜': { surname: '석', surname_en: 'Seok', group: 'ZEROBASEONE' },
  '성한빈': { surname: '성', surname_en: 'Sung', group: 'ZEROBASEONE' },
  '장하오': { surname: '장', surname_en: 'Jang', group: 'ZEROBASEONE' },
  '한유진': { surname: '한', surname_en: 'Han', group: 'ZEROBASEONE' },

  // ================= 솔로 =================
  '아이유': { surname: '이', surname_en: 'Lee', group: 'IU' },
  '싸이': { surname: '박', surname_en: 'Park', group: 'PSY' },
  '강다니엘': { surname: '강', surname_en: 'Kang', group: '강다니엘' },
  '권은비': { surname: '권', surname_en: 'Kwon', group: '권은비' },
  '선미': { surname: '이', surname_en: 'Lee', group: '선미' },
  '이무진': { surname: '이', surname_en: 'Lee', group: '이무진' },
  '임영웅': { surname: '임', surname_en: 'Im', group: '임영웅' },
  '전소미': { surname: '에', surname_en: 'Ennik', group: '전소미' },
  '지코': { surname: '우', surname_en: 'Woo', group: '지코' },
  '청하': { surname: '김', surname_en: 'Kim', group: '청하' },
  '최예나': { surname: '최', surname_en: 'Choi', group: '최예나' },
};

export function normalizeIdolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w가-힣]/g, '')
    .trim();
}

export const GROUP_NAMES = new Set([
  'bts', '방탄소년단', 'blackpink', '블랙핑크', 'seventeen', '세븐틴',
  'nct', 'exo', '엑소', 'twice', '트와이스', 'aespa', '에스파',
  'stray kids', 'straykids', '스트레이키즈', 'ateez', '에이티즈',
  'txt', '투모로우바이투게더', 'enhypen', '엔하이픈', 'itzy', '잇지',
  'ive', '아이브', 'lesserafim', '르세라핌', 'newjeans', '뉴진스',
  'gidle', '여자아이들', 'nctdream', 'nct127', 'nctdojaejung',
  'riize', '라이즈', 'zerobaseone', '제로베이스원',
  'boynextdoor', '보이넥스트도어', 'day6', '데이식스',
  'redvelvet', '레드벨벳', 'got7', '갓세븐', 'shinee', '샤이니',
  'babymonster', '베이비몬스터', 'nmixx', 'kissoflife',
  'treasure', '트레저', 'theboyz', '더보이즈',
]);

export function getIdolSurname(idolName: string): { surname: string; surname_en: string; group: string } | null {
  const normalized = normalizeIdolName(idolName);

  if (GROUP_NAMES.has(normalized)) {
    console.warn(`⚠️ Group name detected as idolName: "${idolName}" (normalized: "${normalized}"). Will NOT resolve to a specific member. Using AI lookup.`);
    return null;
  }

  const found = IDOL_DB[normalized];
  if (found) {
    console.log(`✅ Found in IDOL_DB: ${idolName} → ${found.surname} (${found.surname_en}) [${found.group}]`);
    return found;
  }
  console.warn(`⚠️ Not found in IDOL_DB: "${idolName}" (normalized: "${normalized}"), will use AI lookup`);
  return null;
}

export function cleanIdolRealName(idolRealName: string, idolName: string): string {
  if (!idolRealName) return idolRealName;
  
  if (idolRealName.includes(',')) {
    const names = idolRealName.split(',').map(n => n.trim());
    const normalizedIdolName = normalizeIdolName(idolName);
    const idolNameMap: Record<string, string[]> = {
      'jisoo': ['지수', '김지수'],
      'jennie': ['제니', '김제니'],
      'rose': ['채영', '박채영', 'rosé'],
      'rosé': ['채영', '박채영'],
      'chaeyoung': ['채영', '박채영'],
      'lisa': ['리사', '라리사', 'lalisa'],
      'lalisa': ['리사', '라리사'],
    };
    
    const targetNames = idolNameMap[normalizedIdolName] || [];
    
    for (const name of names) {
      for (const target of targetNames) {
        if (name.includes(target) || target.includes(name.replace(/[가-힣]/g, ''))) {
          return name;
        }
      }
    }
    
    return names[0];
  }
  
  return idolRealName.trim();
}

// 동명이인 검색: IDOL_DB에서 같은 정규화된 이름을 가진 모든 항목 검색
export function findAllIdolMatches(idolName: string): Array<{ key: string; surname: string; surname_en: string; group: string }> {
  const normalized = normalizeIdolName(idolName);
  
  if (GROUP_NAMES.has(normalized)) return [];
  
  const matches: Array<{ key: string; surname: string; surname_en: string; group: string }> = [];
  
  // 직접 매칭
  const direct = IDOL_DB[normalized];
  if (direct) {
    matches.push({ key: normalized, ...direct });
  }
  
  // 다른 키에서 같은 이름 패턴으로 매칭되는 것 찾기 (동명이인 확인)
  for (const [key, value] of Object.entries(IDOL_DB)) {
    if (key === normalized) continue;
    if (normalizeIdolName(key) === normalized && !matches.find(m => m.group === value.group)) {
      matches.push({ key, ...value });
    }
  }
  
  return matches;
}
