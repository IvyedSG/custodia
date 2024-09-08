"use client"

export default function UserActivity() {
  const activities = [
    { id: 1, description: 'Locked locker 3' },
    { id: 2, description: 'Unlocked locker 12' },
    // Add more user activity records here
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Activity</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-t">
              <td className="px-4 py-2">{activity.id}</td>
              <td className="px-4 py-2">{activity.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
