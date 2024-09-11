'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Lock } from 'lucide-react';

export default function LockerDialog({ isOpen, setIsOpen, selectedLocker, lockerNumber, onAddItem }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">Locker {lockerNumber}</DialogTitle>
          <DialogDescription className="text-indigo-600">
            {selectedLocker?.status === 'empty' ? 'Add an item to this locker' : 'Locker details'}
          </DialogDescription>
        </DialogHeader>
        {selectedLocker?.status === 'empty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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
              <Button onClick={onAddItem} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
                Add Item
              </Button>
            </DialogFooter>
          </motion.div>
        )}
        {selectedLocker?.status === 'occupied' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            <p className="text-indigo-700 flex items-center">
              <Package size={18} className="mr-2" />
              Items: {selectedLocker.items}
            </p>
            <p className="text-indigo-700 flex items-center mt-2">
              <Lock size={18} className="mr-2" />
              Status: Occupied
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}