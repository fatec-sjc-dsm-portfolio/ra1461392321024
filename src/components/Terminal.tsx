import React, { useState, useRef, useEffect } from 'react';
import TypingText from './TypingText';
import '../styles/Terminal.css';

const Terminal: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  type HistoryItem = { kind: 'input' | 'response' | 'static'; text: string };

  const [history, setHistory] = useState<HistoryItem[]>([
    { kind: 'static', text: 'Coding since 2022' },
    { kind: 'static', text: 'Welcome to my portfolio!' },
  ]);

  const [hasResponded, setHasResponded] = useState(false);
  const [focused, setFocused] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  const commandResponses: { [key: string]: string } = {
    'oi': 'hey sister',
    'oii': 'walk for me.',
    'ola': 'the icon.',
    'olá': 'face.',
    'tudo bem': 'im literally 45 years old',
    'que legal': 'ate.',
    'muito bom': 'left no crumbs.',
    'gostei': 'you have taste.',
    'show': 'i guess',
    'legal': 'thx ho',
    'massa': 'low frequency energy',
    'top': 'the girls are girling',
    'amei': 'obsessed.',
    'amo': 'correct.',
    'amoo': 'we are the moment',
    'ameii': 'stunning.',
    'bonito': 'stop looking at me',
    'arrasou': 'an absolute vision',
    'divou': 'the blueprint.',
    'diva': 'estrogen.',
    'divo': 'wait...',
    'veyr': 'STFU and look at the material.',
    'vey': 'dont call me that',
    'hey hey hey': 'look at the material',
    'feio': 'jail.',
    'bosta': 'security.',
    'lixo': 'fast fashion behavior',
    'horror': 'immediately no.',
    'péssimo': 'commercial failure.',
    'pessimo': 'delete it.',
    'ruim': 'go back to gap',
    'odeio': 'you dont get the vision',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Se já respondeu uma vez, acabou o show.
    if (hasResponded) return;

    if (e.key === 'Enter') {
      const command = inputValue.trim();
      if (!command) return;

      setHistory(prev => [...prev, { kind: 'input', text: command }]);

      const lc = command.toLowerCase();
      let response: string | undefined;

      for (const key in commandResponses) {
        if (lc.includes(key)) {
          response = commandResponses[key];
          break;
        }
      }

      const badWords = ['bosta', 'lixo', 'horror', 'péssimo', 'pessimo', 'ruim', 'merda', 'idiota', 'feio', 'odeio'];
      
      if (!response && badWords.some(w => lc.includes(w))) {
        response = 'get a job. stay away from me.';
      }

      if (!response) {
        response = 'anyway...';
      }

      setHistory(prev => [...prev, { kind: 'response', text: response! }]);
      setHasResponded(true); // Trava futuras interações
      setInputValue('');

    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setInputValue(prev => prev + e.key);
    } else if (e.key === 'Backspace') {
      setInputValue(prev => prev.slice(0, -1));
    }
  };

  return (
    <div
      className="terminal-wrapper"
      ref={terminalRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ outline: 'none' }}
    >
      <div className="terminal-shadow"></div>
      <div className="terminal-body tech">
        <div className="terminal-tabs tech">
          <span>PROBLEMS</span>
          <span>OUTPUT</span>
          <span className="active-tab">TERMINAL</span>
          <span>DEBUG CONSOLE</span>
          <span>PORTS</span>
        </div>

        <div className="terminal-content tech">
          {history.map((item, index) => {
            if (item.kind === 'static' || item.kind === 'input') {
              return (
                <p key={index} className="terminal-line tech">
                  C:\Users\Eber&gt; {item.text}
                </p>
              );
            }

            if (item.kind === 'response') {
              return (
                <div key={index} className="terminal-line tech response-line">
                  <span>C:\Users\Eber&gt;&nbsp;</span>
                  <TypingText text={item.text} speed={30} />
                </div>
              );
            }

            return null;
          })}

          {/* O input só aparece se ainda não houve resposta */}
          {!hasResponded && (
            <div className="terminal-input-line tech">
              <span>C:\Users\Eber&gt; </span>
              <span>{inputValue}</span>
              {focused && <span className="blinking-cursor"></span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;