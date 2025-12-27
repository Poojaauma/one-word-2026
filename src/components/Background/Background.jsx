import React from 'react';
import './Background.css';
import { Sparkles } from './Sparkles';

export const Background = () => {
    return (
        <div className="background-container">
            <div className="gradient-layer"></div>
            <Sparkles />
            <div className="grain-overlay"></div>
            <div className="vignette-overlay"></div>
        </div>
    );
};
