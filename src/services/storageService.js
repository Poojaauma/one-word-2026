// Storage Service - LocalStorage wrapper for user preferences

const STORAGE_KEYS = {
    WORD: 'oneword_2026_word',
    NOTIFICATIONS_ENABLED: 'oneword_2026_notifications',
    FIRST_TIME: 'oneword_2026_first_time',
    LAST_AFFIRMATION: 'oneword_2026_last_affirmation',
    LAST_AFFIRMATION_DATE: 'oneword_2026_last_affirmation_date',
    NOTIFICATION_TIME: 'oneword_2026_notification_time'
};

// Get user's chosen word
export function getWord() {
    return localStorage.getItem(STORAGE_KEYS.WORD) || '';
}

// Set user's chosen word
export function setWord(word) {
    localStorage.setItem(STORAGE_KEYS.WORD, word);
}

// Check if notifications are enabled
export function areNotificationsEnabled() {
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED) === 'true';
}

// Set notification preference
export function setNotificationsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled ? 'true' : 'false');
}

// Check if this is the user's first time
export function isFirstTime() {
    return localStorage.getItem(STORAGE_KEYS.FIRST_TIME) !== 'false';
}

// Mark onboarding as complete
export function completeOnboarding() {
    localStorage.setItem(STORAGE_KEYS.FIRST_TIME, 'false');
}

// Get last shown affirmation
export function getLastAffirmation() {
    return localStorage.getItem(STORAGE_KEYS.LAST_AFFIRMATION) || '';
}

// Set last shown affirmation
export function setLastAffirmation(affirmation) {
    localStorage.setItem(STORAGE_KEYS.LAST_AFFIRMATION, affirmation);
    localStorage.setItem(STORAGE_KEYS.LAST_AFFIRMATION_DATE, new Date().toDateString());
}

// Check if we already fetched today's affirmation
export function hasTodaysAffirmation() {
    const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_AFFIRMATION_DATE);
    return lastDate === new Date().toDateString();
}

// Get notification time (default 9:00)
export function getNotificationTime() {
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIME) || '09:00';
}

// Set notification time
export function setNotificationTime(time) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, time);
}

// Clear all data
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
