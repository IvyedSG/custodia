'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, UserPlus } from 'lucide-react';

export default function LockerTable({ lockers = [], currentPage, itemsPerPage, onStatusChange, onAddVolunteer }) {
  if (!lockers || lockers.length === 0) {
    return <div className="text-center py-4">No lockers to display</div>;
  }

  return (
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
          {lockers?.map((locker, index) => (
            <TableRow key={index} className="hover:bg-purple-50 transition-colors duration-200">
              <TableCell className="font-medium">{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
              <TableCell className={locker.status === 'empty' ? 'text-green-600' : 'text-red-600'}>
                {locker.status === 'empty' ? <Unlock className="inline mr-2" /> : <Lock className="inline mr-2" />}
                {locker.status}
              </TableCell>
              <TableCell>{locker.items}</TableCell>
              <TableCell className="hidden md:table-cell">{new Date(locker.lastUpdated).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={() => onStatusChange(index)} className="mr-2 mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
                  {locker.status === 'empty' ? <Lock className="mr-2" /> : <Unlock className="mr-2" />}
                  {locker.status === 'empty' ? 'Mark Occupied' : 'Mark Empty'}
                </Button>
                <Button onClick={() => onAddVolunteer(index)} variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50 transition-all duration-200">
                  <UserPlus className="mr-2" />
                  Add Volunteer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}