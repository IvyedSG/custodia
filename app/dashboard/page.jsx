"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Lockers from '../register/lockers';
import LockerStatusTable from '../register/LockerStatusTable';
import UserActivity from '../register/UserActivity';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-6 space-x-4">
        <Button
          onClick={() => setActiveTab('register')}
          className={`w-full max-w-xs h-14 text-lg font-semibold ${activeTab === 'register' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white'}`}
        >
          Register
        </Button>
        <Button
          onClick={() => setActiveTab('lockers')}
          className={`w-full max-w-xs h-14 text-lg font-semibold ${activeTab === 'lockers' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white'}`}
        >
          Lockers
        </Button>
        <Button
          onClick={() => setActiveTab('activity')}
          className={`w-full max-w-xs h-14 text-lg font-semibold ${activeTab === 'activity' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white'}`}
        >
          Activity
        </Button>
      </div>

      {activeTab === 'register' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Locker Status</h2>
          <LockerStatusTable />
        </div>
      )}

      {activeTab === 'lockers' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Manage Lockers</h2>
          <Lockers />
        </div>
      )}

      {activeTab === 'activity' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Locker Activity</h2>
          <UserActivity />
        </div>
      )}
    </div>
  );
}
