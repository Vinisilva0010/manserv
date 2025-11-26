'use client'

import { useState } from 'react'
import { Trophy, X } from 'lucide-react' // Adicionei o ícone X
import { QuizEngine } from '@/components/classroom/quiz-engine'

interface QuizWrapperProps {
  userId: string
  lessonTitle: string
  videoUrl?: string
  quizId?: string
}

export default function QuizWrapper({ userId, lessonTitle, videoUrl, quizId }: QuizWrapperProps) {
  const [mode, setMode] = useState<'video' | 'quiz'>('video')

  // MODO QUIZ: TELA CHEIA (FULLSCREEN OVERLAY)
  if (mode === 'quiz' && quizId) {
    return (
      // fixed inset-0 z-50 = Cobre a tela toda e fica por cima de tudo
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
        {/* Botão de Fechar no topo (caso o usuário desista) */}
        <div className="absolute top-4 right-4 z-[101]">
          <button 
            onClick={() => setMode('video')}
            className="p-2 bg-slate-800/50 rounded-full text-white hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Engine do Quiz ocupando tudo */}
        <QuizEngine quizId={quizId} userId={userId} />
      </div>
    )
  }

  // MODO VÍDEO (Padrão)
  return (
    <div className="w-full h-full relative group bg-black flex flex-col justify-center">
      <div className="w-full aspect-video">
        <iframe 
          src={videoUrl?.replace('watch?v=', 'embed/')} 
          className="w-full h-full object-cover"
          allowFullScreen
          title={lessonTitle}
        />
      </div>

      {quizId && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
          <button
            onClick={() => setMode('quiz')}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all md:animate-pulse text-xs md:text-base"
          >
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline">Desafiar Conhecimento</span>
            <span className="md:hidden">Fazer Quiz</span>
          </button>
        </div>
      )}
    </div>
  )
}