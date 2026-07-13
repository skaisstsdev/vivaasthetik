import React from 'react'
import { motion } from 'framer-motion'
import { getTranslation } from '../i18n/translations'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Procedures = ({ lang }) => {
    const t = (path) => getTranslation(lang, path);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="page-procedures">
            <section className="proc-header">
                <div className="header-overlay"></div>
                <img src="/services.jpg" alt="Behandlungen" className="header-bg" />
                <div className="container">
                    <motion.span
                        className="hero-tag"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {lang === 'de' ? 'Umfassendes Portfolio' : 'Полное портфолио'}
                    </motion.span>
                    <motion.h1
                        className="heading-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t('procedures.title')}
                    </motion.h1>
                    <motion.p
                        className="text-editorial white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {t('procedures.subtitle')}
                    </motion.p>
                </div>
            </section>

            <section className="proc-grid-section">
                <div className="container">
                    <div className="proc-grid">
                        {t('procedures.items').map((item, i) => (
                            <motion.div
                                key={item.id}
                                className="proc-card"
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="proc-image-placeholder">
                                    {/* Procedural image */}
                                </div>
                                <div className="proc-info">
                                    <div className="proc-title-row">
                                        <h3>{item.title}</h3>
                                        <ArrowUpRight size={20} className="proc-icon" />
                                    </div>
                                    <p>{item.desc}</p>
                                    <Link to={`/booking?service=${item.id}`} className="proc-link">
                                        {lang === 'de' ? 'Termin buchen' : 'Записаться'}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx="true">{`
        .proc-header {
          padding: 15vh 0 10vh;
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          color: white;
          overflow: hidden;
        }
        .header-bg {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover;
          z-index: -1;
        }
        .header-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(11, 42, 84, 0.6);
          z-index: 0;
        }
        .proc-header .container { position: relative; z-index: 1; }
        .text-editorial.white { color: rgba(255,255,255,0.9); }

        .proc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 3rem;
          margin-top: 4rem;
        }
        .proc-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          overflow: hidden;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .proc-card:hover {
          border-color: var(--accent-gold);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .proc-image-placeholder {
          aspect-ratio: 16/10;
          background: var(--bg-secondary);
          width: 100%;
        }
        .proc-info {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .proc-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .proc-title-row h3 {
          font-family: var(--font-accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 1.1rem;
          color: var(--bg-dark);
        }
        .proc-icon {
          color: var(--accent-gold);
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .proc-card:hover .proc-icon { opacity: 1; }
        .proc-info p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          min-height: 3.2em;
        }
        .proc-link {
          font-family: var(--font-accent);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          color: var(--bg-dark);
          border-bottom: 2px solid var(--accent-gold);
          align-self: flex-start;
          padding-bottom: 2px;
          transition: color 0.3s;
        }
        .proc-link:hover { color: var(--accent-gold); }

        @media (max-width: 768px) {
          .proc-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}

export default Procedures
