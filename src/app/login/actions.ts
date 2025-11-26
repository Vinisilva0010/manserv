'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export interface FormState {
  error: string | null
  success?: boolean
}

export async function login(prevState: FormState | null, formData: FormData): Promise<FormState> {
  // O .trim() remove espaços antes e depois do email
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email ou senha incorretos.' }
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: FormState | null, formData: FormData): Promise<FormState> {
  // AQUI O SEGREDO: .trim()
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'As senhas não coincidem.' }
  }

  if (password.length < 6) {
    return { error: 'A senha deve ter no mínimo 6 caracteres.' }
  }

  const supabase = await createClient()

  // Atenção: Configurei para NÃO precisar confirmar email no ambiente de desenvolvimento
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Isso força o redirecionamento correto
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Supabase Error:', error)
    // Tratamento melhor da mensagem de erro
    if (error.message.includes('invalid')) {
       return { error: 'Formato de email inválido.' }
    }
    if (error.message.includes('already registered')) {
       return { error: 'Este email já está cadastrado.' }
    }
    return { error: 'Erro ao criar conta. Tente novamente.' }
  }
  
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}