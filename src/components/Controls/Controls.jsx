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
        const config = type === 'cover'
            ? { width: 1584, height: 396, suffix: 'cover' }
            : { width: 1080, height: 1080, suffix: 'post' };

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
                    // Clean up for export rendering
                    borderRadius: 0,
                    transform: 'none',
                    boxShadow: 'none',
                },
                pixelRatio: 1,
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
                    Download Square
                </button>
                <button className="btn-download variant" onClick={() => handleExport('cover')}>
                    Download Cover
                </button>
            </div>
        </div>
    );
};
