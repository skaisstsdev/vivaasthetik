import React from 'react'
import { motion } from 'framer-motion'
import { getTranslation } from '../i18n/translations'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = ({ lang }) => {
    const t = (path) => getTranslation(lang, path);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <motion.div
            className="page-home"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* 1. IMAGE BANNER (HERO) */}
            <section className="hero-banner">
                <div className="hero-overlay"></div>
                <img src="/hero-banner.jpg" alt="Hero" className="hero-bg" />
                <div className="container hero-content">
                    <motion.span className="hero-tag" variants={itemVariants}>
                        {lang === 'de' ? 'VIVA ÄSTHETIK' : 'VIVA ÄSTHETIK'}
                    </motion.span>
                    <motion.h1 className="heading-xl hero-title" variants={itemVariants}>
                        {t('hero.title')}
                    </motion.h1>
                    <motion.p className="hero-subtitle" variants={itemVariants}>
                        {t('hero.subtitle')}
                    </motion.p>
                    <motion.div className="hero-actions" variants={itemVariants}>
                        <Link to="/booking" className="btn btn-gold">{t('hero.cta')}</Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. RICH TEXT INTRO */}
            <section className="section-intro">
                <div className="container centered">
                    <motion.h2 className="heading-lg" variants={itemVariants}>
                        {lang === 'de' ? <>Willkommen bei <em><strong>VIVA Ästhetik</strong></em></> : <>Добро пожаловать в <em><strong>VIVA Ästhetik</strong></em></>}
                    </motion.h2>
                    <motion.p className="text-editorial" variants={itemVariants}>
                        {lang === 'de'
                            ? "Bei Schönheit geht es nicht nur um das Aussehen, sondern auch um ein Gefühl von Selbstvertrauen, Wohlbefinden und Frische. Wir legen Wert darauf, Ihre natürliche Schönheit hervorzuheben."
                            : "Красота – это не только внешний вид, но и чувство уверенности, благополучия и свежести. Мы ценим то, что подчеркивает вашу естественную красоту."}
                    </motion.p>
                </div>
            </section>

            {/* 3. MULTIROW SECTIONS */}
            <section className="section-multirow">
                <div className="container">
                    {/* Row 1: Services */}
                    <div className="multirow-row">
                        <div className="row-image">
                            <img src="/services.jpg" alt="Services" />
                        </div>
                        <div className="row-content">
                            <h3><strong>{lang === 'de' ? 'Unsere Leistungen' : 'Наши Услуги'}</strong></h3>
                            <p><em>{lang === 'de' ? 'Unsere ästhetischen Leistungen verbinden modernste Technologie mit einem persönlichen Ansatz.' : 'Наши эстетические услуги сочетают в себе новейшие технологии с индивидуальным подходом.'}</em></p>
                            <Link to="/procedures" className="btn btn-outline">{lang === 'de' ? 'Mehr erfahren' : 'Подробнее'}</Link>
                        </div>
                    </div>

                    {/* Row 2: About (Alternate) */}
                    <div className="multirow-row reverse">
                        <div className="row-image">
                            <img src="/about-clinic.jpg" alt="About" />
                        </div>
                        <div className="row-content">
                            <h3><strong>{lang === 'de' ? 'Über VIVA Ästhetik' : 'О VIVA Ästhetik'}</strong></h3>
                            <p><em>{lang === 'de' ? 'Der Ort, an dem hochqualifizierte Spezialisten и moderne Technologien Ihnen helfen, innere Harmonie zu erreichen.' : 'Место, где высококвалифицированные специалисты и современные технологии помогут вам достичь внутренней гармонии.'}</em></p>
                            <Link to="/about" className="btn btn-outline">{lang === 'de' ? 'Mehr erfahren' : 'Подробнее'}</Link>
                        </div>
                    </div>

                    {/* Row 3: Modern Treatment */}
                    <div className="multirow-row">
                        <div className="row-image">
                            <img src="/modern-treatment.jpg" alt="Technology" />
                        </div>
                        <div className="row-content">
                            <h3><strong>{lang === 'de' ? 'Unsere Moderne Behandlungen' : 'Наше современное лечение'}</strong></h3>
                            <p><em>{lang === 'de' ? 'Wir setzen auf den fortschrittlichsten Meso-Injektor Pistor Eliance.' : 'Мы полагаемся на самый современный мезоинъектор Pistor Eliance.'}</em></p>
                            <Link to="/procedures" className="btn btn-outline">{lang === 'de' ? 'Mehr erfahren' : 'Подробнее'}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. WHATSAPP CTA */}
            <section className="section-whatsapp text-center">
                <div className="container">
                    <h2 className="heading-md">{lang === 'de' ? 'Sie sind unsicher?' : 'Не уверены?'}</h2>
                    <p>{lang === 'de' ? 'Kommen Sie zur Beratung vorbei!' : 'Приходите на консультацию!'}</p>
                    <a href="https://wa.me/491799004902" className="whatsapp-btn" target="_blank" rel="noreferrer">
                        WhatsApp
                    </a>
                </div>
            </section>

            {/* 5. REVIEWS */}
            <section className="section-reviews">
                <div className="container">
                    <h2 className="heading-lg text-center">{t('reviews.title')}</h2>
                    <div className="reviews-carousel">
                        {t('reviews.items').map((review, i) => (
                            <motion.div
                                key={i}
                                className="review-card"
                                variants={itemVariants}
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="review-stars">{"★".repeat(review.stars)}</div>
                                <p className="review-text">"{review.text}"</p>
                                <p className="review-author">— {review.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. NEWSLETTER */}
            <section className="section-newsletter">
                <div className="container centered">
                    <h2 className="heading-md"><strong>{lang === 'de' ? 'Erhalten Sie exklusive Empfehlungen' : 'Получайте эксклюзивные рекомендации'}</strong></h2>
                    <p>{lang === 'de' ? 'Hinterlassen Sie Ihre E-Mail, um weitere Informationen zu erhalten' : 'Оставьте свой адрес электронной почты, чтобы получить дополнительную информацию'}</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="E-mail" />
                        <button className="btn btn-gold">{lang === 'de' ? 'Senden' : 'Отправить'}</button>
                    </div>
                </div>
            </section>

            <style jsx="true">{`
        .hero-banner {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(11, 42, 84, 0.4); /* Navy overlay */
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          color: white;
          max-width: 800px;
        }
        .hero-tag {
          font-family: var(--font-accent);
          font-size: 0.9rem;
          letter-spacing: 0.3em;
          margin-bottom: 2rem;
          display: block;
        }
        .hero-title {
          margin-bottom: 2rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 3rem;
          opacity: 0.9;
          max-width: 600px;
          line-height: 1.6;
        }

        .section-intro { padding: 8rem 0; text-align: center; }
        .centered { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
        .text-editorial { font-size: 1.2rem; color: var(--text-secondary); line-height: 1.7; }

        .section-multirow { padding: 4rem 0; background: var(--bg-secondary); }
        .multirow-row {
          display: flex;
          align-items: center;
          gap: 4rem;
          margin-bottom: 6rem;
        }
        .multirow-row.reverse { flex-direction: row-reverse; }
        .row-image { flex: 1; aspect-ratio: 4/3; overflow: hidden; }
        .row-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .multirow-row:hover .row-image img { transform: scale(1.05); }
        .row-content { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; align-items: flex-start; }
        .row-content h3 { font-size: 2rem; }
        .row-content p { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; }

        .section-whatsapp { padding: 6rem 0; }
        .whatsapp-btn {
          display: inline-block;
          background: #25D366;
          color: white;
          padding: 1rem 3rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 2rem;
          transition: 0.3s;
        }
        .whatsapp-btn:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }

        .section-reviews { padding: 6rem 0; background: #f8f8f8; }
        .reviews-carousel { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }
        .review-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .review-stars { color: #FFD700; font-size: 1.5rem; margin-bottom: 1rem; }
        .review-text { font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem; }
        .review-author { font-weight: 600; color: var(--bg-dark); }

        .section-newsletter { padding: 8rem 0; background: var(--bg-dark); color: white; }
        .newsletter-form { display: flex; gap: 1rem; margin-top: 2rem; justify-content: center; width: 100%; max-width: 500px; align-self: center; }
        .newsletter-form input { flex: 1; padding: 1rem; border: none; border-radius: 4px; }

        @media (max-width: 1024px) {
          .reviews-carousel { grid-template-columns: 1fr; }
          .multirow-row, .multirow-row.reverse { flex-direction: column; gap: 2rem; }
          .newsletter-form { flex-direction: column; }
        }
      `}</style>
        </motion.div>
    )
}

export default Home
