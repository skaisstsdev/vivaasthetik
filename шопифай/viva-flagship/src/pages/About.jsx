import React from 'react'
import { motion } from 'framer-motion'
import { getTranslation } from '../i18n/translations'

const About = ({ lang }) => {
    const t = (path) => getTranslation(lang, path);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <motion.div
            className="page-about"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <section className="about-intro">
                <div className="header-overlay"></div>
                <img src="/about-clinic.jpg" alt="About VIVA" className="header-bg" />
                <div className="container">
                    <motion.span className="hero-tag" variants={itemVariants}>{t('about.tag')}</motion.span>
                    <motion.h1 className="heading-xl white" variants={itemVariants}>{t('about.tagSub')}</motion.h1>
                </div>
            </section>

            <section className="about-content">
                <div className="container grid-2">
                    <motion.div className="about-text" variants={itemVariants}>
                        <h2 className="heading-lg">{t('about.title')}</h2>
                        <p className="text-large">{t('about.text1')}</p>
                        <p className="text-editorial">{t('about.text2')}</p>
                    </motion.div>
                    <motion.div className="about-image" variants={itemVariants}>
                        <div className="image-frame">
                            {/* Profile image placeholder */}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="about-quote">
                <div className="container narrow centered">
                    <motion.blockquote variants={itemVariants}>
                        "{t('about.quote')}"
                    </motion.blockquote>
                </div>
            </section>

            <section className="about-details">
                <div className="container narrow">
                    <motion.div className="details-card" variants={itemVariants}>
                        <p>{t('about.details')}</p>
                    </motion.div>
                </div>
            </section>

            <style jsx="true">{`
        .about-intro {
          height: 60vh;
          position: relative;
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
          background: rgba(11, 42, 84, 0.7);
          z-index: 0;
        }
        .about-intro .container { position: relative; z-index: 1; }
        .heading-xl.white { color: white; margin-top: 1rem; }

        .about-content { padding: 8rem 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
        .text-large { font-size: 1.5rem; font-family: var(--font-serif); margin-bottom: 2rem; color: var(--bg-dark); }
        .image-frame { aspect-ratio: 3/4; background: var(--bg-secondary); border: 1px solid var(--border-subtle); }

        .about-quote { padding: 8rem 0; background: var(--bg-dark); color: white; text-align: center; }
        .about-quote blockquote { font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3rem); line-height: 1.3; font-style: italic; }

        .about-details { padding: 8rem 0; background: var(--bg-secondary); }
        .narrow { max-width: 800px; margin: 0 auto; }
        .details-card { background: white; padding: 4rem; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); line-height: 1.8; color: var(--text-secondary); }

        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr; gap: 4rem; }
        }
      `}</style>
        </motion.div>
    )
}

export default About
