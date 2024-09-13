'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, pageCount, setCurrentPage }) {
  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      <Button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        variant="outline"
        size="icon"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {Array.from({ length: pageCount }, (_, i) => (
        <Button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          variant={currentPage === i + 1 ? "default" : "outline"}
          className={`w-10 h-10 ${
            currentPage === i + 1
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
              : 'text-purple-500 hover:text-purple-700'
          } transition-all duration-200`}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
        variant="outline"
        size="icon"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}