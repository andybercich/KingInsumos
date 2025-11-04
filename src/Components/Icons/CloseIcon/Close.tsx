import styles from "./Close.module.css"

interface IClose{
    close: React.Dispatch<React.SetStateAction<boolean>>
}

export const Close = ({close} : IClose) => {
  return (
    <span onClick={()=>{close(false)}} className={`material-symbols-outlined ${styles.icono}`}>
        close
    </span>
  )
}
