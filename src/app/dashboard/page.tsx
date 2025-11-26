import { createClient } from '@/utils/supabase/server'
import { Play, Clock, Award } from 'lucide-react'
import { CourseCard } from '@/components/dashboard/course-card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar cursos publicados
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Bem-vindo, <span className="text-primary">Time Manserv</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">Seu progresso de segurança hoje salva vidas amanhã.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">+12%</span>
          </div>
          <p className="text-slate-400 text-sm">Cursos em Andamento</p>
          <p className="text-3xl font-bold text-white mt-1">0</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Horas Treinadas</p>
          <p className="text-3xl font-bold text-white mt-1">0h</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Certificados</p>
          <p className="text-3xl font-bold text-white mt-1">0</p>
        </div>
      </div>

      {/* Courses Section */}
      {courses && courses.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Cursos Disponíveis</h2>
            <span className="text-sm text-muted-foreground">
              {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-slate-700 rounded-2xl p-12 text-center bg-slate-900/30">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum curso disponível</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            {error 
              ? 'Erro ao carregar cursos. Tente novamente mais tarde.'
              : 'Não há cursos publicados no momento. Verifique novamente mais tarde.'}
          </p>
        </div>
      )}
    </div>
  )
}