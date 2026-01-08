import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink, Wrench } from 'lucide-react';
import { storeInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I want to know more about your products and services.");
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${storeInfo.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${storeInfo.email}`, '_self');
  };

  const handleMap = () => {
    window.open(storeInfo.mapUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-4">Get in touch</p>
          <h1 className="text-4xl md:text-6xl font-display mb-6">Contact Us</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Have questions? Need a quote? We're here to help!
            Reach out through any of the channels below.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <button
            onClick={handleCall}
            className="group relative bg-charcoal text-primary-foreground rounded-2xl p-8 text-left overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mb-6 shadow-accent group-hover:scale-110 transition-transform">
                <Phone className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-display text-3xl mb-2">Call Now</h3>
              <p className="text-primary-foreground/60 mb-4">Speak directly with our team</p>
              <span className="font-display text-xl text-accent">{storeInfo.phone}</span>
            </div>
          </button>

          <button
            onClick={handleWhatsApp}
            className="group relative bg-whatsapp text-white rounded-2xl p-8 text-left overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="font-display text-3xl mb-2">WhatsApp Us</h3>
              <p className="text-white/70 mb-4">Quick response guaranteed</p>
              <span className="font-display text-xl">Send Message →</span>
            </div>
          </button>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Visit Us */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-3">Visit Our Store</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {storeInfo.address}<br />
                  {storeInfo.city}
                </p>
                <Button variant="outline" onClick={handleMap} className="font-display">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Maps
                </Button>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-3">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between gap-8">
                    <span>Monday - Saturday</span>
                    <span className="font-medium text-foreground">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span>Sunday</span>
                    <span className="font-medium text-foreground">10:00 AM - 2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-3">Phone</h3>
                <p className="text-muted-foreground mb-4">
                  For orders and inquiries
                </p>
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="font-display text-xl text-accent hover:underline"
                >
                  {storeInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-3">Email</h3>
                <p className="text-muted-foreground mb-4">
                  For quotes and bulk orders
                </p>
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="font-body text-lg text-accent hover:underline break-all"
                >
                  {storeInfo.email.toLowerCase()}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-charcoal rounded-2xl overflow-hidden">
          <div className="aspect-[16/7] flex items-center justify-center relative">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="text-center text-primary-foreground relative z-10 p-8">
              <div className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-accent">
                <MapPin className="h-10 w-10 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl mb-3">Find Us on Google Maps</h3>
              <p className="text-primary-foreground/60 mb-6 max-w-md mx-auto">
                Located in the heart of the market area, easily accessible with ample parking
              </p>
              <Button onClick={handleMap} className="bg-gradient-accent text-accent-foreground font-display shadow-accent">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
