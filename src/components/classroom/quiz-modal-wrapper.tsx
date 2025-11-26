'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'
import { QuizModal } from './quiz-modal'

interface QuizModalWrapperProps {
  quizId: string
  userId: string
}

export function QuizModalWrapper({ quizId, userId }: QuizModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleComplete = (totalScore: number) => {
    console.log('Quiz concluído! Pontuação:', totalScore)
    // Aqui você pode adicionar lógica adicional, como atualizar progresso, etc.
  }

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full neon-glow hover:neon-glow-strong"
      >
        <Trophy className="w-5 h-5 mr-2" />
        Iniciar Quiz
      </Button>

      <QuizModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        quizId={quizId}
        userId={userId}
        onComplete={handleComplete}
      />
    </>
  )
}

