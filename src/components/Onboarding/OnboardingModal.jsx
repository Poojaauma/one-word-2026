import React, { useState } from 'react';
import './OnboardingModal.css';


export const OnboardingModal = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [word, setWord] = useState('');



    const handleWordChange = (e) => {
        let val = e.target.value;
        if (val.length <= 12) {
            val = val.charAt(0).toUpperCase() + val.slice(1);
            setWord(val);
        }
    };

    const handleNextStep = () => {
        if (word.trim()) {
            onComplete(word);
        }
    };



    return (
        <div className="onboarding-overlay">
            <div className="onboarding-modal">
                {step === 1 && (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Welcome to 2026 ✨</h2>
                        <p className="onboarding-subtitle">
                            Choose one word to guide your year.<br />
                            Let it be your compass.
                        </p>
                        <input
                            type="text"
                            className="onboarding-input"
                            placeholder="Your word..."
                            value={word}
                            onChange={handleWordChange}
                            autoFocus
                            maxLength={12}
                        />
                        <button
                            className="onboarding-btn primary"
                            onClick={handleNextStep}
                            disabled={!word.trim()}
                        >
                            Continue
                        </button>
                    </div>
                )}



                <div className="step-indicator">
                    <span className={`step-dot ${step >= 1 ? 'active' : ''}`}></span>
                </div>
            </div>
        </div>
    );
};
