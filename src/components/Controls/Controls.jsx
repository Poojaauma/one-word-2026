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

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                width: 1080,
                height: 1080,
                style: {
                    background: 'linear-gradient(135deg, #FDFCF8 0%, #FFF5F2 50%, #ECF1EF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                pixelRatio: 1,
            });

            const link = document.createElement('a');
            link.download = `one-word-2026-${word || 'inspiration'}.png`;
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
                <button className="btn-download" onClick={handleDownload}>
                    Download Card
                </button>
            </div>
        </div>
    );
};
