'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';

export default function AddVolunteerDialog({ isOpen, setIsOpen, selectedLocker, onAddVolunteer }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button onClick={onAddVolunteer} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
            <UserPlus className="mr-2" />
            Add Volunteer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}