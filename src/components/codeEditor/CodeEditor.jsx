import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { sublime } from '@uiw/codemirror-theme-sublime';
import styles from './CodeEditor.module.css';

const CodeEditor = ({ code, onChange, languageExtension }) => (
  <div className={styles.wrapCode}>
    <CodeMirror
      value={code}
      height="300px"
      extensions={[languageExtension, EditorView.lineWrapping]}
      onChange={onChange}
      theme={sublime}
      autoFocus={true}
    />
  </div>
);

export default CodeEditor;