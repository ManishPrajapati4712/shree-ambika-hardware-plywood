import { useOffer } from '@/context/OfferContext';
import { X } from 'lucide-react';
import { useState } from 'react';

const OfferBanner = () => {
    const { offerText, isVisible, backgroundColor } = useOffer();
    const [isDismissed, setIsDismissed] = useState(false);

    if (!isVisible || isDismissed) return null;

    return (
        <div
            className="w-full py-3 px-4 text-white text-center relative flex items-center justify-center animate-in slide-in-from-top duration-500"
            style={{ backgroundColor }}
        >
            <span className="font-medium text-sm md:text-base animate-pulse">
                {offerText}
            </span>
            <button
                onClick={() => setIsDismissed(true)}
                className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Dismiss offer"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default OfferBanner;
