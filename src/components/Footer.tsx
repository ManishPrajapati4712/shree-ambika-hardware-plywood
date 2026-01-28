import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Wrench, ArrowUpRight } from 'lucide-react';
import { storeInfo } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-charcoal text-primary-foreground relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="container relative py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Ambika Hardware Logo" className="w-14 h-14 rounded-xl object-contain bg-white" />
              <div>
                <h3 className="text-2xl font-display font-bold mb-4" style={{ fontFamily: 'Arial', fontWeight: 'bold' }}>Ambika Hardware & Plywood</h3>
                <p className="text-sm opacity-60 font-display tracking-widest">& Plywood</p>
              </div>
            </div>
            <p className="text-base opacity-70 leading-relaxed max-w-md mb-6">
              Your trusted partner for quality hardware and plywood products since 1995.
              Serving contractors, builders, and homeowners with the finest materials at competitive prices.
            </p>
            <div className="flex gap-4">
              <a
                href={`tel:${storeInfo.phone}`}
                className="w-12 h-12 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition-colors group"
              >
                <Phone className="h-5 w-5 group-hover:text-accent-foreground" />
              </a>
              <a
                href={`mailto:${storeInfo.email}`}
                className="w-12 h-12 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition-colors group"
              >
                <Mail className="h-5 w-5 group-hover:text-accent-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-6 text-accent">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-accent transition-all group"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg mb-6 text-accent">Contact</h4>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${storeInfo.phone}`}
                className="flex items-start gap-3 opacity-70 hover:opacity-100 transition-opacity"
              >
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5 text-accent" />
                <span>{storeInfo.phone}</span>
              </a>
              <div className="flex items-start gap-3 opacity-70">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-accent" />
                <span>{storeInfo.address}<br />{storeInfo.city}</span>
              </div>
              <div className="flex items-start gap-3 opacity-70">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5 text-accent" />
                <span className="text-sm">Mon-Sat: 8AM - 8PM<br />Sun: 8AM - 1PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-50">
            © {new Date().getFullYear()} {storeInfo.name}. All rights reserved.
          </p>
          <p className="text-sm opacity-50">
            Quality Hardware & Plywood at Best Price
          </p>
        </div>
      </div>
    </footer>
  );
}
