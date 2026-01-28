import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageCircle, Wrench, ChevronRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeInfo } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';

import { toast } from 'sonner';

export const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const { products } = useProducts();

    // Find products
    const roffProduct = products.find(p => p.id === 'roff-t01');
    const fevicolProduct = products.find(p => p.id === 'fevicol-sh');
    const drFixitProduct = products.find(p => p.id === 'dr-fixit-201');

    // Handle Resize for Mobile Detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-slide Timer
    useEffect(() => {
        if (isPaused) return;

        // Slide durations
        let duration = 3000; // Default faster for mobile
        if (currentSlide === 0) duration = 7000;
        if (currentSlide === 1) duration = 5000;
        if (currentSlide === 2) duration = 5000;
        if (currentSlide === 3) duration = 5000;
        if (currentSlide === 4) duration = 5000;
        if (currentSlide === 5) duration = 5000;

        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % 6);
        }, duration);

        return () => clearTimeout(timer);
    }, [currentSlide, isPaused]);

    // Touch Handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsPaused(true);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            setCurrentSlide((prev) => (prev + 1) % 6);
        }
        if (isRightSwipe) {
            setCurrentSlide((prev) => (prev === 0 ? 5 : prev - 1));
        }

        // Resume auto-slide after a delay
        setTimeout(() => setIsPaused(false), 3000);
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hi! I want to know more about your products.");
        window.open(`https://wa.me/${storeInfo.whatsapp}?text=${message}`, '_blank');
    };



    return (
        <section
            className="relative bg-gradient-hero text-primary-foreground min-h-[85vh] flex items-center overflow-hidden transition-all duration-1000 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-pattern opacity-5" />

            {/* Diagonal accent */}
            <div className="absolute bottom-0 right-0 w-1/3 h-full bg-accent/10 -skew-x-12 translate-x-1/2" />

            {/* Animated accent bar */}
            <div className="absolute left-0 top-1/4 w-2 h-32 bg-gradient-accent animate-pulse-glow" />

            {/* Content Container */}
            <div className="container relative z-10 py-8 md:py-20 w-full h-full min-h-[500px]">

                {/* SLIDES */}
                {[0, 1, 2, 3, 4, 5].map((index) => {
                    // Mobile: Position absolute with transform
                    // Desktop: Position absolute with opacity fade
                    const isActive = currentSlide === index;

                    let mobileStyle = {};
                    if (isMobile) {
                        mobileStyle = {
                            transform: `translateX(${(index - currentSlide) * 100}%)`,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.5s ease-out',
                            zIndex: 10
                        };
                    }

                    // Desktop classes
                    const desktopClasses = !isMobile
                        ? `transition-opacity duration-1000 absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16 ${isActive ? 'opacity-100 relative z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none absolute'}`
                        : "absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16";

                    return (
                        <div
                            key={index}
                            className={isMobile ? "absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16" : desktopClasses}
                            style={isMobile ? mobileStyle : {}}
                        >
                            <div className={`grid lg:grid-cols-2 gap-12 h-full ${isMobile ? 'content-start pt-20' : 'items-center'} ${isMobile ? '' : (isActive ? '' : 'hidden lg:grid')}`}>
                                {/* Slide 0: Ambika Main */}
                                {index === 0 && (isMobile || isActive) && (
                                    <>
                                        <div className="space-y-4 md:space-y-8">
                                            <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up" style={{ animationDelay: '100ms' }}>
                                                Ambika<br /><span className="text-[#fcdb03]">Hardware & Plywood</span>
                                            </h1>
                                            <p className="text-lg md:text-2xl opacity-80 max-w-lg font-body animate-fade-up" style={{ animationDelay: '200ms' }}>
                                                Building with Quality & Trust. Your one-stop shop for all hardware and home improvement needs.
                                            </p>
                                            <div className="space-y-2 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                                {["Premium Quality Products", "Authorized Dealer", "Best Market Prices"].map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#fcdb03] bg-black rounded-full" />
                                                        <span className="text-base md:text-lg">{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 pt-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
                                                <Link to="/products">
                                                    <Button size="lg" className="bg-[#fcdb03] hover:bg-[#e3c502] text-black font-bold px-6 py-3 shadow-lg border-none">View Products</Button>
                                                </Link>
                                                <a href={`tel:${storeInfo.phone}`}>
                                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 shadow-lg border border-white/20 backdrop-blur-sm">Call Now</Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className={`hidden lg:flex animate-slide-in-right mt-12 justify-center ${isMobile ? 'hidden display-none' : ''}`} style={{ animationDelay: '500ms', display: isMobile ? 'none' : '' }}>
                                            <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                                <div className="aspect-square max-h-[500px] w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#ffffff] to-[#f0f0f0]">
                                                    {/* Logo or placeholder if missing */}
                                                    <img src="/ambika-logo.png" alt="Ambika Hardware Logo" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}


                                {/* Slide 1: Astral */}
                                {index === 1 && (isMobile || isActive) && (
                                    <>
                                        <div className="space-y-4 md:space-y-8">
                                            <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up" style={{ animationDelay: '100ms' }}>
                                                Astral<br /><span className="text-gradient">Pipes</span>
                                            </h1>
                                            <p className="text-lg md:text-2xl opacity-80 max-w-lg font-body animate-fade-up" style={{ animationDelay: '200ms' }}>
                                                India's No. 1 Pipe Company. Advanced plumbing solutions for your home.
                                            </p>
                                            <div className="space-y-2 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                                {["Lead-free UPVC pipes", "High pressure resistance", "Leak-proof plumbing solution"].map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-accent bg-white rounded-full" />
                                                        <span className="text-base md:text-lg">{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 pt-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
                                                <Link to="/products">
                                                    <Button size="lg" className="bg-gradient-accent text-accent-foreground font-bold px-6 py-4 shadow-accent hover:scale-105 transition-transform">
                                                        View Products <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Button>
                                                </Link>
                                                <a href={`tel:${storeInfo.phone}`}>
                                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 transition-all border border-white/20 backdrop-blur-sm">Call Now</Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className={`hidden lg:flex animate-slide-in-right mt-24 ${isMobile ? 'hidden display-none' : ''}`} style={{ animationDelay: '600ms', display: isMobile ? 'none' : '' }}>
                                            <div className="relative">
                                                <div className="aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-3xl overflow-hidden border border-accent/20 flex items-center justify-center p-8">
                                                    <img src="/astral-pipes.png" alt="Astral Pipes" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Slide 2: Finolex */}
                                {index === 2 && (isMobile || isActive) && (
                                    <>
                                        <div className="space-y-4 md:space-y-8">
                                            <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up" style={{ animationDelay: '100ms' }}>
                                                Finolex<br /><span className="text-[#00aeef]">Pipes</span>
                                            </h1>
                                            <p className="text-lg md:text-2xl opacity-80 max-w-lg font-body animate-fade-up" style={{ animationDelay: '200ms' }}>
                                                India's most trusted pipe brand. Superior quality PVC pipes and fittings.
                                            </p>
                                            <div className="space-y-2 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                                {["Premium quality material", "Long-lasting durability", "Wide range of applications"].map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#fff200] bg-black rounded-full" />
                                                        <span className="text-base md:text-lg">{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 pt-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
                                                <Link to="/products">
                                                    <Button size="lg" className="bg-[#00aeef] hover:bg-[#008dbf] text-white font-bold px-6 py-3 shadow-lg border-none">View Products</Button>
                                                </Link>
                                                <a href={`tel:${storeInfo.phone}`}>
                                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 shadow-lg border border-white/20 backdrop-blur-sm">Call Now</Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className={`hidden lg:flex animate-slide-in-right mt-12 justify-center ${isMobile ? 'hidden display-none' : ''}`} style={{ animationDelay: '500ms', display: isMobile ? 'none' : '' }}>
                                            <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                                <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-[#fff200] rounded-xl overflow-hidden shadow-2xl">
                                                    <img src="/finolex-pipes.png" alt="Finolex Pipes" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Slide 3: Plywood */}
                                {index === 3 && (isMobile || isActive) && (
                                    <>
                                        <div className="space-y-4 md:space-y-8">
                                            <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up" style={{ animationDelay: '100ms' }}>
                                                Premium<br /><span className="text-[#deb887]">Plywood</span>
                                            </h1>
                                            <p className="text-lg md:text-2xl opacity-80 max-w-lg font-body animate-fade-up" style={{ animationDelay: '200ms' }}>
                                                High-quality, durable plywood for all your furniture and interior needs.
                                            </p>
                                            <div className="space-y-2 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                                {["Termite & Borer Resistant", "Superior Strength & Durability", "Smooth Surface Finish"].map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#deb887] bg-black rounded-full" />
                                                        <span className="text-base md:text-lg">{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 pt-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
                                                <Link to="/products">
                                                    <Button size="lg" className="bg-[#deb887] hover:bg-[#c19b6c] text-black font-bold px-6 py-3 shadow-lg border-none">View Products</Button>
                                                </Link>
                                                <a href={`tel:${storeInfo.phone}`}>
                                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 shadow-lg border border-white/20 backdrop-blur-sm">Call Now</Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className={`hidden lg:flex animate-slide-in-right mt-12 justify-center ${isMobile ? 'hidden display-none' : ''}`} style={{ animationDelay: '500ms', display: isMobile ? 'none' : '' }}>
                                            <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                                <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-white/5 rounded-xl overflow-hidden shadow-2xl">
                                                    <img src="/plywood.jpg" alt="Premium Plywood" className="w-full h-full object-cover p-0 group-hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Slide 4: Dr. Fixit */}
                                {index === 4 && (isMobile || isActive) && (
                                    <>
                                        <div className="space-y-4 md:space-y-8 lg:pr-12">
                                            <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up uppercase" style={{ animationDelay: '100ms' }}>
                                                DR. FIXIT<br /><span className="text-[#fcdb03]">WATERPROOFING</span><br /><span className="text-[#fcdb03]">EXPERT</span>
                                            </h1>
                                            <p className="text-lg md:text-2xl opacity-80 max-w-lg font-body animate-fade-up" style={{ animationDelay: '200ms' }}>
                                                India's No. 1 Waterproofing Solution.<br className="hidden md:block" /> Complete protection for your home.
                                            </p>
                                            <div className="space-y-2 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                                {["Leak-free homes guaranteed", "Expert waterproofing solutions", "Durable and long-lasting protection"].map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#fcdb03] bg-black rounded-full" />
                                                        <span className="text-base md:text-lg">{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 pt-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
                                                <Link to="/products">
                                                    <Button size="lg" className="bg-[#fcdb03] hover:bg-[#e3c502] text-black font-bold px-6 py-3 shadow-lg border-none uppercase tracking-wide">View Products</Button>
                                                </Link>
                                                <a href={`tel:${storeInfo.phone}`}>
                                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 shadow-lg border border-white/20 backdrop-blur-sm uppercase tracking-wide">Call Now</Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className={`hidden lg:flex animate-slide-in-right mt-12 justify-center ${isMobile ? 'hidden display-none' : ''}`} style={{ animationDelay: '500ms', display: isMobile ? 'none' : '' }}>
                                            <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                                <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-[#0054a6] rounded-xl overflow-hidden shadow-2xl">
                                                    <img src="/dr-fixit-brand.png" alt="Dr. Fixit" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Slide 5: DongCheng */}
                                {index === 5 && (isMobile || isActive) && (
                                    <>
                                        <div className="space-y-4 md:space-y-8">
                                            <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up" style={{ animationDelay: '100ms' }}>
                                                DongCheng<br /><span className="text-[#0056b3]">Power Tools</span>
                                            </h1>
                                            <p className="text-lg md:text-2xl opacity-80 max-w-lg font-body animate-fade-up" style={{ animationDelay: '200ms' }}>
                                                Professional power tools for industrial and home use. High performance and durability.
                                            </p>
                                            <div className="space-y-2 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                                {["Heavy-duty performance", "Precision engineering", "Wide range of tools"].map((text, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-[#0056b3] bg-white rounded-full" />
                                                        <span className="text-base md:text-lg">{text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 pt-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
                                                <Link to="/products">
                                                    <Button size="lg" className="bg-[#0056b3] hover:bg-[#004494] text-white font-bold px-6 py-3 shadow-lg border-none">View Products</Button>
                                                </Link>
                                                <a href={`tel:${storeInfo.phone}`}>
                                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 shadow-lg border border-white/20 backdrop-blur-sm">Call Now</Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className={`hidden lg:flex animate-slide-in-right mt-12 justify-center ${isMobile ? 'hidden display-none' : ''}`} style={{ animationDelay: '500ms', display: isMobile ? 'none' : '' }}>
                                            <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                                <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-2xl">
                                                    <img src="/dongcheng.png" alt="DongCheng Power Tools" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
