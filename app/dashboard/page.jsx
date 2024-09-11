'use client'

import { useState, useEffect } from 'react'
import CustodiaHeader from './components/CustodiaHeader'
import CustodiaContent from './components/CustodiaContent'
import ServiceSelectionDialog from './components/ServiceSelectionDialog'

export default function Custodia() {
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    setIsDialogOpen(true)
  }, [])

  const handleServiceSelection = (service) => {
    setSelectedService(service)
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 md:p-8">
      <ServiceSelectionDialog isOpen={isDialogOpen} onServiceSelect={handleServiceSelection} />
      <CustodiaHeader selectedService={selectedService} />
      <CustodiaContent />
    </div>
  )
}