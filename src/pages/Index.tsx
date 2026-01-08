import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageCircle, Wrench, Shield, Truck, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/CategoryCard';
import { categories, storeInfo } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '@/components/Hero';

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Only the finest materials from trusted manufacturers"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery available in select areas"
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive wholesale & retail pricing"
  }
];

const Index = () => {
  const { products } = useProducts();
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I want to know more about your products.");
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${message}`, '_blank');
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Features Strip */}
      <section className="py-6 bg-accent">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 text-accent-foreground opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="h-6 w-6" />
                <div>
                  <div className="font-display text-lg">{feature.title}</div>
                  <div className="text-xs opacity-80">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-20 bg-[#003B46] text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">

              <img
                src="/owner.jpg"
                alt="Mehul Prajapati"
                className="relative rounded-3xl shadow-xl w-full max-w-sm mx-auto object-cover aspect-[3/4]"
              />
            </div>
            <div className="space-y-6 relative">
              {/* Background Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <img src="/logo.jpg" alt="Watermark" className="w-80 h-80 object-contain grayscale" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Meet the Owner</p>
                <h2 className="text-4xl font-display">Mehul Prajapati</h2>
              </div>
              <p className="text-lg text-white/80 leading-relaxed relative z-10">
                He is a respected businessman known for his excellence in the hardware and plywood industry.
                With a strong focus on quality, trust, and customer satisfaction, he delivers reliable products
                that build strong foundations. His dedication and honest approach make his business stand out
                in the market.
              </p>
              <div className="pt-8 relative z-10 flex justify-center">
                <img src="/logo.jpg" alt="Ambika Hardware" className="h-32 object-contain rounded-xl bg-white/50 p-2 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="industrial-border pl-6">
              <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Browse by category</p>
              <h2 className="text-4xl md:text-5xl font-display">
                Our Product Range
              </h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-medium">View All Products</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Featured</p>
            <h2 className="text-4xl md:text-5xl font-display mb-4">
              Popular Products
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our best-selling items trusted by contractors and homeowners alike
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="opacity-0 animate-reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="font-display text-lg px-8">
                Browse All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-5" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-4xl md:text-6xl font-display mb-6 opacity-0 animate-fade-up">
              Ready to Build Something
              <span className="text-gradient block">Amazing?</span>
            </h2>
            <p className="text-xl opacity-80 mb-10 opacity-0 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Get in touch for bulk orders, custom requirements, or expert advice on your next project.
            </p>
            <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <a href={`tel:${storeInfo.phone}`}>
                <Button size="lg" className="bg-gradient-accent text-accent-foreground font-display text-lg px-8 py-6 shadow-accent">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
              </a>
              <Button
                size="lg"
                onClick={handleWhatsApp}
                className="bg-whatsapp hover:bg-whatsapp/90 font-display text-lg px-8 py-6"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
