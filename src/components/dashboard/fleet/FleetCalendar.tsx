'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const localizer = momentLocalizer(moment);

interface FleetCalendarProps {
    vehicles: any[];
    blocks: any[];
    assignedBookings: any[];
}

export default function FleetCalendar({ vehicles, blocks, assignedBookings }: FleetCalendarProps) {
    const [selectedVehicle, setSelectedVehicle] = useState('ALL');

    const events = useMemo(() => {
        const _events: any[] = [];

        // Add bookings
        assignedBookings.forEach((b: any) => {
            if (selectedVehicle !== 'ALL' && b.assignedVehicleId !== selectedVehicle) return;

            const vehicle = vehicles.find((v: any) => v._id === b.assignedVehicleId);

            _events.push({
                id: `booking-${b._id}`,
                title: `Trip: ${b.bookingNo} (${vehicle?.model || 'Unknown'})`,
                start: new Date(b.dates.from),
                end: new Date(b.dates.to),
                allDay: true,
                resource: b,
                type: 'BOOKING'
            });
        });

        // Add blocks
        blocks.forEach((block: any) => {
            if (selectedVehicle !== 'ALL' && block.vehicleId !== selectedVehicle) return;

            const vehicle = vehicles.find((v: any) => v._id === block.vehicleId);

            _events.push({
                id: `block-${block._id}`,
                title: `Blocked: ${block.reason} (${vehicle?.model || 'Unknown'})`,
                start: new Date(block.from),
                end: new Date(block.to),
                allDay: true,
                resource: block,
                type: 'BLOCK'
            });
        });

        return _events;
    }, [selectedVehicle, assignedBookings, blocks, vehicles]);


    return (
        <GlassPanel title="Fleet Schedule" className="col-span-full">
            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-white/60">View all assigned trips and maintenance blocks.</p>
                <div className="w-64">
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                            <SelectValue placeholder="Filter by vehicle..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            <SelectItem value="ALL">All Vehicles</SelectItem>
                            {vehicles.map(v => (
                                <SelectItem key={v._id} value={v._id}>{v.model} ({v.plateNumber || 'No Plate'})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="h-[500px] w-full rbc-dark-theme-override">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    /* Inline style overrides for react-big-calendar to match Dark Mode */
                    .rbc-dark-theme-override .rbc-calendar { color: rgba(255,255,255,0.8); border: none; }
                    .rbc-dark-theme-override .rbc-header { border-bottom: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.1); padding: 10px 0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; color: rgba(255,255,255,0.5); }
                    .rbc-dark-theme-override .rbc-month-view { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; background: rgba(0,0,0,0.1); }
                    .rbc-dark-theme-override .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.05); }
                    .rbc-dark-theme-override .rbc-month-row { border-top: 1px solid rgba(255,255,255,0.05); }
                    .rbc-dark-theme-override .rbc-off-range-bg { background: rgba(0,0,0,0.2) !important; }
                    .rbc-dark-theme-override .rbc-today { background: rgba(16, 185, 129, 0.05) !important; }
                    .rbc-dark-theme-override .rbc-btn-group button { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); }
                    .rbc-dark-theme-override .rbc-btn-group button:hover { background: rgba(255,255,255,0.05); }
                    .rbc-dark-theme-override .rbc-btn-group button.rbc-active { background: rgba(16, 185, 129, 0.2); color: #10b981; border-color: rgba(16, 185, 129, 0.4); box-shadow: none; }
                    .rbc-dark-theme-override .rbc-toolbar button:active, .rbc-dark-theme-override .rbc-toolbar button.rbc-active:hover { box-shadow: none; }
                `}} />
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week']}
                    eventPropGetter={(event: any) => ({
                        style: {
                            backgroundColor: event.type === 'BOOKING' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            borderColor: event.type === 'BOOKING' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: event.type === 'BOOKING' ? '#34d399' : '#fbbf24',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '2px 6px'
                        }
                    })}
                />
            </div>
        </GlassPanel>
    );
}
