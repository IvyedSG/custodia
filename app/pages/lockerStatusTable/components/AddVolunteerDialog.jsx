'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';

export default function AddVolunteerDialog({ isOpen, setIsOpen, onAddVolunteer }) {
  const [volunteerData, setVolunteerData] = useState({
    firstName: '',
    lastName: '',
    team: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setVolunteerData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onAddVolunteer(volunteerData);
    setVolunteerData({ firstName: '', lastName: '', team: '', phone: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">Add Volunteer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right text-indigo-700">First Name</Label>
            <Input id="firstName" value={volunteerData.firstName} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right text-indigo-700">Last Name</Label>
            <Input id="lastName" value={volunteerData.lastName} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dni" className="text-right text-indigo-700">DNI</Label>
            <Input id="dni" value={volunteerData.dni} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right text-indigo-700">Team</Label>
            <Input id="team" value={volunteerData.team} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-indigo-700">Phone</Label>
            <Input id="phone" value={volunteerData.phone} onChange={handleInputChange} className="col-span-3" />
          </div>
          
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
            <UserPlus className="mr-2" />
            Add Volunteer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}