import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function Lockers() {
  const [lockers, setLockers] = useState(Array(24).fill(false));

  const toggleLocker = (index) => {
    const newLockers = [...lockers];
    newLockers[index] = !newLockers[index];
    setLockers(newLockers);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-6 gap-4">
        {lockers.map((isOccupied, index) => (
          <Button
            key={index}
            onClick={() => toggleLocker(index)}
            className={`h-24 w-full flex items-center justify-center text-lg font-bold ${isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} hover:bg-opacity-75 rounded-md`}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
