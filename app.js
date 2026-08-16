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

    transparentBg.addEventListener('change', (e) => {
        state.transparentBg = e.target.checked;
        renderQRCode();
    });

    // Segmented Mode (Solid, Linear, Radial)
    document.querySelectorAll('#fg-mode-control .segment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#fg-mode-control .segment-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            state.fgMode = btn.dataset.fgmode;
            document.getElementById('group-color-fg2').style.display = state.fgMode === 'solid' ? 'none' : 'flex';
            renderQRCode();
        });
    });

    // Preset Palettes
    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.colorFg = btn.dataset.fg;
            state.colorFg2 = btn.dataset.fg2;
            state.fgMode = btn.dataset.mode;

            colorFg.value = state.colorFg;
            colorFgHex.value = state.colorFg;
            colorFg2.value = state.colorFg2;
            colorFg2Hex.value = state.colorFg2;

            document.querySelectorAll('#fg-mode-control .segment-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.fgmode === state.fgMode);
            });
            document.getElementById('group-color-fg2').style.display = state.fgMode === 'solid' ? 'none' : 'flex';

            renderQRCode();
        });
    });

     // 5. Shapes Options
    document.querySelectorAll('#dot-style-options .grid-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#dot-style-options .grid-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.dotStyle = btn.dataset.style;
            renderQRCode();
        });
    });

    document.querySelectorAll('#eye-frame-options .grid-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#eye-frame-options .grid-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.eyeFrameStyle = btn.dataset.eyectrl;
            renderQRCode();
        });
    });

     // 6. Logo Overlay Controls
    document.querySelectorAll('#logo-presets .logo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#logo-presets .logo-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.logoType = btn.dataset.logo;

            // Show/Hide custom file upload container depending on selection
            const uploadWrapper = document.getElementById('logo-upload-wrapper');
            if (uploadWrapper) {
                uploadWrapper.style.display = state.logoType === 'custom' ? 'block' : 'none';
            }

            renderQRCode();
        });
    });

    const logoUpload = document.getElementById('logo-upload');
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                state.customLogoSrc = event.target.result;
                state.logoType = 'custom';
                document.querySelectorAll('#logo-presets .logo-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.logo === 'custom');
                });
                renderQRCode();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('logo-size').addEventListener('input', (e) => {
        state.logoScale = parseInt(e.target.value, 10) / 100;
        document.getElementById('logo-size-val').textContent = e.target.value;
        renderQRCode();
    });

    document.getElementById('logo-padding').addEventListener('input', (e) => {
        state.logoPadding = parseInt(e.target.value, 10);
        document.getElementById('logo-pad-val').textContent = e.target.value;
        renderQRCode();
    });

    // 7. Advanced ECC & Margin
    document.getElementById('ecc-level').addEventListener('change', (e) => {
        state.ecc = e.target.value;
        renderQRCode();
    });

    document.getElementById('margin-size').addEventListener('input', (e) => {
        state.margin = e.target.value;
        document.getElementById('margin-val').textContent = e.target.value;
        renderQRCode();
    });

    // --- Downloads & Export Functions ---

    function saveToHistory(dataUrl) {
        state.history.unshift(dataUrl);
        if (state.history.length > 8) state.history.pop();
        localStorage.setItem('qr_studio_history', JSON.stringify(state.history));
        renderHistoryGrid();
    }

    function renderHistoryGrid() {
        const grid = document.getElementById('history-grid');
        if (state.history.length === 0) {
            grid.innerHTML = `<div class="empty-history">No saved QR codes yet. Generated items appear here.</div>`;
            return;
        }

        grid.innerHTML = state.history.map(imgSrc => `
            <div class="history-item">
                <img src="${imgSrc}" alt="Saved QR Code">
            </div>
        `).join('');
    }

    document.getElementById('btn-download-png').addEventListener('click', () => {
        const exportRes = parseInt(document.getElementById('export-res').value, 10);

        // Render to temporary canvas at target resolution
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = exportRes;
        tempCanvas.height = exportRes;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0, exportRes, exportRes);

        const dataUrl = tempCanvas.toDataURL('image/png');

        // Trigger Download
        const link = document.createElement('a');
        link.download = `QR-Studio-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        saveToHistory(dataUrl);
        showToast('PNG QR Code downloaded successfully!');
    });

    document.getElementById('btn-download-svg').addEventListener('click', () => {
        const svgString = generateSVG();
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const dataUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `QR-Studio-${Date.now()}.svg`;
        link.href = dataUrl;
        link.click();

        // Save a PNG thumbnail to history
        const pngUrl = canvas.toDataURL('image/png');
        saveToHistory(pngUrl);
        showToast('Vector SVG QR Code downloaded successfully!');
    });

    document.getElementById('btn-copy-img').addEventListener('click', async () => {
        try {
            canvas.toBlob(async (blob) => {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                showToast('Copied QR Image to clipboard!');
            });
        } catch (err) {
            showToast('Unable to copy directly. Download instead.');
        }
    });

    document.getElementById('btn-clear-history').addEventListener('click', () => {
        state.history = [];
        localStorage.removeItem('qr_studio_history');
        renderHistoryGrid();
        showToast('History cleared');
    });

    // --- View Switcher (Generator vs Batch vs Scanner) ---
    const genView = document.getElementById('generator-view');
    const batchView = document.getElementById('batch-view');
    const scanView = document.getElementById('scanner-view');
    const btnGen = document.getElementById('btn-mode-gen');
    const btnBatch = document.getElementById('btn-mode-batch');
    const btnScan = document.getElementById('btn-mode-scan');

    function switchView(activeBtn, activeView) {
        [btnGen, btnBatch, btnScan].forEach(btn => {
            if (btn) {
                btn.classList.remove('active');
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
            }
        });
        activeBtn.classList.add('active');
        activeBtn.classList.remove('btn-secondary');
        activeBtn.classList.add('btn-primary');

        genView.style.display = 'none';
        batchView.style.display = 'none';
        scanView.style.display = 'none';

        if (activeView === genView) genView.style.display = 'grid';
        else if (activeView === batchView) batchView.style.display = 'grid';
        else if (activeView === scanView) scanView.style.display = 'flex';

        if (activeView !== scanView) {
            stopWebcam();
        }
    }

    btnGen.addEventListener('click', () => switchView(btnGen, genView));
    btnBatch.addEventListener('click', () => switchView(btnBatch, batchView));
    btnScan.addEventListener('click', () => switchView(btnScan, scanView));

    // --- QR Scanner Functionality ---
    const video = document.getElementById('scan-video');
    let videoStream = null;
    let scanningActive = false;

    async function startWebcam() {
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = videoStream;
            video.setAttribute("playsinline", true);
            video.play();
            scanningActive = true;
            requestAnimationFrame(tickScan);
        } catch (err) {
            showToast('Camera access denied or unequipped.');
        }
    }

    function stopWebcam() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        scanningActive = false;
    }

    document.getElementById('btn-toggle-cam').addEventListener('click', () => {
        if (scanningActive) {
            stopWebcam();
            document.getElementById('btn-toggle-cam').innerHTML = `<i class="fa-solid fa-power-off"></i> Start Camera`;
        } else {
            startWebcam();
            document.getElementById('btn-toggle-cam').innerHTML = `<i class="fa-solid fa-stop"></i> Stop Camera`;
        }
    });

    function tickScan() {
        if (!scanningActive) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const scanCanvas = document.createElement('canvas');
            scanCanvas.width = video.videoWidth;
            scanCanvas.height = video.videoHeight;
            const scanCtx = scanCanvas.getContext('2d');
            scanCtx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
            const imageData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code && code.data) {
                displayScanResult(code.data);
                stopWebcam();
                document.getElementById('btn-toggle-cam').innerHTML = `<i class="fa-solid fa-power-off"></i> Start Camera`;
                return;
            }
        }
        requestAnimationFrame(tickScan);
    }

    const scanFileInput = document.getElementById('scan-file-input');
    scanFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                const scanCanvas = document.createElement('canvas');
                scanCanvas.width = img.width;
                scanCanvas.height = img.height;
                const scanCtx = scanCanvas.getContext('2d');
                scanCtx.drawImage(img, 0, 0);
                const imageData = scanCtx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code && code.data) {
                    displayScanResult(code.data);
                } else {
                    showToast('No QR code detected in image.');
                }
            };
            img.src = URL.createObjectURL(file);
        }
    });

    function displayScanResult(text) {
        const card = document.getElementById('scan-result-card');
        const textElem = document.getElementById('scan-result-text');
        const openBtn = document.getElementById('btn-open-scan');

        textElem.textContent = text;
        card.style.display = 'flex';

        if (text.startsWith('http://') || text.startsWith('https://')) {
            openBtn.href = text;
            openBtn.style.display = 'inline-flex';
        } else {
            openBtn.style.display = 'none';
        }
    }

    document.getElementById('btn-copy-scan').addEventListener('click', () => {
        const text = document.getElementById('scan-result-text').textContent;
        navigator.clipboard.writeText(text);
        showToast('Scan result copied to clipboard!');
    });

    // --- Batch Mode Processing Logic ---
    let batchItems = [];
    let loadedCsvData = null;

    const batchFileInput = document.getElementById('batch-file-input');
    const batchTextarea = document.getElementById('batch-textarea');
    const batchDropzone = document.getElementById('batch-dropzone');

    // CSV File Select
    batchFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                loadedCsvData = event.target.result;
                batchTextarea.value = `File loaded: ${file.name} (${file.size} bytes)\nClick "Process Batch" to parse.`;
                showToast('CSV File loaded successfully.');
            };
            reader.readAsText(file);
        }
    });

    // Drag & Drop
    batchDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        batchDropzone.style.borderColor = 'var(--primary)';
        batchDropzone.style.background = 'rgba(59, 130, 246, 0.05)';
    });

    batchDropzone.addEventListener('dragleave', () => {
        batchDropzone.style.borderColor = 'var(--border-color)';
        batchDropzone.style.background = 'transparent';
    });

    batchDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        batchDropzone.style.borderColor = 'var(--border-color)';
        batchDropzone.style.background = 'transparent';

        const file = e.dataTransfer.files[0];
        if (file && (file.type === "text/csv" || file.type === "text/plain" || file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
            const reader = new FileReader();
            reader.onload = (event) => {
                loadedCsvData = event.target.result;
                batchTextarea.value = `File loaded: ${file.name} (${file.size} bytes)\nClick "Process Batch" to parse.`;
                showToast('CSV File dropped successfully.');
            };
            reader.readAsText(file);
        } else {
            showToast('Invalid file format. Please upload CSV or TXT.');
        }
    });

    // Process Batch
    document.getElementById('btn-batch-process').addEventListener('click', () => {
        const content = loadedCsvData || batchTextarea.value.trim();
        if (!content) {
            showToast('Please upload a file or paste a list first.');
            return;
        }

        const delimiter = document.getElementById('batch-delimiter').value;
        const nameCol = document.getElementById('batch-name-col').value;
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        batchItems = [];

        lines.forEach((line, idx) => {
            if (line.startsWith('File loaded: ')) return;

            let qrValue = line;
            let filename = `qr-${idx + 1}`;

            // Parse columns if delimiter is present
            if (line.includes(delimiter)) {
                const columns = line.split(delimiter).map(col => col.trim().replace(/^["']|["']$/g, ''));
                if (nameCol !== 'none') {
                    const nameColIdx = parseInt(nameCol, 10);
                    if (columns.length > nameColIdx) {
                        filename = columns[nameColIdx].replace(/[^a-zA-Z0-9_-]/g, '_');
                        const otherCols = columns.filter((_, colIdx) => colIdx !== nameColIdx);
                        if (otherCols.length > 0) {
                            qrValue = otherCols[0];
                        }
                    }
                }
            }

            if (qrValue) {
                batchItems.push({
                    value: qrValue,
                    filename: filename
                });
            }
        });

        loadedCsvData = null; // Reset for next import
        renderBatchPreview();
        showToast(`Processed ${batchItems.length} items successfully.`);
    });

    function renderBatchPreview() {
        const previewList = document.getElementById('batch-preview-list');
        const exportSection = document.getElementById('batch-export-section');
        const countBadge = document.getElementById('batch-count');

        if (batchItems.length === 0) {
            previewList.innerHTML = `<div class="empty-history">Process list to preview generated QR codes.</div>`;
            exportSection.style.display = 'none';
            countBadge.textContent = '0 items';
            return;
        }

        previewList.innerHTML = '';
        exportSection.style.display = 'block';
        countBadge.textContent = `${batchItems.length} items`;

        getActiveLogoImage((logoImg) => {
            batchItems.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'batch-item';

                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.width = 120;
                thumbCanvas.height = 120;
                drawSingleQRToCanvas(item.value, thumbCanvas, logoImg);

                itemDiv.innerHTML = `
                    <div class="batch-item-thumb">
                        <img src="${thumbCanvas.toDataURL('image/png')}" alt="QR Preview">
                    </div>
                    <div class="batch-item-info">
                        <span class="batch-item-index">QR #${index + 1}</span>
                        <span class="batch-item-value">${escapeHtml(item.value)}</span>
                        <span class="batch-item-filename">${escapeHtml(item.filename)}</span>
                    </div>
                    <button class="btn-remove-batch" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
                `;

                previewList.appendChild(itemDiv);
            });

            // Add delete button event listeners
            document.querySelectorAll('.btn-remove-batch').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.closest('button').dataset.index, 10);
                    batchItems.splice(idx, 1);
                    renderBatchPreview();
                });
            });
        });
    }

    function drawSingleQRToCanvas(value, targetCanvas, logoImg) {
        const targetCtx = targetCanvas.getContext('2d');
        drawQRCodeToCanvasContext(value, targetCanvas, targetCtx, 300, logoImg);
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ZIP Batch Downloader
    document.getElementById('btn-batch-download-zip').addEventListener('click', async () => {
        if (batchItems.length === 0) return;

        const format = document.getElementById('batch-export-format').value;
        const resolution = parseInt(document.getElementById('batch-export-size').value, 10);
        const zip = new JSZip();

        showToast('Compiling ZIP package...');

        if (format === 'svg') {
            batchItems.forEach(item => {
                const svgString = generateSVGWithValue(item.value);
                zip.file(`${item.filename}.svg`, svgString);
            });

            const content = await zip.generateAsync({ type: 'blob' });
            triggerDownload(content, `QR-Studio-Batch-${Date.now()}.zip`);
            showToast('Vector ZIP downloaded!');
        } else {
            // PNG Mode
            getActiveLogoImage(async (logoImg) => {
                const promises = batchItems.map(async (item) => {
                    return new Promise((resolve) => {
                        const tempCanvas = document.createElement('canvas');
                        const tempCtx = tempCanvas.getContext('2d');
                        drawQRCodeToCanvasContext(item.value, tempCanvas, tempCtx, resolution, logoImg);

                        tempCanvas.toBlob((blob) => {
                            zip.file(`${item.filename}.png`, blob);
                            resolve();
                        }, 'image/png');
                    });
                });

                await Promise.all(promises);
                const content = await zip.generateAsync({ type: 'blob' });
                triggerDownload(content, `QR-Studio-Batch-${Date.now()}.zip`);
                showToast('Images ZIP downloaded!');
            });
        }
    });

    function triggerDownload(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Scanner Tab Toggle
    document.getElementById('tab-webcam').addEventListener('click', () => {
        document.getElementById('tab-webcam').classList.add('active');
        document.getElementById('tab-upload').classList.remove('active');
        document.getElementById('scan-webcam-content').style.display = 'flex';
        document.getElementById('scan-upload-content').style.display = 'none';
    });

    document.getElementById('tab-upload').addEventListener('click', () => {
        document.getElementById('tab-upload').classList.add('active');
        document.getElementById('tab-webcam').classList.remove('active');
        document.getElementById('scan-upload-content').style.display = 'flex';
        document.getElementById('scan-webcam-content').style.display = 'none';
        stopWebcam();
    });

    // --- Toast Notification Helper ---
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- SVG Vector Generator Logic ---
    function generateSVG() {
        const textData = getPayloadData();
        return generateSVGWithValue(textData);
    }

    function generateSVGWithValue(textData) {
        const qr = qrcode(0, state.ecc);
        qr.addData(textData);
        qr.make();

        const count = qr.getModuleCount();
        const resolution = 1000;
        const marginModules = parseInt(state.margin, 10);
        const totalModules = count + marginModules * 2;
        const cellSize = resolution / totalModules;

        let defs = '';
        let fillValue = state.colorFg;
        if (state.fgMode === 'linear') {
            defs = `
            <defs>
                <linearGradient id="fgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${state.colorFg}" />
                    <stop offset="100%" stop-color="${state.colorFg2}" />
                </linearGradient>
            </defs>`;
            fillValue = 'url(#fgGrad)';
        } else if (state.fgMode === 'radial') {
            defs = `
            <defs>
                <radialGradient id="fgGradRadial" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stop-color="${state.colorFg}" />
                    <stop offset="100%" stop-color="${state.colorFg2}" />
                </radialGradient>
            </defs>`;
            fillValue = 'url(#fgGradRadial)';
        }

        let bgRect = '';
        if (!state.transparentBg) {
            bgRect = `<rect width="${resolution}" height="${resolution}" fill="${state.colorBg}" />`;
        }

        function isEyeModule(r, c) {
            if (r < 7 && c < 7) return true;
            if (r < 7 && c >= count - 7) return true;
            if (r >= count - 7 && c < 7) return true;
            return false;
        }

        let pathD = '';
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (qr.isDark(r, c)) {
                    if (isEyeModule(r, c)) continue;

                    const x = (c + marginModules) * cellSize;
                    const y = (r + marginModules) * cellSize;

                    if (state.dotStyle === 'square') {
                        pathD += ` M ${x} ${y} h ${cellSize + 0.5} v ${cellSize + 0.5} h ${-(cellSize + 0.5)} z`;
                    } else if (state.dotStyle === 'dots') {
                        const cx = x + cellSize / 2;
                        const cy = y + cellSize / 2;
                        const radius = cellSize * 0.42;
                        pathD += ` M ${cx} ${cy} m ${-radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 ${-radius * 2},0`;
                    } else if (state.dotStyle === 'rounded') {
                        const radius = cellSize * 0.35;
                        const d = cellSize;
                        pathD += ` M ${x + radius} ${y} h ${d - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},${radius} v ${d - 2 * radius} a ${radius},${radius} 0 0,1 ${-radius},${radius} h ${-(d - 2 * radius)} a ${radius},${radius} 0 0,1 ${-radius},${-radius} v ${-(d - 2 * radius)} a ${radius},${radius} 0 0,1 ${radius},${-radius} z`;
                        } else if (state.dotStyle === 'diamond') {
                        const cx = x + cellSize / 2;
                        const cy = y + cellSize / 2;
                        pathD += ` M ${cx} ${y} L ${x + cellSize} ${cy} L ${cx} ${y + cellSize} L ${x} ${cy} z`;
                    } else if (state.dotStyle === 'classy') {
                        const radius = cellSize * 0.4;
                        pathD += ` M ${x + radius} ${y} h ${cellSize - radius} v ${cellSize - radius} a ${radius},${radius} 0 0,1 ${-radius},${radius} h ${-radius} v ${-cellSize + radius} a ${radius},${radius} 0 0,1 ${radius},${-radius} z`;
                    }
                }
            }
        }

        let modulesPath = pathD ? `<path d="${pathD}" fill="${fillValue}" />` : '';

        let eyesSvg = '';
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
            const lw = cellSize;

            if (state.eyeFrameStyle === 'square') {
                eyesSvg += `<rect x="${x + lw / 2}" y="${y + lw / 2}" width="${outerSize - lw}" height="${outerSize - lw}" fill="none" stroke="${fillValue}" stroke-width="${lw}" />`;
                eyesSvg += `<rect x="${x + 2 * cellSize}" y="${y + 2 * cellSize}" width="${innerSize}" height="${innerSize}" fill="${fillValue}" />`;
            } else if (state.eyeFrameStyle === 'rounded') {
                const rx = cellSize * 1.5;
                eyesSvg += `<rect x="${x + lw / 2}" y="${y + lw / 2}" width="${outerSize - lw}" height="${outerSize - lw}" rx="${rx}" ry="${rx}" fill="none" stroke="${fillValue}" stroke-width="${lw}" />`;
                const irx = cellSize * 0.8;
                eyesSvg += `<rect x="${x + 2 * cellSize}" y="${y + 2 * cellSize}" width="${innerSize}" height="${innerSize}" rx="${irx}" ry="${irx}" fill="${fillValue}" />`;
                } else if (state.eyeFrameStyle === 'circle') {
                const rOuter = (outerSize - lw) / 2;
                eyesSvg += `<circle cx="${x + outerSize / 2}" cy="${y + outerSize / 2}" r="${rOuter}" fill="none" stroke="${fillValue}" stroke-width="${lw}" />`;
                eyesSvg += `<circle cx="${x + outerSize / 2}" cy="${y + outerSize / 2}" r="${innerSize / 2}" fill="${fillValue}" />`;
            }
        });

        let logoSvg = '';
        if (state.logoType !== 'none') {
            const logoSrc = state.logoType === 'custom' ? state.customLogoSrc : presetLogos[state.logoType];
            if (logoSrc) {
                const logoSize = resolution * state.logoScale;
                const logoX = (resolution - logoSize) / 2;
                const logoY = (resolution - logoSize) / 2;
                const pad = state.logoPadding * 4;

                if (!state.transparentBg) {
                    logoSvg += `<rect x="${logoX - pad}" y="${logoY - pad}" width="${logoSize + pad * 2}" height="${logoSize + pad * 2}" rx="16" ry="16" fill="${state.colorBg}" />`;
                }
                logoSvg += `<image href="${logoSrc}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" />`;
            }
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${resolution} ${resolution}" width="100%" height="100%">${defs}${bgRect}${modulesPath}${eyesSvg}${logoSvg}</svg>`;
    }

    // --- State Sharing Logic ---
    function getShareableLink() {
        const params = new URLSearchParams();
        params.set('type', state.contentType);
        params.set('fgMode', state.fgMode);
        params.set('fg', state.colorFg);
        params.set('fg2', state.colorFg2);
        params.set('bg', state.colorBg);
        params.set('trans', state.transparentBg);
        params.set('dot', state.dotStyle);
        params.set('eye', state.eyeFrameStyle);
        params.set('logo', state.logoType);
        params.set('scale', state.logoScale);
        params.set('pad', state.logoPadding);
        params.set('ecc', state.ecc);
        params.set('margin', state.margin);

        if (state.contentType === 'url') params.set('val', document.getElementById('input-url').value);
        else if (state.contentType === 'text') params.set('val', document.getElementById('input-text').value);
        else if (state.contentType === 'wifi') {
            params.set('ssid', document.getElementById('wifi-ssid').value);
            params.set('pass', document.getElementById('wifi-pass').value);
            params.set('enc', document.getElementById('wifi-enc').value);
        } else if (state.contentType === 'vcard') {
            params.set('fn', document.getElementById('vc-fn').value);
            params.set('ln', document.getElementById('vc-ln').value);
            params.set('org', document.getElementById('vc-org').value);
            params.set('title', document.getElementById('vc-title').value);
            params.set('tel', document.getElementById('vc-tel').value);
            params.set('email', document.getElementById('vc-email').value);
        } else if (state.contentType === 'email') {
            params.set('to', document.getElementById('email-to').value);
            params.set('sub', document.getElementById('email-subject').value);
            params.set('body', document.getElementById('email-body').value);
        } else if (state.contentType === 'phone') {
            params.set('val', document.getElementById('input-phone').value);
        }