import styles from './Header.module.css';

const Header = () => (
  <div className={styles.exercise}>
    <h2 className={styles.titleExercise}>Задача №1</h2>
    <p className={styles.descExercise}>
      Напишите ниже код, который выведет в консоль - &#34;Привет мир!&#34;
    </p>
  </div>
);

export default Header;