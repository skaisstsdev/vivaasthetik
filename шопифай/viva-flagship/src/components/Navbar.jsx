import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'

const Navbar = ({ currentLang, onLangChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: currentLang === 'de' ? 'Home' : 'Главная', path: '/' },
        { name: currentLang === 'de' ? 'Behandlungen' : 'Услуги', path: '/procedures' },
        { name: currentLang === 'de' ? 'Über Uns' : 'О нас', path: '/about' },
        { name: currentLang === 'de' ? 'Termin' : 'Запись', path: '/booking' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src="/logo-white.png" alt="VIVA ÄSTHETIK" className="logo-img" />
                </Link>

                {/* Desktop Links */}
                <div className="nav-desktop">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="lang-switcher">
                        <button
                            onClick={() => onLangChange('de')}
                            className={currentLang === 'de' ? 'active' : ''}
                        >
                            DE
                        </button>
                        <span className="sep">|</span>
                        <button
                            onClick={() => onLangChange('ru')}
                            className={currentLang === 'ru' ? 'active' : ''}
                        >
                            RU
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.4 }}
                    >
                        <div className="mobile-links">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} className="mobile-link">
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mobile-lang">
                                <button onClick={() => onLangChange('de')} className={currentLang === 'de' ? 'active' : ''}>DE</button>
                                <button onClick={() => onLangChange('ru')} className={currentLang === 'ru' ? 'active' : ''}>RU</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 5%;
          transition: var(--transition-smooth);
          background: transparent;
        }
        .nav-scrolled {
          background: var(--bg-dark);
          padding: 1rem 5%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-img {
          height: 50px;
          width: auto;
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.3));
        }
        .nav-desktop {
          display: flex;
          gap: 3rem;
          align-items: center;
        }
        .nav-link {
          text-decoration: none;
          color: white;
          font-family: var(--font-accent);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: var(--transition-smooth);
          text-shadow: 0 0 10px rgba(0,0,0,0.3);
          opacity: 0.85;
        }
        .nav-link:hover, .nav-link.active {
          opacity: 1;
          color: var(--accent-gold);
        }
        .lang-switcher {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-left: 1rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
        }
        .lang-switcher button {
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          font-family: var(--font-accent);
          transition: color 0.3s;
        }
        .lang-switcher button.active {
          color: white;
          font-weight: 600;
        }
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: white;
        }
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          background: var(--bg-dark);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          text-align: center;
        }
        .mobile-link {
          font-size: 1.8rem;
          font-family: var(--font-serif);
          text-decoration: none;
          color: white;
          letter-spacing: 0.05em;
        }
        .mobile-lang {
          margin-top: 3rem;
          display: flex;
          gap: 2rem;
          justify-content: center;
        }
        .mobile-lang button {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: rgba(255,255,255,0.6);
        }
        .mobile-lang button.active {
          color: var(--accent-gold);
          font-weight: 600;
        }
        
        @media (max-width: 1024px) {
          .nav-desktop { display: none; }
          .nav-toggle { display: block; }
        }
      `}</style>
        </nav>
    )
}

export default Navbar
