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

  // MODO VÍDEO (Padrão) - Responsivo para Landscape
  return (
    <div className="w-full h-full relative bg-black flex items-center justify-center">
      <div className="w-full h-full">
        <iframe 
          src={videoUrl?.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={lessonTitle}
        />
      </div>

      {/* Botão do Quiz - Posicionamento responsivo */}
      {quizId && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-20">
          <button
            onClick={() => setMode('quiz')}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all md:animate-pulse text-xs sm:text-sm md:text-base"
            aria-label="Iniciar Quiz"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden md:inline">Desafiar Conhecimento</span>
            <span className="md:hidden">Fazer Quiz</span>
          </button>
        </div>
      )}
    </div>
  )
}