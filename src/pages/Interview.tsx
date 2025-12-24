import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import api from "../services/api"
import Swal from "sweetalert2"
import { isAxiosError } from "axios"

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
      const response = await api.post("/interview/create", {
        role,
        experience,
        education,
        type: qType
      });

      const data = response.data;
      const generated = Array.isArray(data.questions) ? data.questions.map((q: string) => ({ text: q })) : []

      if (!generated.length) {
        Swal.fire({
          icon: 'warning',
          title: 'No Questions Generated',
          text: 'AI did not return any questions. Please try again later.',
          confirmButtonColor: '#F59E0B'
        });
        return
      }

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
      let message = "AI service is unavailable right now. Please try again later."
      if (isAxiosError(err)) {
        message = (err.response?.data as { message?: string } | undefined)?.message || message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false)
    }
  }

  const handleStartAnswer = () => {
    const recognition = recognitionRef.current
    if (!recognition) {
      Swal.fire('Not Supported', 'SpeechRecognition not supported in this browser.', 'error');
      return;
    }
    if (!questions.length) {
      Swal.fire('No Questions', 'Generate questions first.', 'warning');
      return;
    }
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
    const answered = answers.filter(Boolean).length
    const total = questions.length

    Swal.fire({
      icon: 'success',
      title: 'Interview Finished',
      text: `Score: ${answered}/${total}`,
      confirmButtonText: 'Go Home',
      confirmButtonColor: '#3B82F6'
    }).then(() => {
      navigate("/home", { replace: true })
    });
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 space-y-8 dark:bg-white/10 dark:backdrop-blur-xl dark:ring-1 dark:ring-white/10 dark:border-transparent">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-heading-gradient">Please Login</h1>
            <p className="text-sm text-slate-600 dark:text-blue_slate-800">Login to access the interview simulation.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl border border-gray-100/80 p-10 space-y-8 backdrop-blur-sm dark:bg-white/10 dark:border-white/10">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-heading-gradient drop-shadow">Interview Simulation</h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-blue_slate-800 max-w-2xl mx-auto">Practice with AI-generated questions and get instant feedback. Fill in your details to start.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">Job Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40" placeholder="e.g. Frontend Engineer" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">Experience Level</label>
            <input value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40" placeholder="e.g. 3 years" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">Education Level</label>
            <input value={education} onChange={(e) => setEducation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40" placeholder="e.g. B.Sc. in CS" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">Question Type</label>
            <select value={qType} onChange={(e) => setQType(e.target.value as any)} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40">
              <option value="mixed">Mixed</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
            </select>
          </div>
        </div>

        <div className="mb-6 text-center">
          <button disabled={loading} onClick={fetchQuestions} className="btn-primary-gradient px-8 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise_surf-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Generating..." : "Start Interview (Generate Questions)"}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="mb-4 text-center">
              <h3 className="text-xl font-semibold text-heading-gradient">Question {currentIdx + 1} / {questions.length}</h3>
              <p className="mt-2 p-4 bg-gray-100 rounded-xl text-gray-900 dark:bg-white/10 dark:text-lavender_grey-900 shadow-sm">{questions[currentIdx].text}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <button onClick={() => playText(questions[currentIdx].text)} className="px-4 py-2 rounded-xl font-semibold shadow transition bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white hover:brightness-110">Play Question</button>
              <button disabled={isRecording} onClick={handleStartAnswer} className="px-4 py-2 rounded-xl font-semibold shadow transition bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110">Start Answer (mic)</button>
              <button disabled={!isRecording} onClick={handleStopAnswer} className="px-4 py-2 rounded-xl font-semibold shadow transition bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110">Stop Answer</button>
              <button onClick={handlePrev} className="px-4 py-2 rounded-xl font-semibold shadow transition bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-gray-900 hover:brightness-110">Prev</button>
              <button onClick={handleNext} className="px-4 py-2 rounded-xl font-semibold shadow transition bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white hover:brightness-110">Next</button>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-blue_slate-800">Transcribed Answer</label>
              <textarea value={transcript} readOnly className="w-full p-3 border rounded-xl h-24 bg-white text-light_text dark:bg-white/10 dark:text-lavender_grey-900 shadow-sm" />
            </div>

            <div className="mb-6 text-center">
              <button onClick={finishInterview} className="btn-primary-gradient px-8 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise_surf-600 transition">Finish Interview</button>
            </div>

            <div>
              <h4 className="font-semibold text-heading-gradient mb-2">Answers Summary</h4>
              <ol className="list-decimal ml-6">
                {questions.map((q, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="font-medium">{q.text}</div>
                    <div className="text-sm text-gray-700 dark:text-blue_slate-800">Answer: {answers[idx] || "(no answer)"}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
