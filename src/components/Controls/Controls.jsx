import React from 'react';
import './Controls.css';

export const Controls = ({ word, onWordChange, cardRef }) => {
    const presets = ['Calm', 'Focus', 'Courage', 'Flow', 'Joy', 'Bold'];
    const inspirationWords = [
        'Create', 'Balance', 'Growth', 'Peace', 'Energy', 'Trust',
        'Align', 'Reset', 'Shine', 'Build', 'Dream', 'Grit'
    ];

    const handleChange = (e) => {
        let val = e.target.value;
        if (val.length <= 12) {
            val = val.charAt(0).toUpperCase() + val.slice(1);
            onWordChange(val);
        }
    };

    const handlePreset = (preset) => onWordChange(preset);

    const handleRandom = () => {
        const combined = [...presets, ...inspirationWords];
        const random = combined[Math.floor(Math.random() * combined.length)];
        onWordChange(random);
    };

    const handleExport = async (type) => {
        // Dimensions for each export type
        const configs = {
            mobile: { width: 1170, height: 2532, suffix: 'mobile-wallpaper' },
            linkedin: { width: 1584, height: 396, suffix: 'linkedin-cover' }
        };
        const config = configs[type] || configs.linkedin;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = config.width;
        canvas.height = config.height;
        const ctx = canvas.getContext('2d');

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, config.width, config.height);
        gradient.addColorStop(0, '#FFF6F8');
        gradient.addColorStop(0.4, '#F3E5F5');
        gradient.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, config.width, config.height);

        // Text settings based on type
        const wordSize = type === 'mobile' ? 160 : 120;
        const subtitleSize = type === 'mobile' ? 36 : 24;
        const centerX = config.width / 2;
        const centerY = config.height / 2;

        // Draw main word
        ctx.fillStyle = '#2d2d2d';
        ctx.font = `500 ${wordSize}px "Cormorant Garamond", Georgia, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(word || 'Inspire', centerX, centerY - subtitleSize);

        // Draw subtitle
        ctx.fillStyle = 'rgba(80, 80, 80, 0.6)';
        ctx.font = `400 ${subtitleSize}px "Inter", sans-serif`;
        ctx.fillText('Let this guide your 2026.', centerX, centerY + wordSize / 2);

        // Download
        const link = document.createElement('a');
        link.download = `one-word-2026-${word || 'inspiration'}-${config.suffix}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="controls-container">
            <div className="input-group">
                <input
                    type="text"
                    className="word-input"
                    placeholder="One Word"
                    value={word}
                    onChange={handleChange}
                    maxLength={12}
                />
                <button
                    className="btn-random"
                    onClick={handleRandom}
                    title="Random Word"
                >
                    🎲
                </button>
            </div>

            <div className="presets">
                {presets.map(p => (
                    <button
                        key={p}
                        className="chip"
                        onClick={() => handlePreset(p)}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <div className="actions">
                <button className="btn-download" onClick={() => handleExport('mobile')}>
                    📱 Mobile Wallpaper
                </button>
                <button className="btn-download variant" onClick={() => handleExport('linkedin')}>
                    💼 LinkedIn Cover
                </button>
            </div>
        </div>
    );
};
