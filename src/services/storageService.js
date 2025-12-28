// Storage Service - LocalStorage wrapper for user preferences

const STORAGE_KEYS = {
    WORD: 'oneword_2026_word',
    FIRST_TIME: 'oneword_2026_first_time',
    LAST_AFFIRMATION: 'oneword_2026_last_affirmation',
    LAST_AFFIRMATION_DATE: 'oneword_2026_last_affirmation_date'
};

// Get user's chosen word
export function getWord() {
    return localStorage.getItem(STORAGE_KEYS.WORD) || '';
}

// Set user's chosen word
export function setWord(word) {
    localStorage.setItem(STORAGE_KEYS.WORD, word);
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



// Clear all data
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
