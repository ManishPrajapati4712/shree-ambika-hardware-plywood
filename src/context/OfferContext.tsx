import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfferContextType {
    offerText: string;
    setOfferText: (text: string) => void;
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const OfferProvider = ({ children }: { children: React.ReactNode }) => {
    const [offerText, setOfferText] = useState(() => {
        return localStorage.getItem('offerText') || 'Big Festival Sale! Flat 50% OFF';
    });

    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem('offerVisible') === 'true';
    });

    const [backgroundColor, setBackgroundColor] = useState(() => {
        return localStorage.getItem('offerColor') || '#0ea5e9'; // Default to sky-500 equivalent
    });

    useEffect(() => {
        localStorage.setItem('offerText', offerText);
    }, [offerText]);

    useEffect(() => {
        localStorage.setItem('offerVisible', String(isVisible));
    }, [isVisible]);

    useEffect(() => {
        localStorage.setItem('offerColor', backgroundColor);
    }, [backgroundColor]);

    return (
        <OfferContext.Provider value={{
            offerText,
            setOfferText,
            isVisible,
            setIsVisible,
            backgroundColor,
            setBackgroundColor
        }}>
            {children}
        </OfferContext.Provider>
    );
};

export const useOffer = () => {
    const context = useContext(OfferContext);
    if (context === undefined) {
        throw new Error('useOffer must be used within a OfferProvider');
    }
    return context;
};
