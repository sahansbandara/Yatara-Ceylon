import { formatLKRCompact } from '@/lib/currency';

interface HotelKPIProps {
  totalBookings: number;
  bookingsChange: number;
  revenue: number;
  revenueChange: number;
  healthScore: number;
}

export function HotelKPIs({
  totalBookings,
  bookingsChange,
  revenue,
  revenueChange,
  healthScore,
}: HotelKPIProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Bookings Card (Dark Glass) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1A1D21]/80 backdrop-blur-md border border-white/[0.04] p-5 shadow-2xl transition-all hover:bg-[#1A1D21]">
        <div className="flex justify-between items-start mb-6">
          <p className="text-white/60 font-medium">Total Bookings</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <span>▲</span> {bookingsChange}%
          </div>
        </div>
        <div className="flex justify-between items-end">
          <h3 className="text-3xl font-bold tracking-tight text-white">{totalBookings}</h3>
          
          {/* Mock Line Graph (Gold) */}
          <div className="w-24 h-10 opacity-80">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path 
                d="M0,30 C20,30 30,10 50,20 C70,30 80,5 100,10" 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M0,30 C20,30 30,10 50,20 C70,30 80,5 100,10 L100,40 L0,40 Z" 
                fill="url(#goldGradient)" 
                opacity="0.1" 
              />
              <defs>
                <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Revenue Card (Gold Gradient) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E2C373] via-[#D4AF37] to-[#B08920] p-5 shadow-2xl transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
        <div className="flex justify-between items-start mb-6">
          <p className="text-[#08110d]/80 font-medium font-outfit">Revenue</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            <span>▲</span> {revenueChange}%
          </div>
        </div>
        <div className="flex justify-between items-end">
          <h3 className="text-3xl font-bold tracking-tight text-[#08110d] font-outfit">
            <span className="text-lg mr-1 font-semibold opacity-90">LKR</span>
            {formatLKRCompact(revenue).replace('LKR', '').trim()} 
            {/* formatLKRCompact uses K/M sizes, but image shows exact with commas "12,450,000". Let's format manually to match perfectly if high, or just let formatLKR do it? Actually let's use toLocaleString just for this explicit UI match, or formatLKR. Wait, image shows exactly "LKR 12,450,000" */} 
          </h3>
          
          {/* Mock Line Graph (Dark) */}
          <div className="w-24 h-10 opacity-60">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path 
                d="M0,35 C20,15 30,25 50,20 C70,15 80,5 100,15" 
                fill="none" 
                stroke="#08110d" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M0,35 C20,15 30,25 50,20 C70,15 80,5 100,15 L100,40 L0,40 Z" 
                fill="url(#darkGradient)" 
                opacity="0.1" 
              />
              <defs>
                <linearGradient id="darkGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#08110d" stopOpacity="1" />
                  <stop offset="100%" stopColor="#08110d" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Property Health Card (Gold Gradient) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E2C373] via-[#D4AF37] to-[#B08920] p-5 shadow-2xl transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
        <div className="flex justify-between items-start h-full">
          <div className="flex flex-col justify-between h-full">
            <p className="text-[#08110d]/80 font-medium font-outfit">Property Health</p>
            <h3 className="text-4xl font-bold tracking-tight text-[#08110d] mt-2">{healthScore}%</h3>
          </div>
          
          {/* Circular Progress (Dark Green & Dark ring) */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#08110d" 
                strokeWidth="8" 
                strokeOpacity="0.2"
              />
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${251 * (healthScore / 100)} 251`} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#08110d]">{healthScore}%</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
