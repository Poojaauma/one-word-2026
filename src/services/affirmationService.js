// Affirmation Service - Fetches affirmations from API with fallback

const API_URL = 'https://www.affirmations.dev/';

// Fallback affirmations when API is unavailable
const FALLBACK_AFFIRMATIONS = [
    "Today is full of possibilities.",
    "You are exactly where you need to be.",
    "Small steps lead to great journeys.",
    "Your potential is limitless.",
    "Peace begins with a single breath.",
    "You have the strength to handle this.",
    "Every moment is a fresh beginning.",
    "Trust the process of your growth.",
    "You are worthy of good things.",
    "Let go of what no longer serves you.",
    "Your presence makes a difference.",
    "Breathe deeply and let calm wash over you.",
    "You are capable of amazing things.",
    "Today holds unexpected blessings.",
    "Your journey is uniquely yours."
];

// Contextual lines based on user's word
const CONTEXTUAL_TEMPLATES = [
    (word) => `Let ${word.toLowerCase()} guide you today.`,
    (word) => `Embrace ${word.toLowerCase()} in this moment.`,
    (word) => `Remember: ${word} is your compass.`,
    (word) => `${word} leads the way.`,
    (word) => `Carry ${word.toLowerCase()} with you today.`,
    (word) => `Your word is ${word}. Let it inspire you.`
];

// Get a random item from array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Fetch affirmation from API
export async function fetchAffirmation() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API response not ok');
        const data = await response.json();
        return data.affirmation;
    } catch (error) {
        console.log('Affirmation API unavailable, using fallback');
        return getRandomItem(FALLBACK_AFFIRMATIONS);
    }
}

// Get contextual line based on user's word
export function getContextualLine(word) {
    if (!word || word.trim() === '') return '';

    const template = getRandomItem(CONTEXTUAL_TEMPLATES);
    return template(word);
}

// Get subtle emoji (occasional)
export function getSubtleEmoji() {
    // Only show emoji 40% of the time for subtlety
    if (Math.random() > 0.4) return '';

    const emojis = ['🌱', '✨', '🌸', '💫', '🌿', '☀️', '🌙', '🦋'];
    return getRandomItem(emojis);
}

// Compose full affirmation message
export async function getFullAffirmation(word) {
    const affirmation = await fetchAffirmation();
    const contextLine = getContextualLine(word);
    const emoji = getSubtleEmoji();

    return {
        affirmation,
        contextLine,
        emoji,
        fullMessage: `${affirmation}${contextLine ? `\n${contextLine}` : ''} ${emoji}`.trim()
    };
}
