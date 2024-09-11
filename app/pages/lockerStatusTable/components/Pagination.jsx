'use client'

import React from 'react';
import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, pageCount, setCurrentPage }) {
  return (
    <div className="mt-4 flex justify-center">
      {Array.from({ length: pageCount }, (_, i) => (
        <Button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`mx-1 ${
            currentPage === i + 1
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
              : 'bg-white text-purple-500 border border-purple-500 hover:bg-purple-50'
          } transition-all duration-200`}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}