'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Package } from 'lucide-react';

export default function LockerButton({ locker, index, onClick }) {
  return (
    <Button
      className={`h-24 w-full ${
        locker.status === 'empty' ? 'bg-gradient-to-br from-green-400 to-green-600' :
        locker.items === 3 ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
      } hover:opacity-80 text-white font-bold transition-all duration-200 rounded-lg shadow-lg`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl mb-2">
          {locker.status === 'empty' ? <Unlock /> : <Lock />}
        </div>
        <div className="text-lg">Locker {index + 1}</div>
        {locker.status === 'occupied' && (
          <div className="text-sm flex items-center mt-1">
            <Package size={14} className="mr-1" />
            {locker.items} item{locker.items !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Button>
  );
}