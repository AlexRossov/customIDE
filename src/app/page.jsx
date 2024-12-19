'use client';
import styles from './page.module.css';

import { useState, useEffect } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { php } from '@codemirror/lang-php';
import { Hook, Unhook } from 'console-feed';

import Header from '@/components/header/Header';
import LanguageSelector from '@/components/languageSelector/LanguageSelector';
import CodeEditor from '@/components/codeEditor/CodeEditor';
import ConsoleOutput from '@/components/consoleOutput/ConsoleOutput';
import Button from '@/components/button/Button';
import { executeCode } from '@/utils/codeExecutor';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function App() {

  const LANGUAGES = {
    javascript: { name: 'JavaScript', extension: javascript({ jsx: true }) },
    php: { name: 'PHP', extension: php({ plain: true }) },
  };

  const [selectedLanguage, setSelectedLanguage] = useState(Object.keys(LANGUAGES)[0]);
  const [code, setCode] = useLocalStorage('ide_code', '');
  const [logs, setLogs] = useState([]);

  // Подключение console-feed
  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false
    );
    return () => Unhook(hookedConsole);
  }, []);

  const runCode = async () => {
    // Валидация на запуск пустой строки кода
    if (!code.trim()) {
      console.error('Пустой код не может быть выполнен.');
      return;
    }

    // Простая валидация на запрещённые конструкции
    const forbiddenPatterns = /window|document|<script>|eval\(/i;
    if (forbiddenPatterns.test(code)) {
      console.error('Использование запрещённых конструкций!');
      return;
    }

    try {
      const data = await executeCode(code, selectedLanguage);

      if (data.status === 'success') {
        console.log(data.output);
      } else {
        console.error('Ошибка:', data.error);
      }
    } catch (err) {
      console.error('Ошибка при отправке запроса:', err.message);
    }
  };

  // Очистка кода
  const clearCode = () => {
    setCode('');
  };

  // Очистка консоли
  const clearConsole = () => {
    setLogs([]);
  };

  return (
    <>
      <Header />
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        languages={LANGUAGES}
      />
      <CodeEditor
        code={code}
        onChange={(value) => {setCode(value);}}
        languageExtension={LANGUAGES[selectedLanguage].extension}
      />
      <div className={styles.wrapButtons}>
        <Button variant='green' onClick={runCode}>
          Run
        </Button>
        <Button variant='red' onClick={clearCode}>
          Clear Code
        </Button>
      </div>
      <ConsoleOutput logs={logs} />
      <div className={styles.wrapButtons}>
        <Button variant='red' onClick={clearConsole}>
          Clear Console
        </Button>
      </div>
    </>
  );
}

export default App;
