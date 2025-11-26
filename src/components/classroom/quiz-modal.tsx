'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { QuizEngine } from './quiz-engine'
import { Button } from '@/components/ui/button'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  quizId: string
  userId: string
  onComplete?: (totalScore: number) => void
}

export function QuizModal({ isOpen, onClose, quizId, userId, onComplete }: QuizModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-custom">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Quiz Content */}
              <QuizEngine
                quizId={quizId}
                userId={userId}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

