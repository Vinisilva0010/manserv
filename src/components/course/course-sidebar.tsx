'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlayCircle, CheckCircle, Lock, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  order_index: number | null
  is_locked?: boolean
  [key: string]: any
}

interface Module {
  id: string
  title: string
  order_index: number | null
  lessons: Lesson[]
  [key: string]: any
}

interface CourseSidebarProps {
  courseId: string
  modules: Module[]
  currentLessonId: string
}

export function CourseSidebar({ courseId, modules, currentLessonId }: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map(m => m.id)) // Expandir todos por padrão
  )

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const getLessonIcon = (lesson: Lesson, isCurrent: boolean) => {
    if (lesson.is_locked) {
      return <Lock className="w-4 h-4 text-muted-foreground" />
    }
    if (isCurrent) {
      return <PlayCircle className="w-4 h-4 text-primary" />
    }
    // Por enquanto, todas as aulas não bloqueadas são consideradas disponíveis
    // Futuramente, pode verificar se foi concluída
    return <CheckCircle className="w-4 h-4 text-muted-foreground" />
  }

  const getLessonStatus = (lesson: Lesson, isCurrent: boolean) => {
    if (lesson.is_locked) return 'locked'
    if (isCurrent) return 'current'
    return 'available'
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-custom sticky top-20">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Conteúdo do Curso</h3>
        
        <div className="space-y-2">
          {modules.map((module) => {
            const isExpanded = expandedModules.has(module.id)
            const lessons = module.lessons || []

            return (
              <div key={module.id} className="glass rounded-lg border border-white/10 overflow-hidden">
                {/* Header do Módulo */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="font-semibold text-foreground">{module.title}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'}
                    </span>
                  </div>
                </button>

                {/* Lista de Aulas */}
                {isExpanded && (
                  <div className="border-t border-white/10">
                    {lessons.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        Nenhuma aula disponível
                      </div>
                    ) : (
                      lessons.map((lesson, index) => {
                        const isCurrent = lesson.id === currentLessonId
                        const status = getLessonStatus(lesson, isCurrent)
                        const href = `/dashboard/courses/${courseId}?lessonId=${lesson.id}`

                        return (
                          <Link
                            key={lesson.id}
                            href={href}
                            className={cn(
                              "flex items-center gap-3 p-4 border-b border-white/5 last:border-b-0 transition-colors",
                              isCurrent && "bg-primary/10 border-l-2 border-l-primary",
                              !lesson.is_locked && !isCurrent && "hover:bg-white/5",
                              lesson.is_locked && "opacity-60 cursor-not-allowed"
                            )}
                            onClick={(e) => {
                              if (lesson.is_locked) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <div className="flex-shrink-0">
                              {getLessonIcon(lesson, isCurrent)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-mono">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <span
                                  className={cn(
                                    "text-sm truncate",
                                    isCurrent && "text-primary font-semibold",
                                    !isCurrent && !lesson.is_locked && "text-foreground",
                                    lesson.is_locked && "text-muted-foreground"
                                  )}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                            </div>
                          </Link>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

