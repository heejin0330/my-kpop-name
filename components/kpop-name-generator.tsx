"use client"

import { useState } from "react"
import { Sparkles, RefreshCw, Loader2, Eye, EyeOff, Search, Heart, User } from "lucide-react"

const languages = [
  { value: "English", label: "English" },
  { value: "Japanese", label: "日本語" },
  { value: "Thai", label: "ภาษาไทย" },
  { value: "Spanish", label: "Español" },
  { value: "Arabic", label: "العربية" },
]

const genders = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Unisex", label: "Unisex" },
]

interface GeneratedResult {
  koreanName: string
  romanized: string
  meaning: string
  fanMessage: string
}

export default function KpopNameGenerator() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [userName, setUserName] = useState("")
  const [gender, setGender] = useState("Female")
  const [idolName, setIdolName] = useState("")
  const [language, setLanguage] = useState("English")
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [idolImage, setIdolImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Gemini API 키를 입력해주세요!")
      return
    }
    if (!userName || !idolName) {
      setError("이름과 최애 아이돌을 모두 입력해주세요!")
      return
    }

    setError("")
    setIsLoading(true)
    setResult(null)

    const prompt = `
      당신은 K-POP 팬을 위한 한국 이름 작명가입니다.
      다음 정보를 바탕으로 JSON 형식으로 답하세요.

      [입력 정보]
      1. 사용자 이름: ${userName}
      2. 성별: ${gender}
      3. 좋아하는 아이돌: ${idolName}
      4. 출력 언어: ${language}

      [중요: 문화적 안전 수칙]
      1. 출력 언어가 'Arabic(아랍어)'일 경우: 
         - '하은(하나님의 은혜)', '요한', '예수' 등 기독교적/특정 종교적 의미가 담긴 이름은 절대 피하십시오.
         - 대신 '별(Star)', '수아(Water)', '지수(Wisdom)', '서윤' 등 자연이나 중립적이고 아름다운 뜻의 이름을 지으세요.
      2. 아이돌의 한국어 성씨(Surname)를 정확히 찾아내어 사용자의 성으로 쓰세요.
      3. 성별(${gender})에 맞는 이름을 지으세요. Female이면 여성스러운 이름, Male이면 남성스러운 이름, Unisex면 중성적인 이름을 선택하세요.
      4. 출력 언어(${language})로 모든 설명과 메시지를 번역하세요.

      [출력 JSON 형식]
      {
          "korean_name": "한국어 이름 (예: 전정국)",
          "romanized": "영어 발음 (예: Jeon Jung-kook)",
          "meaning": "이름의 뜻 설명 (${language}로 작성)",
          "fan_message": "환영 메시지 (${language}로 작성, 예: 이제 당신은 정국과 가족입니다!)"
      }
    `

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "API 오류가 발생했습니다.")
      }

      const textResponse = data.candidates[0].content.parts[0].text
      const jsonStr = textResponse.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(jsonStr)

      setResult({
        koreanName: parsed.korean_name,
        romanized: parsed.romanized,
        meaning: parsed.meaning,
        fanMessage: parsed.fan_message,
      })
    } catch (err) {
      setError("오류가 발생했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError("")
  }

  const isRtl = language === "Arabic"

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-6 relative overflow-hidden">
      {/* Animated background smoke/glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff1493] rounded-full blur-[150px] opacity-20 smoke-animation" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d946ef] rounded-full blur-[150px] opacity-20 smoke-animation"
        style={{ animationDelay: "-4s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff69b4] rounded-full blur-[200px] opacity-10" />

      {/* Language selector - top right pill */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 rounded-full glass text-white text-sm bg-transparent focus:outline-none focus:border-[#d946ef] cursor-pointer appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d946ef'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
          }}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value} className="bg-[#0a0a0a] text-white">
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6 pt-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff1493] via-[#d946ef] to-[#ff69b4] animate-pulse"
            style={{ 
              fontFamily: "var(--font-heading)",
              textShadow: "0 0 40px rgba(217, 70, 239, 0.5), 0 0 80px rgba(255, 20, 147, 0.3)"
            }}
          >
            My K-POP Name
          </h1>
          <p className="text-[#888888] text-sm md:text-base">
            Do you want to share your Bias&apos;s Family Name? <span className="text-[#ff69b4]">💍</span>
          </p>
        </div>

        {/* Form section */}
        {!result && !isLoading && (
          <div className="w-full glass rounded-2xl p-6 space-y-5">
            {/* API Key input */}
            <div className="space-y-1.5">
              <label className="block text-xs text-[#666666]">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-[#d946ef]/30 text-white placeholder:text-[#555555] focus:outline-none focus:border-[#d946ef] focus:ring-2 focus:ring-[#d946ef]/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#d946ef] transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Your Name input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#aaaaaa]">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g., Emily"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#d946ef]/30 text-white placeholder:text-[#555555] focus:outline-none focus:border-[#d946ef] focus:ring-2 focus:ring-[#d946ef]/20 transition-all duration-300"
              />
            </div>

            {/* Gender dropdown */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#aaaaaa]">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#d946ef]/30 text-white focus:outline-none focus:border-[#d946ef] focus:ring-2 focus:ring-[#d946ef]/20 transition-all duration-300 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d946ef'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.25rem",
                  backgroundColor: "transparent",
                }}
              >
                {genders.map((g) => (
                  <option key={g.value} value={g.value} className="bg-[#0a0a0a] text-white">
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ultimate Bias input with avatar slot */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#aaaaaa]">Ultimate Bias</label>
              <div className="relative flex items-center">
                {/* Avatar preview slot */}
                <div className="absolute left-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#d946ef]/20 to-[#ff1493]/20 border border-[#d946ef]/40 flex items-center justify-center overflow-hidden">
                  {idolImage ? (
                    <img src={idolImage || "/placeholder.svg"} alt="Idol" className="w-full h-full object-cover" />
                  ) : idolName ? (
                    <User className="w-5 h-5 text-[#d946ef]" />
                  ) : (
                    <Search className="w-4 h-4 text-[#666666]" />
                  )}
                </div>
                <input
                  type="text"
                  value={idolName}
                  onChange={(e) => setIdolName(e.target.value)}
                  placeholder="e.g., Jennie (BLACKPINK)"
                  className="w-full pl-16 pr-12 py-3 rounded-xl bg-white/5 border border-[#d946ef]/30 text-white placeholder:text-[#555555] focus:outline-none focus:border-[#d946ef] focus:ring-2 focus:ring-[#d946ef]/20 transition-all duration-300"
                />
                <button
                  type="button"
                  className="absolute right-3 w-8 h-8 rounded-full bg-[#d946ef]/20 flex items-center justify-center hover:bg-[#d946ef]/40 transition-colors"
                >
                  <Search className="w-4 h-4 text-[#d946ef]" />
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl gradient-btn text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              <Heart className="w-5 h-5" />
              Get My K-Name <span className="text-xl">💖</span>
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="w-full glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#d946ef]/20 border-t-[#d946ef] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#ff1493] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-[#d946ef] text-sm font-medium animate-pulse">
              Asking your Ultimate Bias for permission...
            </p>
            <p className="text-[#666666] text-xs">
              Analyzing fortune & family name
            </p>
          </div>
        )}

        {/* Result card - Photo Card Style */}
        {result && (
          <div
            className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            {/* Outer gradient border */}
            <div className="p-[2px] rounded-3xl bg-gradient-to-br from-[#ff1493] via-[#d946ef] to-[#ff69b4]">
              <div className="w-full rounded-3xl bg-[#0a0a0a] holographic relative overflow-hidden">
                {/* Holographic shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_ease-in-out_infinite]" />
                
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full" />
                </div>

                <div className="relative z-10 p-6 space-y-5">
                  {/* Badge */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff1493]/20 to-[#d946ef]/20 border border-[#d946ef]/40">
                      <Sparkles className="w-3 h-3 text-[#d946ef]" />
                      <span className="text-xs font-bold text-[#d946ef] tracking-widest uppercase">Official K-Name</span>
                      <Sparkles className="w-3 h-3 text-[#d946ef]" />
                    </div>
                  </div>

                  {/* Main Korean Name */}
                  <div className="text-center py-4">
                    <h2
                      className="text-5xl md:text-6xl font-bold text-white"
                      style={{ 
                        fontFamily: "var(--font-heading)",
                        textShadow: "0 0 30px rgba(217, 70, 239, 0.5), 0 0 60px rgba(255, 20, 147, 0.3)"
                      }}
                    >
                      {result.koreanName}
                    </h2>
                    <p className="text-xl text-[#d946ef] font-medium mt-3 tracking-wide">{result.romanized}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent" />

                  {/* Detail sections */}
                  <div className="space-y-4">
                    {/* Meaning */}
                    <div className="p-4 rounded-xl bg-white/5 border border-[#d946ef]/20">
                      <p className="text-xs text-[#d946ef] uppercase tracking-widest mb-2 font-semibold">Meaning</p>
                      <p className="text-[#cccccc] text-sm leading-relaxed">{result.meaning}</p>
                    </div>

                    {/* Fan Message */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#ff1493]/10 to-[#d946ef]/10 border border-[#d946ef]/20">
                      <p className="text-xs text-[#ff69b4] uppercase tracking-widest mb-2 font-semibold">Fan Message</p>
                      <p className="text-[#ff69b4] text-sm font-medium leading-relaxed">{result.fanMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-full glass text-[#888888] hover:text-white hover:border-[#d946ef]/50 transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-[#444444] text-center mt-4">Your destiny in K-POP awaits</p>
      </div>
    </div>
  )
}
