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
    <div className="w-full h-full relative group">
      {/* 1. O Vídeo (Simulado com Iframe ou Imagem) */}
      <iframe 
        src={videoUrl?.replace('watch?v=', 'embed/')} 
        className="w-full h-full object-cover"
        allowFullScreen
        title={lessonTitle}
      />

      {/* 2. Overlay que convida para o Quiz (Só aparece se tiver quizId) */}
      {quizId && (
        <div className="absolute bottom-6 right-6 z-10">
          <button
            onClick={() => setMode('quiz')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform animate-pulse"
          >
            <Trophy className="w-5 h-5" />
            Desafiar Conhecimento
          </button>
        </div>
      )}
    </div>
  )
}