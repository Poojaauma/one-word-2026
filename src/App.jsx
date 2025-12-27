import { useState, useRef } from 'react';
import { Background } from './components/Background/Background';
import { Card } from './components/Card/Card';
import { Controls } from './components/Controls/Controls';

function App() {
  const [word, setWord] = useState('');
  const cardRef = useRef(null);

  return (
    <div className="app-container">
      <Background />
      <main className="content">
        <Card ref={cardRef} word={word} />
        <Controls word={word} onWordChange={setWord} cardRef={cardRef} />
      </main>
    </div>
  )
}

export default App
