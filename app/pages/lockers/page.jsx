'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LockerGrid from './components/LockerGrid';
import LockerDialog from './components/LockerDialog';

const TOTAL_LOCKERS = 24;

export default function Lockers() {
  const [lockers, setLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const initialLockers = Array(TOTAL_LOCKERS).fill().map(() => ({
      status: 'empty',
      items: []
    }));
    setLockers(initialLockers);
  }, []);

  const handleLockerClick = (index) => {
    setSelectedLocker(index);
    setIsDialogOpen(true);
  };

  const handleUpdateLocker = (updatedItems) => {
    if (selectedLocker !== null) {
      const newLockers = [...lockers];
      newLockers[selectedLocker].items = updatedItems;
      newLockers[selectedLocker].status = updatedItems.length > 0 ? 'occupied' : 'empty';
      setLockers(newLockers);
      setIsDialogOpen(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4"
    >
      <LockerGrid lockers={lockers} onLockerClick={handleLockerClick} />
      <LockerDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        locker={selectedLocker !== null ? lockers[selectedLocker] : null}
        lockerNumber={selectedLocker !== null ? selectedLocker + 1 : null}
        onUpdateLocker={handleUpdateLocker}
      />
    </motion.div>
  );
}