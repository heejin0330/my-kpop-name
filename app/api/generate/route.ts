// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { selectRandomNameCharacters, LANGUAGE_MAP, type NameCharacter } from './name-characters-db';

// 1️⃣ K-POP 아이돌 데이터베이스 (활동명 & 본명 & 영문명 통합)
// 모든 키(key)는 소문자, 띄어쓰기 없이 작성 (검색 최적화)
const IDOL_DB: Record<string, { surname: string; surname_en: string; group: string }> = {
  
  // ================= BTS (방탄소년단) =================
  'rm': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'namjoon': { surname: '김', surname_en: 'Kim', group: 'BTS' }, // 김남준
  'jin': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'seokjin': { surname: '김', surname_en: 'Kim', group: 'BTS' }, // 김석진
  'suga': { surname: '민', surname_en: 'Min', group: 'BTS' },
  'yoongi': { surname: '민', surname_en: 'Min', group: 'BTS' }, // 민윤기
  'agustd': { surname: '민', surname_en: 'Min', group: 'BTS' },
  'jhope': { surname: '정', surname_en: 'Jung', group: 'BTS' },
  'hoseok': { surname: '정', surname_en: 'Jung', group: 'BTS' }, // 정호석
  'jimin': { surname: '박', surname_en: 'Park', group: 'BTS' }, // 박지민
  'v': { surname: '김', surname_en: 'Kim', group: 'BTS' },
  'taehyung': { surname: '김', surname_en: 'Kim', group: 'BTS' }, // 김태형
  'jungkook': { surname: '전', surname_en: 'Jeon', group: 'BTS' }, // 전정국

  // ================= BLACKPINK (블랙핑크) =================
  'jisoo': { surname: '김', surname_en: 'Kim', group: 'BLACKPINK' },
  'jennie': { surname: '김', surname_en: 'Kim', group: 'BLACKPINK' },
  'rose': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' },
  'rosé': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' },
  'chaeyoung': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' }, // 박채영
  'lisa': { surname: '라', surname_en: 'La', group: 'BLACKPINK' }, // 라리사 (성씨 '라' 매칭)
  'lalisa': { surname: '라', surname_en: 'La', group: 'BLACKPINK' },

  // ================= SEVENTEEN (세븐틴) =================
  'scoups': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'seungcheol': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'jeonghan': { surname: '윤', surname_en: 'Yoon', group: 'SEVENTEEN' },
  'joshua': { surname: '홍', surname_en: 'Hong', group: 'SEVENTEEN' },
  'jisoo_svt': { surname: '홍', surname_en: 'Hong', group: 'SEVENTEEN' }, // 홍지수
  'jun': { surname: '문', surname_en: 'Moon', group: 'SEVENTEEN' }, // 문준휘
  'hoshi': { surname: '권', surname_en: 'Kwon', group: 'SEVENTEEN' },
  'soonyoung': { surname: '권', surname_en: 'Kwon', group: 'SEVENTEEN' }, // 권순영
  'wonwoo': { surname: '전', surname_en: 'Jeon', group: 'SEVENTEEN' },
  'woozi': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'jihoon': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' }, // 이지훈
  'dk': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'dokyeom': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },
  'seokmin': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' }, // 이석민
  'mingyu': { surname: '김', surname_en: 'Kim', group: 'SEVENTEEN' },
  'the8': { surname: '서', surname_en: 'Seo', group: 'SEVENTEEN' }, // 서명호
  'minghao': { surname: '서', surname_en: 'Seo', group: 'SEVENTEEN' },
  'seungkwan': { surname: '부', surname_en: 'Boo', group: 'SEVENTEEN' }, // 부승관 (희귀성씨!)
  'vernon': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'hansol': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' },
  'dino': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' },

  // ================= Stray Kids (스트레이 키즈) =================
  'bangchan': { surname: '방', surname_en: 'Bang', group: 'Stray Kids' },
  'leeknow': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  'minho': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' }, // 이리노
  'changbin': { surname: '서', surname_en: 'Seo', group: 'Stray Kids' },
  'hyunjin': { surname: '황', surname_en: 'Hwang', group: 'Stray Kids' },
  'han': { surname: '한', surname_en: 'Han', group: 'Stray Kids' },
  'jisung': { surname: '한', surname_en: 'Han', group: 'Stray Kids' }, // 한지성
  'felix': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' },
  'yongbok': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' }, // 이용복
  'seungmin': { surname: '김', surname_en: 'Kim', group: 'Stray Kids' },
  'in': { surname: '양', surname_en: 'Yang', group: 'Stray Kids' }, // 아이엔
  'jeongin': { surname: '양', surname_en: 'Yang', group: 'Stray Kids' }, // 양정인

  // ================= NewJeans (뉴진스) =================
  'minji': { surname: '김', surname_en: 'Kim', group: 'NewJeans' },
  'hanni': { surname: '팜', surname_en: 'Pham', group: 'NewJeans' }, // 팜하니
  'danielle': { surname: '모', surname_en: 'Mo', group: 'NewJeans' }, // 모지혜
  'haerin': { surname: '강', surname_en: 'Kang', group: 'NewJeans' },
  'hyein': { surname: '이', surname_en: 'Lee', group: 'NewJeans' },

  // ================= IVE (아이브) =================
  'yujin': { surname: '안', surname_en: 'An', group: 'IVE' }, // 안유진
  'gaeul': { surname: '김', surname_en: 'Kim', group: 'IVE' },
  'rei': { surname: '나', surname_en: 'Na', group: 'IVE' }, // 나오이 레이 -> '나'씨로 매칭
  'wonyoung': { surname: '장', surname_en: 'Jang', group: 'IVE' }, // 장원영
  'liz': { surname: '김', surname_en: 'Kim', group: 'IVE' }, // 김지원
  'leeseo': { surname: '이', surname_en: 'Lee', group: 'IVE' }, // 이현서

  // ================= NCT (주요 멤버) =================
  'taeyong': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'mark': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'jaehyun': { surname: '정', surname_en: 'Jeong', group: 'NCT' },
  'doyoung': { surname: '김', surname_en: 'Kim', group: 'NCT' },
  'haechan': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'jaemin': { surname: '나', surname_en: 'Na', group: 'NCT' }, // 나재민
  'jeno': { surname: '이', surname_en: 'Lee', group: 'NCT' },
  'jisung_nct': { surname: '박', surname_en: 'Park', group: 'NCT' }, // 박지성

  // ================= TXT (투모로우바이투게더) =================
  'soobin': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  'yeonjun': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  'beomgyu': { surname: '최', surname_en: 'Choi', group: 'TXT' },
  'taehyun_txt': { surname: '강', surname_en: 'Kang', group: 'TXT' },
  'hueningkai': { surname: '휴', surname_en: 'Huening', group: 'TXT' }, // 휴닝카이 -> '휴'씨

  // ================= Aespa (에스파) =================
  'karina': { surname: '유', surname_en: 'Yu', group: 'aespa' }, // 유지민
  'giselle': { surname: '김', surname_en: 'Kim', group: 'aespa' }, // 김애리
  'winter': { surname: '김', surname_en: 'Kim', group: 'aespa' }, // 김민정
  'ningning': { surname: '닝', surname_en: 'Ning', group: 'aespa' },

  // ================= (G)I-DLE =================
  '미연': { surname: '조', surname_en: 'Cho', group: '(G)I-DLE' }, // 조미연
  '민니': { surname: '니', surname_en: 'Nicha', group: '(G)I-DLE' }, // 니차 욘따라락
  '소연': { surname: '전', surname_en: 'Jeon', group: '(G)I-DLE' }, // 전소연
  '슈화': { surname: '예', surname_en: 'Ye', group: '(G)I-DLE' }, // 예슈화
  '우기': { surname: '송', surname_en: 'Song', group: '(G)I-DLE' }, // 송우기

  // ================= ATEEZ =================
  '민기': { surname: '송', surname_en: 'Song', group: 'ATEEZ' }, // 송민기
  '산': { surname: '최', surname_en: 'Choi', group: 'ATEEZ' }, // 최산
  '성화': { surname: '박', surname_en: 'Park', group: 'ATEEZ' }, // 박성화
  '여상': { surname: '강', surname_en: 'Kang', group: 'ATEEZ' }, // 강여상
  '우영': { surname: '정', surname_en: 'Jung', group: 'ATEEZ' }, // 정우영
  '윤호': { surname: '정', surname_en: 'Jung', group: 'ATEEZ' }, // 정윤호
  '종호': { surname: '최', surname_en: 'Choi', group: 'ATEEZ' }, // 최종호
  '홍중': { surname: '김', surname_en: 'Kim', group: 'ATEEZ' }, // 김홍중

  // ================= BABYMONSTER =================
  '라미': { surname: '신', surname_en: 'Shin', group: 'BABYMONSTER' }, // 신하람
  '로라': { surname: '이', surname_en: 'Lee', group: 'BABYMONSTER' }, // 이다인
  '루카': { surname: '카', surname_en: 'Kawai', group: 'BABYMONSTER' }, // 카와이 루카
  '아사': { surname: '에', surname_en: 'Enami', group: 'BABYMONSTER' }, // 에나미 아사
  '아현': { surname: '정', surname_en: 'Jung', group: 'BABYMONSTER' }, // 정아현
  '치키타': { surname: '리', surname_en: 'Lilacha', group: 'BABYMONSTER' }, // 리라차 폰데차피팟
  '파리타': { surname: '파', surname_en: 'Parita', group: 'BABYMONSTER' }, // 파리타 분팍디트라웰

  // ================= BLACKPINK (블랙핑크) - 추가 =================
  '로제': { surname: '박', surname_en: 'Park', group: 'BLACKPINK' }, // 박채영

  // ================= BOYNEXTDOOR =================
  '리우': { surname: '이', surname_en: 'Lee', group: 'BOYNEXTDOOR' }, // 이상혁
  '명재현': { surname: '명', surname_en: 'Myeong', group: 'BOYNEXTDOOR' }, // 명재현
  '성호': { surname: '박', surname_en: 'Park', group: 'BOYNEXTDOOR' }, // 박성호
  '운학': { surname: '김', surname_en: 'Kim', group: 'BOYNEXTDOOR' }, // 김운학
  '이한': { surname: '김', surname_en: 'Kim', group: 'BOYNEXTDOOR' }, // 김동현
  '태산': { surname: '한', surname_en: 'Han', group: 'BOYNEXTDOOR' }, // 한동민

  // ================= BTS (방탄소년단) - 추가 =================
  '슈가': { surname: '민', surname_en: 'Min', group: 'BTS' }, // 민윤기
  '정국': { surname: '전', surname_en: 'Jeon', group: 'BTS' }, // 전정국
  '제이홉': { surname: '정', surname_en: 'Jung', group: 'BTS' }, // 정호석

  // ================= DAY6 =================
  'youngk': { surname: '강', surname_en: 'Kang', group: 'DAY6' }, // 강영현
  '도운': { surname: '윤', surname_en: 'Yoon', group: 'DAY6' }, // 윤도운
  '성진': { surname: '박', surname_en: 'Park', group: 'DAY6' }, // 박성진
  '원필': { surname: '김', surname_en: 'Kim', group: 'DAY6' }, // 김원필

  // ================= ENHYPEN =================
  '니키': { surname: '니', surname_en: 'Nishimura', group: 'ENHYPEN' }, // 니시무라 리키
  '선우': { surname: '김', surname_en: 'Kim', group: 'ENHYPEN' }, // 김선우
  '성훈': { surname: '박', surname_en: 'Park', group: 'ENHYPEN' }, // 박성훈
  '정원': { surname: '양', surname_en: 'Yang', group: 'ENHYPEN' }, // 양정원
  '제이': { surname: '박', surname_en: 'Park', group: 'ENHYPEN' }, // 박종성
  '제이크': { surname: '심', surname_en: 'Shim', group: 'ENHYPEN' }, // 심재윤
  '희승': { surname: '이', surname_en: 'Lee', group: 'ENHYPEN' }, // 이희승

  // ================= EXO =================
  '디오': { surname: '도', surname_en: 'Do', group: 'EXO' }, // 도경수
  '백현': { surname: '변', surname_en: 'Byun', group: 'EXO' }, // 변백현
  '세훈': { surname: '오', surname_en: 'Oh', group: 'EXO' }, // 오세훈
  '수호': { surname: '김', surname_en: 'Kim', group: 'EXO' }, // 김준면
  '시우민': { surname: '김', surname_en: 'Kim', group: 'EXO' }, // 김민석
  '찬열': { surname: '박', surname_en: 'Park', group: 'EXO' }, // 박찬열
  '첸': { surname: '김', surname_en: 'Kim', group: 'EXO' }, // 김종대
  '카이': { surname: '김', surname_en: 'Kim', group: 'EXO' }, // 김종인

  // ================= GOT7 =================
  '마크': { surname: '마', surname_en: 'Mark', group: 'GOT7' }, // 마크 투안
  '뱀뱀': { surname: '깐', surname_en: 'Kunpimook', group: 'GOT7' }, // 깐삐묵 뿌와꾼
  '영재': { surname: '최', surname_en: 'Choi', group: 'GOT7' }, // 최영재
  '유겸': { surname: '김', surname_en: 'Kim', group: 'GOT7' }, // 김유겸
  '잭슨': { surname: '잭', surname_en: 'Jackson', group: 'GOT7' }, // 잭슨 왕
  '제이비': { surname: '임', surname_en: 'Im', group: 'GOT7' }, // 임재범
  '진영': { surname: '박', surname_en: 'Park', group: 'GOT7' }, // 박진영

  // ================= ILLIT =================
  '모카': { surname: '사', surname_en: 'Sakai', group: 'ILLIT' }, // 사카이 모카
  '민주': { surname: '박', surname_en: 'Park', group: 'ILLIT' }, // 박민주
  '원희': { surname: '이', surname_en: 'Lee', group: 'ILLIT' }, // 이원희
  '윤아': { surname: '노', surname_en: 'Noh', group: 'ILLIT' }, // 노윤아
  '이로하': { surname: '호', surname_en: 'Hokazono', group: 'ILLIT' }, // 호카조노 이로하

  // ================= ITZY =================
  '류진': { surname: '신', surname_en: 'Shin', group: 'ITZY' }, // 신류진
  '리아': { surname: '최', surname_en: 'Choi', group: 'ITZY' }, // 최지수
  '예지': { surname: '황', surname_en: 'Hwang', group: 'ITZY' }, // 황예지
  '유나': { surname: '신', surname_en: 'Shin', group: 'ITZY' }, // 신유나
  '채령': { surname: '이', surname_en: 'Lee', group: 'ITZY' }, // 이채령

  // ================= IVE (아이브) - 추가 =================
  '가을': { surname: '김', surname_en: 'Kim', group: 'IVE' }, // 김가을
  '레이': { surname: '나', surname_en: 'Na', group: 'IVE' }, // 나오이 레이

  // ================= KISS OF LIFE =================
  '나띠': { surname: '안', surname_en: 'Annachaya', group: 'KISS OF LIFE' }, // 안나차야 수완차이
  '벨': { surname: '심', surname_en: 'Shim', group: 'KISS OF LIFE' }, // 심혜원
  '쥴리': { surname: '한', surname_en: 'Han', group: 'KISS OF LIFE' }, // 한 쥴리
  '하늘': { surname: '원', surname_en: 'Won', group: 'KISS OF LIFE' }, // 원하늘

  // ================= Kep1er =================
  '강예서': { surname: '강', surname_en: 'Kang', group: 'Kep1er' }, // 강예서
  '김다연': { surname: '김', surname_en: 'Kim', group: 'Kep1er' }, // 김다연
  '김채현': { surname: '김', surname_en: 'Kim', group: 'Kep1er' }, // 김채현
  '마시로': { surname: '사', surname_en: 'Sakamoto', group: 'Kep1er' }, // 사카모토 마시로
  '샤오팅': { surname: '선', surname_en: 'Shen', group: 'Kep1er' }, // 선샤오팅
  '서영은': { surname: '서', surname_en: 'Seo', group: 'Kep1er' }, // 서영은
  '최유진': { surname: '최', surname_en: 'Choi', group: 'Kep1er' }, // 최유진
  '휴닝바히에': { surname: '바', surname_en: 'Bahiyyih', group: 'Kep1er' }, // 바히에 정 휴닝
  '히카루': { surname: '에', surname_en: 'Ezaki', group: 'Kep1er' }, // 에자키 히카루

  // ================= LE SSERAFIM =================
  '김채원': { surname: '김', surname_en: 'Kim', group: 'LE SSERAFIM' }, // 김채원
  '사쿠라': { surname: '미', surname_en: 'Miyawaki', group: 'LE SSERAFIM' }, // 미야와키 사쿠라
  '카즈하': { surname: '나', surname_en: 'Nakamura', group: 'LE SSERAFIM' }, // 나카무라 카즈하
  '허윤진': { surname: '허', surname_en: 'Heo', group: 'LE SSERAFIM' }, // 허윤진
  '홍은채': { surname: '홍', surname_en: 'Hong', group: 'LE SSERAFIM' }, // 홍은채

  // ================= MONSTA X =================
  '기현': { surname: '유', surname_en: 'Yu', group: 'MONSTA X' }, // 유기현
  '민혁': { surname: '이', surname_en: 'Lee', group: 'MONSTA X' }, // 이민혁
  '셔누': { surname: '손', surname_en: 'Son', group: 'MONSTA X' }, // 손현우
  '아이엠': { surname: '임', surname_en: 'Im', group: 'MONSTA X' }, // 임창균
  '주헌': { surname: '이', surname_en: 'Lee', group: 'MONSTA X' }, // 이주헌
  '형원': { surname: '채', surname_en: 'Chae', group: 'MONSTA X' }, // 채형원

  // ================= NCT 127 =================
  '도영': { surname: '김', surname_en: 'Kim', group: 'NCT 127' }, // 김동영
  '유타': { surname: '나', surname_en: 'Nakamoto', group: 'NCT 127' }, // 나카모토 유타
  '재현': { surname: '정', surname_en: 'Jung', group: 'NCT 127' }, // 정윤오
  '쟈니': { surname: '서', surname_en: 'Seo', group: 'NCT 127' }, // 서영호
  '정우': { surname: '김', surname_en: 'Kim', group: 'NCT 127' }, // 김정우
  '태용': { surname: '이', surname_en: 'Lee', group: 'NCT 127' }, // 이태용
  '태일': { surname: '문', surname_en: 'Moon', group: 'NCT 127' }, // 문태일
  '해찬': { surname: '이', surname_en: 'Lee', group: 'NCT 127' }, // 이동혁

  // ================= NCT DREAM =================
  '런쥔': { surname: '황', surname_en: 'Hwang', group: 'NCT DREAM' }, // 황인준
  '재민': { surname: '나', surname_en: 'Na', group: 'NCT DREAM' }, // 나재민
  '제노': { surname: '이', surname_en: 'Lee', group: 'NCT DREAM' }, // 이제노
  '지성': { surname: '박', surname_en: 'Park', group: 'NCT DREAM' }, // 박지성
  '천러': { surname: '종', surname_en: 'Zhong', group: 'NCT DREAM' }, // 종천러

  // ================= NMIXX =================
  '규진': { surname: '장', surname_en: 'Jang', group: 'NMIXX' }, // 장규진
  '릴리': { surname: '릴', surname_en: 'Lily', group: 'NMIXX' }, // 릴리 진 머로우
  '배이': { surname: '배', surname_en: 'Bae', group: 'NMIXX' }, // 배진솔
  '설윤': { surname: '설', surname_en: 'Seol', group: 'NMIXX' }, // 설윤아
  '지우': { surname: '김', surname_en: 'Kim', group: 'NMIXX' }, // 김지우
  '해원': { surname: '오', surname_en: 'Oh', group: 'NMIXX' }, // 오해원

  // ================= NewJeans (뉴진스) - 추가 =================
  '다니엘': { surname: '다', surname_en: 'Marsh', group: 'NewJeans' }, // 다니엘 마쉬
  '혜인': { surname: '이', surname_en: 'Lee', group: 'NewJeans' }, // 이혜인

  // ================= RIIZE =================
  '성찬': { surname: '정', surname_en: 'Jung', group: 'RIIZE' }, // 정성찬
  '소희': { surname: '이', surname_en: 'Lee', group: 'RIIZE' }, // 이소희
  '쇼타로': { surname: '오', surname_en: 'Osaki', group: 'RIIZE' }, // 오사키 쇼타로
  '앤톤': { surname: '이', surname_en: 'Lee', group: 'RIIZE' }, // 이찬영
  '원빈': { surname: '박', surname_en: 'Park', group: 'RIIZE' }, // 박원빈
  '은석': { surname: '송', surname_en: 'Song', group: 'RIIZE' }, // 송은석

  // ================= Red Velvet =================
  '슬기': { surname: '강', surname_en: 'Kang', group: 'Red Velvet' }, // 강슬기
  '아이린': { surname: '배', surname_en: 'Bae', group: 'Red Velvet' }, // 배주현
  '예리': { surname: '김', surname_en: 'Kim', group: 'Red Velvet' }, // 김예림
  '웬디': { surname: '손', surname_en: 'Son', group: 'Red Velvet' }, // 손승완
  '조이': { surname: '박', surname_en: 'Park', group: 'Red Velvet' }, // 박수영

  // ================= SEVENTEEN (세븐틴) - 추가 =================
  '도겸': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' }, // 이석민
  '디노': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' }, // 이찬
  '디에잇': { surname: '서', surname_en: 'Seo', group: 'SEVENTEEN' }, // 서명호
  '민규': { surname: '김', surname_en: 'Kim', group: 'SEVENTEEN' }, // 김민규
  '버논': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' }, // 최한솔
  '에스쿱스': { surname: '최', surname_en: 'Choi', group: 'SEVENTEEN' }, // 최승철
  '우지': { surname: '이', surname_en: 'Lee', group: 'SEVENTEEN' }, // 이지훈
  '원우': { surname: '전', surname_en: 'Jeon', group: 'SEVENTEEN' }, // 전원우
  '정한': { surname: '윤', surname_en: 'Yoon', group: 'SEVENTEEN' }, // 윤정한
  '조슈아': { surname: '홍', surname_en: 'Hong', group: 'SEVENTEEN' }, // 홍지수
  '준': { surname: '문', surname_en: 'Moon', group: 'SEVENTEEN' }, // 문준휘
  '호시': { surname: '권', surname_en: 'Kwon', group: 'SEVENTEEN' }, // 권순영

  // ================= SHINee =================
  '민호': { surname: '최', surname_en: 'Choi', group: 'SHINee' }, // 최민호
  '온유': { surname: '이', surname_en: 'Lee', group: 'SHINee' }, // 이진기
  '키': { surname: '김', surname_en: 'Kim', group: 'SHINee' }, // 김기범
  '태민': { surname: '이', surname_en: 'Lee', group: 'SHINee' }, // 이태민

  // ================= STAYC =================
  '세은': { surname: '윤', surname_en: 'Yoon', group: 'STAYC' }, // 윤세은
  '수민': { surname: '배', surname_en: 'Bae', group: 'STAYC' }, // 배수민
  '시은': { surname: '박', surname_en: 'Park', group: 'STAYC' }, // 박시은
  '아이사': { surname: '이', surname_en: 'Lee', group: 'STAYC' }, // 이채영
  '윤': { surname: '심', surname_en: 'Shim', group: 'STAYC' }, // 심자윤
  '재이': { surname: '장', surname_en: 'Jang', group: 'STAYC' }, // 장예은

  // ================= Stray Kids (스트레이 키즈) - 추가 =================
  '리노': { surname: '이', surname_en: 'Lee', group: 'Stray Kids' }, // 이민호
  '승민': { surname: '김', surname_en: 'Kim', group: 'Stray Kids' }, // 김승민

  // ================= THE BOYZ =================
  '뉴': { surname: '최', surname_en: 'Choi', group: 'THE BOYZ' }, // 최찬희
  '상연': { surname: '이', surname_en: 'Lee', group: 'THE BOYZ' }, // 이상연
  '선우': { surname: '김', surname_en: 'Kim', group: 'THE BOYZ' }, // 김선우
  '에릭': { surname: '손', surname_en: 'Son', group: 'THE BOYZ' }, // 손영재
  '영훈': { surname: '김', surname_en: 'Kim', group: 'THE BOYZ' }, // 김영훈
  '제이콥': { surname: '배', surname_en: 'Bae', group: 'THE BOYZ' }, // 배준영
  '주연': { surname: '이', surname_en: 'Lee', group: 'THE BOYZ' }, // 이주연
  '주학년': { surname: '주', surname_en: 'Joo', group: 'THE BOYZ' }, // 주학년
  '케빈': { surname: '문', surname_en: 'Moon', group: 'THE BOYZ' }, // 문형서
  '큐': { surname: '지', surname_en: 'Ji', group: 'THE BOYZ' }, // 지창민
  '현재': { surname: '이', surname_en: 'Lee', group: 'THE BOYZ' }, // 이재현

  // ================= TREASURE =================
  '도영': { surname: '김', surname_en: 'Kim', group: 'TREASURE' }, // 김도영
  '박정우': { surname: '박', surname_en: 'Park', group: 'TREASURE' }, // 박정우
  '소정환': { surname: '소', surname_en: 'So', group: 'TREASURE' }, // 소정환
  '아사히': { surname: '하', surname_en: 'Hamada', group: 'TREASURE' }, // 하마다 아사히
  '요시': { surname: '카', surname_en: 'Kanemoto', group: 'TREASURE' }, // 카네모토 요시노리
  '윤재혁': { surname: '윤', surname_en: 'Yoon', group: 'TREASURE' }, // 윤재혁
  '준규': { surname: '김', surname_en: 'Kim', group: 'TREASURE' }, // 김준규
  '지훈': { surname: '박', surname_en: 'Park', group: 'TREASURE' }, // 박지훈
  '최현석': { surname: '최', surname_en: 'Choi', group: 'TREASURE' }, // 최현석
  '하루토': { surname: '와', surname_en: 'Watanabe', group: 'TREASURE' }, // 와타나베 하루토

  // ================= TWICE =================
  '나연': { surname: '임', surname_en: 'Im', group: 'TWICE' }, // 임나연
  '다현': { surname: '김', surname_en: 'Kim', group: 'TWICE' }, // 김다현
  '모모': { surname: '히', surname_en: 'Hirai', group: 'TWICE' }, // 히라이 모모
  '미나': { surname: '묘', surname_en: 'Moi', group: 'TWICE' }, // 묘이 미나
  '사나': { surname: '미', surname_en: 'Minatozaki', group: 'TWICE' }, // 미나토자키 사나
  '정연': { surname: '유', surname_en: 'Yu', group: 'TWICE' }, // 유정연
  '지효': { surname: '박', surname_en: 'Park', group: 'TWICE' }, // 박지효
  '쯔위': { surname: '저', surname_en: 'Zhou', group: 'TWICE' }, // 저우쯔위
  '채영': { surname: '손', surname_en: 'Son', group: 'TWICE' }, // 손채영

  // ================= TWS =================
  '경민': { surname: '임', surname_en: 'Im', group: 'TWS' }, // 임경민
  '도훈': { surname: '최', surname_en: 'Choi', group: 'TWS' }, // 최도훈
  '신유': { surname: '신', surname_en: 'Shin', group: 'TWS' }, // 신정환
  '영재': { surname: '최', surname_en: 'Choi', group: 'TWS' }, // 최영재
  '지훈': { surname: '한', surname_en: 'Han', group: 'TWS' }, // 한지훈
  '한진': { surname: '한', surname_en: 'Han', group: 'TWS' }, // 한진

  // ================= TXT (투모로우바이투게더) - 추가 =================
  '범규': { surname: '최', surname_en: 'Choi', group: 'TXT' }, // 최범규
  '수빈': { surname: '최', surname_en: 'Choi', group: 'TXT' }, // 최수빈
  '연준': { surname: '최', surname_en: 'Choi', group: 'TXT' }, // 최연준
  '태현': { surname: '강', surname_en: 'Kang', group: 'TXT' }, // 강태현

  // ================= VIVIZ =================
  '신비': { surname: '황', surname_en: 'Hwang', group: 'VIVIZ' }, // 황은비
  '엄지': { surname: '김', surname_en: 'Kim', group: 'VIVIZ' }, // 김예원
  '은하': { surname: '정', surname_en: 'Jung', group: 'VIVIZ' }, // 정은비

  // ================= ZEROBASEONE =================
  '김규빈': { surname: '김', surname_en: 'Kim', group: 'ZEROBASEONE' }, // 김규빈
  '김지웅': { surname: '김', surname_en: 'Kim', group: 'ZEROBASEONE' }, // 김지웅
  '김태래': { surname: '김', surname_en: 'Kim', group: 'ZEROBASEONE' }, // 김태래
  '리키': { surname: '션', surname_en: 'Shen', group: 'ZEROBASEONE' }, // 션취안루이
  '박건욱': { surname: '박', surname_en: 'Park', group: 'ZEROBASEONE' }, // 박건욱
  '석매튜': { surname: '석', surname_en: 'Seok', group: 'ZEROBASEONE' }, // 석우현
  '성한빈': { surname: '성', surname_en: 'Sung', group: 'ZEROBASEONE' }, // 성한빈
  '장하오': { surname: '장', surname_en: 'Jang', group: 'ZEROBASEONE' }, // 장하오
  '한유진': { surname: '한', surname_en: 'Han', group: 'ZEROBASEONE' }, // 한유진

  // ================= 솔로 =================
  '아이유': { surname: '이', surname_en: 'Lee', group: 'IU' }, // 이지은
  '싸이': { surname: '박', surname_en: 'Park', group: 'PSY' }, // 박재상
  '강다니엘': { surname: '강', surname_en: 'Kang', group: '강다니엘' }, // 강다니엘
  '권은비': { surname: '권', surname_en: 'Kwon', group: '권은비' }, // 권은비
  '선미': { surname: '이', surname_en: 'Lee', group: '선미' }, // 이선미
  '이무진': { surname: '이', surname_en: 'Lee', group: '이무진' }, // 이무진
  '임영웅': { surname: '임', surname_en: 'Im', group: '임영웅' }, // 임영웅
  '전소미': { surname: '에', surname_en: 'Ennik', group: '전소미' }, // 에닉 소미 다우마
  '지코': { surname: '우', surname_en: 'Woo', group: '지코' }, // 우지호
  '청하': { surname: '김', surname_en: 'Kim', group: '청하' }, // 김찬미
  '최예나': { surname: '최', surname_en: 'Choi', group: '최예나' }, // 최예나
};

