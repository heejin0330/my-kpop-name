// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { selectRandomNameCharacters, LANGUAGE_MAP, type NameCharacter } from './name-characters-db';
import { IDOL_DB, normalizeIdolName, getIdolSurname, GROUP_NAMES, cleanIdolRealName } from '@/app/lib/idol-db';

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
  
  // 아이돌 매칭 로그: 잘못된 매칭 발생 시 역추적용
  console.log('🔍 Idol lookup:', {
    originalIdolName: idolName,
    normalized: normalizeIdolName(idolName),
    foundInDB: hasIdolDbInfo,
    surname: idolDbInfo?.surname,
    surname_en: idolDbInfo?.surname_en,
    group: idolDbInfo?.group,
    isGroupName: GROUP_NAMES.has(normalizeIdolName(idolName))
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

    ⛔ MEMBER CONFUSION PREVENTION (CRITICAL - K-POP fans will leave if this is wrong!):
    - The user's bias is SPECIFICALLY "${idolName}" and NOBODY ELSE.
    - NEVER substitute another member's real name or surname, even if they are in the same group.
    - "${idolName}" has surname "${idolDbInfo.surname}" (${idolDbInfo.surname_en}). Use ONLY this surname.
    - If "${idolName}" is Jimin → surname MUST be 박 (Park). NEVER use 전 (Jeon/Jungkook) or 김 (Kim/V/Jin).
    - If "${idolName}" is Jungkook → surname MUST be 전 (Jeon). NEVER use 박 (Park/Jimin).
    - If "${idolName}" is V → surname MUST be 김 (Kim). NEVER use 박 (Park) or 전 (Jeon).
    - DO NOT confuse ${idolName} with ANY other ${idolDbInfo.group} member under any circumstance.
    ` : `
    [AI LOOKUP REQUIRED]
    - For Ultimate Bias: ${idolName}
    - The "idol_real_name" MUST be the REAL KOREAN NAME of ${idolName} ONLY (single name, not a list).
    - The "idol_surname" MUST be the SINGLE-CHARACTER KOREAN SURNAME from "idol_real_name".
    - DO NOT use real names or surnames of other idols (e.g., V/김태형, RM/김남준, Jungkook/전정국, Jennie/김제니) if ${idolName} is not them.
    - DO NOT list multiple names or group members in "idol_real_name". Output ONLY the selected idol's name.

    ⛔ MEMBER CONFUSION PREVENTION:
    - The user chose "${idolName}" as their bias. Return ONLY this idol's real name and surname.
    - NEVER substitute a different member's name/surname, even from the same group.
    - Examples of correct surname mapping:
      * Jimin/지민 → 박지민 → 박 (Park) — NOT 전 (Jeon), NOT 김 (Kim)
      * Jungkook/정국 → 전정국 → 전 (Jeon) — NOT 박 (Park), NOT 김 (Kim)
      * G-Dragon/지드래곤 → 권지용 → 권 (Kwon)
      * RM → 김남준 → 김 (Kim)
      * V/뷔 → 김태형 → 김 (Kim)
      * Jennie/제니 → 김제니 → 김 (Kim)
      * IU/아이유 → 이지은 → 이 (Lee)
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
      if (hasIdolDbInfo && idolDbInfo) {
        (parsedResult as Record<string, unknown>).idol_group = idolDbInfo.group;
      }
      // 최종 응답 전 매칭 검증 로그
      if (hasIdolDbInfo && idolDbInfo && parsedResult.idol_surname !== idolDbInfo.surname) {
        console.error(`🚨 CRITICAL MISMATCH: User bias="${idolName}", expected surname="${idolDbInfo.surname}", but response has "${parsedResult.idol_surname}". Force-correcting.`);
        parsedResult.idol_surname = idolDbInfo.surname;
        if (parsedResult.korean_name && !parsedResult.korean_name.startsWith(idolDbInfo.surname)) {
          parsedResult.korean_name = idolDbInfo.surname + parsedResult.korean_name.substring(1);
        }
      }
      console.log(`✅ Success with v1beta API/${model}`, { bias: idolName, result_surname: parsedResult.idol_surname, result_name: parsedResult.korean_name });
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
        if (hasIdolDbInfo && idolDbInfo) {
          (parsedResult as Record<string, unknown>).idol_group = idolDbInfo.group;
        }
        // 최종 응답 전 매칭 검증 로그
        if (hasIdolDbInfo && idolDbInfo && parsedResult.idol_surname !== idolDbInfo.surname) {
          console.error(`🚨 CRITICAL MISMATCH: User bias="${idolName}", expected surname="${idolDbInfo.surname}", but response has "${parsedResult.idol_surname}". Force-correcting.`);
          parsedResult.idol_surname = idolDbInfo.surname;
          if (parsedResult.korean_name && !parsedResult.korean_name.startsWith(idolDbInfo.surname)) {
            parsedResult.korean_name = idolDbInfo.surname + parsedResult.korean_name.substring(1);
          }
        }
        console.log(`✅ Success with SDK/${model}`, { bias: idolName, result_surname: parsedResult.idol_surname, result_name: parsedResult.korean_name });
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