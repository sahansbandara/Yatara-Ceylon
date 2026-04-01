'use client';
import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useTableSort<T>(data: T[], defaultSort?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    defaultSort || { key: '', direction: null }
  );

  const requestSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // cycle: asc → desc → null
        if (prev.direction === 'asc') return { key, direction: 'desc' as const };
        if (prev.direction === 'desc') return { key: '', direction: null };
      }
      return { key, direction: 'asc' as const };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    return [...data].sort((a: any, b: any) => {
      const aVal = sortConfig.key.split('.').reduce((o, k) => o?.[k], a);
      const bVal = sortConfig.key.split('.').reduce((o, k) => o?.[k], b);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      // Date comparison
      const aDate = new Date(aVal).getTime();
      const bDate = new Date(bVal).getTime();
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return { sortedData, sortConfig, requestSort };
}
