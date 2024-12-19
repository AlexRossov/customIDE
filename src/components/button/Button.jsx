import styles from './Button.module.css';

const Button = ({ onClick, variant, children }) => {
  return (
    <button className={`${styles.button} ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;