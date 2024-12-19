'use client';
import styles from './page.module.css';

import { useState, useEffect, useCallback, useRef } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { php } from '@codemirror/lang-php';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { Console, Hook, Unhook } from 'console-feed';

function App() {

  const LANGUAGES = {
    javascript: { name: 'JavaScript', extension: javascript({ jsx: true }) },
    php: { name: 'PHP', extension: php({ plain: true }) },
  };

  const [selectedLanguage, setSelectedLanguage] = useState(Object.keys(LANGUAGES)[0]);
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef(null);
  const debounceTimer = useRef(null);

  // Подключение console-feed
  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false
    );
    return () => Unhook(hookedConsole);
  }, []);

  // Загрузка кода из localStorage
  useEffect(() => {
    const codeFromStorage = window.localStorage.getItem('ide_code');
    if (codeFromStorage) {
      setCode(codeFromStorage);
    }
  }, []);

  // Скроллинг консоли вниз
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTo({
        top: consoleRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [logs]);

  // Сохранение кода в localStorage с debounce 300 мс
  const onChange = useCallback((val) => {
    setCode(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current); // Очистка предыдущего таймера
    debounceTimer.current = setTimeout(() => {
      window.localStorage.setItem('ide_code', val); // Сохранение в localStorage
    }, 300);
  }, []);

  // Функция для выполнения запроса на сервер
  const executeCode = async (code, language) => {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });

    return await response.json();
  };

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

  // Функция установления используемого языка
  const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

  return (
    <>
      <div className={styles.exercise}>
        <h2 className={styles.titleExercise}>Задача №1</h2>
        <p className={styles.descExercise}>
          Напишите ниже код, который выведет в консоль - &#34;Привет мир!&#34;
        </p>
      </div>
      <div className={styles.toogleLanguage}>
        <label htmlFor="languageSelect">Выберите язык: </label>
        <select
          id="languageSelect"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className={styles.languageSelect}
        >
          {Object.keys(LANGUAGES).map((key) => (
            <option key={key} value={key}>
              {LANGUAGES[key].name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.wrapCode}>
        <CodeMirror
          value={code}
          height="300px"
          extensions={[
            LANGUAGES[selectedLanguage].extension,
            EditorView.lineWrapping,
          ]}
          onChange={onChange}
          theme={sublime}
          autoFocus={true}
        />
      </div>
      <div className={styles.wrapButtons}>
        <button className={`button ${styles.buttonRunCode}`} onClick={runCode}>
          Run
        </button>
        <button className={`button ${styles.buttonClear}`} onClick={clearCode}>
          Clear Code
        </button>
      </div>
      <div className={styles.console} ref={consoleRef}>
        <Console logs={logs} variant="dark" styles={{ BASE_FONT_SIZE: 18 }}/>
      </div>
      <div className={styles.wrapButtons}>
        <button className={`button ${styles.buttonClear}`} onClick={clearConsole}>
          Clear Console
        </button>
      </div>
    </>
  );
}

export default App;
