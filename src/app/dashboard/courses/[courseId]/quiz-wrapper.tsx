'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { QuizEngine } from '@/components/classroom/quiz-engine'

interface QuizWrapperProps {
  userId: string
  lessonTitle: string
  videoUrl?: string
  quizId?: string
}

export default function QuizWrapper({ userId, lessonTitle, videoUrl, quizId }: QuizWrapperProps) {
  const [mode, setMode] = useState<'video' | 'quiz'>('video')

  // Se estiver no modo Quiz, renderiza a Engine ocupando altura total
  if (mode === 'quiz' && quizId) {
    return (
      <div className="w-full h-full bg-slate-950">
        <QuizEngine quizId={quizId} userId={userId} />
      </div>
    )
  }

  return (
    <div className="w-full h-full relative group bg-black flex flex-col justify-center">
      {/* 1. O Vídeo Responsivo */}
      {/* aspect-video garante o formato 16:9 tanto no mobile quanto desktop */}
      <div className="w-full aspect-video">
        <iframe 
          src={videoUrl?.replace('watch?v=', 'embed/')} 
          className="w-full h-full object-cover"
          allowFullScreen
          title={lessonTitle}
        />
      </div>

      {/* 2. Botão de Ação (Ajustado para Mobile) */}
      {quizId && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
          <button
            onClick={() => setMode('quiz')}
            // Mobile: Botão menor (text-xs), menos padding (py-2), sem animação pesada
            // Desktop (md): Botão maior, animação de pulse
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