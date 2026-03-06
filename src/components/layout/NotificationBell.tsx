'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function NotificationBell({ userRole }: { userRole?: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unread, setUnread] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?published=true');
            if (res.ok) {
                const data = await res.json();

                // Filter client side based on role
                const visible = data.notifications.filter((n: any) => {
                    if (n.visibleTo === 'ALL') return true;
                    if (!userRole) return false; // unauthenticated visitors only see ALL

                    if (n.visibleTo === 'CUSTOMERS' && userRole === 'USER') return true;
                    if (n.visibleTo === 'STAFF' && ['STAFF', 'ADMIN'].includes(userRole)) return true;
                    if (n.visibleTo === 'VEHICLE_OWNERS' && userRole === 'VEHICLE_OWNER') return true;
                    if (n.visibleTo === 'HOTEL_OWNERS' && userRole === 'HOTEL_OWNER') return true;

                    return false;
                });

                setNotifications(visible.slice(0, 5)); // Keep top 5 latest
                setUnread(visible.length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [userRole]);

    const markAsRead = () => {
        setUnread(0);
    };

    return (
        <Popover onOpenChange={(open) => { if (open) markAsRead(); }}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-white/60 hover:text-white rounded-full">
                    <Bell className="h-[18px] w-[18px]" />
                    {unread > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 border-white/10 bg-[#061a15]/95 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-sm font-medium text-white/90">Notifications</span>
                    {unread > 0 && <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full">{unread} New</span>}
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-glass-dark">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif._id} className="flex flex-col gap-1 p-4 border-b border-white/5 hover:bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${notif.type === 'ALERT' ? 'bg-rose-500' : notif.type === 'OFFER' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                    <span className="text-xs font-semibold text-white/80">{notif.title}</span>
                                </div>
                                <p className="text-[12px] text-white/50 pl-4">{notif.body}</p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 gap-2 text-white/30">
                            <AlertCircle className="h-6 w-6 opacity-30" />
                            <span className="text-xs">No recent notifications</span>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
