'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusFilter from './components/StatusFilter';
import LockerTable from './components/LockerTable';
import Pagination from './components/Pagination';
import AddVolunteerDialog from './components/AddVolunteerDialog';
import ShowLockerDialog from './components/ShowLockerDialog';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

const TOTAL_LOCKERS = 24;
const ITEMS_PER_PAGE = 7;

export default function LockerStatusTable() {
  const [lockers, setLockers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isAddVolunteerDialogOpen, setIsAddVolunteerDialogOpen] = useState(false);
  const [isShowLockerDialogOpen, setIsShowLockerDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Initialize lockers
    const initialLockers = Array(TOTAL_LOCKERS).fill().map(() => ({
      status: Math.random() > 0.5 ? 'empty' : 'occupied',
      items: Array(3).fill().map(() => ({
        dni: '',
        description: '',
        delivered: false
      })),
      lastUpdated: new Date().toISOString(),
    }));
    setLockers(initialLockers);
  }, []);

  const handleAddVolunteer = (volunteerData) => {
    // Logic to add a volunteer
    console.log('Adding volunteer:', volunteerData);
    setIsAddVolunteerDialogOpen(false);
  };

  const handleShowLocker = (index) => {
    setSelectedLocker(index);
    setIsShowLockerDialogOpen(true);
  };

  const handleUpdateLocker = (index, updatedItems, isOccupied) => {
    setLockers(prevLockers => {
      const newLockers = [...prevLockers];
      newLockers[index].items = updatedItems;
      newLockers[index].status = isOccupied ? 'occupied' : 'empty';
      newLockers[index].lastUpdated = new Date().toISOString();
      return newLockers;
    });
    setIsShowLockerDialogOpen(false);
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
      className="w-full max-w-7xl mx-auto px-4 py-0"
    >
      <div className="flex justify-between items-center mb-3">
        <Button onClick={() => setIsAddVolunteerDialogOpen(true)} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
          <UserPlus className="mr-2" />
          Add Volunteer
        </Button>
        <StatusFilter filter={filter} setFilter={setFilter} />
      </div>
      <LockerTable 
        lockers={paginatedLockers} 
        currentPage={currentPage} 
        itemsPerPage={ITEMS_PER_PAGE}
        onShowLocker={handleShowLocker}
      />
      {pageCount > 1 && (
        <Pagination 
          currentPage={currentPage} 
          pageCount={pageCount} 
          setCurrentPage={setCurrentPage} 
        />
      )}
      <AddVolunteerDialog 
        isOpen={isAddVolunteerDialogOpen} 
        setIsOpen={setIsAddVolunteerDialogOpen} 
        onAddVolunteer={handleAddVolunteer} 
      />
      <ShowLockerDialog 
        isOpen={isShowLockerDialogOpen} 
        setIsOpen={setIsShowLockerDialogOpen} 
        selectedLocker={selectedLocker !== null ? lockers[selectedLocker] : null}
        onUpdateLocker={(updatedItems, isOccupied) => handleUpdateLocker(selectedLocker, updatedItems, isOccupied)}
      />
    </motion.div>
  );
}