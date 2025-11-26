'use client'

import { useState, useEffect } from 'react'

interface Lesson {
  id: string
  title: string
  video_url: string | null
  [key: string]: any
}

interface CoursePlayerProps {
  lesson: Lesson
}

export function CoursePlayer({ lesson }: CoursePlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!lesson.video_url) {
      setVideoUrl(null)
      return
    }

    // Verificar se é URL do YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = lesson.video_url.match(youtubeRegex)
    
    if (match && match[1]) {
      // Converter para embed URL
      setVideoUrl(`https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`)
    } else if (lesson.video_url.includes('youtube.com/embed') || lesson.video_url.includes('youtu.be')) {
      // Já é uma URL de embed ou precisa de conversão
      if (lesson.video_url.includes('youtu.be/')) {
        const videoId = lesson.video_url.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) {
          setVideoUrl(`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`)
        } else {
          setVideoUrl(lesson.video_url)
        }
      } else {
        setVideoUrl(lesson.video_url)
      }
    } else {
      // Assumir que é uma URL de vídeo direta
      setVideoUrl(lesson.video_url)
    }
  }, [lesson.video_url])

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10">
      <div className="relative aspect-video w-full bg-black">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Vídeo não disponível</p>
              <p className="text-sm text-muted-foreground/70">
                {lesson.video_url ? 'URL de vídeo inválida' : 'Nenhum vídeo cadastrado para esta aula'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

