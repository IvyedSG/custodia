import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Package } from 'lucide-react';

const TOTAL_LOCKERS = 24;

export default function Lockers() {
  const [lockers, setLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const initialLockers = Array(TOTAL_LOCKERS).fill().map(() => ({
      status: Math.random() > 0.5 ? 'empty' : 'occupied',
      items: Math.floor(Math.random() * 3)
    }));
    setLockers(initialLockers);
  }, []);

  const handleLockerClick = (index) => {
    setSelectedLocker(index);
    setIsDialogOpen(true);
  };

  const handleAddItem = () => {
    if (selectedLocker !== null) {
      const newLockers = [...lockers];
      newLockers[selectedLocker].items += 1;
      newLockers[selectedLocker].status = 'occupied';
      setLockers(newLockers);
      setIsDialogOpen(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {lockers.map((locker, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={`h-24 w-full ${
                locker.status === 'empty' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                locker.items === 3 ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
              } hover:opacity-80 text-white font-bold transition-all duration-200 rounded-lg shadow-lg`}
              onClick={() => handleLockerClick(index)}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">
                  {locker.status === 'empty' ? <Unlock /> : <Lock />}
                </div>
                <div className="text-lg">Locker {index + 1}</div>
                {locker.status === 'occupied' && (
                  <div className="text-sm flex items-center mt-1">
                    <Package size={14} className="mr-1" />
                    {locker.items} item{locker.items !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800">Locker {selectedLocker !== null ? selectedLocker + 1 : ''}</DialogTitle>
            <DialogDescription className="text-indigo-600">
              {selectedLocker !== null && lockers[selectedLocker]?.status === 'empty' ? 'Add an item to this locker' : 'Locker details'}
            </DialogDescription>
          </DialogHeader>
          {selectedLocker !== null && lockers[selectedLocker]?.status === 'empty' && (
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
                <Button onClick={handleAddItem} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
                  Add Item
                </Button>
              </DialogFooter>
            </motion.div>
          )}
          {selectedLocker !== null && lockers[selectedLocker]?.status === 'occupied' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <p className="text-indigo-700 flex items-center">
                <Package size={18} className="mr-2" />
                Items: {lockers[selectedLocker].items}
              </p>
              <p className="text-indigo-700 flex items-center mt-2">
                <Lock size={18} className="mr-2" />
                Status: Occupied
              </p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}