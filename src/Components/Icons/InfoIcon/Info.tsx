import { Dispatch } from 'react';
import style from './Info.module.css'
interface IProps {
  onClick: Dispatch<React.SetStateAction<boolean>>;
}
export const Info = ({onClick}:IProps) => {
  return (
    <span onClick={()=>onClick(true)} className={`material-symbols-outlined ${style.info}`}>
        info
    </span>
  )
}
