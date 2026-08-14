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
    const presetLogos = {
        github: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230f172a"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
        twitter: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230f172a"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        linkedin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230a66c2"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>`,
        whatsapp: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2325D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`,
        globe: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8 8 0 0 1 18.93 8zM12 4a13.62 13.62 0 0 1 1.77 4h-3.54A13.62 13.62 0 0 1 12 4zm-4.6 1.44A15.65 15.65 0 0 0 6.02 8H3.07a8 8 0 0 1 4.33-3.56zM3.07 10h3.13a16.8 16.8 0 0 0-.1 2 16.8 16.8 0 0 0 .1 2H3.07a7.94 7.94 0 0 1 0-4zm1.53 6h2.95a15.65 15.65 0 0 0 1.38 3.56A8 8 0 0 1 4.6 16zm2.8-2a14.7 14.7 0 0 1-.15-2 14.7 14.7 0 0 1 .15-2h9.2a14.7 14.7 0 0 1 .15 2 14.7 14.7 0 0 1-.15 2zm4.6 5.56A13.62 13.62 0 0 1 10.23 16h3.54A13.62 13.62 0 0 1 12 19.56zm4.6-1.56a15.65 15.65 0 0 0 1.38-3.56h2.95a8 8 0 0 1-4.33 3.56zM17.8 14a16.8 16.8 0 0 0 .1-2 16.8 16.8 0 0 0-.1-2h3.13a7.94 7.94 0 0 1 0 4z"/></svg>`
    };

    function getPayloadData() {
        switch (state.contentType) {
            case 'url':
                return document.getElementById('input-url').value.trim() || 'https://antigravity.ai';
            case 'text':
                return document.getElementById('input-text').value.trim() || 'QR Studio Pro';
            case 'wifi': {
                const ssid = document.getElementById('wifi-ssid').value.trim() || 'WiFi-Network';
                return `WIFI:S:${ssid};T:WPA;P:;;`;
            }
            case 'vcard': {
                const name = document.getElementById('vc-name').value.trim() || 'John Doe';
                return `BEGIN:VCARD\nVERSION:3.0\nN:${name};\nFN:${name}\nEND:VCARD`;
            }
            case 'email': {
                const to = document.getElementById('email-to').value.trim() || 'hello@example.com';
                return `mailto:${to}`;
            }
            case 'phone': {
                const phone = document.getElementById('input-phone').value.trim() || '+1234567890';
                return `tel:${phone}`;
            }
            default:
                return 'https://antigravity.ai';
        }
    }

    function getActiveLogoImage(callback) {
        if (state.logoType === 'none') {
            callback(null);
            return;
        }
        const logoSrc = state.logoType === 'custom' ? state.customLogoSrc : presetLogos[state.logoType];
        if (!logoSrc) {
            callback(null);
            return;
        }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => callback(img);
        img.onerror = () => callback(null);
        img.src = logoSrc;
    }

    function renderQRCode() {
        const textData = getPayloadData();
        getActiveLogoImage((logoImg) => {
            drawQRCodeToCanvasContext(textData, canvas, ctx, 1000, logoImg);
        });
    }

    // Reusable canvas draw helper for Single & Batch generation
    function drawQRCodeToCanvasContext(textData, targetCanvas, targetCtx, resolution, logoImg) {
        // Generate matrix data using qrcode-generator
        const qr = qrcode(0, state.ecc);
        qr.addData(textData);
        qr.make();

        const count = qr.getModuleCount();
        const marginModules = parseInt(state.margin, 10);
        const totalModules = count + marginModules * 2;
        const cellSize = resolution / totalModules;

        targetCanvas.width = resolution;
        targetCanvas.height = resolution;

         // Clear Canvas
        targetCtx.clearRect(0, 0, resolution, resolution);

        // Fill Background
        if (!state.transparentBg) {
            targetCtx.fillStyle = state.colorBg;
            targetCtx.fillRect(0, 0, resolution, resolution);
        }

        // Prepare Foreground Fill Style (Solid or Gradient)
        let fgStyle;
        if (state.fgMode === 'solid') {
            fgStyle = state.colorFg;
        } else if (state.fgMode === 'linear') {
            const grad = targetCtx.createLinearGradient(0, 0, resolution, resolution);
            grad.addColorStop(0, state.colorFg);
            grad.addColorStop(1, state.colorFg2);
            fgStyle = grad;
        } else if (state.fgMode === 'radial') {
            const grad = targetCtx.createRadialGradient(resolution / 2, resolution / 2, 50, resolution / 2, resolution / 2, resolution * 0.7);
            grad.addColorStop(0, state.colorFg);
            grad.addColorStop(1, state.colorFg2);
            fgStyle = grad;
        }
        targetCtx.fillStyle = fgStyle;
        targetCtx.strokeStyle = fgStyle;

        function isEyeModule(r, c) {
            if (r < 7 && c < 7) return true; // Top-Left
            if (r < 7 && c >= count - 7) return true; // Top-Right
            if (r >= count - 7 && c < 7) return true; // Bottom-Left
            return false;
        }

        // Draw Body Modules
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (qr.isDark(r, c)) {
                    if (isEyeModule(r, c)) continue; // Handled separately

                    const x = (c + marginModules) * cellSize;
                    const y = (r + marginModules) * cellSize;

                    // Draw custom dot shapes
                    if (state.dotStyle === 'square') {
                        targetCtx.fillRect(x, y, cellSize + 0.5, cellSize + 0.5);
                    } else if (state.dotStyle === 'dots') {
                        targetCtx.beginPath();
                        targetCtx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
                        targetCtx.fill();
                    } else if (state.dotStyle === 'rounded') {
                        drawRoundedRect(targetCtx, x, y, cellSize, cellSize, cellSize * 0.35);
                        targetCtx.fill();
                    } else if (state.dotStyle === 'diamond') {
                        targetCtx.beginPath();
                        targetCtx.moveTo(x + cellSize / 2, y);
                        targetCtx.lineTo(x + cellSize, y + cellSize / 2);
                        targetCtx.lineTo(x + cellSize / 2, y + cellSize);
                        targetCtx.lineTo(x, y + cellSize / 2);
                        targetCtx.closePath();
                        targetCtx.fill();
                    } else if (state.dotStyle === 'classy') {
                        drawClassyModule(targetCtx, x, y, cellSize);
                    }
                }
            }
        }

        const eyeLocations = [
            { r: 0, c: 0 },
            { r: 0, c: count - 7 },
            { r: count - 7, c: 0 }
        ];

        eyeLocations.forEach(loc => {
            const x = (loc.c + marginModules) * cellSize;
            const y = (loc.r + marginModules) * cellSize;
            const outerSize = 7 * cellSize;
            const innerSize = 3 * cellSize;

            drawCustomEye(targetCtx, x, y, outerSize, innerSize, cellSize, fgStyle);
        });

        // Draw Center Logo Overlay if enabled
        if (state.logoType !== 'none' && logoImg) {
            const logoSize = resolution * state.logoScale;
            const logoX = (resolution - logoSize) / 2;
            const logoY = (resolution - logoSize) / 2;
            const pad = state.logoPadding * 4;

            // Draw solid background behind logo to mask the QR modules
            targetCtx.fillStyle = state.transparentBg ? '#ffffff' : state.colorBg;
            drawRoundedRect(targetCtx, logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2, 16);
            targetCtx.fill();

            // Draw Image
            targetCtx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        }
    }

    function drawCustomEye(ctx, x, y, outerSize, innerSize, cellSize, fgStyle) {
        ctx.save();
        ctx.fillStyle = fgStyle;
        ctx.strokeStyle = fgStyle;
        const lineWidth = cellSize;

        // Outer Frame
        if (state.eyeFrameStyle === 'square') {
            ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, outerSize - lineWidth, outerSize - lineWidth);
            ctx.lineWidth = lineWidth;
            // Center Dot
            ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, innerSize, innerSize);
        } else if (state.eyeFrameStyle === 'rounded') {
            ctx.lineWidth = lineWidth;
            drawRoundedRect(ctx, x + lineWidth / 2, y + lineWidth / 2, outerSize - lineWidth, outerSize - lineWidth, cellSize * 1.5);
            ctx.stroke();
            // Center Inner Dot Rounded
            drawRoundedRect(ctx, x + 2 * cellSize, y + 2 * cellSize, innerSize, innerSize, cellSize * 0.8);
            ctx.fill();
        } else if (state.eyeFrameStyle === 'circle') {
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(x + outerSize / 2, y + outerSize / 2, (outerSize - lineWidth) / 2, 0, Math.PI * 2);
            ctx.stroke();
            // Center Inner Circle
            ctx.beginPath();
            ctx.arc(x + outerSize / 2, y + outerSize / 2, innerSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawRoundedRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function drawClassyModule(ctx, x, y, size) {
        const r = size * 0.4;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size - r);
        ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
        ctx.fill();
    }

    // --- Event Listeners Setup ---

    // 1. Content Type Buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.dataset.type;
            state.contentType = type;

            document.querySelectorAll('.content-form').forEach(f => f.classList.remove('active'));
            document.getElementById(`form-${type}`).classList.add('active');

            renderQRCode();
        });
    });

    // 2. Real-time Text & Form Inputs
    const allInputs = document.querySelectorAll('.content-form input, .content-form textarea, .content-form select');
    allInputs.forEach(input => {
        input.addEventListener('input', renderQRCode);
    });

     // 3. Accordion Toggle
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // 4. Color Controls
    const colorFg = document.getElementById('color-fg');
    const colorFgHex = document.getElementById('color-fg-hex');
    const colorFg2 = document.getElementById('color-fg2');
    const colorFg2Hex = document.getElementById('color-fg2-hex');
    const colorBg = document.getElementById('color-bg');
    const colorBgHex = document.getElementById('color-bg-hex');
    const transparentBg = document.getElementById('transparent-bg');

    colorFg.addEventListener('input', (e) => {
        state.colorFg = e.target.value;
        colorFgHex.value = e.target.value;
        renderQRCode();
    });

    colorFgHex.addEventListener('input', (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
            state.colorFg = val;
            colorFg.value = val;
            renderQRCode();
        }
    });

    colorFg2.addEventListener('input', (e) => {
        state.colorFg2 = e.target.value;
        colorFg2Hex.value = e.target.value;
        renderQRCode();
    });

    colorFg2Hex.addEventListener('input', (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
            state.colorFg2 = val;
            colorFg2.value = val;
            renderQRCode();
        }
    });

    colorBg.addEventListener('input', (e) => {
        state.colorBg = e.target.value;
        colorBgHex.value = e.target.value;
        renderQRCode();
    });

    colorBgHex.addEventListener('input', (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
            state.colorBg = val;
            colorBg.value = val;
            renderQRCode();
        }
    });