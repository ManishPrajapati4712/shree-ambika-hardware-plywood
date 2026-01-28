import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, Wrench, User } from 'lucide-react';
import { useState, useEffect } from 'react';

import { storeInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import OfferBanner from './OfferBanner';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHeroPage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHeroPage
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
        : 'bg-transparent'
        }`}
    >
      {/* Top bar - only show when scrolled or not on hero */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isScrolled || !isHeroPage ? 'max-h-0' : 'max-h-12'
          }`}
      >
        <div className="bg-accent text-accent-foreground py-2 text-sm">
          <div className="container flex justify-between items-center">
            <span className="hidden sm:flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              {storeInfo.tagline}
            </span>
            <a
              href={`tel:${storeInfo.phone}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity font-medium"
            >
              <Phone className="h-4 w-4" />
              <span>{storeInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Offer Banner */}
      <OfferBanner />

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Ambika Hardware Logo" className="w-12 h-12 rounded-xl object-contain bg-white group-hover:scale-105 transition-transform" />
            <div className="hidden sm:block">
              <h1 className={`text-xl font-display leading-tight transition-colors ${isScrolled || !isHeroPage ? 'text-foreground' : 'text-primary-foreground'
                }`}>
                Ambika Hardware
              </h1>
              <p className={`text-xs font-display tracking-widest transition-colors ${isScrolled || !isHeroPage ? 'text-muted-foreground' : 'text-primary-foreground/60'
                }`}>& Plywood</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-5 py-2 rounded-lg font-medium transition-all relative ${isActive(link.href)
                  ? 'text-accent'
                  : isScrolled || !isHeroPage
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">


            {/* User / Login */}
            {localStorage.getItem('user') ? (
              <div className="hidden md:flex items-center gap-2">
                <span className={`text-sm font-medium ${isScrolled || !isHeroPage ? 'text-foreground' : 'text-primary-foreground'}`}>
                  Hi, {JSON.parse(localStorage.getItem('user') || '{}').name?.split(' ')[0] || 'User'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className={isScrolled || !isHeroPage ? '' : 'text-primary-foreground hover:bg-white/10 hover:text-primary-foreground'}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isScrolled || !isHeroPage ? '' : 'text-primary-foreground hover:bg-white/10 hover:text-primary-foreground'}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            <Link to="/admin" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className={isScrolled || !isHeroPage ? '' : 'text-primary-foreground hover:bg-white/10 hover:text-primary-foreground'}
              >
                Admin
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled || !isHeroPage ? 'hover:bg-muted' : 'text-primary-foreground hover:bg-white/10'
                }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden pt-2 pb-2 border-t border-border/50 mt-4 animate-fade-up bg-white text-black shadow-xl rounded-xl z-50 relative">
            <div className="flex flex-col gap-1 p-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg font-display text-lg tracking-wide transition-colors ${isActive(link.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted text-gray-800'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="py-3 px-4 rounded-lg font-display text-lg tracking-wide hover:bg-muted text-gray-800"
              >
                Admin Panel
              </Link>
              {/* Mobile Login/Logout */}
              {localStorage.getItem('user') ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className="py-3 px-4 rounded-lg font-display text-lg tracking-wide hover:bg-muted text-left w-full text-gray-800"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 px-4 rounded-lg font-display text-lg tracking-wide hover:bg-muted text-gray-800"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
