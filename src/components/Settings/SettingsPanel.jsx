import React, { useState, useEffect } from 'react';
import './SettingsPanel.css';
import {
    areNotificationsSupported,
    getPermissionStatus,
    requestPermission,
    sendTestNotification,
    scheduleInAppNotification
} from '../../services/notificationService';
import {
    areNotificationsEnabled,
    setNotificationsEnabled,
    getNotificationTime,
    setNotificationTime
} from '../../services/storageService';

export const SettingsPanel = ({ isOpen, onClose, word, onWordChange }) => {
    const [localWord, setLocalWord] = useState(word);
    const [notificationsOn, setNotificationsOn] = useState(false);
    const [notificationTime, setLocalNotificationTime] = useState('09:00');
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [testSent, setTestSent] = useState(false);

    useEffect(() => {
        setLocalWord(word);
        setNotificationsOn(areNotificationsEnabled());
        setLocalNotificationTime(getNotificationTime());
        setPermissionStatus(getPermissionStatus());
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

    const handleToggleNotifications = async () => {
        if (notificationsOn) {
            setNotificationsEnabled(false);
            setNotificationsOn(false);
        } else {
            if (permissionStatus !== 'granted') {
                const result = await requestPermission();
                setPermissionStatus(result.granted ? 'granted' : 'denied');
                if (result.granted) {
                    setNotificationsEnabled(true);
                    setNotificationsOn(true);
                }
            } else {
                setNotificationsEnabled(true);
                setNotificationsOn(true);
            }
        }
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setLocalNotificationTime(newTime);
        setNotificationTime(newTime);
        scheduleInAppNotification(); // Reschedule with new time
    };

    const handleTestNotification = async () => {
        const sent = await sendTestNotification();
        if (sent) {
            setTestSent(true);
            setTimeout(() => setTestSent(false), 3000);
        }
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

                {areNotificationsSupported() && (
                    <div className="settings-section">
                        <label className="settings-label">Daily Affirmations</label>
                        <div className="settings-toggle-row">
                            <span className="toggle-label">
                                {notificationsOn ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                                className={`toggle-btn ${notificationsOn ? 'active' : ''}`}
                                onClick={handleToggleNotifications}
                            >
                                <span className="toggle-knob"></span>
                            </button>
                        </div>

                        {notificationsOn && permissionStatus === 'granted' && (
                            <div className="settings-time-row">
                                <label className="settings-label small">Daily Time</label>
                                <input
                                    type="time"
                                    className="settings-time-input"
                                    value={notificationTime}
                                    onChange={handleTimeChange}
                                />
                            </div>
                        )}

                        {permissionStatus === 'denied' && (
                            <p className="settings-note warning">
                                Notifications were blocked. Please enable them in your browser settings.
                            </p>
                        )}
                    </div>
                )}

                <div className="settings-section">
                    <p className="settings-note">
                        Your word and preferences are stored locally on your device.
                    </p>
                </div>
            </div>
        </div>
    );
};
