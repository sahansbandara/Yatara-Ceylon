import { formatLKRCompact } from '@/lib/currency';
import { StatCard } from './StatCard';
import { Building2, CalendarCheck, DollarSign, Activity } from 'lucide-react';

interface HotelKPIProps {
  totalServices: number;
  activeServices: number;
  totalBlocks: number;
  activeBlocks: number;
  totalRevenuePotential: number;
  occupancyRate: number;
}

export function HotelKPIs({
  totalServices,
  activeServices,
  totalBlocks,
  activeBlocks,
  totalRevenuePotential,
  occupancyRate,
}: HotelKPIProps) {
  const revenueValue = (
    <>
      <span className="text-lg mr-1 font-semibold opacity-90">LKR</span>
      {formatLKRCompact(totalRevenuePotential).replace('LKR', '').trim()}
    </>
  );

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Services"
        value={`${activeServices} / ${totalServices}`}
        icon={Building2}
        variant="glass"
        accentColor="text-blue-400"
      />

      <StatCard
        title="Revenue Potential"
        value={revenueValue}
        icon={DollarSign}
        variant="gold"
        chartType="line"
      />

      <StatCard
        title="Active Blocks"
        value={activeBlocks}
        icon={CalendarCheck}
        variant="glass"
        accentColor="text-amber-400"
        trend={totalBlocks > 0 ? { value: `${totalBlocks} total`, positive: true } : undefined}
      />

      <StatCard
        title="Service Health"
        value={`${occupancyRate}%`}
        icon={Activity}
        variant="glass"
        chartType="progress"
        progressValue={occupancyRate}
        accentColor="text-emerald-400"
      />
    </div>
  );
}
