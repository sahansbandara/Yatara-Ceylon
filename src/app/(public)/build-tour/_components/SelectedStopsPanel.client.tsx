'use client';

import { useCallback } from 'react';
import {
    GripVertical, X, ChevronUp, ChevronDown, Sparkles, MapPin, Trash2, Wand2,
} from 'lucide-react';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { getCategoryColor } from '@/lib/trip/types';
import type { Stop } from '@/lib/trip/types';

// ─── Sortable Item ───────────────────────────────────────────────────────────

function SortableStopItem({
    stop, index, total, onRemove,
}: {
    stop: Stop; index: number; total: number; onRemove: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: stop.stopId,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto' as any,
    };

    const color = getCategoryColor(stop.place.category);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ${isDragging ? 'bg-antique-gold/10 border border-antique-gold/20' : 'hover:bg-white/3'
                }`}
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="p-0.5 cursor-grab active:cursor-grabbing text-white/20 hover:text-antique-gold/60 transition-colors flex-shrink-0"
            >
                <GripVertical className="w-3.5 h-3.5" />
            </button>

            {/* Order badge */}
            <div className="w-6 h-6 bg-antique-gold/15 text-antique-gold flex items-center justify-center font-serif text-[11px] rounded-full flex-shrink-0 border border-antique-gold/25">
                {index + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-serif text-[12px] text-white/85 truncate">{stop.place.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                        className="text-[7px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
                        style={{ color, backgroundColor: color + '18' }}
                    >
                        {stop.place.category}
                    </span>
                    <span className="text-white/20 text-[8px]">{stop.place.district}</span>
                </div>
            </div>

            {/* Category dot + Remove */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(stop.stopId); }}
                    className="p-1 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            {/* Connection line to next stop */}
            {index < total - 1 && (
                <div className="absolute left-[39px] bottom-0 translate-y-full w-px h-[6px] bg-antique-gold/15" />
            )}
        </div>
    );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

export default function SelectedStopsPanel() {
    const stops = useBuildTourStore((s) => s.stops);
    const removeStop = useBuildTourStore((s) => s.removeStop);
    const reorderStops = useBuildTourStore((s) => s.reorderStops);
    const clearStops = useBuildTourStore((s) => s.clearStops);
    const optimizeOrder = useBuildTourStore((s) => s.optimizeOrder);
    const getTripEstimate = useBuildTourStore((s) => s.getTripEstimate);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
                const oldIndex = stops.findIndex((s) => s.stopId === active.id);
                const newIndex = stops.findIndex((s) => s.stopId === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    reorderStops(oldIndex, newIndex);
                }
            }
        },
        [stops, reorderStops]
    );

    const tripEstimate = getTripEstimate();

    // ─── Empty state ─────────────────────────────────────────────────────
    if (stops.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
                <div className="w-16 h-16 rounded-2xl bg-antique-gold/5 border border-antique-gold/10 flex items-center justify-center mb-5">
                    <MapPin className="w-7 h-7 text-antique-gold/30" strokeWidth={1.2} />
                </div>
                <h3 className="font-serif text-white/60 text-sm tracking-wide mb-2">
                    No stops yet
                </h3>
                <p className="text-white/25 text-[10px] font-light leading-relaxed max-w-[200px]">
                    Switch to <span className="text-antique-gold/50">Discover</span> tab and add places to build your trip.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header with actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-antique-gold/60" />
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-serif">
                        {stops.length} Stops
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    {stops.length >= 3 && (
                        <button
                            onClick={optimizeOrder}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-antique-gold/10 hover:bg-antique-gold/20 text-antique-gold/70 hover:text-antique-gold transition-all text-[9px] uppercase tracking-wider font-serif"
                        >
                            <Wand2 className="w-2.5 h-2.5" />
                            Optimize
                        </button>
                    )}
                    <button
                        onClick={clearStops}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all text-[9px] uppercase tracking-wider font-serif"
                    >
                        <Trash2 className="w-2.5 h-2.5" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Trip estimate mini bar */}
            {tripEstimate && (
                <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-white/20 text-[9px] uppercase tracking-wider">Dist:</span>
                        <span className="text-white/60 text-[11px] font-serif">~{tripEstimate.totalKm} km</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-white/20 text-[9px] uppercase tracking-wider">Time:</span>
                        <span className="text-white/60 text-[11px] font-serif">~{tripEstimate.totalHours} hrs</span>
                    </div>
                </div>
            )}

            {/* Sortable list */}
            <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={stops.map((s) => s.stopId)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-0.5">
                            {stops.map((stop, idx) => (
                                <SortableStopItem
                                    key={stop.stopId}
                                    stop={stop}
                                    index={idx}
                                    total={stops.length}
                                    onRemove={removeStop}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Send to concierge */}
            {stops.length >= 2 && (
                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={() => {
                            const itinerary = stops.map((s) => s.place.name).join(', ');
                            const districts = Array.from(new Set(stops.map((s) => s.place.district))).join(', ');
                            const params = new URLSearchParams({ itinerary, districts, source: 'build-tour' });
                            window.location.href = `/inquire?${params.toString()}`;
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-antique-gold text-deep-emerald font-serif text-[11px] uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 transition-all font-semibold"
                    >
                        Send Plan to Concierge
                    </button>
                </div>
            )}
        </div>
    );
}
