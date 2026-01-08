import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageCircle, Wrench, ChevronRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeInfo } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { addToCart } = useCart();
    const { products } = useProducts();

    // Find products
    const roffProduct = products.find(p => p.id === 'roff-t01');
    const fevicolProduct = products.find(p => p.id === 'fevicol-sh');
    const drFixitProduct = products.find(p => p.id === 'dr-fixit-201');

    useEffect(() => {
        // Slide 0 (Main): 2s
        // Slide 1 (Roff): 2s
        // Slide 2 (Fevicol): 2s
        // Slide 3 (Dr. Fixit): 30s
        let duration = 2000;
        if (currentSlide === 0) duration = 2000;
        if (currentSlide === 1) duration = 2000;
        if (currentSlide === 2) duration = 2000;
        if (currentSlide === 3) duration = 3000;

        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % 4);
        }, duration);

        return () => clearTimeout(timer);
    }, [currentSlide]);

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hi! I want to know more about your products.");
        window.open(`https://wa.me/${storeInfo.whatsapp}?text=${message}`, '_blank');
    };

    const handleAddToCart = (product: typeof roffProduct) => {
        if (product) {
            addToCart(product);
            toast.success(`${product.name} added to cart!`);
        }
    };

    return (
        <section className="relative bg-gradient-hero text-primary-foreground min-h-[85vh] flex items-center overflow-hidden transition-all duration-1000">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-pattern opacity-5" />

            {/* Diagonal accent */}
            <div className="absolute bottom-0 right-0 w-1/3 h-full bg-accent/10 -skew-x-12 translate-x-1/2" />

            {/* Animated accent bar */}
            <div className="absolute left-0 top-1/4 w-2 h-32 bg-gradient-accent animate-pulse-glow" />

            {/* Content Container */}
            <div className="container relative z-10 py-20">

                {/* Slide 1: Main Store Branding */}
                <div className={`grid lg:grid-cols-2 gap-12 items-center transition-opacity duration-1000 absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16 ${currentSlide === 0 ? 'opacity-100 relative z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none absolute'}`}>
                    {currentSlide === 0 && (
                        <>
                            <div className="space-y-8">
                                {/* Badge */}
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full animate-fade-up"
                                    style={{ animationDelay: '100ms' }}
                                >
                                    <Wrench className="h-4 w-4 text-accent" />
                                    <span className="text-sm font-medium text-accent">Since 1995 • Trusted by 10,000+ Customers</span>
                                </div>

                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-display leading-none animate-fade-up"
                                    style={{ animationDelay: '200ms' }}
                                >
                                    Ambika
                                    <br />
                                    <span className="text-gradient">Hardware</span>
                                    <br />
                                    & Plywood
                                </h1>

                                <p
                                    className="text-xl md:text-2xl opacity-80 max-w-lg font-body animate-fade-up"
                                    style={{ animationDelay: '300ms' }}
                                >
                                    {storeInfo.tagline}
                                </p>

                                <div
                                    className="flex gap-4 pt-4 animate-fade-up"
                                    style={{ animationDelay: '400ms' }}
                                >
                                    <Link to="/products">
                                        <Button size="lg" className="bg-gradient-accent text-accent-foreground font-bold px-6 py-4 shadow-accent hover:scale-105 transition-transform">
                                            View Products
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Button
                                        size="lg"
                                        onClick={handleWhatsApp}
                                        className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6 py-4 transition-all border-none shadow-lg"
                                    >
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        WhatsApp Us
                                    </Button>
                                </div>

                                {/* Stats */}
                                <div
                                    className="flex gap-8 pt-8 animate-fade-up"
                                    style={{ animationDelay: '500ms' }}
                                >
                                    {[
                                        { value: "25+", label: "Years Experience" },
                                        { value: "500+", label: "Products" },
                                        { value: "10K+", label: "Happy Customers" },
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-3xl md:text-4xl font-display text-accent">{stat.value}</div>
                                            <div className="text-sm opacity-60">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Image/Visual */}
                            <div
                                className="hidden lg:block animate-slide-in-right mt-24"
                                style={{ animationDelay: '600ms' }}
                            >
                                <div className="relative">
                                    {/* Main image container */}
                                    <div className="aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-t-3xl overflow-hidden border border-accent/20">
                                        <img
                                            src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop"
                                            alt="Hardware Tools"
                                            className="w-full h-full object-cover mix-blend-luminosity opacity-60"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


                {/* Slide 2: Roff T01 Tile Adhesive */}
                <div className={`grid lg:grid-cols-2 gap-12 items-center transition-opacity duration-1000 absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16 ${currentSlide === 1 ? 'opacity-100 relative z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none absolute'}`}>
                    {currentSlide === 1 && (
                        <>
                            <div className="space-y-8">
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up"
                                    style={{ animationDelay: '100ms' }}
                                >
                                    Roff T01 Tile Adhesive
                                </h1>

                                <p
                                    className="text-xl md:text-2xl opacity-80 max-w-lg font-body animate-fade-up"
                                    style={{ animationDelay: '200ms' }}
                                >
                                    High-strength cement-based adhesive for new construction
                                </p>

                                <div className="space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#1b4d3e] bg-white rounded-full" />
                                        <span className="text-lg">Ideal for ceramic tiles on floor and wall</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#1b4d3e] bg-white rounded-full" />
                                        <span className="text-lg">Strong bonding strength</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#1b4d3e] bg-white rounded-full" />
                                        <span className="text-lg">Suitable for new construction</span>
                                    </div>
                                </div>

                                <div
                                    className="flex gap-4 pt-4 animate-fade-up"
                                    style={{ animationDelay: '400ms' }}
                                >
                                    <Link to="/products">
                                        <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold px-6 py-3 shadow-lg border-none">
                                            View Products
                                        </Button>
                                    </Link>
                                    <Button
                                        size="lg"
                                        onClick={() => handleAddToCart(roffProduct)}
                                        className="bg-[#27ae60] hover:bg-[#2ecc71] text-white font-bold px-6 py-3 shadow-lg border-none"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </Button>
                                    <a href={`tel:${storeInfo.phone}`}>
                                        <Button
                                            size="lg"
                                            className="bg-[#c0392b] hover:bg-[#e74c3c] text-white font-bold px-6 py-3 shadow-lg border-none"
                                        >
                                            Call Now
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            {/* Product Image */}
                            <div
                                className="hidden lg:block animate-slide-in-right mt-12 flex justify-center"
                                style={{ animationDelay: '500ms' }}
                            >
                                <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-2xl">
                                        <img
                                            src="/roff-adhesive.png"
                                            alt="Roff T01 Tile Adhesive"
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Slide 3: Fevicol SH */}
                <div className={`grid lg:grid-cols-2 gap-12 items-center transition-opacity duration-1000 absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16 ${currentSlide === 2 ? 'opacity-100 relative z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none absolute'}`}>
                    {currentSlide === 2 && (
                        <>
                            <div className="space-y-8">
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up"
                                    style={{ animationDelay: '100ms' }}
                                >
                                    Fevicol SH – Synthetic
                                    <br />
                                    Resin Adhesive
                                </h1>

                                <p
                                    className="text-xl md:text-2xl opacity-80 max-w-lg font-body animate-fade-up"
                                    style={{ animationDelay: '200ms' }}
                                >
                                    High-quality synthetic resin adhesive for plywood, laminate, MDF and woodworking applications
                                </p>

                                <div className="space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#f39c12] bg-white rounded-full" />
                                        <span className="text-lg">Strong and durable bonding</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#f39c12] bg-white rounded-full" />
                                        <span className="text-lg">Trusted by carpenters construction</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#f39c12] bg-white rounded-full" />
                                        <span className="text-lg">Smooth application</span>
                                    </div>
                                </div>

                                <div
                                    className="flex gap-4 pt-4 animate-fade-up"
                                    style={{ animationDelay: '400ms' }}
                                >
                                    <Link to="/products">
                                        <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold px-6 py-3 shadow-lg border-none">
                                            View Products
                                        </Button>
                                    </Link>
                                    <Button
                                        size="lg"
                                        onClick={() => handleAddToCart(fevicolProduct)}
                                        className="bg-[#27ae60] hover:bg-[#2ecc71] text-white font-bold px-6 py-3 shadow-lg border-none"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </Button>
                                    <a href={`tel:${storeInfo.phone}`}>
                                        <Button
                                            size="lg"
                                            className="bg-[#c0392b] hover:bg-[#e74c3c] text-white font-bold px-6 py-3 shadow-lg border-none"
                                        >
                                            Call Now
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            {/* Product Image */}
                            <div
                                className="hidden lg:block animate-slide-in-right mt-12 flex justify-center"
                                style={{ animationDelay: '500ms' }}
                            >
                                <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-2xl">
                                        <img
                                            src="/fevicol-sh.png"
                                            alt="Fevicol SH"
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Slide 3: Dr. Fixit */}
                <div className={`grid lg:grid-cols-2 gap-12 items-center transition-opacity duration-1000 absolute inset-0 w-full h-full px-4 md:px-8 lg:px-16 ${currentSlide === 3 ? 'opacity-100 relative z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none absolute'}`}>
                    {currentSlide === 3 && (
                        <>
                            <div className="space-y-8">
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-display leading-none text-white animate-fade-up"
                                    style={{ animationDelay: '100ms' }}
                                >
                                    Dr. Fixit 201 –
                                    <br />
                                    Crack-X Paste
                                </h1>

                                <p
                                    className="text-xl md:text-2xl opacity-80 max-w-lg font-body animate-fade-up"
                                    style={{ animationDelay: '200ms' }}
                                >
                                    Ready-to-use crack filler paste
                                </p>

                                <div className="space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#f39c12] bg-white rounded-full" />
                                        <span className="text-lg">Ready to use formula</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#f39c12] bg-white rounded-full" />
                                        <span className="text-lg">High strength crack filling & plaster</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-[#f39c12] bg-white rounded-full" />
                                        <span className="text-lg">Smooth and easy application</span>
                                    </div>
                                </div>

                                <div
                                    className="flex gap-4 pt-4 animate-fade-up"
                                    style={{ animationDelay: '400ms' }}
                                >
                                    <Link to="/products">
                                        <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold px-6 py-3 shadow-lg border-none">
                                            View Products
                                        </Button>
                                    </Link>
                                    <Button
                                        size="lg"
                                        onClick={() => handleAddToCart(drFixitProduct)}
                                        className="bg-[#27ae60] hover:bg-[#2ecc71] text-white font-bold px-6 py-3 shadow-lg border-none"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </Button>
                                    <a href={`tel:${storeInfo.phone}`}>
                                        <Button
                                            size="lg"
                                            className="bg-[#c0392b] hover:bg-[#e74c3c] text-white font-bold px-6 py-3 shadow-lg border-none"
                                        >
                                            Call Now
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            {/* Product Image */}
                            <div
                                className="hidden lg:block animate-slide-in-right mt-12 flex justify-center"
                                style={{ animationDelay: '500ms' }}
                            >
                                <div className="relative p-8 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="aspect-[3/4] max-h-[600px] w-full flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-2xl">
                                        <img
                                            src="/dr-fixit.png"
                                            alt="Dr. Fixit 201"
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
