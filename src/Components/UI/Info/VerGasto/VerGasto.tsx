import { Dispatch } from "react";
import { GastoCreate } from "../../../../Models/Gasto";
import style from "./VerGasto.module.css"
import { Close } from "../../../Icons/CloseIcon/Close";

interface IVer {
  gasto: GastoCreate;
  close: Dispatch<React.SetStateAction<boolean>>;
}
export const VerGasto = ({ gasto, close }: IVer) => {



  return (
    <div className={style.mainDiv}>
      <div className={style.modalUser}>
        <div className={style.divClose}>
          <Close close={close}></Close>
        </div>
        <div className={style.info}>
          <h3><b>Motivo: </b>{gasto.motivo}</h3>
          <h3><b>Gasto: </b>${gasto.gasto}</h3>
        </div>
          <div className={style.datos}>
            
            <p><b>Fecha:</b> {gasto.fechaCreacion}</p>
            <p><b>Descripcion:</b> {gasto.descripcion}</p>

        </div>
        </div>
      </div>
  );
};


