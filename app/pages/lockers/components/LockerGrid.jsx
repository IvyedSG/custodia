'use client'

import React from 'react';
import { motion } from 'framer-motion';
import LockerButton from './LockerButton';

export default function LockerGrid({ lockers, onLockerClick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {lockers && Array.isArray(lockers) ? (
        lockers.map((locker, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LockerButton 
              locker={locker} 
              index={index} 
              onClick={() => onLockerClick(index)} 
            />
          </motion.div>
        ))
      ) : (
        <p>No lockers available.</p>
      )}
    </div>
  );
}