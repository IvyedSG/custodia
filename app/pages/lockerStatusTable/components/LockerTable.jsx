'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Eye } from 'lucide-react';

export default function LockerTable({ lockers = [], currentPage, itemsPerPage, onShowLocker }) {
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
              <TableCell>{locker.items.filter(item => item.dni !== '').length}</TableCell>
              <TableCell className="hidden md:table-cell">{new Date(locker.lastUpdated).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={() => onShowLocker(index)} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
                  <Eye className="mr-2" />
                  Show Locker
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}