// 아이돌 이름 정규화 함수 (소문자, 띄어쓰기 제거, 특수문자 처리)
function normalizeIdolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '') // 띄어쓰기 제거
    .replace(/[^\w가-힣]/g, '') // 특수문자 제거 (한글, 영문, 숫자만 유지)
    .trim();
}

// idol_real_name 정리 함수 (여러 이름이 포함된 경우 첫 번째 이름만 추출)
function cleanIdolRealName(idolRealName: string, idolName: string): string {
  if (!idolRealName) return idolRealName;
  
  // 쉼표로 구분된 여러 이름이 있는 경우
  if (idolRealName.includes(',')) {
    const names = idolRealName.split(',').map(n => n.trim());
    // 선택한 아이돌 이름과 일치하는 이름 찾기
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
    
    // 일치하는 이름 찾기
    for (const name of names) {
      for (const target of targetNames) {
        if (name.includes(target) || target.includes(name.replace(/[가-힣]/g, ''))) {
          return name;
        }
      }
    }
    
    // 일치하는 이름이 없으면 첫 번째 이름 반환
    return names[0];
  }
  
  return idolRealName.trim();
}

// 성씨 조회 함수
function getIdolSurname(idolName: string): { surname: string; surname_en: string; group: string } | null {
  const normalized = normalizeIdolName(idolName);
  const found = IDOL_DB[normalized];
  if (found) {
    console.log(`✅ Found in IDOL_DB: ${idolName} → ${found.surname} (${found.surname_en})`);
    return found;
  }
  console.log(`⚠️ Not found in IDOL_DB: ${idolName}, will use AI lookup`);
  return null;
}

