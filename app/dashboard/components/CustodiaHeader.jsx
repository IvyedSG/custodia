'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Sparkles } from 'lucide-react'

export default function CustodiaHeader({ selectedService }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        Custodia
        <Sparkles className="inline-block ml-2 text-yellow-400" />
      </h1>
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="secondary" className="text-sm md:text-base px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              {selectedService.name} - Encargado: {selectedService.manager}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}