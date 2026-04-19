import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, MapPin, Phone, Mail, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PartnerDetailService } from '@/services/crud.service';
import { getSessionUser } from '@/lib/auth';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'View Property | Hotel Dashboard',
};

type Params = Promise<{ id: string }>;

export default async function ViewHotelPropertyPage({ params }: { params: Params }) {
    const session = await getSessionUser();
    if (!session?.userId) redirect('/login');

    const { id } = await params;
    const partner = await PartnerDetailService.getPartnerById(id);

    if (!partner || partner.ownerId?.toString() !== session.userId) {
        notFound();
    }

    const imageUrl = partner.imageUrl || "/images/placeholder-property.jpg";

    return (
        <div className="flex flex-col gap-6 text-slate-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/hotel">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">View Property</h1>
                        <p className="text-sm text-white/50 font-light mt-1">Property details and information.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/dashboard/hotel/${partner._id}/edit`}>
                        <Button variant="outline" className="border-white/20 text-white/90 hover:bg-white/10 hover:text-white">
                            Edit Property
                        </Button>
                    </Link>
                    <Link href={`/dashboard/hotel/${partner._id}/availability`}>
                        <Button className="bg-gradient-to-r from-antique-gold to-[#c59b27] text-[#061a15] hover:brightness-110">
                            Manage Availability
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border border-white/[0.04] bg-[#1A1D21] rounded-2xl p-6 flex items-center justify-center relative overflow-hidden aspect-[4/3] shadow-md">
                    {partner.imageUrl ? (
                        <Image 
                            src={imageUrl} 
                            alt={partner.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    ) : (
                        <Building2 className="w-24 h-24 text-white/10" />
                    )}
                </div>

                <div className="md:col-span-2 border border-white/[0.04] bg-[#1A1D21] rounded-2xl p-6 shadow-md flex flex-col gap-5">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-white tracking-tight">{partner.name}</h2>
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <span className={`w-1.5 h-1.5 rounded-full ${partner.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                <span className={`text-[10px] font-semibold uppercase tracking-widest ${partner.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {partner.status || "Active"}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-antique-gold uppercase tracking-widest">{partner.type}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {partner.contactPerson && (
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-xl bg-white/5 text-white/50"><Info className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5 font-medium">Contact Person</p>
                                    <p className="text-sm text-white/80">{partner.contactPerson}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-white/5 text-white/50"><Phone className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5 font-medium">Phone</p>
                                <p className="text-sm text-white/80">{partner.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-white/5 text-white/50"><Mail className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5 font-medium">Email</p>
                                <p className="text-sm text-white/80">{partner.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-white/5 text-white/50"><MapPin className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5 font-medium">Address</p>
                                <p className="text-sm text-white/80">{partner.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {(partner.notes || partner.description) && (
                        <div className="mt-2 pt-5 border-t border-white/[0.04]">
                            <p className="text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">Description / Notes</p>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {partner.description || partner.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
