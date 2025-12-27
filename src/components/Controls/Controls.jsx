import React from 'react';
import { toPng } from 'html-to-image';
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
        if (!cardRef.current) return;

        // Config for different export types
        // Cover: 1584x396 (Wide, Short)
        // Post: 1080x1080 (Square, Tall)
        // Wallpaper: 1920x1080 (Standard HD)
        let config;
        switch (type) {
            case 'cover':
                config = { width: 1584, height: 396, suffix: 'cover' };
                break;
            case 'wallpaper':
                config = { width: 1920, height: 1080, suffix: 'wallpaper' };
                break;
            case 'post':
            default:
                config = { width: 1080, height: 1080, suffix: 'post' };
                break;
        }

        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                width: config.width,
                height: config.height,
                style: {
                    background: 'linear-gradient(135deg, #FFF6F8 0%, #F3E5F5 40%, #E0F7FA 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    transform: 'none',
                    boxShadow: 'none',
                    padding: 0,
                },
                // Scale text for high-res output
                onClone: (clonedNode) => {
                    const wordEl = clonedNode.querySelector('.word-display');
                    const subtitleEl = clonedNode.querySelector('.subtitle');
                    const brandEl = clonedNode.querySelector('.brand');
                    const footerEl = clonedNode.querySelector('.card-footer');

                    if (type === 'post') {
                        if (wordEl) wordEl.style.fontSize = '12rem';
                        if (subtitleEl) subtitleEl.style.fontSize = '2.5rem';
                        if (brandEl) brandEl.style.fontSize = '1.5rem';
                        if (footerEl) footerEl.style.bottom = '4rem';
                    } else if (type === 'cover') {
                        if (wordEl) wordEl.style.fontSize = '7rem';
                        if (subtitleEl) subtitleEl.style.fontSize = '1.8rem';
                        if (brandEl) brandEl.style.fontSize = '1.2rem';
                        if (footerEl) footerEl.style.bottom = '2rem';
                    } else if (type === 'wallpaper') {
                        if (wordEl) wordEl.style.fontSize = '14rem';
                        if (subtitleEl) subtitleEl.style.fontSize = '3rem';
                        if (brandEl) brandEl.style.fontSize = '2rem';
                        if (footerEl) footerEl.style.bottom = '5rem';
                    }
                },
                pixelRatio: 3, // Render at 3x density for HD crispness
            });

            const link = document.createElement('a');
            link.download = `one-word-2026-${word || 'inspiration'}-${config.suffix}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
        }
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
                <button className="btn-download" onClick={() => handleExport('post')}>
                    Square
                </button>
                <button className="btn-download variant" onClick={() => handleExport('cover')}>
                    Cover
                </button>
                <button className="btn-download variant" onClick={() => handleExport('wallpaper')}>
                    Wallpaper
                </button>
            </div>
        </div>
    );
};
