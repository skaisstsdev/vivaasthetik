import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Procedures from './pages/Procedures'
import About from './pages/About'
import Booking from './pages/Booking'

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    const [lang, setLang] = useState(localStorage.getItem('viva_lang') || 'de');

    const toggleLang = (val) => {
        setLang(val);
        localStorage.setItem('viva_lang', val);
        document.documentElement.lang = val;
    };

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <Router>
            <ScrollToTop />
            <div className="app-container">
                <Navbar currentLang={lang} onLangChange={toggleLang} />
                <main>
                    <Routes>
                        <Route path="/" element={<Home lang={lang} />} />
                        <Route path="/procedures" element={<Procedures lang={lang} />} />
                        <Route path="/about" element={<About lang={lang} />} />
                        <Route path="/booking" element={<Booking lang={lang} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer lang={lang} />
            </div>
        </Router>
    )
}

export default App
