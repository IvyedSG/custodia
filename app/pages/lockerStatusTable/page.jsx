'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusFilter from './components/StatusFilter';
import LockerTable from './components/LockerTable';
import Pagination from './components/Pagination';
import AddVolunteerDialog from './components/AddVolunteerDialog';

const TOTAL_LOCKERS = 24;
const ITEMS_PER_PAGE = 10;

export default function LockerStatusTable() {
  const [lockers, setLockers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Initialize lockers
    const initialLockers = Array(TOTAL_LOCKERS).fill().map(() => ({
      status: Math.random() > 0.5 ? 'empty' : 'occupied',
      items: Math.floor(Math.random() * 3),
      lastUpdated: new Date().toISOString(),
    }));
    setLockers(initialLockers);
  }, []);

  const handleStatusChange = (index) => {
    setLockers(prevLockers => {
      const newLockers = [...prevLockers];
      newLockers[index].status = newLockers[index].status === 'empty' ? 'occupied' : 'empty';
      newLockers[index].lastUpdated = new Date().toISOString();
      return newLockers;
    });
  };

  const handleAddVolunteer = () => {
    // Logic to add a volunteer
    setIsDialogOpen(false);
  };

  const filteredLockers = lockers.filter(locker => 
    filter === 'all' || locker.status === filter
  );

  const pageCount = Math.ceil(filteredLockers.length / ITEMS_PER_PAGE);
  const paginatedLockers = filteredLockers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <StatusFilter filter={filter} setFilter={setFilter} />
      <LockerTable 
        lockers={paginatedLockers} 
        currentPage={currentPage} 
        itemsPerPage={ITEMS_PER_PAGE}
        onStatusChange={handleStatusChange}
        onAddVolunteer={(index) => {
          setSelectedLocker(index);
          setIsDialogOpen(true);
        }}
      />
      {pageCount > 1 && (
        <Pagination 
          currentPage={currentPage} 
          pageCount={pageCount} 
          setCurrentPage={setCurrentPage} 
        />
      )}
      <AddVolunteerDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        selectedLocker={selectedLocker} 
        onAddVolunteer={handleAddVolunteer} 
      />
    </motion.div>
  );
}