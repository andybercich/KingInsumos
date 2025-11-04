import { useState } from 'react';
import { paginadorStore } from '../../../store/PaginaStore';
import style from './CardEnvio.module.css'
import { EnvioService } from '../../../Services/EnvioService';
import { badContest, godContest, tripleOptionAlert } from '../PopUps/Alerts/ServerBadAlert';
import { EnvioDTO } from '../../../Models/Envio';
import { Edit } from '../../Icons/EditIcon/Edit';
import { Delete } from '../../Icons/DeleteIcon/Delete';
import { Info } from '../../Icons/InfoIcon/Info';
import ReactDOM from 'react-dom';
import { CreateEnvio } from '../Modals/CreateEnvio/CreateEnvio';
import { VerEnvio } from '../Info/VerEnvio/VerEnvio';

interface EnvioProps{
    envio:EnvioDTO
}
export const CardEnvio = ({envio}:EnvioProps) => {
    const {setRecargar,recargar} = paginadorStore();
    const [edit,setEdit] = useState<boolean>(false);
    const [ver, setVer]= useState<boolean>(false);
    const onDelete= async()=>{
      const service = new EnvioService();
      try {
  
        const afirmative = await tripleOptionAlert("¿Estás seguro de querer borrar este envio?", "Tienes dos opciones", "Eliminar y reestablecer stock", "Eliminar sin reestablecer stock", "Cancelar");
        
        if(afirmative === 3){
          const response = await service.deleteEnvioAfectandoStockById(envio.id);
          godContest("El envio y el stock se reestablecio correctamente")
          if(response.status === 204){
  
            setRecargar(!recargar);
  
          }

        }else if(afirmative === 2){
          const response = await service.eliminarSinAfectarStock(envio.id);
          godContest("El pedido fue eliminado correctamente sin afectar stock")
          if(response.status === 204){
  
            setRecargar(!recargar);
  
          }
        }

  
  
        
      } catch (error) {
        badContest("No se pudo borrar el envio: "+error)
      }
    }
  
    return (
      <div className= {style.card}>
          <div className={style.titulos}>
              <h3>{envio.cliente}</h3>
              <h3>{envio.totalSinEnvio}</h3>
              <h3>{envio.fechaPedido}</h3>
              <h3>{envio.contacto}</h3>
              <h3>{envio.medioPago}</h3>
              <h3>{envio.adelanto > 0 ? `Total:$${envio.totalSinEnvio}-$${envio.adelanto}=$${envio.totalSinEnvio-envio.adelanto} `: `${envio.totalSinEnvio}`}</h3>
          </div>
          
          <div className={style.iconos}>
              <Edit close={setEdit}></Edit>
              <Delete onDelete={onDelete}></Delete>
              <Info onClick={setVer}></Info>
          </div>
  
  
          {edit  ? 
          
          ReactDOM.createPortal(
          <CreateEnvio edit={true} close={setEdit} idEnvio={envio.id}/> , 
                document.body
          ) 
        
          : null}
          {ver  ? 
          
          ReactDOM.createPortal(
          <VerEnvio  close={setVer} envioId={envio.id}/> , 
                document.body
          ) 
        
          : null}
  
      </div>
    )
  }
  
