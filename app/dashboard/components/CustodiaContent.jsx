'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Box, Activity, Menu } from 'lucide-react'
import Lockers from '../../pages/lockers/components/LockerGrid'
import LockerStatusTable from '../../pages/lockerStatusTable/components/LockerTable'
import UserActivity from '../../pages/userActivity/userActivity'

const tabIcons = {
  lockers: <Box className="w-5 h-5" />,
  status: <Activity className="w-5 h-5" />,
  activity: <Menu className="w-5 h-5" />
}

export default function CustodiaContent() {
  const [activeTab, setActiveTab] = useState("lockers")

  return (
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
  )
}