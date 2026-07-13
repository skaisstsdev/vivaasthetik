import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, Phone, Mail } from 'lucide-react'

const Footer = ({ lang }) => {
  const t = {
    de: {
      about: 'VIVA Ästhetik – Exzellenz in der ästhetischen Medizin. Wir vereinen medizinische Präzision mit künstlerischem Feingefühl.',
      links: 'Schnellzugriff',
      contact: 'Kontakt',
      legal: 'Rechtliches',
      rights: 'Alle Rechte vorbehalten.',
    },
    ru: {
      about: 'VIVA Ästhetik – совершенство в эстетической медицине. Мы сочетаем медицинскую точность с художественным чутьем.',
      links: 'Быстрые ссылки',
      contact: 'Контакты',
      legal: 'Юридическая информация',
      rights: 'Все права защищены.',
    }
  }[lang];

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo-white.png" alt="VIVA" className="footer-logo-img" />
          <p className="footer-about">{t.about}</p>
          <div className="social-links">
            <a href="https://instagram.com/viva.aesthetik" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-nav">
          <h3>{t.links}</h3>
          <Link to="/">{lang === 'de' ? 'Home' : 'Главная'}</Link>
          <Link to="/procedures">{lang === 'de' ? 'Behandlungen' : 'Услуги'}</Link>
          <Link to="/about">{lang === 'de' ? 'Über Uns' : 'О нас'}</Link>
          <Link to="/booking">{lang === 'de' ? 'Termin' : 'Запись'}</Link>
        </div>

        <div className="footer-contact">
          <h3>{t.contact}</h3>
          <div className="contact-item">
            <MapPin size={16} />
            <span>Musterstraße 123, 10115 Berlin</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <span>+49 179 9004902</span>
          </div>
          <div className="contact-item">
            <Mail size={16} />
            <span>info@vivaasthetik.de</span>
          </div>
        </div>

        <div className="footer-legal">
          <h3>{t.legal}</h3>
          <a href="#">Impressum</a>
          <a href="#">Datenschutz</a>
          <a href="#">AGB</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VIVA Ästhetik. {t.rights}</p>
      </div>

      <style jsx="true">{`
        .footer {
          background-color: var(--bg-dark);
          color: white;
          padding: 6rem 5% 3rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 4rem;
        }
        .footer-logo-img {
          height: 40px;
          margin-bottom: 2rem;
        }
        .footer-about {
          color: rgba(255,255,255,0.7);
          max-width: 30ch;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .footer h3 {
          font-family: var(--font-accent);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          color: var(--accent-gold);
        }
        .footer-nav, .footer-legal, .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-nav a, .footer-legal a {
          text-decoration: none;
          color: rgba(255,255,255,0.8);
          font-size: 0.95rem;
          transition: color 0.3s;
        }
        .footer-nav a:hover, .footer-legal a:hover {
          color: var(--accent-gold);
        }
        .contact-item {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
          color: rgba(255,255,255,0.8);
          font-size: 0.95rem;
        }
        .social-links a {
          color: white;
          transition: transform 0.3s;
          display: inline-block;
        }
        .social-links a:hover {
          transform: translateY(-3px);
          color: var(--accent-gold);
        }
        .footer-bottom {
          margin-top: 6rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
