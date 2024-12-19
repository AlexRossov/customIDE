import { useRef, useEffect, useState } from 'react';
import { Console, Hook, Unhook } from 'console-feed';
import styles from './ConsoleOutput.module.css';

const ConsoleOutput = ({ logs }) => {
  const consoleRef = useRef(null);


  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTo({
        top: consoleRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [logs]);

  return (
    <div className={styles.console} ref={consoleRef}>
      <Console logs={logs} variant="dark" styles={{ BASE_FONT_SIZE: 18 }} />
    </div>
  );
};

export default ConsoleOutput;