'use client';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { SortDirection } from '@/hooks/useTableSort';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentKey: string;
  direction: SortDirection;
  onSort: (key: string) => void;
  className?: string;
  align?: 'left' | 'right';
}

export default function SortableHeader({
  label,
  sortKey,
  currentKey,
  direction,
  onSort,
  className = '',
  align = 'left'
}: SortableHeaderProps) {
  const isActive = currentKey === sortKey && direction !== null;
  const alignClass = align === 'right' ? 'text-right' : 'text-left';

  return (
    <th
      className={`px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase font-semibold cursor-pointer select-none group transition-colors hover:text-white/50 ${
        isActive ? 'text-antique-gold/70' : 'text-white/30'
      } ${alignClass} ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="inline-flex flex-col">
          {isActive && direction === 'asc' ? (
            <ChevronUp className="h-3 w-3" />
          ) : isActive && direction === 'desc' ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronsUpDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          )}
        </span>
      </span>
    </th>
  );
}
