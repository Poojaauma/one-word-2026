import React, { useState, useEffect } from 'react';
import './AffirmationPreview.css';
import { getFullAffirmation } from '../../services/affirmationService';
import { getLastAffirmation, setLastAffirmation, hasTodaysAffirmation } from '../../services/storageService';

export const AffirmationPreview = ({ word, isVisible }) => {
    const [affirmation, setAffirmation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFull, setShowFull] = useState(false);

    useEffect(() => {
        if (isVisible && !affirmation) {
            loadAffirmation();
        }
    }, [isVisible]);

    const loadAffirmation = async () => {
        // Check if we already have today's affirmation
        if (hasTodaysAffirmation()) {
            const cached = getLastAffirmation();
            if (cached) {
                setAffirmation({
                    affirmation: cached,
                    contextLine: '',
                    emoji: ''
                });
                return;
            }
        }

        setIsLoading(true);
        try {
            const result = await getFullAffirmation(word);
            setAffirmation(result);
            setLastAffirmation(result.affirmation);
        } catch (error) {
            console.error('Failed to fetch affirmation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const result = await getFullAffirmation(word);
            setAffirmation(result);
            setLastAffirmation(result.affirmation);
        } catch (error) {
            console.error('Failed to fetch affirmation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`affirmation-preview ${showFull ? 'expanded' : ''}`}>
            <button
                className="affirmation-toggle"
                onClick={() => setShowFull(!showFull)}
            >
                <span className="toggle-icon">{showFull ? '−' : '+'}</span>
                <span className="toggle-text">Click here for Today's Affirmation</span>
            </button>

            {showFull && (
                <div className="affirmation-content fade-in">
                    {isLoading ? (
                        <p className="affirmation-loading">Loading inspiration...</p>
                    ) : affirmation ? (
                        <>
                            <p className="affirmation-text">
                                "{affirmation.affirmation}"
                                {affirmation.emoji && <span className="affirmation-emoji"> {affirmation.emoji}</span>}
                            </p>
                            {word && affirmation.contextLine && (
                                <p className="affirmation-context">{affirmation.contextLine}</p>
                            )}
                            <button
                                className="affirmation-refresh"
                                onClick={handleRefresh}
                                title="Get new affirmation"
                            >
                                ↻
                            </button>
                        </>
                    ) : (
                        <p className="affirmation-text">Take a moment to breathe.</p>
                    )}
                    {affirmation && (
                        <div className="affirmation-actions">
                            <button className="affirmation-share" onClick={() => {
                                const text = `✨ Affirmation of the day\n\n"${affirmation.affirmation}"\n\nFor more such positives for the day, check https://one-word-2026.vercel.app/`;
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Daily Affirmation',
                                        text: text
                                    }).catch(console.error);
                                } else {
                                    navigator.clipboard.writeText(text);
                                    alert('Copied to clipboard!');
                                }
                            }}>
                                📤 Share this thought
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
