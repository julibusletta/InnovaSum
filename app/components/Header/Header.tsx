'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaChevronDown, FaUserCircle, FaShoppingBag, FaFileInvoice, FaHeart, FaSignOutAlt, FaTruck, FaQuestionCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { useCart } from '@/app/context/CartContext';
import { useAuthModal } from '@/app/context/AuthModalContext';
import '../../styles/Header.css';

interface NavLink {
  label: string;
  href: string;
  id?: string;
  submenu?: NavLink[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const { openLogin } = useAuthModal();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await fetch('/api/categories');
        const data = await resp.json();
        setDbCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories for nav:', err);
      }
    };
    fetchCategories();
  }, []);

  const buildCategoryNav = () => {
    // Top-level categories
    const parents = dbCategories.filter(c => !c.parentId);
    const buildSub = (parentId: string) => {
        const children = dbCategories.filter(c => c.parentId === parentId || c.parentId === dbCategories.find(p => p.slug === parentId)?.id);
        if (children.length === 0) return undefined;
        return children.map(c => ({
            label: c.name,
            href: `/category/${c.slug}`,
            submenu: buildSub(c.slug)
        }));
    };

    return parents.map(c => ({
        label: c.name,
        href: `/category/${c.slug}`,
        submenu: buildSub(c.slug)
    }));
  };

  const navLinks: NavLink[] = [
    { label: 'HOME', href: '/', id: 'home' },
    { label: 'NOSOTROS', href: '/quienes-somos', id: 'nosotros' },
    {
      label: 'PRODUCTOS',
      href: '/#productos',
      id: 'productos',
      submenu: dbCategories.length > 0 ? buildCategoryNav() : undefined,
    },
  ];

  // Update active link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = document.querySelectorAll('section, .hero');
      let currentSection = 'home';
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150) {
          currentSection = section.id || 'home';
        }
      });
      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // On mobile we don't necessarily want to lock body scroll for a dropdown
    // but if it's very long, maybe we do. Compragamer doesn't lock it usually.
  };

  const toggleDropdown = (label: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenDropdown(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header 
      className={`main-site-header sticky top-0 z-[1100] bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="header-top flex items-center justify-between px-4 md:px-10 py-3 md:py-4">
        {/* Left: Hamburger (Mobile Only) */}
        <button
          onClick={toggleMenu}
          className="hamburger-menu md:hidden flex items-center justify-center w-10 h-10 p-0 bg-transparent border-0 cursor-pointer text-black z-[1100]"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Center/Left: Logo */}
        <Link href="/" className="logo flex items-center">
          <img
            src="/images/innovasumlogo.png"
            alt="Innovasum Logo"
            className="w-auto object-contain cursor-pointer transition-transform hover:scale-105"
          />
        </Link>

          <form onSubmit={handleSearch} className="hidden md:flex search-bar flex-1 max-w-2xl mx-10 items-center rounded-lg border border-gray-300 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-3 border-0 bg-transparent font-sans text-base outline-0"
            />
            <button type="submit" className="px-5 py-3 border-0 bg-transparent cursor-pointer flex items-center justify-center text-gray-600 hover:text-orange-600">
              <FaSearch size={20} />
            </button>
          </form>

          {/* Right: Actions */}
          <div className="header-actions flex items-center gap-4 md:gap-6">
            {/* Search Icon Mobile */}
            <button 
              className="md:hidden bg-transparent border-0 cursor-pointer text-gray-700 hover:text-orange-600" 
              aria-label="Buscar"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <FaSearch size={22} />
            </button>



            {/* Account Icon Mobile */}
            <button 
              className="md:hidden bg-transparent border-0 cursor-pointer text-gray-700 hover:text-orange-600" 
              aria-label="Cuenta"
              onClick={() => session ? router.push('/mi-cuenta') : openLogin()}
            >
              <FaUserCircle size={24} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="cart-icon relative flex items-center text-gray-700 hover:text-orange-600 cursor-pointer transition-colors">
              <FaShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="cart-count absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
      </div>
      {/* Mobile Search Input */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex search-bar items-center rounded-lg border border-gray-300 bg-gray-50 shadow-inner">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2 border-0 bg-transparent font-sans text-sm outline-0"
            />
            <button type="submit" className="px-4 py-2 border-0 bg-transparent cursor-pointer flex items-center justify-center text-gray-600 hover:text-orange-600">
              <FaSearch size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-[#001a3d] header-nav px-10 py-0 items-center justify-center h-14">
        <div className="nav-primary flex gap-8 list-none m-0 p-0 w-auto h-14 items-center">
          {navLinks.map((link) => (
            <div key={link.label} className="dropdown relative inline-block group">
              <Link
                href={link.href}
                className={`text-white font-medium text-[13px] py-1.5 px-4 rounded transition-all flex items-center gap-2 leading-none ${activeLink === link.id ? 'font-bold' : 'hover:bg-gray-800'}`}
              >
                {link.label}
                {link.submenu && <FaChevronDown size={10} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />}
              </Link>
              {link.submenu && (
                <div className="dropdown-content absolute bg-white min-w-[220px] shadow-lg rounded-lg top-full left-0 p-3 hidden group-hover:block z-[1200]">
                  {link.submenu.map((sublink) => (
                    <div key={sublink.label} className="relative group/sub">
                      <Link
                        href={sublink.href}
                        className="flex items-center justify-between text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all no-underline w-full whitespace-nowrap uppercase"
                      >
                        {sublink.label}
                        {sublink.submenu && <FaChevronDown size={10} className="-rotate-90 opacity-70 ml-4 shrink-0" />}
                      </Link>
                      {sublink.submenu && (
                        <div className="absolute bg-white min-w-[200px] shadow-lg rounded-lg top-0 left-full ml-1 p-3 hidden group-hover/sub:block z-[1300]">
                          {sublink.submenu.map((nestedLink) => (
                            <Link
                              key={nestedLink.label}
                              href={nestedLink.href}
                              className="block text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all no-underline whitespace-nowrap uppercase"
                            >
                              {nestedLink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}


          {/* Separator and My Account */}
          <div className="h-6 w-[1px] bg-gray-700 mx-2 hidden md:block"></div>
          
          <div className="dropdown relative inline-block group">
            {session ? (
              <>
                <button
                  className="text-white font-medium text-[13px] py-1.5 px-4 rounded transition-all flex items-center gap-2 hover:bg-gray-800 bg-transparent border-0 cursor-pointer uppercase tracking-normal leading-none"
                >
                  MI CUENTA
                  <FaChevronDown size={10} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                </button>
                <div className="dropdown-content absolute bg-white min-w-[220px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-lg top-[calc(100%-8px)] right-0 p-3 hidden group-hover:block z-[1100] border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-sm text-gray-400 m-0">Hola {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}</p>
                  </div>
                  {[
                    { label: 'Mi cuenta', href: '/mi-cuenta' },
                    { label: 'Mis Compras', href: '/mi-cuenta/compras' },
                    { label: 'Facturas', href: '/mi-cuenta/facturas' },
                    { label: 'Preguntas', href: '/preguntas' },
                    { label: 'Favoritos', href: '/mi-cuenta/favoritos' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center text-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-md transition-all no-underline"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-1 pt-1 border-t border-gray-50">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center justify-end text-red-500 px-4 py-2.5 text-sm font-bold hover:bg-red-50 rounded-md transition-all bg-transparent border-0 cursor-pointer text-right"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => openLogin()}
                className="text-white font-medium text-[13px] py-1.5 px-4 rounded transition-all flex items-center gap-2 hover:bg-gray-800 bg-transparent border-0 cursor-pointer uppercase tracking-normal leading-none"
              >
                MI CUENTA
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown (Compragamer style) */}
      <div 
        id="main-nav" 
        className={`md:hidden absolute top-full left-0 w-full bg-white z-[900] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="mobile-dropdown-nav flex flex-col overflow-y-auto max-h-[80vh]">
          {/* Mobile Account Section Removed - Now in Header Icons */}

          {navLinks.map((link) => (
            <div key={link.label} className="mobile-menu-item border-b border-gray-100">
              <div className="flex items-center justify-between px-6 py-4">
                <Link 
                  href={link.href} 
                  className="text-black text-sm font-bold uppercase no-underline flex-1"
                  onClick={() => !link.submenu && setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <button 
                    onClick={(e) => toggleDropdown(link.label, e)}
                    className="p-2 text-gray-400 bg-transparent border-0 cursor-pointer"
                  >
                    <FaChevronDown className={`transition-transform duration-300 ${openDropdown[link.label] ? 'rotate-180' : ''}`} size={16} />
                  </button>
                )}
              </div>
              
              {link.submenu && openDropdown[link.label] && (
                <div className="bg-gray-50 animate-slideDown">
                  {link.submenu.map((sublink) => (
                    <div key={sublink.label} className="border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between px-10 py-3">
                        <Link
                          href={sublink.href}
                          className="text-gray-600 text-xs font-semibold hover:text-blue-600 no-underline uppercase flex-1"
                          onClick={() => !sublink.submenu && setIsMenuOpen(false)}
                        >
                          {sublink.label}
                        </Link>
                        {sublink.submenu && (
                          <button 
                            onClick={(e) => toggleDropdown(sublink.label, e)}
                            className="p-2 text-gray-400 bg-transparent border-0 cursor-pointer"
                          >
                            <FaChevronDown className={`transition-transform duration-300 ${openDropdown[sublink.label] ? 'rotate-180' : ''}`} size={14} />
                          </button>
                        )}
                      </div>
                      {sublink.submenu && openDropdown[sublink.label] && (
                        <div className="bg-gray-100 animate-slideDown">
                          {sublink.submenu.map((nestedLink) => (
                            <Link
                              key={nestedLink.label}
                              href={nestedLink.href}
                              className="block text-gray-500 px-14 py-3 text-xs font-semibold border-b border-gray-200 last:border-0 hover:text-blue-600 no-underline uppercase"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {nestedLink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </nav>
      </div>
    </header>
  );
}
