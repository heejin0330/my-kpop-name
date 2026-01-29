// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

  // 생일 정보 처리
  let zodiacInfo: { sign: string; element: string } | null = null;
  if (userBirthday) {
    const [year, month, day] = userBirthday.split('-').map(Number);
    zodiacInfo = getZodiacSign(month, day);
  }
  const compatibilityScore = calculateCompatibilityScore(userBirthday);
  const birthdayText = userBirthday ? `Birthday: ${userBirthday}${zodiacInfo ? ` (${zodiacInfo.sign} ${zodiacInfo.element})` : ''}` : '';

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
    - Ultimate Bias: ${idolName}
    - Surname (Korean): ${idolDbInfo.surname}
    - Surname (English): ${idolDbInfo.surname_en}
    - Group: ${idolDbInfo.group}
    - The "idol_surname" MUST be exactly "${idolDbInfo.surname}" (single character).
    - The "idol_real_name" should be a realistic Korean full name starting with "${idolDbInfo.surname}" (e.g., ${idolDbInfo.surname}${idolName.includes('jimin') ? '지민' : idolName.includes('jungkook') ? '정국' : '민수'}).
    - DO NOT use any other surname. Use "${idolDbInfo.surname}" ONLY.
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
    
    RULES:
    1. Find the idol's REAL Korean surname first
    2. Create a 2-syllable given name (총 3글자: 성 1자 + 이름 2자)
    3. Given name should be modern, beautiful, and fit ${userGender}
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
        parsedResult.idol_surname = idolDbInfo.surname;
        if (!parsedResult.idol_real_name || !parsedResult.idol_real_name.startsWith(idolDbInfo.surname)) {
          const commonNames: Record<string, string> = {
            'jimin': '지민', 'jungkook': '정국', 'rm': '남준', 'namjoon': '남준',
            'v': '태형', 'taehyung': '태형', 'jin': '석진', 'seokjin': '석진',
            'suga': '윤기', 'yoongi': '윤기', 'jhope': '호석', 'hoseok': '호석',
            // BLACKPINK
            'jisoo': '지수', 'jennie': '제니', 'rose': '채영', 'rosé': '채영',
            'chaeyoung': '채영', 'lisa': '리사', 'lalisa': '리사',
          };
          const normalized = normalizeIdolName(idolName);
          const givenName = commonNames[normalized] || '민수';
          parsedResult.idol_real_name = `${idolDbInfo.surname}${givenName}`;
        }
        if (parsedResult.korean_name && !parsedResult.korean_name.startsWith(idolDbInfo.surname)) {
          parsedResult.korean_name = idolDbInfo.surname + parsedResult.korean_name.substring(1);
        }
      }
      
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
          parsedResult.idol_surname = idolDbInfo.surname;
          // idol_real_name이 없거나 성씨가 다르면 생성
          if (!parsedResult.idol_real_name || !parsedResult.idol_real_name.startsWith(idolDbInfo.surname)) {
            // 간단한 본명 생성 (예: 박지민, 김남준 등)
            const commonNames: Record<string, string> = {
              'jimin': '지민', 'jungkook': '정국', 'rm': '남준', 'namjoon': '남준',
              'v': '태형', 'taehyung': '태형', 'jin': '석진', 'seokjin': '석진',
              'suga': '윤기', 'yoongi': '윤기', 'jhope': '호석', 'hoseok': '호석',
              // BLACKPINK
              'jisoo': '지수', 'jennie': '제니', 'rose': '채영', 'rosé': '채영',
              'chaeyoung': '채영', 'lisa': '리사', 'lalisa': '리사',
            };
            const normalized = normalizeIdolName(idolName);
            const givenName = commonNames[normalized] || '민수';
            parsedResult.idol_real_name = `${idolDbInfo.surname}${givenName}`;
          }
          // 생성된 이름의 성씨도 강제 수정
          if (parsedResult.korean_name && !parsedResult.korean_name.startsWith(idolDbInfo.surname)) {
            parsedResult.korean_name = idolDbInfo.surname + parsedResult.korean_name.substring(1);
          }
        }
        
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