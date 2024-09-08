'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Box, Activity, Menu } from 'lucide-react'
import Lockers from '../pages/lockers/lockers'
import LockerStatusTable from '../pages/lockerStatusTable/lockerStatusTable'
import UserActivity from '../pages/userActivity/userActivity'
import ServiceSelectionDialog from '../ServiceSelectionDialog'

export default function Custodia() {
  const [activeTab, setActiveTab] = useState("lockers")
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    setIsDialogOpen(true)
  }, [])

  const handleServiceSelection = (service) => {
    setSelectedService(service)
    setIsDialogOpen(false)
  }

  const tabIcons = {
    lockers: <Box className="w-5 h-5" />,
    status: <Activity className="w-5 h-5" />,
    activity: <Menu className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 md:p-8">
      <ServiceSelectionDialog isOpen={isDialogOpen} onServiceSelect={handleServiceSelection} />
      
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
      
      <Card className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border-2 border-purple-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-purple-100">
            {['lockers', 'status', 'activity'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="py-3 data-[state=active]:bg-white data-[state=active]:text-purple-700 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center space-x-2">
                  {tabIcons[tab]}
                  <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <CardContent className="p-6">
            <TabsContent value="lockers">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Lockers />
              </motion.div>
            </TabsContent>
            <TabsContent value="status">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <LockerStatusTable />
              </motion.div>
            </TabsContent>
            <TabsContent value="activity">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <UserActivity />
              </motion.div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}