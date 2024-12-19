import styles from './LanguageSelector.module.css';

const LanguageSelector = ({ selectedLanguage, onChange, languages }) => (
  <div className={styles.toogleLanguage}>
    <label htmlFor="languageSelect">Выберите язык: </label>
    <select
      id="languageSelect"
      value={selectedLanguage}
      onChange={onChange}
      className={styles.languageSelect}
    >
      {Object.keys(languages).map((key) => (
        <option key={key} value={key}>
          {languages[key].name}
        </option>
      ))}
    </select>
  </div>
);

export default LanguageSelector;