import React, { forwardRef } from 'react';
import './Card.css';

export const Card = forwardRef(({ word }, ref) => {
    return (
        <div className="card-wrapper" ref={ref}>
            <div className="card-content">
                <h1 className={`word-display ${word ? 'active' : 'empty'}`}>
                    {word || "Your Word"}
                </h1>
                <p className="subtitle">Let this guide your 2026.</p>
            </div>
            <div className="card-footer">
                <span className="brand">One Word · 2026</span>
            </div>
        </div>
    );
});

Card.displayName = "Card";
