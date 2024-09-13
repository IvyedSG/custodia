'use client'

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StatusFilter({ filter, setFilter }) {
  return (
    <div className="flex justify-end">
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px] bg-white border-purple-300 text-purple-700">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="empty">Empty</SelectItem>
          <SelectItem value="occupied">Occupied</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}