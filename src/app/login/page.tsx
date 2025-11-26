'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { login, signup, FormState } from './actions' // Importamos o tipo FormState
import { Button } from '@/components/ui/button'
import { Mail, Lock, Shield, AlertCircle } from 'lucide-react'

// Definimos o estado inicial explicitamente
const initialState: FormState = {
  error: null,
  success: false
}

function SubmitButton({ isSignup }: { isSignup: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button
      type="submit"
      // Se não tiver o variant="primary", usamos uma classe padrão do Tailwind
      className={`w-full mt-6 ${pending ? 'opacity-70 cursor-not-allowed' : ''} bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold`}
      disabled={pending}
    >
      {pending ? 'Processando...' : isSignup ? 'Criar Conta' : 'Entrar'}
    </Button>
  )
}

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  
  // Agora passamos o initialState tipado, resolvendo o erro do TypeScript
  const [loginState, loginAction] = useFormState(login, initialState)
  const [signupState, signupAction] = useFormState(signup, initialState)
  
  const currentState = isSignup ? signupState : loginState
  const currentAction = isSignup ? signupAction : loginAction

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl backdrop-blur-md bg-white/5">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500/20 p-4 rounded-full mb-4 neon-glow border border-emerald-500/30">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Manserv Safety
          </h1>
          <p className="text-sm text-slate-400">
            {isSignup ? 'Crie sua conta corporativa' : 'Acesse o painel de treinamento'}
          </p>
        </div>

        {/* Alerta de Erro */}
        {currentState?.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{currentState.error}</p>
          </div>
        )}

        {/* Form */}
        <form action={currentAction} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu.nome@manserv.com.br"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Confirm Password (apenas no signup) */}
          {isSignup && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          <SubmitButton isSignup={isSignup} />
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isSignup ? (
              <>
                Já tem uma conta? <span className="text-emerald-500 font-medium">Entrar</span>
              </>
            ) : (
              <>
                Não tem uma conta? <span className="text-emerald-500 font-medium">Criar conta</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}