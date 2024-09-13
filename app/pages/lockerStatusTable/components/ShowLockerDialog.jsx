'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Trash2, Package, Check, Edit } from 'lucide-react';

export default function ShowLockerDialog({ isOpen, setIsOpen, selectedLocker, onUpdateLocker }) {
  const [items, setItems] = useState([]);
  const [isOccupied, setIsOccupied] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    if (selectedLocker) {
      setItems(selectedLocker.items);
      setIsOccupied(selectedLocker.status === 'occupied');
    }
  }, [selectedLocker]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems[index] = { dni: '', description: '', delivered: false };
    setItems(newItems);
  };

  const handleToggleDelivered = (index) => {
    const newItems = [...items];
    newItems[index].delivered = !newItems[index].delivered;
    setItems(newItems);
  };

  const handleSubmit = () => {
    const filledItems = items.filter(item => item.dni !== '' || item.description !== '');
    const newIsOccupied = filledItems.length === 3 || isOccupied;
    onUpdateLocker(items, newIsOccupied);
  };

  const toggleEdit = (index) => {
    setEditingIndex(editingIndex === index ? -1 : index);
  };

  if (!selectedLocker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">Locker Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-2 p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold text-indigo-700">Item {index + 1}</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <Label htmlFor={`dni-${index}`} className="text-indigo-700 mb-1">DNI</Label>
                  <Input 
                    id={`dni-${index}`} 
                    value={item.dni} 
                    onChange={(e) => handleItemChange(index, 'dni', e.target.value)} 
                    disabled={editingIndex !== index}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor={`description-${index}`} className="text-indigo-700 mb-1">Description</Label>
                  <Input 
                    id={`description-${index}`} 
                    value={item.description} 
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                    disabled={editingIndex !== index}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 space-x-2">
                <Button 
                  onClick={() => handleToggleDelivered(index)} 
                  size="sm" 
                  variant={item.delivered ? "default" : "outline"}
                  className="flex-grow"
                >
                  {item.delivered ? <Check className="w-4 h-4 mr-1" /> : <Package className="w-4 h-4 mr-1" />}
                  {item.delivered ? "Entregado" : "Entregado?"}
                </Button>
                <Button 
                  onClick={() => toggleEdit(index)} 
                  size="sm" 
                  variant={editingIndex === index ? "default" : "outline"}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDeleteItem(index)} size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="locker-status" 
              checked={isOccupied} 
              onCheckedChange={setIsOccupied} 
            />
            <Label htmlFor="locker-status" className="text-indigo-700">Mark as Occupied</Label>
          </div>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
            Update Locker
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}