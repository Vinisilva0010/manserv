'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ArrowRight, CheckCircle, XCircle, Download } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CertificateDocument } from '@/components/certificate/certificate-document'

// ... (Interfaces continuam iguais, vou ocultar pra economizar espaço, mas mantenha elas)
interface Answer { id: string; answer_text: string; is_correct: boolean }
interface Question { id: string; question_text: string; time_limit_seconds: number; points: number; answers: Answer[] }
interface QuizEngineProps { quizId: string; userId: string }

export function QuizEngine({ quizId, userId }: QuizEngineProps) {
  // ... (Estados continuam iguais)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameState, setGameState] = useState<'loading' | 'intro' | 'playing' | 'feedback' | 'finished'>('loading')
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('Aluno Manserv')
  const [courseTitle, setCourseTitle] = useState('NR-10')
  const supabase = createClient()

  // ... (UseEffects e funções lógicas continuam iguais)
  useEffect(() => {
    async function fetchData() {
      const { data: quizData } = await supabase.from('questions').select('*, answers(*)').eq('quiz_id', quizId).order('order_index', { ascending: true })
      if (quizData) { setQuestions(quizData); setGameState('intro') }
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userId).single()
      if (profile?.full_name) setStudentName(profile.full_name)
    }
    fetchData()
  }, [quizId, userId])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (gameState === 'playing' && timeLeft === 0) { handleTimeUp() }
  }, [gameState, timeLeft])

  const startGame = () => { setCurrentQuestionIndex(0); setScore(0); loadQuestion(0) }
  const loadQuestion = (index: number) => { const q = questions[index]; setTimeLeft(q.time_limit_seconds); setSelectedAnswerId(null); setGameState('playing') }
  const handleAnswer = (answer: Answer) => {
    if (gameState !== 'playing') return
    setSelectedAnswerId(answer.id); setGameState('feedback')
    if (answer.is_correct) { const bonus = timeLeft * 10; setScore((prev) => prev + questions[currentQuestionIndex].points + bonus) }
  }
  const handleTimeUp = () => setGameState('feedback')
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) { setCurrentQuestionIndex((prev) => prev + 1); loadQuestion(currentQuestionIndex + 1) } 
    else { finishGame() }
  }
  const finishGame = async () => { setGameState('finished'); await supabase.from('quiz_attempts').insert({ user_id: userId, quiz_id: quizId, score: score, passed: true }) }

  // --- RENDERIZAÇÃO MELHORADA ---

  if (gameState === 'loading') return <div className="flex items-center justify-center h-full text-white">Carregando...</div>

  // Intro Centralizada
  if (gameState === 'intro') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-950">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 neon-glow">
        <Trophy className="w-10 h-10 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">Hora do Desafio</h2>
      <p className="text-slate-400 mb-8 max-w-xs mx-auto">
        Responda rápido para garantir sua pontuação máxima.
      </p>
      <button onClick={startGame} className="w-full max-w-xs py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl text-lg hover:scale-105 transition-transform">
        INICIAR
      </button>
    </div>
  )

  // Final Centralizado
  if (gameState === 'finished') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-950">
      <h2 className="text-3xl font-bold text-white mb-2">Parabéns!</h2>
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 my-8">
        {score}
      </div>
      <div className="w-full max-w-xs space-y-4">
        <PDFDownloadLink
          document={<CertificateDocument studentName={studentName} courseTitle={courseTitle} score={score} completedDate={new Date().toLocaleDateString('pt-BR')} />}
          fileName="Certificado_Manserv.pdf"
          className="flex items-center justify-center gap-2 w-full py-4 bg-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg"
        >
          {({ loading }) => (loading ? 'Gerando...' : 'BAIXAR CERTIFICADO')}
        </PDFDownloadLink>
        <button onClick={() => window.location.reload()} className="text-slate-400 underline pt-4">Jogar Novamente</button>
      </div>
    </div>
  )

  const currentQuestion = questions[currentQuestionIndex]

  // JOGO: Layout Flexível com Scroll se precisar
  return (
    <div className="h-full flex flex-col bg-slate-950 text-white overflow-y-auto safe-area-padding">
      {/* Top Bar Fixa visualmente */}
      <div className="p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400 text-sm">Questão {currentQuestionIndex + 1}/{questions.length}</span>
          <div className="bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-400 font-bold text-sm">
            {score} pts
          </div>
        </div>
        {/* Barra Timer */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / currentQuestion.time_limit_seconds) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-cyan-400'}`}
          />
        </div>
      </div>

      {/* Área Central (Pergunta + Botões) */}
      <div className="flex-1 flex flex-col justify-center p-4 min-h-0">
        
        {/* Pergunta */}
        <div className="mb-6 flex-shrink-0">
          <h3 className="text-xl md:text-3xl font-bold text-center leading-snug">
            {currentQuestion.question_text}
          </h3>
        </div>

        {/* Botões - Scrollavel se for muito alto */}
        <div className="space-y-3 pb-24 md:pb-0 overflow-y-auto">
          {currentQuestion.answers.map((answer) => {
             let style = "bg-slate-800 border-slate-700"
             if (gameState === 'feedback') {
               if (answer.is_correct) style = "bg-emerald-500/20 border-emerald-500 text-emerald-400"
               else if (selectedAnswerId === answer.id) style = "bg-red-500/20 border-red-500 text-red-400"
               else style = "opacity-40 grayscale"
             }
            return (
              <button 
                key={answer.id} 
                disabled={gameState === 'feedback'} 
                onClick={() => handleAnswer(answer)} 
                className={`w-full p-4 rounded-xl border-2 text-left transition-all active:scale-95 flex items-center justify-between min-h-[70px] ${style}`}
              >
                <span className="text-sm md:text-lg font-medium pr-2">{answer.answer_text}</span>
                {gameState === 'feedback' && answer.is_correct && <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />}
                {gameState === 'feedback' && !answer.is_correct && selectedAnswerId === answer.id && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Botão Próxima (Fixo embaixo) */}
      <AnimatePresence>
        {gameState === 'feedback' && (
          <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="fixed bottom-6 left-0 right-0 px-4 z-[102] flex justify-center">
            <button onClick={nextQuestion} className="w-full max-w-sm py-4 bg-white text-slate-950 font-bold rounded-xl shadow-2xl text-lg flex items-center justify-center gap-2">
              {currentQuestionIndex + 1 === questions.length ? 'VER RESULTADO' : 'PRÓXIMA'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}