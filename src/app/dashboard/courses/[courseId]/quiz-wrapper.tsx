'use client'

import { useState } from 'react'
import { Play, Trophy } from 'lucide-react'
import { QuizEngine } from '@/components/classroom/quiz-engine' // O componente que sua IA criou

interface QuizWrapperProps {
  userId: string
  lessonTitle: string
  videoUrl?: string
  quizId?: string
}

export default function QuizWrapper({ userId, lessonTitle, videoUrl, quizId }: QuizWrapperProps) {
  const [mode, setMode] = useState<'video' | 'quiz'>('video')

  // Se o usuário clicou em jogar, mostra a Engine do Kahoot
  if (mode === 'quiz' && quizId) {
    return <QuizEngine quizId={quizId} userId={userId} />
  }

  return (
    <div className="w-full h-full relative group flex items-center justify-center bg-black">
      {/* 1. O Vídeo */}
      {videoUrl ? (
        <iframe 
          src={videoUrl?.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
          className="w-full h-full min-h-[250px] sm:min-h-[400px]"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={lessonTitle}
        />
      ) : (
        <div className="w-full h-full min-h-[250px] sm:min-h-[400px] flex items-center justify-center text-slate-400">
          <div className="text-center">
            <Play className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Vídeo não disponível</p>
          </div>
        </div>
      )}

      {/* 2. Overlay que convida para o Quiz (Só aparece se tiver quizId) */}
      {quizId && (
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-10">
          <button
            onClick={() => setMode('quiz')}
            className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary to-primary/80 text-slate-950 font-bold rounded-full sm:rounded-full text-xs sm:text-base shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform neon-glow"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Desafiar Conhecimento</span>
            <span className="sm:hidden">Desafio</span>
          </button>
        </div>
      )}
    </div>
  )
}