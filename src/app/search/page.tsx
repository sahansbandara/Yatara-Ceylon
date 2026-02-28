import { SearchModal } from '@/components/public/SearchModal';

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-deep-emerald w-full pt-[72px]">
            {/* If users hit this directly, we just render the modal in the page */}
            <SearchModal />
        </div>
    );
}
