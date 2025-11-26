import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PlayCircle, CheckCircle, Lock, ChevronRight, Trophy } from 'lucide-react'
import QuizWrapper from './quiz-wrapper' // Vamos criar esse pequeno arquivo já já

export default async function CoursePage({
  params,
}: {
  params: { courseId: string }
}) {
  const supabase = await createClient()
  
  // 1. Pegar usuário logado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Buscar Curso, Módulos, Aulas e se tem Quiz
  // Note a query profunda: lessons(*, quizzes(*))
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        *,
        lessons (
          *,
          quizzes (*)
        )
      )
    `)
    .eq('id', params.courseId)
    .order('order_index', { foreignTable: 'modules', ascending: true })
    .single()

  if (error || !course) {
    return <div className="p-8 text-white">Curso não encontrado.</div>
  }

  // Lógica simples: Vamos pegar a primeira aula do primeiro módulo como "Aula Atual" para teste
  // Num app real, você pegaria isso do histórico do usuário
  const currentModule = course.modules?.[0]
  const currentLesson = currentModule?.lessons?.sort((a: any, b: any) => a.order_index - b.order_index)[0]
  const quizData = currentLesson?.quizzes?.[0] // Pega o quiz se existir

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      
      {/* Coluna Esquerda: Player e Conteúdo */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-emerald-400 mb-4 inline-flex items-center gap-1">
            ← Voltar para Dashboard
          </Link>
          
          <h1 className="text-2xl font-bold text-white mb-6">{course.title}</h1>

          {/* ÁREA DO PLAYER / QUIZ */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            {/* Aqui usamos um Wrapper Client Component para gerenciar a troca Vídeo <-> Quiz */}
            <QuizWrapper 
              userId={user.id}
              lessonTitle={currentLesson?.title || 'Aula'}
              videoUrl={currentLesson?.video_url}
              quizId={quizData?.id} // Passa o ID do quiz se existir
            />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {currentLesson?.title || 'Selecione uma aula'}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Assista ao conteúdo completo antes de iniciar o desafio. 
              A pontuação deste módulo conta para seu certificado final.
            </p>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Sidebar (Playlist) */}
      <div className="w-96 bg-slate-900/50 border-l border-slate-800 hidden lg:flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-bold text-white">Conteúdo do Curso</h3>
          <p className="text-xs text-slate-500 mt-1">2 Módulos • 0% Concluído</p>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {course.modules?.map((module: any) => (
            <div key={module.id} className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                {module.title}
              </p>
              <div className="space-y-1">
                {module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => {
                  const isActive = lesson.id === currentLesson?.id
                  return (
                    <button 
                      key={lesson.id}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isActive 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'hover:bg-white/5 text-slate-400'
                      }`}
                    >
                      {isActive ? <PlayCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 opacity-50" />}
                      <span className="text-sm font-medium truncate flex-1">{lesson.title}</span>
                      {lesson.quizzes?.length > 0 && (
                        <Trophy className="w-3 h-3 text-yellow-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}