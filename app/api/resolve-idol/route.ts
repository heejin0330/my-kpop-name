// app/api/resolve-idol/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IDOL_DB, normalizeIdolName, getIdolSurname, GROUP_NAMES, findAllIdolMatches } from '@/app/lib/idol-db';

export async function POST(req: Request) {
  try {
    const { idolName } = await req.json();

    if (!idolName || typeof idolName !== 'string' || idolName.trim().length < 1) {
      return NextResponse.json({ found: false, error: 'idolName is required' }, { status: 400 });
    }

    const normalized = normalizeIdolName(idolName.trim());

    // 그룹명이 직접 입력된 경우 → 그룹 자체를 searchTerm으로 반환
    if (GROUP_NAMES.has(normalized)) {
      return NextResponse.json({
        found: true,
        isGroup: true,
        group: idolName.trim(),
        searchTerm: idolName.trim(),
      });
    }

    // IDOL_DB에서 직접 매칭
    const dbResult = getIdolSurname(idolName.trim());

    if (dbResult) {
      return NextResponse.json({
        found: true,
        isGroup: false,
        surname: dbResult.surname,
        surnameEn: dbResult.surname_en,
        group: dbResult.group,
        searchTerm: dbResult.group,
        idolName: idolName.trim(),
      });
    }

    // IDOL_DB에 없는 경우 → Gemini AI로 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        found: false,
        searchTerm: idolName.trim(),
        reason: 'not_in_db_no_api_key',
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { temperature: 0.1, maxOutputTokens: 300 },
      });

      const prompt = `You are a K-POP expert. Identify the K-POP idol named "${idolName}".
Return ONLY a JSON object with these fields:
- "found": boolean (true if this is a known K-POP idol)
- "realName": string (real Korean name, e.g. "이용복")
- "stageName": string (stage name, e.g. "Felix")
- "surname": string (Korean surname, single character, e.g. "이")
- "surnameEn": string (English surname, e.g. "Lee")
- "group": string (group name as commonly known in English, e.g. "Stray Kids")

If there are multiple K-POP idols with this name, return an array of candidates:
- "found": true
- "candidates": [{ "realName": "...", "stageName": "...", "surname": "...", "surnameEn": "...", "group": "..." }, ...]

If this is not a K-POP idol, return: { "found": false }

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);

      if (!parsed.found) {
        return NextResponse.json({
          found: false,
          searchTerm: idolName.trim(),
          reason: 'ai_not_found',
        });
      }

      if (parsed.candidates && Array.isArray(parsed.candidates)) {
        return NextResponse.json({
          found: true,
          isGroup: false,
          candidates: parsed.candidates.map((c: any) => ({
            realName: c.realName,
            stageName: c.stageName,
            surname: c.surname,
            surnameEn: c.surnameEn,
            group: c.group,
            searchTerm: c.group,
          })),
          idolName: idolName.trim(),
        });
      }

      return NextResponse.json({
        found: true,
        isGroup: false,
        surname: parsed.surname,
        surnameEn: parsed.surnameEn,
        group: parsed.group,
        searchTerm: parsed.group,
        realName: parsed.realName,
        idolName: idolName.trim(),
        source: 'ai',
      });
    } catch (aiError: any) {
      console.error('Gemini AI error in resolve-idol:', aiError.message);
      return NextResponse.json({
        found: false,
        searchTerm: idolName.trim(),
        reason: 'ai_error',
      });
    }
  } catch (e: any) {
    console.error('resolve-idol error:', e.message);
    return NextResponse.json({ found: false, error: 'Invalid request' }, { status: 400 });
  }
}
