import styles from "./Add.module.css";

interface AddProps {
  onClick?: () => void; 
}

export const Add = ({ onClick }: AddProps) => {
  return (
    <span onClick={onClick} className={`material-symbols-outlined ${styles.icono}`}>
      add
    </span>
  );
};

