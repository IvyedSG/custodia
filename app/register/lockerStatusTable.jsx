"use client"

export default function LockerStatusTable() {
  const lockers = Array(24).fill(false); // Replace with actual locker status data

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Locker</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {lockers.map((isOccupied, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-1 text-sm font-semibold ${isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} rounded-full`}>
                  {isOccupied ? 'Occupied' : 'Available'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
