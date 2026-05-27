const fs = require('fs');
const path = require('path');

// Mock basic browser globals to prevent app.js from throwing ReferenceErrors on load
global.window = global;
global.document = {
    getElementById: () => ({ innerText: '', innerHTML: '', style: {}, classList: { add: () => {} }, appendChild: () => {} }),
    createElement: () => ({ innerText: '', innerHTML: '', style: {}, classList: { add: () => {} }, appendChild: () => {} })
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

// Import ZONE_DATABASE from app.js
const { ZONE_DATABASE } = require('./app.js');

// Ensure the assets/portraits directory exists
const portraitsDir = path.join(__dirname, 'assets', 'portraits');
fs.mkdirSync(portraitsDir, { recursive: true });

console.log("=== STARTING PROCEDURAL SVG ENEMY PORTRAITS GENERATION ===");

let generatedCount = 0;

ZONE_DATABASE.forEach(zone => {
    zone.enemies.forEach(enemy => {
        const name = enemy.name.toLowerCase();
        const icon = enemy.icon;
        
        // Generate deterministic hash from the enemy ID to ensure visual uniqueness
        let hash = 0;
        for (let i = 0; i < enemy.id.length; i++) {
            hash = enemy.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let primaryColor = "#1a1c23";
        let secondaryColor = "#0f1015";
        let accentColor = "rgba(255, 255, 255, 0.15)";
        let particleColor = "rgba(255, 255, 255, 0.22)";
        let glowColor = "rgba(255, 255, 255, 0.4)";
        let sigilPath = "";
        
        // Determine color palettes based on elemental/thematic category
        if (name.includes("fire") || name.includes("molten") || name.includes("cinder") || icon === "🔥" || icon === "🌋") {
            primaryColor = "#4c1205";
            secondaryColor = "#1a0400";
            accentColor = "rgba(255, 68, 0, 0.15)";
            particleColor = "rgba(255, 120, 0, 0.25)";
            glowColor = "rgba(255, 80, 0, 0.55)";
            sigilPath = `M 0 -60 L 50 25 L -50 25 Z M 0 -42 L 35 17 L -35 17 Z M 0 -25 L 20 8 L -20 8 Z`;
        } else if (name.includes("frost") || name.includes("glacier") || name.includes("ice") || icon === "❄️" || icon === "🐆") {
            primaryColor = "#0c3559";
            secondaryColor = "#03172b";
            accentColor = "rgba(0, 150, 255, 0.18)";
            particleColor = "rgba(100, 200, 255, 0.28)";
            glowColor = "rgba(0, 180, 255, 0.65)";
            // Symmetrical ice star compass
            for (let a = 0; a < 6; a++) {
                const angle = (a * Math.PI) / 3;
                const x1 = Math.round(Math.cos(angle) * 18);
                const y1 = Math.round(Math.sin(angle) * 18);
                const x2 = Math.round(Math.cos(angle) * 55);
                const y2 = Math.round(Math.sin(angle) * 55);
                sigilPath += `M 0 0 L ${x1} ${y1} M ${x1} ${y1} L ${x2} ${y2} `;
                const cx1 = Math.round(Math.cos(angle) * 38 + Math.cos(angle + Math.PI/2) * 10);
                const cy1 = Math.round(Math.sin(angle) * 38 + Math.sin(angle + Math.PI/2) * 10);
                const cx2 = Math.round(Math.cos(angle) * 38 - Math.cos(angle + Math.PI/2) * 10);
                const cy2 = Math.round(Math.sin(angle) * 38 - Math.sin(angle + Math.PI/2) * 10);
                sigilPath += `M ${cx1} ${cy1} L ${cx2} ${cy2} `;
            }
        } else if (name.includes("shadow") || name.includes("death") || name.includes("grim") || name.includes("ghoul") || icon === "🧛" || icon === "🧟" || icon === "🧙‍♂️") {
            primaryColor = "#3d134f";
            secondaryColor = "#150221";
            accentColor = "rgba(163, 53, 238, 0.16)";
            particleColor = "rgba(180, 80, 255, 0.25)";
            glowColor = "rgba(163, 53, 238, 0.55)";
            sigilPath = `M -45 0 A 45 45 0 1 0 45 0 A 35 35 0 1 1 -45 0 M 0 -45 L 0 45 M -45 0 L 45 0`;
        } else if (name.includes("jungle") || name.includes("tiger") || name.includes("pirate") || icon === "🐅" || icon === "🏴‍☠️") {
            primaryColor = "#114529";
            secondaryColor = "#041b0f";
            accentColor = "rgba(30, 255, 0, 0.15)";
            particleColor = "rgba(80, 255, 80, 0.25)";
            glowColor = "rgba(30, 255, 0, 0.5)";
            sigilPath = `M 0 -60 C 30 -30 38 8 0 50 C -30 8 -28 -30 0 -60 M 0 -60 L 0 50 M -25 -8 Q 0 -15 25 -8`;
        } else {
            // Standard shield runic compass
            const hue = Math.abs(hash % 360);
            primaryColor = `hsl(${hue}, 35%, 15%)`;
            secondaryColor = `hsl(${hue}, 45%, 6%)`;
            accentColor = `hsla(${hue}, 100%, 50%, 0.14)`;
            particleColor = `hsla(${hue}, 100%, 70%, 0.22)`;
            glowColor = `hsla(${hue}, 100%, 70%, 0.55)`;
            sigilPath = `M 0 -55 L 38 -34 L 38 17 C 38 46 0 63 0 63 C 0 63 -38 46 -38 17 L -38 -34 Z M -38 -34 L 38 17 M 38 -34 L -38 17`;
        }
        
        // Procedural rings and layout variations
        const rotation = Math.abs((hash >> 2) % 30) - 15;
        const scale = 1.1 + (Math.abs((hash >> 4) % 4) * 0.08);
        const bubbleCount = 5 + (Math.abs(hash % 5));
        
        let bubblesSvg = "";
        for (let j = 0; j < bubbleCount; j++) {
            const cx = 40 + Math.abs((hash >> (j * 2)) % 220);
            const cy = 40 + Math.abs((hash >> (j * 3)) % 280);
            const r = 15 + Math.abs((hash >> (j * 4)) % 50);
            const op = 0.06 + (Math.abs((hash >> (j * 5)) % 10) * 0.02);
            bubblesSvg += `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${particleColor}" opacity="${op}" />\n`;
        }
        
        const ringCount = 2 + (Math.abs(hash % 3));
        let ringsSvg = "";
        for (let k = 0; k < ringCount; k++) {
            const rx = 170 + (k * 35);
            const ry = 170 + (k * 35);
            const op = 0.05 + (0.03 * k);
            ringsSvg += `    <ellipse cx="150" cy="180" rx="${rx}" ry="${ry}" fill="none" stroke="${accentColor}" stroke-width="1.8" stroke-dasharray="10 15" opacity="${op}" />\n`;
        }
        
        // Outer thematic borders based on trash/elite/boss classification
        const isBoss = enemy.name.includes("[Boss]");
        const isElite = enemy.name.includes("[Elite]");
        
        let borderColor = glowColor;
        let borderWidth = "1.5";
        let dashArray = "4 6";
        let outerEmblemGlow = "";
        
        if (isBoss) {
            borderColor = "rgba(255, 209, 0, 0.6)"; // Rich gold
            borderWidth = "2.5";
            dashArray = "none";
            outerEmblemGlow = `    <circle cx="150" cy="180" r="115" fill="none" stroke="rgba(255, 209, 0, 0.25)" stroke-width="6" opacity="0.3" filter="url(#glow)" />\n`;
        } else if (isElite) {
            borderColor = "rgba(30, 255, 0, 0.5)"; // Green
            borderWidth = "2";
            dashArray = "10 5";
        }
        
        // Gothic Capital Monospace Spaced Name
        const spacedName = enemy.name.replace(/\[(Boss|Elite)\]/gi, '').trim().toUpperCase().split('').join(' ');
        
        // Main SVG File Template
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
    <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="${primaryColor}" />
            <stop offset="100%" stop-color="${secondaryColor}" />
        </radialGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    
    <!-- Base Dark Fantasy Gradient Background -->
    <rect width="100%" height="100%" fill="url(#bgGrad)" />
    
    <!-- Orbiting Rings -->
${ringsSvg}    
    <!-- Floating Particles -->
${bubblesSvg}    
    <!-- Outer Sigil Ring borders -->
${outerEmblemGlow}    <circle cx="150" cy="180" r="100" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-dasharray="${dashArray}" opacity="0.55" />
    <circle cx="150" cy="180" r="88" fill="none" stroke="${borderColor}" stroke-width="1.2" opacity="0.38" />

    <!-- Centered Glowing Large Custom Runic Fantasy Seal -->
    <g transform="translate(150, 180) rotate(${rotation}) scale(${scale})">
        <!-- Sigil Glow Shadow -->
        <path d="${sigilPath}" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" opacity="0.22" />
        <!-- Main Sigil Vector Path -->
        <path d="${sigilPath}" fill="none" stroke="${glowColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.55" />
    </g>
    
    <!-- Monospace spaced parodied name engraving at bottom -->
    <text x="150" y="328" font-family="'Courier New', Courier, monospace" font-size="10.5" font-weight="bold" fill="#ffffff" opacity="0.32" text-anchor="middle" letter-spacing="1">${spacedName}</text>
</svg>
`.trim();

        // Write the custom SVG portrait file to assets/portraits/
        const fileName = `${enemy.id}.svg`;
        const filePath = path.join(portraitsDir, fileName);
        fs.writeFileSync(filePath, svgContent, 'utf8');
        generatedCount++;
    });
});

console.log(`🎉 SUCCESS: Generated ${generatedCount} custom, distinct dark-fantasy enemy portraits in assets/portraits/!`);
