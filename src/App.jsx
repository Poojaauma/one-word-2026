import { useState, useRef, useEffect } from 'react';
import { Background } from './components/Background/Background';
import { Card } from './components/Card/Card';
import { Controls } from './components/Controls/Controls';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { AffirmationPreview } from './components/Affirmation/AffirmationPreview';
import {
  getWord,
  setWord as saveWord,
  isFirstTime,
  completeOnboarding
} from './services/storageService';


// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration.scope);
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  });
}

function App() {
  const [word, setWord] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const cardRef = useRef(null);

  // Load saved word on mount
  useEffect(() => {
    const savedWord = getWord();
    if (savedWord) {
      setWord(savedWord);
    }

    // Check if first time user
    if (isFirstTime()) {
      setShowOnboarding(true);
    }



    // Mark app as ready with slight delay for fade-in effect
    setTimeout(() => setIsReady(true), 100);
  }, []);

  // Handle word changes (save to localStorage)
  const handleWordChange = (newWord) => {
    setWord(newWord);
    saveWord(newWord);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (chosenWord) => {
    setWord(chosenWord);
    saveWord(chosenWord);
    completeOnboarding();
    setShowOnboarding(false);
  };

  return (
    <div className={`app-container ${isReady ? 'ready' : ''}`}>
      <Background />

      {/* Settings gear icon */}
      <button
        className="settings-gear"
        onClick={() => setShowSettings(true)}
        title="Settings"
      >
        ⚙️
      </button>

      <main className="content">
        <Card ref={cardRef} word={word} />
        <Controls word={word} cardRef={cardRef} />
        <AffirmationPreview word={word} isVisible={!showOnboarding && word} />
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        word={word}
        onWordChange={handleWordChange}
      />
    </div>
  )
}

export default App
