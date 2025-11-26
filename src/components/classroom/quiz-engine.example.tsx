/**
 * EXEMPLO DE USO DO QUIZ ENGINE
 * 
 * Este arquivo mostra como usar o componente QuizEngine em uma página de aula.
 * 
 * Estrutura esperada do banco de dados:
 * 
 * - quizzes (id, title, description, lesson_id)
 * - questions (id, quiz_id, text, points, time_limit, order_index)
 * - answers (id, question_id, text, is_correct, order_index)
 * - quiz_attempts (id, quiz_id, user_id, total_score, completed_at)
 */

'use client'

import { QuizEngine } from './quiz-engine'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export function ExampleQuizUsage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [quizId, setQuizId] = useState<string>('your-quiz-id')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [])

  const handleQuizComplete = (totalScore: number) => {
    console.log('Quiz concluído! Pontuação:', totalScore)
    // Aqui você pode redirecionar, atualizar estado, etc.
  }

  if (!userId) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-6">
      <QuizEngine
        quizId={quizId}
        userId={userId}
        onComplete={handleQuizComplete}
      />
    </div>
  )
}

/**
 * INTEGRAÇÃO NA PÁGINA DE AULA:
 * 
 * No arquivo src/app/dashboard/courses/[courseId]/page.tsx,
 * você pode adicionar o quiz após o conteúdo da aula:
 * 
 * ```tsx
 * import { QuizEngine } from '@/components/classroom/quiz-engine'
 * 
 * // Dentro do componente, após o conteúdo da aula:
 * {currentLesson.quiz_id && (
 *   <div className="mt-8">
 *     <QuizEngine
 *       quizId={currentLesson.quiz_id}
 *       userId={user.id}
 *       onComplete={(score) => {
 *         // Atualizar progresso, etc.
 *       }}
 *     />
 *   </div>
 * )}
 * ```
 */

