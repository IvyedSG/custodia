import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, UserPlus, RefreshCw } from 'lucide-react';

const TOTAL_LOCKERS = 24;
const ITEMS_PER_PAGE = 10;

export default function LockerStatusTable() {
  const [lockers, setLockers] = useState(Array(TOTAL_LOCKERS).fill().map(() => ({
    status: Math.random() > 0.5 ? 'empty' : 'occupied',
    items: Math.floor(Math.random() * 3),
    lastUpdated: new Date().toISOString(),
  })));
  const [filter, setFilter] = useState('all');
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusChange = (index) => {
    const newLockers = [...lockers];
    newLockers[index].status = newLockers[index].status === 'empty' ? 'occupied' : 'empty';
    newLockers[index].lastUpdated = new Date().toISOString();
    setLockers(newLockers);
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
      <div className="mb-4 flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="empty">Empty</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-100 to-indigo-100">
              <TableHead className="w-[100px] font-bold text-purple-800">Locker Number</TableHead>
              <TableHead className="font-bold text-purple-800">Status</TableHead>
              <TableHead className="font-bold text-purple-800">Items</TableHead>
              <TableHead className="hidden md:table-cell font-bold text-purple-800">Last Updated</TableHead>
              <TableHead className="font-bold text-purple-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLockers.map((locker, index) => (
              <TableRow key={index} className="hover:bg-purple-50 transition-colors duration-200">
                <TableCell className="font-medium">{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</TableCell>
                <TableCell className={locker.status === 'empty' ? 'text-green-600' : 'text-red-600'}>
                  {locker.status === 'empty' ? <Unlock className="inline mr-2" /> : <Lock className="inline mr-2" />}
                  {locker.status}
                </TableCell>
                <TableCell>{locker.items}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(locker.lastUpdated).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleStatusChange(index)} className="mr-2 mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
                    {locker.status === 'empty' ? <Lock className="mr-2" /> : <Unlock className="mr-2" />}
                    {locker.status === 'empty' ? 'Mark Occupied' : 'Mark Empty'}
                  </Button>
                  <Button onClick={() => {
                    setSelectedLocker(index);
                    setIsDialogOpen(true);
                  }} variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50 transition-all duration-200">
                    <UserPlus className="mr-2" />
                    Add Volunteer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: pageCount }, (_, i) => (
          <Button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`mx-1 ${
              currentPage === i + 1
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'bg-white text-purple-500 border border-purple-500 hover:bg-purple-50'
            } transition-all duration-200`}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800">Add Volunteer for Locker {selectedLocker !== null ? selectedLocker + 1 : ''}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-indigo-700">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dni" className="text-right text-indigo-700">
                DNI
              </Label>
              <Input id="dni" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddVolunteer} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
              <UserPlus className="mr-2" />
              Add Volunteer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}