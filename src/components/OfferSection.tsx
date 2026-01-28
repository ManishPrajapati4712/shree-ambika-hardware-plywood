import { useOffer } from '@/context/OfferContext';

const OfferSection = () => {
    const { offerText, isVisible, backgroundColor } = useOffer();

    if (!isVisible) return null;

    return (
        <section className="py-12" style={{ backgroundColor }}>
            <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-display text-white font-bold animate-pulse">
                    {offerText}
                </h2>
            </div>
        </section>
    );
};

export default OfferSection;