// 별자리 계산 함수
function getZodiacSign(month: number, day: number): { sign: string; element: string } | null {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries', element: 'Fire' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus', element: 'Earth' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', element: 'Air' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', element: 'Water' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', element: 'Fire' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', element: 'Earth' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', element: 'Air' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio', element: 'Water' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', element: 'Fire' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', element: 'Earth' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius', element: 'Air' };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: 'Pisces', element: 'Water' };
  return null;
}

// 생년 기준 '○○의 해' (간지 띠) 문구 반환. 예: 2024 → "푸른 용의 해", 2026 → "붉은 말의 해"
function getKoreanYearPhrase(year: number): string | null {
  if (!Number.isFinite(year) || year < 1900 || year > 2100) return null;
  const stem = (year - 4) % 10; // 천간 0~9
  const branch = (year - 4) % 12; // 지지 0~11
  const colors = ['푸른', '붉은', '노란', '흰', '검은'];
  const animals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  const color = colors[Math.floor(stem / 2)];  // 갑을=0, 병정=1, ...
  const animal = animals[branch];
  return `${color} ${animal}의 해`;
}

// 궁합 점수 계산 (생일 기반)
function calculateCompatibilityScore(birthday?: string): number {
  if (!birthday) return Math.floor(Math.random() * 11) + 85; // 85-95
  const [year, month, day] = birthday.split('-').map(Number);
  const zodiac = getZodiacSign(month, day);
  if (!zodiac) return Math.floor(Math.random() * 11) + 85;
  return Math.floor(Math.random() * 11) + 88; // 88-98
}

