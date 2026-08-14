document.addEventListener('DOMContentLoaded', () => {
    // --- State Object ---
    const state = {
        contentType: 'url',
        fgMode: 'solid', // 'solid', 'linear', 'radial'
        colorFg: '#0f172a',
        colorFg2: '#3b82f6',
        colorBg: '#ffffff',
        transparentBg: false,
        dotStyle: 'square', // 'square', 'dots', 'rounded', 'diamond', 'classy'
        eyeFrameStyle: 'square', // 'square', 'rounded', 'circle'
        logoType: 'none', // 'none', 'github', 'twitter', 'linkedin', 'whatsapp', 'globe', 'custom'
        customLogoSrc: null,
        logoScale: 0.22,
        logoPadding: 4,
        ecc: 'H',
        margin: 2,
        history: JSON.parse(localStorage.getItem('qr_studio_history') || '[]')
    };

    // Canvas & Context
    const canvas = document.getElementById('qr-canvas');
    const ctx = canvas.getContext('2d');
