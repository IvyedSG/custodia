'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Package, Plus, Lock, Unlock } from 'lucide-react';

export default function LockerDialog({ isOpen, setIsOpen, locker, lockerNumber, onUpdateLocker }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ dni: '', description: '' });

  useEffect(() => {
    if (locker) {
      setItems(locker.items);
    }
  }, [locker]);

  const handleAddItem = () => {
    if (newItem.dni && newItem.description && items.length < 3) {
      setItems([...items, newItem]);
      setNewItem({ dni: '', description: '' });
    }
  };

  const handleSave = () => {
    onUpdateLocker(items);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800 flex items-center">
            {items.length === 0 ? <Unlock className="mr-2" /> : <Lock className="mr-2" />}
            Locker {lockerNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-indigo-700">No items yet. Add up to 3 items.</p>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-indigo-700">Current Items:</h3>
              {items.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded-md text-sm text-indigo-600">
                  <span className="font-semibold">Item {index + 1}:</span> {item.description} (DNI: {item.dni})
                </div>
              ))}
            </div>
          )}
          {items.length < 3 && (
            <div className="space-y-3 bg-white p-3 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-700">Add New Item:</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <Label htmlFor="dni" className="text-sm font-medium text-indigo-700 mb-1">DNI</Label>
                  <Input 
                    id="dni" 
                    value={newItem.dni} 
                    onChange={(e) => setNewItem({...newItem, dni: e.target.value})} 
                    className="border-indigo-300 focus:border-indigo-500"
                    placeholder="Enter DNI"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="description" className="text-sm font-medium text-indigo-700 mb-1">Description</Label>
                  <Input 
                    id="description" 
                    value={newItem.description} 
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})} 
                    className="border-indigo-300 focus:border-indigo-500"
                    placeholder="Enter item description"
                  />
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <div className="text-indigo-700 flex items-center">
              <Package size={18} className="mr-2" />
              Items: {items.length}/3
            </div>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}