export async function POST(req: Request) {
  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

  const { userName, userGender, idolName, language, userBirthday, lastKoreanName } = requestBody;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
    return NextResponse.json({ error: 'API Key missing. Check .env.local' }, { status: 500 });
  }

  // IDOL_DB에서 성씨 조회
  const idolDbInfo = getIdolSurname(idolName);
  const hasIdolDbInfo = idolDbInfo !== null;
  
  // 디버깅: 아이돌 이름과 조회 결과 로깅
  console.log('🔍 Idol lookup:', {
    originalIdolName: idolName,
    normalized: normalizeIdolName(idolName),
    foundInDB: hasIdolDbInfo,
    surname: idolDbInfo?.surname,
    group: idolDbInfo?.group
  });

  // 생일: 궁합(호환성 점수·띠)용으로만 사용. 이름 글자 조합에는 사용하지 않음.
  let zodiacInfo: { sign: string; element: string } | null = null;
  if (userBirthday) {
    const [year, month, day] = userBirthday.split('-').map(Number);
    zodiacInfo = getZodiacSign(month, day);
  }
  // 이름 2글자: 성별에 맞는 글자 풀에서 무작위 선택 (여성→은혁 등 남성형 이름 방지)
  const selectedCharacters = selectRandomNameCharacters(userGender);
  const compatibilityScore = calculateCompatibilityScore(userBirthday);
  const birthdayText = userBirthday ? `Birthday: ${userBirthday}${zodiacInfo ? ` (${zodiacInfo.sign} ${zodiacInfo.element})` : ''}` : '';
  // 생년 기준 '○○의 해' 문구 (결과 문구용). 예: "푸른 용의 해"
  const yearPhrase = userBirthday ? getKoreanYearPhrase(Number(userBirthday.split('-')[0])) : null;
  
  // 언어 코드 매핑
  const langKey = LANGUAGE_MAP[language.toLowerCase()] || 'en';

  // 한국 이름인지 확인
  const isKoreanName = /[가-힣]/.test(userName);

  // 🚨 무적의 모델 리스트 (성공할 때까지 순서대로 다 해봅니다)
  // gemini-2.0-flash를 최우선으로 시도 (curl 예시에서 작동 확인)
  const v1betaModels = [
    "gemini-2.0-flash",        // 1순위: 최신 모델 (curl 예시에서 작동 확인)
    "gemini-1.5-flash-latest", // 2순위: v1beta 최신 모델
    "gemini-1.5-pro-latest",   // 3순위: v1beta 고성능 모델
    "gemini-1.5-flash",        // 4순위: fallback
    "gemini-1.5-pro",          // 5순위: fallback
  ];
  
  const v1Models = [
    "gemini-pro",              // v1에서 시도
  ];

  // SDK 초기화
  // 참고: SDK는 기본적으로 v1beta를 사용하지만, v1 API를 직접 호출하는 방법도 있음
  const genAI = new GoogleGenerativeAI(apiKey);

    const langMap: Record<string, string> = { 
      en: "English", jp: "Japanese", th: "Thai", es: "Spanish", ar: "Arabic", ko: "Korean" 
    };
    const outputLang = langMap[language] || "English";

  // 랜덤 이름 스타일 (다양성 증가)
  const nameStyles = [
    "modern and trendy", "classic and elegant", "cute and charming", 
    "strong and powerful", "gentle and soft", "unique and memorable"
  ];
  const randomStyle = nameStyles[Math.floor(Math.random() * nameStyles.length)];

    const prompt = `
    Role: K-POP Naming Expert & Compatibility Fortune Teller.
    
    [USER INFO]
    Original Name: ${userName} ${isKoreanName ? "(Korean name detected)" : "(Foreign name)"}
    Gender: ${userGender}
    ${birthdayText ? birthdayText : "Birthday: Not provided"}
    Ultimate Bias: ${idolName}
    Output Language: ${outputLang}

    [NAME STYLE]
    - The overall vibe of the new name should be: ${randomStyle}.
    - Even with the same idol and same user, you can choose DIFFERENT given names on different runs.
    
    ${lastKoreanName ? `[PREVIOUS NAME TO AVOID]
    - The last generated Korean name was: "${lastKoreanName}".
    - DO NOT reuse this exact given name, and avoid names that are too similar in sound or spelling.
    - Keep the same surname from the idol, but pick a clearly different 2-syllable given name.` : ""}
    
    [COMPATIBILITY SCORE - FIXED]
    Score: ${compatibilityScore}% (USE THIS EXACT NUMBER!)
    ${zodiacInfo?.sign ? `Zodiac: ${zodiacInfo.sign} (${zodiacInfo.element})` : ""}
    
    ⚠️ TASK: Create a NEW Korean name for the user using the idol's REAL surname.
    ${isKoreanName ? "Note: Even though the user already has a Korean name, create a COMPLETELY NEW name with the idol's surname!" : ""}
    
    ⚠️ IDOL SURNAME LOOKUP (CRITICAL):
    ${hasIdolDbInfo ? `
    [IDOL DATABASE INFO - USE THIS EXACTLY]
    - Ultimate Bias: ${idolName} (${idolDbInfo.group})
    - This is ${idolDbInfo.group} member "${idolName}" (also known as ${normalizeIdolName(idolName)}).
    - Surname (Korean): ${idolDbInfo.surname}
    - Surname (English): ${idolDbInfo.surname_en}
    - Group: ${idolDbInfo.group}
    - The "idol_surname" MUST be exactly "${idolDbInfo.surname}" (single character).
    - The "idol_real_name" MUST be the REAL Korean name of ${idolName} from ${idolDbInfo.group}, starting with "${idolDbInfo.surname}".
    - IMPORTANT: ${idolName} is NOT Jungkook (전정국/전). ${idolName} is ${idolDbInfo.group} member with surname "${idolDbInfo.surname}".
    - DO NOT confuse ${idolName} with other ${idolDbInfo.group} members. Use "${idolDbInfo.surname}" ONLY for ${idolName}.
    - Example: If ${idolName} is "jimin" or "Jimin", the real name is "박지민" (Park Jimin), NOT "전정국" (Jeon Jungkook).
    ` : `
    [AI LOOKUP REQUIRED]
    - For Ultimate Bias: ${idolName}
    - The "idol_real_name" MUST be the REAL KOREAN NAME of ${idolName} ONLY (single name, not a list).
    - The "idol_surname" MUST be the SINGLE-CHARACTER KOREAN SURNAME from "idol_real_name".
    - DO NOT use real names or surnames of other idols (e.g., V/김태형, RM/김남준, Jungkook/전정국, Jennie/김제니) if ${idolName} is not them.
    - DO NOT list multiple names or group members in "idol_real_name". Output ONLY the selected idol's name.
    - Examples of correct surname mapping:
      * Jimin/지민 → 박지민 → 박 (Park)
      * G-Dragon/지드래곤 → 권지용 → 권 (Kwon)
      * RM → 김남준 → 김 (Kim)
      * V/뷔 → 김태형 → 김 (Kim)
      * Jennie/제니 → 김제니 → 김 (Kim)
      * IU/아이유 → 이지은 → 이 (Lee)
      * Jungkook/정국 → 전정국 → 전 (Jeon)
      * Taeyeon/태연 → 김태연 → 김 (Kim)
      * Suzy/수지 → 배수지 → 배 (Bae)
      * Karina/카리나 → 유지민 → 유 (Yoo)
      * Lisa/리사 (Thai) → Use 노 (Noh) or similar
    `}
    
    [NAME CHARACTERS - MANDATORY FORMAT]
    ${selectedCharacters ? `
    - The Korean name MUST be created using these specific characters:
      * First character (Month): "${selectedCharacters.month.character}" (${selectedCharacters.month.romanized}) - ${selectedCharacters.month.meanings[langKey]}
      * Second character (Day): "${selectedCharacters.day.character}" (${selectedCharacters.day.romanized}) - ${selectedCharacters.day.meanings[langKey]}
    - Name format: [Idol's Surname] + "${selectedCharacters.month.character}" + "${selectedCharacters.day.character}"
    - Example: If idol's surname is "김", the name should be "김${selectedCharacters.month.character}${selectedCharacters.day.character}"
    - The romanized name should follow: [Surname_English] + "${selectedCharacters.month.romanized}" + "${selectedCharacters.day.romanized}"
    ` : `
    - Create a 2-syllable given name using modern Korean characters
    - You can reference the name character database for inspiration, but you have flexibility in character selection
    `}
    
    RULES:
    1. Find the idol's REAL Korean surname first
    2. ${selectedCharacters ? `Create the name using EXACTLY these characters: [Surname] + "${selectedCharacters.month.character}" + "${selectedCharacters.day.character}"` : 'Create a 2-syllable given name (총 3글자: 성 1자 + 이름 2자)'}
    3. Given name MUST match the user's gender: ${userGender}. If Female → clearly feminine Korean name. If Male → clearly masculine. Never give a female user a typically male name (e.g. 은혁, 준혁, 성민) or vice versa.
    4. compatibility_score MUST be exactly "${compatibilityScore}"
    ${zodiacInfo?.sign ? `5. Mention ${zodiacInfo.sign} zodiac in compatibility_reason` : ""}
    
    OUTPUT FORMAT (JSON only, no markdown):
    {"korean_name":"성이름","romanized":"Seong Ireum","compatibility_score":"${compatibilityScore}","compatibility_reason":"reason in ${outputLang}","meaning":"meaning in ${outputLang}","idol_real_name":"${idolName}의 실제 한국 이름 (단일 이름만, 예: 박지민)","idol_surname":"그 한국 이름에서의 성씨 1글자 (예: 박, 김)"}
    
    ⚠️ CRITICAL: "idol_real_name" MUST be ONLY the selected idol's real name (e.g., "김제니" for Jennie).
    - DO NOT list multiple names or group members (e.g., "김지수, 김제니, 박채영" is WRONG).
    - DO NOT include other group members' names.
    - Output format: Single Korean name only (e.g., "김제니", "박지민", "김남준").
  `;

  // 순차적 연결 시도 로직
  // 1단계: v1beta API 직접 호출 (gemini-2.0-flash 우선 - curl 예시에서 작동 확인)
  // 2단계: SDK로 v1beta 시도 (다른 모델들)
  // 3단계: v1 API 직접 호출 (gemini-pro)
  let lastError: any = null;
  
  // 1단계: v1beta API 직접 호출 (gemini-2.0-flash 우선)
  console.log('📡 Step 1: Trying v1beta API directly (gemini-2.0-flash first)...');
  const v1betaDirectModels = ["gemini-2.0-flash"]; // curl 예시에서 작동 확인된 모델
  for (const model of v1betaDirectModels) {
    try {
      console.log(`Trying model: ${model} with v1beta API directly...`);
      
      const v1betaUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(v1betaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey, // curl 예시처럼 헤더에도 추가
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 50,
            maxOutputTokens: 1000,
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ v1beta API Error for ${model}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText.substring(0, 500)
        });
        lastError = {
          model: model,
          status: response.status,
          statusText: response.statusText,
          message: errorText.substring(0, 500)
        };
        continue;
      }
      
      console.log(`✅ v1beta API response OK for ${model}, parsing...`);

      let data;
      try {
        data = await response.json();
      } catch (jsonError: any) {
        const responseText = await response.text();
        console.error(`❌ Failed to parse response JSON for ${model}:`, jsonError.message);
        console.error(`Response text (first 500 chars):`, responseText.substring(0, 500));
        throw new Error(`Invalid JSON response from API: ${jsonError.message}`);
      }
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error(`❌ Invalid response structure from ${model}:`, JSON.stringify(data).substring(0, 500));
        throw new Error(`Invalid response structure from ${model}. Expected candidates array.`);
      }
      
      const textResponse = data.candidates[0].content.parts[0].text;
      
      if (!textResponse || textResponse.trim().length === 0) {
        throw new Error(`Empty response from model ${model}`);
      }
      
      // JSON 파싱 (에러 처리 강화)
      let parsedResult;
      try {
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(jsonStr);
      } catch (parseError: any) {
        console.error(`❌ JSON Parse Error for ${model}:`, parseError.message);
        console.error(`Raw response (first 500 chars):`, textResponse.substring(0, 500));
        // JSON이 아닌 경우, 텍스트에서 JSON 부분만 추출 시도
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedResult = JSON.parse(jsonMatch[0]);
            console.log(`✅ Extracted JSON from text response`);
          } catch (e) {
            throw new Error(`Failed to parse JSON from response. Response: ${textResponse.substring(0, 200)}`);
          }
        } else {
          throw new Error(`No JSON found in response. Response: ${textResponse.substring(0, 200)}`);
        }
      }
      
      // idol_real_name 정리 (여러 이름이 포함된 경우)
      if (parsedResult.idol_real_name) {
        const cleaned = cleanIdolRealName(parsedResult.idol_real_name, idolName);
        if (cleaned !== parsedResult.idol_real_name) {
          console.warn(`Cleaned idol_real_name: "${parsedResult.idol_real_name}" → "${cleaned}"`);
          parsedResult.idol_real_name = cleaned;
        }
      }
      
      // 서버 측 검증 및 IDOL_DB 처리 (기존 로직과 동일)
      if (parsedResult.idol_surname && parsedResult.korean_name) {
        const generatedSurname = parsedResult.korean_name.charAt(0);
        if (generatedSurname !== parsedResult.idol_surname) {
          console.warn(`Surname mismatch! Generated: ${generatedSurname}, Expected: ${parsedResult.idol_surname}. Correcting...`);
          parsedResult.korean_name = parsedResult.idol_surname + parsedResult.korean_name.substring(1);
        }
      }
      
      if (hasIdolDbInfo && idolDbInfo) {
        // 강제로 올바른 성씨 설정
        parsedResult.idol_surname = idolDbInfo.surname;
        
        // idol_real_name 검증 및 수정
        const normalized = normalizeIdolName(idolName);
        const commonNames: Record<string, string> = {
          'jimin': '지민', 'jungkook': '정국', 'rm': '남준', 'namjoon': '남준',
          'v': '태형', 'taehyung': '태형', 'jin': '석진', 'seokjin': '석진',
          'suga': '윤기', 'yoongi': '윤기', 'jhope': '호석', 'hoseok': '호석',
          // BLACKPINK
          'jisoo': '지수', 'jennie': '제니', 'rose': '채영', 'rosé': '채영',
          'chaeyoung': '채영', 'lisa': '리사', 'lalisa': '리사',
        };
        const givenName = commonNames[normalized] || '민수';
        const correctRealName = `${idolDbInfo.surname}${givenName}`;
        
        // idol_real_name이 없거나 잘못된 성씨를 사용하면 강제 수정
        if (!parsedResult.idol_real_name || !parsedResult.idol_real_name.startsWith(idolDbInfo.surname)) {
          console.warn(`⚠️ Correcting idol_real_name: "${parsedResult.idol_real_name}" → "${correctRealName}" (for ${idolName})`);
          parsedResult.idol_real_name = correctRealName;
        } else if (parsedResult.idol_real_name !== correctRealName && commonNames[normalized]) {
          // 성씨는 맞지만 이름이 다를 수 있으므로 확인
          console.log(`ℹ️ idol_real_name "${parsedResult.idol_real_name}" seems correct for ${idolName}`);
        }
        if (parsedResult.korean_name && !parsedResult.korean_name.startsWith(idolDbInfo.surname)) {
          parsedResult.korean_name = idolDbInfo.surname + parsedResult.korean_name.substring(1);
        }
      }
      
      // 선택된 글자 의미 추가 및 이름 검증
      if (selectedCharacters) {
        parsedResult.character_meanings = {
          month: {
            character: selectedCharacters.month.character,
            romanized: selectedCharacters.month.romanized,
            meaning: selectedCharacters.month.meanings[langKey]
          },
          day: {
            character: selectedCharacters.day.character,
            romanized: selectedCharacters.day.romanized,
            meaning: selectedCharacters.day.meanings[langKey]
          }
        };
        
        // 선택된 글자로 이름이 생성되었는지 검증 및 수정
        if (parsedResult.korean_name && parsedResult.korean_name.length >= 3) {
          const surname = parsedResult.korean_name.charAt(0);
          const expectedName = surname + selectedCharacters.month.character + selectedCharacters.day.character;
          if (parsedResult.korean_name !== expectedName) {
            console.warn(`⚠️ Name doesn't match selected characters. Expected: ${expectedName}, Got: ${parsedResult.korean_name}. Correcting...`);
            parsedResult.korean_name = expectedName;
            // romanized도 수정
            const surnameEn = hasIdolDbInfo && idolDbInfo ? idolDbInfo.surname_en : 
                              (parsedResult.idol_surname === '김' ? 'Kim' : 
                               parsedResult.idol_surname === '이' ? 'Lee' : 
                               parsedResult.idol_surname === '박' ? 'Park' : 
                               parsedResult.idol_surname === '최' ? 'Choi' : 
                               parsedResult.idol_surname === '정' ? 'Jung' : 'Kim');
            parsedResult.romanized = `${surnameEn} ${selectedCharacters.month.romanized}${selectedCharacters.day.romanized}`;
          }
        }
      }
      
      if (yearPhrase != null) (parsedResult as Record<string, unknown>).year_phrase = yearPhrase;
      console.log(`✅ Success with v1beta API/${model}`);
      return NextResponse.json(parsedResult);
      
    } catch (v1betaError: any) {
      console.error(`❌ v1beta API Error with ${model}:`, v1betaError.message || v1betaError);
      lastError = {
        model: model,
        status: v1betaError.status,
        statusText: v1betaError.statusText,
        message: v1betaError.message || String(v1betaError)
      };
      continue;
    }
  }
  
  // 2단계: SDK로 v1beta 시도 (다른 모델들)
  console.log('📡 Step 2: Trying SDK with v1beta models...');
  if (v1betaModels.length > 0) {
    for (const model of v1betaModels) {
    try {
      console.log(`Trying model: ${model} with SDK (v1beta)...`);
      
      try {
        // SDK를 사용하여 모델 가져오기
        const genModel = genAI.getGenerativeModel({ 
          model: model,
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 50,
            maxOutputTokens: 1000,
          }
        });
        
        console.log(`✅ Model ${model} initialized successfully`);

        // 콘텐츠 생성
        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        
        // 응답 검증
        if (!response) {
          throw new Error(`No response from model ${model}`);
        }
        
        const textResponse = response.text();
        
        if (!textResponse || textResponse.trim().length === 0) {
          throw new Error(`Empty response from model ${model}`);
        }

        // JSON 파싱
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsedResult = JSON.parse(jsonStr);
        
        // idol_real_name 정리 (여러 이름이 포함된 경우)
        if (parsedResult.idol_real_name) {
          const cleaned = cleanIdolRealName(parsedResult.idol_real_name, idolName);
          if (cleaned !== parsedResult.idol_real_name) {
            console.warn(`Cleaned idol_real_name: "${parsedResult.idol_real_name}" → "${cleaned}"`);
            parsedResult.idol_real_name = cleaned;
          }
        }
        
        // 서버 측 검증: 생성된 이름의 성씨가 idol_surname과 일치하는지 확인
        if (parsedResult.idol_surname && parsedResult.korean_name) {
          const generatedSurname = parsedResult.korean_name.charAt(0);
          if (generatedSurname !== parsedResult.idol_surname) {
            // 성씨가 다르면 수정
            console.warn(`Surname mismatch! Generated: ${generatedSurname}, Expected: ${parsedResult.idol_surname}. Correcting...`);
            parsedResult.korean_name = parsedResult.idol_surname + parsedResult.korean_name.substring(1);
          }
        }
        
        // IDOL_DB에서 찾은 경우, 응답의 성씨를 강제로 DB 값으로 설정
        if (hasIdolDbInfo && idolDbInfo) {
          // 강제로 올바른 성씨 설정
          parsedResult.idol_surname = idolDbInfo.surname;
          
          // idol_real_name 검증 및 수정
          const normalized = normalizeIdolName(idolName);
          const commonNames: Record<string, string> = {
            'jimin': '지민', 'jungkook': '정국', 'rm': '남준', 'namjoon': '남준',
            'v': '태형', 'taehyung': '태형', 'jin': '석진', 'seokjin': '석진',
            'suga': '윤기', 'yoongi': '윤기', 'jhope': '호석', 'hoseok': '호석',
            // BLACKPINK
            'jisoo': '지수', 'jennie': '제니', 'rose': '채영', 'rosé': '채영',
            'chaeyoung': '채영', 'lisa': '리사', 'lalisa': '리사',
          };
          const givenName = commonNames[normalized] || '민수';
          const correctRealName = `${idolDbInfo.surname}${givenName}`;
          
          // idol_real_name이 없거나 잘못된 성씨를 사용하면 강제 수정
          if (!parsedResult.idol_real_name || !parsedResult.idol_real_name.startsWith(idolDbInfo.surname)) {
            console.warn(`⚠️ Correcting idol_real_name: "${parsedResult.idol_real_name}" → "${correctRealName}" (for ${idolName})`);
            parsedResult.idol_real_name = correctRealName;
          } else if (parsedResult.idol_real_name !== correctRealName && commonNames[normalized]) {
            // 성씨는 맞지만 이름이 다를 수 있으므로 확인
            console.log(`ℹ️ idol_real_name "${parsedResult.idol_real_name}" seems correct for ${idolName}`);
          }
          
          // 생성된 이름의 성씨도 강제 수정
          if (parsedResult.korean_name && !parsedResult.korean_name.startsWith(idolDbInfo.surname)) {
            parsedResult.korean_name = idolDbInfo.surname + parsedResult.korean_name.substring(1);
          }
        }
        
        // 선택된 글자 의미 추가
        if (selectedCharacters) {
          parsedResult.character_meanings = {
            month: {
              character: selectedCharacters.month.character,
              romanized: selectedCharacters.month.romanized,
              meaning: selectedCharacters.month.meanings[langKey]
            },
            day: {
              character: selectedCharacters.day.character,
              romanized: selectedCharacters.day.romanized,
              meaning: selectedCharacters.day.meanings[langKey]
            }
          };
          
          // 선택된 글자로 이름이 생성되었는지 검증 및 수정
          if (parsedResult.korean_name && parsedResult.korean_name.length >= 3) {
            const expectedName = parsedResult.korean_name.charAt(0) + selectedCharacters.month.character + selectedCharacters.day.character;
            if (parsedResult.korean_name !== expectedName) {
              console.warn(`⚠️ Name doesn't match selected characters. Expected: ${expectedName}, Got: ${parsedResult.korean_name}. Correcting...`);
              parsedResult.korean_name = expectedName;
              // romanized도 수정
              const surnameEn = hasIdolDbInfo && idolDbInfo ? idolDbInfo.surname_en : 
                                (parsedResult.idol_surname === '김' ? 'Kim' : 
                                 parsedResult.idol_surname === '이' ? 'Lee' : 
                                 parsedResult.idol_surname === '박' ? 'Park' : 
                                 parsedResult.idol_surname === '최' ? 'Choi' : 
                                 parsedResult.idol_surname === '정' ? 'Jung' : 'Kim');
              parsedResult.romanized = `${surnameEn} ${selectedCharacters.month.romanized}${selectedCharacters.day.romanized}`;
            }
          }
        }
        
        if (yearPhrase != null) (parsedResult as Record<string, unknown>).year_phrase = yearPhrase;
        console.log(`✅ Success with SDK/${model}`);
        return NextResponse.json(parsedResult);
      } catch (modelError: any) {
        // 상세한 에러 로깅
        console.error(`❌ SDK Error with ${model}:`, {
          message: modelError.message,
          status: modelError.status,
          statusText: modelError.statusText,
          code: modelError.code,
          fullError: modelError,
          stack: modelError.stack
        });
        
        // 모델이 존재하지 않거나 사용할 수 없는 경우
        if (
          modelError.message?.includes('404') || 
          modelError.message?.includes('not found') ||
          modelError.status === 404 ||
          modelError.code === 404
        ) {
          console.log(`⚠️ Model ${model} not available (404), trying next model...`);
          lastError = {
            model: model,
            status: modelError.status || 404,
            statusText: modelError.statusText || 'Not Found',
            message: modelError.message || 'Model not found'
          };
          continue; // 다음 모델 시도
        }
        // 다른 에러는 로깅하고 다음 모델 시도
        lastError = {
          model: model,
          status: modelError.status,
          statusText: modelError.statusText,
          message: modelError.message || String(modelError)
        };
        continue; // 다음 모델 시도
      }
      
      console.warn(`Model ${model} failed, trying next model...`);
    } catch (e) {
      console.error(`Error with model ${model}:`, e);
      lastError = e;
      // 에러 무시하고 다음 모델로
    }
    }
  } else {
    console.log('⚠️ No v1beta models to try');
  }

    // 모든 방법이 실패했을 때
    console.error('❌ All models and API versions failed. Details:', {
      triedV1Models: v1Models,
      triedV1betaModels: v1betaModels,
      lastError: lastError,
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey?.length || 0
    });
    
    const errorMessage = lastError 
      ? `All AI models failed. Last error: ${JSON.stringify(lastError)}` 
      : "All AI models failed. Please check your API Key.";
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 });
  } catch (unexpectedError: any) {
    // 예상치 못한 에러 처리
    console.error('❌ Unexpected error in POST handler:', {
      message: unexpectedError.message,
      stack: unexpectedError.stack,
      error: unexpectedError
    });
    return NextResponse.json({ 
      error: `Internal server error: ${unexpectedError.message || String(unexpectedError)}` 
    }, { status: 500 });
  }
}