import { Dispatch } from 'react'
import style from './edit.module.css'

interface Props{
  close: Dispatch<React.SetStateAction<boolean>>
}
export const Edit = ({close}:Props) => {
  return (
    <span onClick={()=>{close(true)}} className={`material-symbols-outlined ${style.edit}`}>
        edit
    </span>
  )
}
