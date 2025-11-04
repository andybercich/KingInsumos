import { useState } from 'react';
import { GastoUpdate } from '../../../Models/Gasto'
import { paginadorStore } from '../../../store/PaginaStore';
import style from './Gasto.module.css'
import { GastoService } from '../../../Services/GastoService';
import { badContest, confirmAlert, godContest } from '../PopUps/Alerts/ServerBadAlert';
import { Edit } from '../../Icons/EditIcon/Edit';
import { Delete } from '../../Icons/DeleteIcon/Delete';
import { Info } from '../../Icons/InfoIcon/Info';
import ReactDOM from 'react-dom';
import { CreateGasto } from '../Modals/CreateGasto/CreateGasto';
import { VerGasto } from '../Info/VerGasto/VerGasto';

interface IGasto {
    gasto: GastoUpdate
}
export const Gasto = ({gasto}:IGasto) => {
  const {setRecargar,recargar} = paginadorStore();
  const [edit,setEdit] = useState<boolean>(false);
  const [ver,setVer]= useState<boolean>(false);

  const onDelete= async()=>{
    const service = new GastoService();
    try {

      const afirmative = await confirmAlert("¿Estás seguro de borrar este gasto?");
      
      if(afirmative){
        const response = await service.deleteGasto(gasto.id);
        godContest("El gasto se eliminó correctamente")
        if(response.status === 204){

          setRecargar(!recargar);

        }

      }



      
    } catch (error) {
      badContest("No se pudo borrar el gasto: "+error)
    }
  }

  return (
    <div className= {style.card}>
        <div className={style.titulos}>
            <h3>${gasto.gasto}</h3>
            <h3>{gasto.motivo}</h3>
            <h3>{gasto.fechaCreacion}</h3>
        </div>
        
        <div className={style.iconos}>
            <Edit close={setEdit}></Edit>
            <Delete onDelete={onDelete}></Delete>
            <Info onClick={setVer}></Info>
        </div>


        {edit  ? 
        
        ReactDOM.createPortal(
        <CreateGasto close={setEdit} gasto={gasto}/> , 
              document.body
        ) 
      
        : null}
        {ver  ? 
        
        ReactDOM.createPortal(
        <VerGasto close={setVer} gasto={gasto}/> , 
              document.body
        ) 
      
        : null}

    </div>
  )
}