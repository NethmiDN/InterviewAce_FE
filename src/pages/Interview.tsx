import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

type Question = {
  text: string
}

export default function Interview() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [education, setEducation] = useState("")
  const [qType, setQType] = useState<"technical" | "behavioral" | "mixed">("mixed")

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [answers, setAnswers] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)

  const recognitionRef = useRef<any>(null)
  const shouldAdvanceAfterStopRef = useRef(false)
  const currentIdxRef = useRef(0)
  const questionsRef = useRef<Question[]>([])
  const answersRef = useRef<string[]>([])
  const stopRequestedRef = useRef(false)

  useEffect(() => {
    // setup speech recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = "en-US"
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.continuous = true

      recognition.onresult = (event: any) => {
        let chunk = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) chunk += `${result[0].transcript} `
        }

        const text = chunk.trim()
        if (!text) return

        setTranscript((prev) => {
          const normalizedPrev = prev.trim()
          const combined = normalizedPrev ? `${normalizedPrev} ${text}`.trim() : text
          setAnswers((prevAnswers) => {
            const copy = [...prevAnswers]
            copy[currentIdxRef.current] = combined
            answersRef.current = copy
            return copy
          })
          return combined
        })
      }

      recognition.onstart = () => {
        setIsRecording(true)
        stopRequestedRef.current = false
      }

      recognition.onerror = (e: any) => {
        console.error("Recognition error", e)
        setIsRecording(false)
        shouldAdvanceAfterStopRef.current = false
        stopRequestedRef.current = false
      }

      recognition.onend = () => {
        setIsRecording(false)
        const recognitionInstance = recognitionRef.current
        if (shouldAdvanceAfterStopRef.current) {
          shouldAdvanceAfterStopRef.current = false
          const idx = currentIdxRef.current
          const answer = answersRef.current[idx]
          if (answer && answer.trim() && idx < questionsRef.current.length - 1) {
            setCurrentIdx(idx + 1)
          }
          stopRequestedRef.current = false
        } else if (!stopRequestedRef.current && recognitionInstance) {
          // resume listening until the user explicitly stops
          try {
            recognitionInstance.start()
          } catch (err) {
            console.error("Failed to restart recognition", err)
          }
        }
      }

      recognitionRef.current = recognition
    }
  }, [])

  useEffect(() => {
    currentIdxRef.current = currentIdx
  }, [currentIdx])

  useEffect(() => {
    questionsRef.current = questions
  }, [questions])

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    setTranscript(answers[currentIdx] || "")
  }, [currentIdx, answers])

  const playText = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = "en-US"
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/v1/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, experience, education, type: qType })
      })
      const data = await res.json()
      const generated = (data.questions || []).map((q: string) => ({ text: q }))
      setQuestions(generated)
      questionsRef.current = generated
      setCurrentIdx(0)
      currentIdxRef.current = 0
      const blankAnswers = new Array(generated.length).fill("")
      setAnswers(blankAnswers)
      answersRef.current = blankAnswers
      setTranscript("")
      shouldAdvanceAfterStopRef.current = false
      stopRequestedRef.current = false
    } catch (err) {
      console.error(err)
      alert("Failed to fetch questions. Make sure backend is running on http://localhost:5000")
    } finally {
      setLoading(false)
    }
  }

  const handleStartAnswer = () => {
    const recognition = recognitionRef.current
    if (!recognition) return alert("SpeechRecognition not supported in this browser.")
    if (!questions.length) return alert("Generate questions first.")
    if (isRecording) return
    shouldAdvanceAfterStopRef.current = false
    stopRequestedRef.current = false
    setAnswers((prev) => {
      const copy = [...prev]
      copy[currentIdx] = ""
      answersRef.current = copy
      return copy
    })
    setTranscript("")
    recognition.start()
  }

  const handleStopAnswer = () => {
    const recognition = recognitionRef.current
    if (!recognition || !isRecording) return
    shouldAdvanceAfterStopRef.current = true
    stopRequestedRef.current = true
    recognition.stop()
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1)
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1)
  }

  const finishInterview = () => {
    // basic scoring: count answered
    const answered = answers.filter(Boolean).length
    const total = questions.length
    navigate("/home", { replace: true })
    alert(`Interview finished. Score: ${answered}/${total}`)
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please login to access the interview.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Start Your Interview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1">Job Role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Frontend Engineer" />
        </div>
        <div>
          <label className="block mb-1">Experience Level</label>
          <input value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. 3 years" />
        </div>
        <div>
          <label className="block mb-1">Education Level</label>
          <input value={education} onChange={(e) => setEducation(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. B.Sc. in CS" />
        </div>
        <div>
          <label className="block mb-1">Question Type</label>
          <select value={qType} onChange={(e) => setQType(e.target.value as any)} className="w-full p-2 border rounded">
            <option value="mixed">Mixed</option>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <button disabled={loading} onClick={fetchQuestions} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
          {loading ? "Generating..." : "Start Interview (Generate Questions)"}
        </button>
      </div>

      {questions.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Question {currentIdx + 1} / {questions.length}</h3>
            <p className="mt-2 p-4 bg-gray-100 rounded">{questions[currentIdx].text}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => playText(questions[currentIdx].text)} className="px-3 py-2 bg-indigo-600 text-white rounded">Play Question</button>
            <button disabled={isRecording} onClick={handleStartAnswer} className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed">Start Answer (mic)</button>
            <button disabled={!isRecording} onClick={handleStopAnswer} className="px-3 py-2 bg-red-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed">Stop Answer</button>
            <button onClick={handlePrev} className="px-3 py-2 bg-gray-300 rounded">Prev</button>
            <button onClick={handleNext} className="px-3 py-2 bg-gray-300 rounded">Next</button>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Transcribed Answer</label>
            <textarea value={transcript} readOnly className="w-full p-2 border rounded h-24" />
          </div>

          <div className="mb-6">
            <button onClick={finishInterview} className="px-4 py-2 bg-blue-700 text-white rounded">Finish Interview</button>
          </div>

          <div>
            <h4 className="font-semibold">Answers Summary</h4>
            <ol className="list-decimal ml-6">
              {questions.map((q, idx) => (
                <li key={idx} className="mb-2">
                  <div className="font-medium">{q.text}</div>
                  <div className="text-sm text-gray-700">Answer: {answers[idx] || "(no answer)"}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
