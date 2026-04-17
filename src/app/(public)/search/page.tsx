import { SearchModal } from '@/components/public/SearchModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search | Yatara Ceylon',
    description: 'Search destinations, journeys, and experiences across Sri Lanka.',
};

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-deep-emerald w-full pt-[72px]">
            <SearchModal />
        </div>
    );
}
