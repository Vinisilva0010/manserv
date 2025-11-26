import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  [key: string]: any
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const imageUrl = course.cover_image || 'https://placehold.co/800x450/1e293b/00ff9d?text=Curso'
  const description = course.description || 'Sem descrição disponível.'
  
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Progress Bar (fictícia por enquanto) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-primary font-mono">0%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Footer Button */}
        <Link href={`/dashboard/courses/${course.id}`}>
          <Button 
            variant="primary" 
            size="default" 
            className="w-full group-hover:neon-glow-strong"
          >
            <Play className="w-4 h-4 mr-2" />
            Acessar Curso
          </Button>
        </Link>
      </div>
    </div>
  )
}

