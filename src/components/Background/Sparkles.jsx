import React, { useEffect, useState, useRef } from 'react';
import './Sparkles.css';

const randomColor = () => {
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FFF', '#E6E6FA'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const Sparkles = () => {
    const [sparkles, setSparkles] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Throttle creation slightly by using random chance
            if (Math.random() > 0.1) return;

            const newSparkle = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 8 + 4,
                color: randomColor(),
                rotation: Math.random() * 360
            };

            setSparkles(prev => [...prev.slice(-20), newSparkle]); // Keep limit

            // Auto remove after animation
            setTimeout(() => {
                setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
            }, 1000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="sparkles-container" ref={containerRef}>
            {sparkles.map((s) => (
                <div
                    key={s.id}
                    className="sparkle"
                    style={{
                        left: s.x,
                        top: s.y,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        backgroundColor: s.color,
                        transform: `rotate(${s.rotation}deg)`
                    }}
                />
            ))}
        </div>
    );
};
