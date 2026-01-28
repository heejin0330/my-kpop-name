// app/api/generate/route.ts
import { NextResponse } from 'next/server';

// 🎂 별자리 계산 함수
function getZodiacSign(month: number, day: number): { sign: string; signKo: string; element: string } {
  const zodiacData = [
    { sign: "Capricorn", signKo: "염소자리", element: "Earth", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { sign: "Aquarius", signKo: "물병자리", element: "Air", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { sign: "Pisces", signKo: "물고기자리", element: "Water", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { sign: "Aries", signKo: "양자리", element: "Fire", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { sign: "Taurus", signKo: "황소자리", element: "Earth", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { sign: "Gemini", signKo: "쌍둥이자리", element: "Air", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { sign: "Cancer", signKo: "게자리", element: "Water", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { sign: "Leo", signKo: "사자자리", element: "Fire", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { sign: "Virgo", signKo: "처녀자리", element: "Earth", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { sign: "Libra", signKo: "천칭자리", element: "Air", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { sign: "Scorpio", signKo: "전갈자리", element: "Water", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { sign: "Sagittarius", signKo: "사수자리", element: "Fire", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  ];
  
  for (const z of zodiacData) {
    if (z.startMonth === 12) {
      if ((month === 12 && day >= z.startDay) || (month === 1 && day <= z.endDay)) {
        return { sign: z.sign, signKo: z.signKo, element: z.element };
      }
    } else if ((month === z.startMonth && day >= z.startDay) || (month === z.endMonth && day <= z.endDay)) {
      return { sign: z.sign, signKo: z.signKo, element: z.element };
    }
  }
  return { sign: "Aries", signKo: "양자리", element: "Fire" };
}

// 🎯 재미있는 궁합 점수 계산 (생일 기반 + 약간의 랜덤)
function calculateCompatibilityScore(birthday: string, idolName: string): number {
  if (!birthday) {
    // 생일 미입력 시 랜덤 85-99
    return Math.floor(Math.random() * 15) + 85;
  }
  
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 생일 숫자들로 "운명의 숫자" 계산 (재미용)
  const destinyNumber = (month + day) % 15;
  
  // 아이돌 이름 길이도 반영
  const idolFactor = (idolName.length % 5);
  
  // 최종 점수: 85 ~ 99 범위, 항상 높게! (팬서비스!)
  const baseScore = 85;
  const bonus = destinyNumber + idolFactor;
  const finalScore = Math.min(99, baseScore + (bonus % 15));
  
  return finalScore;
}

export async function POST(req: Request) {
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { userName, userBirthday, userGender, idolName, language, lastKoreanName } = requestBody;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key missing. Check .env.local' }, { status: 500 });
  }

  // 🎂 생일 정보 처리
  let zodiacInfo = { sign: "", signKo: "", element: "" };
  let birthdayText = "";
  if (userBirthday) {
    const date = new Date(userBirthday);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    zodiacInfo = getZodiacSign(month, day);
    birthdayText = `Birthday: ${month}/${day} (${zodiacInfo.sign} / ${zodiacInfo.signKo}, Element: ${zodiacInfo.element})`;
  }

  // 🎯 궁합 점수 미리 계산
  const compatibilityScore = calculateCompatibilityScore(userBirthday, idolName);

  // 🚨 2026년 1월 기준 최신 Gemini 모델명
  const candidateModels = [
    "gemini-2.0-flash",          // 최신 Flash 모델
    "gemini-2.0-flash-exp",      // 실험 버전
    "gemini-1.5-flash-8b",       // 경량 모델
    "gemini-1.5-pro-latest",     // Pro 최신
  ];

  const langMap: Record<string, string> = { 
    en: "English", jp: "Japanese", th: "Thai", es: "Spanish", ar: "Arabic", ko: "Korean" 
  };
  const outputLang = langMap[language] || "English";

  // 사용자 이름이 한글인지 확인
  const isKoreanName = /[가-힣]/.test(userName);

  // 🎨 이름 스타일을 살짝 랜덤하게 바꿔서 다양성 증가
  const styleOptions = [
    "fresh, trendy, and idol-like (modern K-POP style)",
    "soft, warm, and romantic (ballad / vocal line style)",
    "strong, charismatic, and powerful (performance / dance line style)",
    "cute, bright, and bubbly (lovely / teen crush concept)",
    "dreamy, mysterious, and elegant (fantasy / fairy-like concept)",
  ];
  const randomStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
  
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
    ${zodiacInfo.sign ? `Zodiac: ${zodiacInfo.sign} (${zodiacInfo.element})` : ""}
    
    ⚠️ TASK: Create a NEW Korean name for the user using the idol's REAL surname.
    ${isKoreanName ? "Note: Even though the user already has a Korean name, create a COMPLETELY NEW name with the idol's surname!" : ""}
    
    ⚠️ IDOL SURNAME LOOKUP (CRITICAL, MUST MATCH USER'S BIAS ONLY):
    - You MUST look up the REAL Korean name and surname for the idol given as "Ultimate Bias: ${idolName}".
    - You are FORBIDDEN to use the real name or surname of any other idol (for example: V/김태형, RM/김남준, Jungkook/전정국, Jennie/김제니 등은 ${idolName}이 아닐 때 절대 사용하지 말 것).
    - \"idol_real_name\" MUST be the real full Korean name of ${idolName} ONLY.
    - \"idol_surname\" MUST be the first syllable (family name) of that exact real Korean name.

    RULES:
    1. Find the idol's REAL Korean surname for "${idolName}" only (do NOT mix with any other idol).
    2. Create a 2-syllable given name (총 3글자: 성 1자 + 이름 2자)
       - The VERY FIRST character of "korean_name" MUST be exactly the same as "idol_surname".
    3. Given name should be modern, beautiful, and fit ${userGender}
    4. compatibility_score MUST be exactly "${compatibilityScore}"
    ${zodiacInfo.sign ? `5. Mention ${zodiacInfo.sign} zodiac in compatibility_reason` : ""}
    
    OUTPUT FORMAT (JSON only, no markdown, no explanation text around it):
    {"korean_name":"성이름","romanized":"Seong Ireum","compatibility_score":"${compatibilityScore}","compatibility_reason":"reason in ${outputLang}","meaning":"meaning in ${outputLang}","idol_real_name":"${idolName}의 실제 한국 이름","idol_surname":"그 한국 이름에서의 성씨 1글자"}
  `;

  // 순차적 연결 시도 로직
  for (const model of candidateModels) {
    try {
      console.log(`Trying model: ${model}...`);
      
      // v1 API 사용 (v1beta 대신)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            // 조금 더 다양한 이름이 나오도록 살짝 올림
            temperature: 0.9,
            maxOutputTokens: 512,
            topP: 0.95,
            topK: 50,
          }
        })
      });

      const data = await response.json();
      console.log(`Model ${model} response:`, JSON.stringify(data).slice(0, 200));

      // 성공하면 바로 리턴!
      if (!data.error && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const textResponse = data.candidates[0].content.parts[0].text;
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        console.log(`Success with model: ${model}`);
        
        const parsed = JSON.parse(jsonStr);

        // ✅ 안전장치: idol_surname과 korean_name의 첫 글자가 다르면 강제로 맞춰줌
        if (parsed?.idol_surname && parsed?.korean_name) {
          const surnameChar = String(parsed.idol_surname).trim()[0];
          if (surnameChar && parsed.korean_name[0] !== surnameChar) {
            parsed.korean_name = surnameChar + parsed.korean_name.slice(1);
          }
        }

        return NextResponse.json(parsed);
      }
      
      console.warn(`Model ${model} failed:`, data.error?.message || 'No valid response');
    } catch (e: any) {
      console.error(`Model ${model} exception:`, e.message);
    }
  }

  // 다 실패했을 때
  return NextResponse.json({ 
    error: "All AI models failed. Please check your API Key and ensure it has Gemini access." 
  }, { status: 500 });
}