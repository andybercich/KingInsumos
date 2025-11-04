import { FC } from 'react';
import style from './Delete.module.css'
interface IProps {
  onDelete?: () => void;
}

export const Delete: FC<IProps> = ({ onDelete }) => {
  return (
    <span onClick={() => onDelete && onDelete()} className={`material-symbols-outlined ${style.delete}`}>
delete
</span>
  )
}
