import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Award, 
  LogOut, 
  Shield 
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Verificar se o usuário está logado. Se não, chuta pro login.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl flex flex-col fixed h-full z-10">
        
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">Manserv Safety</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Visão Geral</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Meus Cursos</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Ranking</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Award className="w-5 h-5" />
            <span className="font-medium">Certificados</span>
          </a>
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-slate-500">Aluno</p>
            </div>
          </div>
          
          <form action={signOut}>
            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}