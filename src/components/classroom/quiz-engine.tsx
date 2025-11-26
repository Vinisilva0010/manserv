'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ArrowRight, CheckCircle, XCircle, Download } from 'lucide-react'
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
  
  // Dados certificado
  const [studentName, setStudentName] = useState('Aluno Manserv')
  const [courseTitle, setCourseTitle] = useState('NR-10')

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: quizData } = await supabase
        .from('questions')
        .select('*, answers(*)')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true })

      if (quizData) {
        setQuestions(quizData)
        setGameState('intro')
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()
      
      if (profile?.full_name) setStudentName(profile.full_name)
      setCourseTitle('NR-10: Segurança em Instalações Elétricas')
    }
    fetchData()
  }, [quizId, userId])

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

  const handleTimeUp = () => setGameState('feedback')

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

  if (gameState === 'loading') return <div className="text-white p-4">Carregando...</div>

  // Tela de Intro (Mobile Friendly)
  if (gameState === 'intro') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-slate-950">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 neon-glow animate-pulse">
        <Trophy className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
      </div>
      <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Desafio de Conhecimento</h2>
      <p className="text-sm md:text-base text-slate-400 mb-6 max-w-md">
        {questions.length} perguntas rápidas valendo certificado.
      </p>
      <button onClick={startGame} className="w-full md:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-base transition-transform active:scale-95">
        Começar Agora
      </button>
    </div>
  )

  // Tela Final (Mobile Friendly)
  if (gameState === 'finished') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-slate-950">
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Parabéns!</h2>
      <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 my-6">
        {score} <span className="text-lg text-slate-500">pts</span>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <PDFDownloadLink
          document={<CertificateDocument studentName={studentName} courseTitle={courseTitle} score={score} completedDate={new Date().toLocaleDateString('pt-BR')} />}
          fileName="Certificado_Manserv.pdf"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg active:scale-95"
        >
          {({ loading }) => (loading ? 'Gerando...' : <><Download className="w-5 h-5" /> Baixar Certificado</>)}
        </PDFDownloadLink>

        <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-white text-sm py-2">
          Jogar Novamente
        </button>
      </div>
    </div>
  )

  const currentQuestion = questions[currentQuestionIndex]

  // Tela do Jogo (Otimizada)
  return (
    <div className="relative h-full flex flex-col p-4 bg-slate-950 text-white overflow-y-auto">
      {/* Header Compacto */}
      <div className="flex justify-between items-center mb-4 text-xs md:text-sm">
        <span className="text-slate-400">Q. {currentQuestionIndex + 1}/{questions.length}</span>
        <span className="flex items-center gap-1 text-emerald-400 font-bold"><Trophy className="w-3 h-3" />{score}</span>
      </div>

      {/* Barra de Tempo */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden flex-shrink-0">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / currentQuestion.time_limit_seconds) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
          className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-cyan-400'}`}
        />
      </div>

      {/* Pergunta e Respostas */}
      <div className="flex-1 flex flex-col">
        {/* Pergunta: Tamanho ajustável para não cortar em telas pequenas */}
        <h3 className="text-lg md:text-3xl font-bold text-center mb-6 md:mb-12 leading-tight">
          {currentQuestion.question_text}
        </h3>
        
        {/* Grid vira Pilha no Mobile (grid-cols-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20"> 
          {currentQuestion.answers.map((answer) => {
             let buttonStyle = "bg-slate-800/50 border-slate-700 active:bg-slate-700"
             if (gameState === 'feedback') {
               if (answer.is_correct) buttonStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400"
               else if (selectedAnswerId === answer.id) buttonStyle = "bg-red-500/20 border-red-500 text-red-400"
               else buttonStyle = "opacity-30 grayscale"
             }
            return (
              <button 
                key={answer.id} 
                disabled={gameState === 'feedback'} 
                onClick={() => handleAnswer(answer)} 
                className={`p-4 md:p-6 rounded-xl border min-h-[80px] text-left transition-all ${buttonStyle} flex items-center justify-between`}
              >
                <span className="font-medium text-sm md:text-lg pr-2 leading-snug">{answer.answer_text}</span>
                {gameState === 'feedback' && answer.is_correct && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                {gameState === 'feedback' && !answer.is_correct && selectedAnswerId === answer.id && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Botão Flutuante Próxima */}
      <AnimatePresence>
        {gameState === 'feedback' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-6 right-6 md:absolute">
            <button onClick={nextQuestion} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-full shadow-xl active:scale-95">
              {currentQuestionIndex + 1 === questions.length ? 'Concluir' : 'Próxima'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}