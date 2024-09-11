import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, User } from 'lucide-react';

const services = [
  { id: 1, name: 'Primer servicio', time: '8:00 AM' },
  { id: 2, name: 'Segundo servicio', time: '9:30 AM' },
  { id: 3, name: 'Tercer servicio', time: '11:30 AM' },
  { id: 4, name: 'Cuarto servicio', time: '1:30 PM' },
  { id: 5, name: 'Quinto servicio', time: '7:00 PM' },
];

export default function ServiceSelectionDialog({ isOpen, onServiceSelect }) {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [managerName, setManagerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedServiceId && managerName) {
      const selectedService = services.find(s => s.id === selectedServiceId);
      onServiceSelect({ ...selectedService, manager: managerName });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">Seleccionar Servicio</DialogTitle>
          <DialogDescription className="text-indigo-600">
            Elige un servicio y proporciona el nombre del encargado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <RadioGroup value={selectedServiceId} onValueChange={(value) => setSelectedServiceId(Number(value))}>
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white transition-all duration-200"
                >
                  <RadioGroupItem value={service.id} id={`service-${service.id}`} />
                  <Label htmlFor={`service-${service.id}`} className="flex-grow text-indigo-700 cursor-pointer">
                    {service.name}
                  </Label>
                  <span className="text-purple-600 flex items-center">
                    <Clock size={16} className="mr-1" />
                    {service.time}
                  </span>
                </motion.div>
              ))}
            </RadioGroup>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="managerName" className="text-right text-indigo-700">
                Encargado
              </Label>
              <div className="col-span-3 relative">
                <User className="absolute top-3 left-3 text-gray-400" size={16} />
                <Input 
                  id="managerName" 
                  value={managerName} 
                  onChange={(e) => setManagerName(e.target.value)} 
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}