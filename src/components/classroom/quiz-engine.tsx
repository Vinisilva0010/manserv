'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Timer, ArrowRight, CheckCircle, XCircle, Download } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CertificateDocument } from '@/components/certificate/certificate-document'

interface Answer {
  id: string
  answer_text: string
  is_correct: boolean
}

interface Question {
  id: string
  question_text: string
  time_limit_seconds: number
  points: number
  answers: Answer[]
}

interface QuizEngineProps {
  quizId: string
  userId: string
}

export function QuizEngine({ quizId, userId }: QuizEngineProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameState, setGameState] = useState<'loading' | 'intro' | 'playing' | 'feedback' | 'finished'>('loading')
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  
  // Dados para o Certificado
  const [studentName, setStudentName] = useState('Aluno Manserv')
  const [courseTitle, setCourseTitle] = useState('Treinamento de Segurança')

  const supabase = createClient()

  // 1. Busca os dados do Quiz e do Usuário
  useEffect(() => {
    async function fetchData() {
      // Pega perguntas
      const { data: quizData } = await supabase
        .from('questions')
        .select('*, answers(*)')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true })

      if (quizData) {
        setQuestions(quizData)
        setGameState('intro')
      }

      // Pega nome do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()
      
      if (profile?.full_name) setStudentName(profile.full_name)

      // Tenta pegar o nome do curso (via relacionamento reverso seria ideal, mas vamos mockar ou pegar do quiz)
      // Simplificação: Assume NR-10 pelo contexto, num app real passariamos via props
      setCourseTitle('NR-10: Segurança em Instalações Elétricas')
    }
    fetchData()
  }, [quizId, userId])

  // 2. Cronômetro
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeUp()
    }
  }, [gameState, timeLeft])

  const startGame = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    loadQuestion(0)
  }

  const loadQuestion = (index: number) => {
    const q = questions[index]
    setTimeLeft(q.time_limit_seconds)
    setSelectedAnswerId(null)
    setGameState('playing')
  }

  const handleAnswer = (answer: Answer) => {
    if (gameState !== 'playing') return
    
    setSelectedAnswerId(answer.id)
    setGameState('feedback')

    if (answer.is_correct) {
      const bonus = timeLeft * 10
      setScore((prev) => prev + questions[currentQuestionIndex].points + bonus)
    }
  }

  const handleTimeUp = () => {
    setGameState('feedback')
  }

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1)
      loadQuestion(currentQuestionIndex + 1)
    } else {
      finishGame()
    }
  }

  const finishGame = async () => {
    setGameState('finished')
    await supabase.from('quiz_attempts').insert({
      user_id: userId,
      quiz_id: quizId,
      score: score,
      passed: true
    })
  }

  // --- RENDERIZAÇÃO ---

  if (gameState === 'loading') return <div className="text-white p-8">Carregando desafio...</div>

  if (gameState === 'intro') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-950">
      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 neon-glow animate-pulse">
        <Trophy className="w-12 h-12 text-emerald-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Desafio de Conhecimento</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        Você terá {questions.length} perguntas. Responda rápido para garantir seu certificado.
      </p>
      <button onClick={startGame} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-lg transition-transform hover:scale-105">
        Começar Agora
      </button>
    </div>
  )

  if (gameState === 'finished') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-950">
      <h2 className="text-4xl font-bold text-white mb-2">Parabéns!</h2>
      <p className="text-slate-400 mb-6">Você concluiu o módulo com êxito.</p>
      
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8">
        {score} pts
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* BOTÃO DE CERTIFICADO */}
        <PDFDownloadLink
          document={
            <CertificateDocument 
              studentName={studentName}
              courseTitle={courseTitle}
              score={score}
              completedDate={new Date().toLocaleDateString('pt-BR')}
            />
          }
          fileName={`Certificado_Manserv_${studentName}.pdf`}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
        >
          {({ loading }) => (loading ? 'Gerando PDF...' : (
            <>
              <Download className="w-5 h-5" />
              Baixar Certificado Oficial
            </>
          ))}
        </PDFDownloadLink>

        <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-white text-sm mt-4">
          Jogar Novamente
        </button>
      </div>
    </div>
  )

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="relative h-full flex flex-col p-6 bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-slate-400">Questão {currentQuestionIndex + 1} de {questions.length}</div>
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold"><Trophy className="w-4 h-4" />{score} pts</div>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / currentQuestion.time_limit_seconds) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
          className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-cyan-400'}`}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">{currentQuestion.question_text}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer) => {
             let buttonStyle = "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
             if (gameState === 'feedback') {
               if (answer.is_correct) buttonStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400"
               else if (selectedAnswerId === answer.id) buttonStyle = "bg-red-500/20 border-red-500 text-red-400"
               else buttonStyle = "opacity-50 grayscale"
             }
            return (
              <button key={answer.id} disabled={gameState === 'feedback'} onClick={() => handleAnswer(answer)} className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${buttonStyle}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{answer.answer_text}</span>
                  {gameState === 'feedback' && answer.is_correct && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                  {gameState === 'feedback' && !answer.is_correct && selectedAnswerId === answer.id && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {gameState === 'feedback' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-6 right-6">
            <button onClick={nextQuestion} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
              {currentQuestionIndex + 1 === questions.length ? 'Concluir' : 'Próxima Questão'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}