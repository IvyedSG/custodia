'use client'

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StatusFilter({ filter, setFilter }) {
  return (
    <div className="mb-4 flex justify-end">
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px] bg-white">
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