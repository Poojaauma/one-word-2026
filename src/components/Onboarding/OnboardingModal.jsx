import React, { useState } from 'react';
import './OnboardingModal.css';
import { areNotificationsSupported, requestPermission } from '../../services/notificationService';

export const OnboardingModal = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [word, setWord] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleWordChange = (e) => {
        let val = e.target.value;
        if (val.length <= 12) {
            val = val.charAt(0).toUpperCase() + val.slice(1);
            setWord(val);
        }
    };

    const handleNextStep = () => {
        if (step === 1 && word.trim()) {
            setStep(2);
        }
    };

    const handleEnableNotifications = async () => {
        setIsLoading(true);
        const result = await requestPermission();
        setNotificationsEnabled(result.granted);
        setIsLoading(false);
    };

    const handleComplete = () => {
        onComplete(word, notificationsEnabled);
    };

    const handleSkipNotifications = () => {
        onComplete(word, false);
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

                {step === 2 && (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Daily Inspiration 🌱</h2>
                        <p className="onboarding-subtitle">
                            Receive a gentle affirmation each morning.<br />
                            One thought to start your day.
                        </p>

                        {areNotificationsSupported() ? (
                            <>
                                {!notificationsEnabled ? (
                                    <button
                                        className="onboarding-btn primary"
                                        onClick={handleEnableNotifications}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Enabling...' : 'Enable Notifications'}
                                    </button>
                                ) : (
                                    <div className="notification-success">
                                        <span className="success-icon">✓</span>
                                        <span>Notifications enabled!</span>
                                    </div>
                                )}
                                <button
                                    className="onboarding-btn secondary"
                                    onClick={notificationsEnabled ? handleComplete : handleSkipNotifications}
                                >
                                    {notificationsEnabled ? 'Get Started' : 'Maybe Later'}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="notification-note">
                                    Notifications aren't supported in this browser,<br />
                                    but you can still see affirmations in the app.
                                </p>
                                <button
                                    className="onboarding-btn primary"
                                    onClick={handleComplete}
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                )}

                <div className="step-indicator">
                    <span className={`step-dot ${step >= 1 ? 'active' : ''}`}></span>
                    <span className={`step-dot ${step >= 2 ? 'active' : ''}`}></span>
                </div>
            </div>
        </div>
    );
};
