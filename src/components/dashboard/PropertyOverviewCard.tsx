import { BadgeCheck, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyOverviewCardProps {
  partner: any;
  editHref: string;
  manageHref: string;
  viewHref: string;
}

export function PropertyOverviewCard({ partner, editHref, manageHref, viewHref }: PropertyOverviewCardProps) {
  const imageUrl = partner.imageUrl || "/images/placeholder-property.jpg";

  return (
    <div className="flex flex-col md:flex-row bg-[#1A1D21] border border-white/[0.04] rounded-2xl overflow-hidden shadow-2xl transition-all hover:bg-[#1f2226]">
      {/* Left side Image with Badge */}
      <div className="relative w-full md:w-[320px] h-[220px] md:h-auto flex-shrink-0 bg-neutral-800 flex items-center justify-center">
        {partner.imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={partner.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <Building2 className="w-16 h-16 text-white/10" />
        )}
        
        {/* Hotel Partner Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-antique-gold/30 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
          <BadgeCheck className="w-3.5 h-3.5 text-antique-gold" />
          <span className="text-[11px] font-medium text-antique-gold tracking-wide uppercase">Hotel Partner</span>
        </div>
      </div>

      {/* Right side Content */}
      <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
              {partner.name}
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">{partner.status || "Active"}</span>
            </div>
          </div>
          
          <p className="text-xs text-white/50 mb-1 tracking-wide uppercase font-medium">Contact Info</p>
          <div className="text-sm text-white/70 flex items-center gap-2">
            <span>{partner.phone || "+94 000 0000000"}</span>
            <span className="text-white/30 px-1">|</span>
            <span>{partner.email || "contact@hotel.com"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Link 
            href={viewHref}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#08110d] text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all text-center"
          >
            View Property
          </Link>
          <Link 
            href={editHref}
            className="px-6 py-2.5 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/5 hover:border-white/40 text-xs font-medium uppercase tracking-wider transition-all text-center"
          >
            Edit Details
          </Link>
          <Link 
            href={manageHref}
            className="px-6 py-2.5 rounded-xl border border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 text-xs font-medium uppercase tracking-wider backdrop-blur-sm transition-all text-center"
          >
            Manage Availability
          </Link>
        </div>
      </div>
    </div>
  );
}
