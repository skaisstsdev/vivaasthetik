import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTranslation } from '../i18n/translations'
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const Booking = ({ lang }) => {
    const t = (path) => getTranslation(lang, path);
    const [searchParams] = useSearchParams();
    const initialService = searchParams.get('service') || '';

    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        service: initialService,
        specialist: '',
        date: null,
        time: ''
    });

    const services = [
        { id: 'botox', title: lang === 'de' ? 'Botox' : 'Ботокс' },
        { id: 'lippen', title: lang === 'de' ? 'Lippenunterspritzung' : 'Коррекция губ' },
        { id: 'prp', title: lang === 'de' ? 'PRP / Vampirlifting' : 'PRP / Вампирлифтинг' },
        { id: 'faden', title: lang === 'de' ? 'Fadenlifting' : 'Нитевой лифтинг' },
        { id: 'intime', title: lang === 'de' ? 'Intimlifting' : 'Интимный лифтинг' }
    ];

    const specialists = [
        { id: 'shnal', name: 'Dr. Natalia Shnal' }
    ];

    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const StepIndicator = () => (
        <div className="step-indicator">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`step-dot ${step >= i ? 'active' : ''}`}>
                    <span className="step-num">{i}</span>
                </div>
            ))}
            <style jsx="true">{`
        .step-indicator { display: flex; justify-content: center; gap: 3rem; margin-bottom: 4rem; position: relative; }
        .step-indicator::after {
          content: ''; position: absolute; top: 50%; left: 50%; width: 15rem; height: 1px; 
          background: var(--border-strong); z-index: 0; transform: translate(-50%, -50%);
        }
        .step-dot { 
          width: 2.5rem; height: 2.5rem; background: var(--bg-primary); 
          border: 1px solid var(--border-strong); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; 
          z-index: 1; transition: 0.3s;
        }
        .step-dot.active { border-color: var(--accent-gold); color: var(--accent-gold); }
        .step-num { font-family: var(--font-accent); font-size: 0.8rem; }
      `}</style>
        </div>
    );

    return (
        <div className="page-booking">
            <section className="booking-intro">
                <div className="container narrow">
                    <motion.h1 className="heading-lg centered">{lang === 'de' ? 'Termin buchen' : 'Запись на прием'}</motion.h1>
                    <StepIndicator />

                    <div className="booking-card">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="booking-step"
                                >
                                    <h3>{lang === 'de' ? 'Wählen Sie eine Behandlung' : 'Выберите процедуру'}</h3>
                                    <div className="selection-list">
                                        {services.map(s => (
                                            <button
                                                key={s.id}
                                                className={`selection-btn ${bookingData.service === s.id ? 'active' : ''}`}
                                                onClick={() => { setBookingData({ ...bookingData, service: s.id }); nextStep(); }}
                                            >
                                                {s.title}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="booking-step"
                                >
                                    <button onClick={prevStep} className="btn-back"><ChevronLeft size={16} /> {lang === 'de' ? 'Zurück' : 'Назад'}</button>
                                    <h3>{lang === 'de' ? 'Wählen Sie einen Experten' : 'Выберите специалиста'}</h3>
                                    <div className="selection-list">
                                        {specialists.map(s => (
                                            <button
                                                key={s.id}
                                                className={`selection-btn ${bookingData.specialist === s.id ? 'active' : ''}`}
                                                onClick={() => { setBookingData({ ...bookingData, specialist: s.id }); nextStep(); }}
                                            >
                                                <User size={18} /> {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="booking-step"
                                >
                                    <button onClick={prevStep} className="btn-back"><ChevronLeft size={16} /> {lang === 'de' ? 'Zurück' : 'Назад'}</button>
                                    <h3>{lang === 'de' ? 'Wählen Sie Zeit & Datum' : 'Выберите время и дату'}</h3>
                                    <div className="time-grid">
                                        {timeSlots.map(t => (
                                            <button
                                                key={t}
                                                className={`time-btn ${bookingData.time === t ? 'active' : ''}`}
                                                onClick={() => { setBookingData({ ...bookingData, time: t }); nextStep(); }}
                                            >
                                                <Clock size={16} /> {t}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="booking-step confirmation"
                                >
                                    <CheckCircle size={64} className="success-icon" />
                                    <h2>{lang === 'de' ? 'Fast geschafft!' : 'Почти готово!'}</h2>
                                    <p>{lang === 'de' ? 'Zusammenfassung Ihrer Buchung:' : 'Сводка вашей записи:'}</p>
                                    <div className="summary-box">
                                        <p><strong>{lang === 'de' ? 'Behandlung' : 'Процедура'}:</strong> {services.find(s => s.id === bookingData.service)?.title}</p>
                                        <p><strong>{lang === 'de' ? 'Zeit' : 'Время'}:</strong> {bookingData.time}</p>
                                    </div>
                                    <button className="btn-primary" onClick={() => alert('Booking Sent!')}>
                                        {lang === 'de' ? 'Buchung absenden' : 'Отправить запись'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <style jsx="true">{`
        .booking-intro { padding-top: 15vh; min-height: 80vh; background: var(--bg-secondary); }
        .narrow { max-width: 800px; }
        .booking-card {
          background: white;
          border: 1px solid var(--border-subtle);
          padding: 4rem;
          min-height: 500px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }
        .booking-step h3 { margin-bottom: 2.5rem; font-family: var(--font-accent); text-transform: uppercase; letter-spacing: 0.1em; font-size: 1rem; text-align: center; color: var(--bg-dark); }
        .selection-list { display: flex; flex-direction: column; gap: 1rem; }
        .selection-btn {
          padding: 1.5rem 2rem; border: 1px solid var(--border-strong); 
          background: transparent; cursor: pointer; text-align: left; 
          font-family: var(--font-sans); font-size: 1rem; color: var(--text-primary);
          transition: 0.3s; display: flex; align-items: center; gap: 1rem;
        }
        .selection-btn:hover { border-color: var(--accent-gold); background: rgba(212, 175, 55, 0.05); }
        .selection-btn.active { background: var(--bg-dark); color: white; border-color: var(--bg-dark); }
        
        .btn-back { 
          background: none; border: none; cursor: pointer; color: var(--text-muted); 
          font-family: var(--font-accent); font-size: 0.8rem; text-transform: uppercase;
          margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem;
        }
        
        .time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .time-btn {
          padding: 1rem; border: 1px solid var(--border-strong); background: transparent;
          cursor: pointer; font-family: var(--font-accent); display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: 0.3s;
        }
        .time-btn:hover { border-color: var(--accent-gold); }
        .time-btn.active { background: var(--accent-gold); color: white; border-color: var(--accent-gold); }

        .confirmation { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2rem; }
        .success-icon { color: var(--accent-gold); }
        .summary-box { background: var(--bg-secondary); padding: 2rem; width: 100%; text-align: left; border: 1px solid var(--border-subtle); }
        .btn-primary { background: var(--bg-dark); color: white; border: none; padding: 1.2rem 3rem; font-family: var(--font-accent); text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { background: var(--accent-gold); }
        
        @media (max-width: 600px) {
          .booking-card { padding: 2rem; }
          .time-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
        </div>
    )
}

export default Booking
