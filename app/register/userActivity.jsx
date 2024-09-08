import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Box, RefreshCw, Download, Eye } from 'lucide-react';

const SAMPLE_ACTIVITIES = [
  { id: 1, date: '2023-07-01', locker: 1, action: 'Item Added', status: 'Pending' },
  { id: 2, date: '2023-07-02', locker: 2, action: 'Item Removed', status: 'Completed' },
  { id: 3, date: '2023-07-03', locker: 3, action: 'Locker Assigned', status: 'Pending' },
];

export default function UserActivity() {
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const [filters, setFilters] = useState({ date: '', locker: '', status: 'all' });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities.filter(activity => 
    (filters.date === '' || activity.date.includes(filters.date)) &&
    (filters.locker === '' || activity.locker.toString() === filters.locker) &&
    (filters.status === 'all' || activity.status === filters.status)
  );

  const handleStatusChange = (id) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, status: activity.status === 'Pending' ? 'Completed' : 'Pending' }
        : activity
    ));
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + filteredActivities.map(a => Object.values(a).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-4 flex flex-wrap gap-4 justify-between items-end">
        <div className="flex flex-wrap gap-4">
          <div>
            <Label htmlFor="date" className="text-indigo-700">Date:</Label>
            <div className="relative">
              <Calendar className="absolute top-3 left-3 text-gray-400" size={16} />
              <Input 
                id="date" 
                type="date" 
                value={filters.date} 
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="pl-10 mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="locker" className="text-indigo-700">Locker:</Label>
            <div className="relative">
              <Box className="absolute top-3 left-3 text-gray-400" size={16} />
              <Input 
                id="locker" 
                type="number" 
                value={filters.locker} 
                onChange={(e) => handleFilterChange('locker', e.target.value)}
                className="pl-10 mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status" className="text-indigo-700">Status:</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[180px] mt-1 bg-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleExport} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-200">
          <Download className="mr-2" size={16} />
          Export to CSV
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-100 to-indigo-100">
              <TableHead className="font-bold text-purple-800">Date</TableHead>
              <TableHead className="font-bold text-purple-800">Locker</TableHead>
              <TableHead className="font-bold text-purple-800">Action</TableHead>
              <TableHead className="font-bold text-purple-800">Status</TableHead>
              <TableHead className="font-bold text-purple-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-purple-50 transition-colors duration-200">
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.locker}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell className={activity.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}>
                  {activity.status}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleStatusChange(activity.id)} className="mr-2 mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-200">
                    <RefreshCw className="mr-2" size={16} />
                    {activity.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSelectedActivity(activity);
                    setIsDialogOpen(true);
                  }} className="border-purple-500 text-purple-500 hover:bg-purple-50 transition-all duration-200">
                    <Eye className="mr-2" size={16} />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800">Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <p className="text-indigo-700"><strong>Date:</strong> {selectedActivity.date}</p>
              <p className="text-indigo-700"><strong>Locker:</strong> {selectedActivity.locker}</p>
              <p className="text-indigo-700"><strong>Action:</strong> {selectedActivity.action}</p>
              <p className="text-indigo-700"><strong>Status:</strong> {selectedActivity.status}</p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}