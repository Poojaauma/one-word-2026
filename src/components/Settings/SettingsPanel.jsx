import React, { useState, useEffect } from 'react';
import './SettingsPanel.css';


export const SettingsPanel = ({ isOpen, onClose, word, onWordChange }) => {
    const [localWord, setLocalWord] = useState(word);
    useEffect(() => {
        setLocalWord(word);
    }, [word, isOpen]);

    const handleWordChange = (e) => {
        let val = e.target.value;
        if (val.length <= 12) {
            val = val.charAt(0).toUpperCase() + val.slice(1);
            setLocalWord(val);
        }
    };

    const handleSaveWord = () => {
        onWordChange(localWord);
    };



    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
                <button className="settings-close" onClick={onClose}>×</button>

                <h2 className="settings-title">Settings</h2>

                <div className="settings-section">
                    <label className="settings-label">Your Word</label>
                    <div className="settings-input-group">
                        <input
                            type="text"
                            className="settings-input"
                            value={localWord}
                            onChange={handleWordChange}
                            maxLength={12}
                        />
                        <button
                            className="settings-btn small"
                            onClick={handleSaveWord}
                            disabled={localWord === word}
                        >
                            Save
                        </button>
                    </div>
                </div>



                <div className="settings-section">
                    <p className="settings-note">
                        Your word and preferences are stored locally on your device.
                    </p>
                </div>
            </div>
        </div>
    );
};
