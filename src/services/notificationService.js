// Notification Service - Handles push notification permissions and scheduling

import {
    getWord,
    areNotificationsEnabled,
    setNotificationsEnabled,
    getNotificationTime
} from './storageService';

// Check if notifications are supported
export function areNotificationsSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
}

// Get current permission status
export function getPermissionStatus() {
    if (!areNotificationsSupported()) return 'unsupported';
    return Notification.permission;
}

// Request notification permission
export async function requestPermission() {
    if (!areNotificationsSupported()) {
        return { granted: false, reason: 'unsupported' };
    }

    try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setNotificationsEnabled(granted);
        return { granted, reason: permission };
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return { granted: false, reason: 'error' };
    }
}

// Send a test notification
export async function sendTestNotification() {
    if (!areNotificationsSupported() || Notification.permission !== 'granted') {
        return false;
    }

    const word = getWord();

    // Use service worker to show notification
    const registration = await navigator.serviceWorker.ready;
    registration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        word: word
    });

    return true;
}

// Schedule daily notifications (using best-effort approach)
export async function scheduleDailyNotification() {
    if (!areNotificationsSupported() || !areNotificationsEnabled()) {
        return false;
    }

    const registration = await navigator.serviceWorker.ready;

    // Try to use Periodic Background Sync (limited support)
    if ('periodicSync' in registration) {
        try {
            const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
            if (status.state === 'granted') {
                await registration.periodicSync.register('daily-affirmation', {
                    minInterval: 24 * 60 * 60 * 1000 // 24 hours
                });
                console.log('Periodic sync registered for daily affirmations');
                return true;
            }
        } catch (error) {
            console.log('Periodic sync not available:', error);
        }
    }

    // Fallback: Schedule notification when app is open
    scheduleInAppNotification();
    return true;
}

// In-app notification scheduling (when app is active)
let notificationTimeout = null;

export function scheduleInAppNotification() {
    // Clear existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    const now = new Date();
    const targetTime = new Date();

    // Get user preference or default to 09:00
    const timeStr = getNotificationTime() || '09:00';
    const [hours, minutes] = timeStr.split(':').map(Number);

    targetTime.setHours(hours, minutes, 0, 0);

    // If it's past the target time today, schedule for tomorrow
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const msUntilNotification = targetTime - now;

    // Only schedule if within reasonable timeframe (24 hours)
    if (msUntilNotification > 0 && msUntilNotification < 24 * 60 * 60 * 1000) {
        notificationTimeout = setTimeout(async () => {
            await sendTestNotification();
            // Reschedule for next day
            scheduleInAppNotification();
        }, msUntilNotification);

        console.log(`Notification scheduled for ${targetTime.toLocaleString()}`);
    }
}

// Cancel scheduled notifications
export function cancelScheduledNotifications() {
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
        notificationTimeout = null;
    }
}

// Initialize notification system
export async function initializeNotifications() {
    if (!areNotificationsSupported()) return;

    if (areNotificationsEnabled() && Notification.permission === 'granted') {
        await scheduleDailyNotification();
    }
}
