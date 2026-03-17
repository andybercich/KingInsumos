import { useState } from "react";
import { PedidoDTO } from "../../../Models/Pedido";
import { paginadorStore } from "../../../store/PaginaStore";
import style from"./CardPedido.module.css"
import { PedidoService } from "../../../Services/PedidoService";
import { badContest, godContest, tripleOptionAlert } from "../PopUps/Alerts/ServerBadAlert";
import { Edit } from "../../Icons/EditIcon/Edit";
import { Delete } from "../../Icons/DeleteIcon/Delete";
import { Info } from "../../Icons/InfoIcon/Info";
import { CreatePedido } from "../Modals/CreatePedido/CreatePedido";
import ReactDOM from "react-dom";
import { VerPedido } from "../Info/VerPedido/VerPedido";

interface IProps{
    pedido: PedidoDTO
  }
  
  export const CardPedido = ({pedido}:IProps) => {
    const {setRecargar,recargar} = paginadorStore();
    const [edit,setEdit] = useState<boolean>(false);
    const [ver, setVer] = useState<boolean>(false);
  
    const onDelete= async()=>{
      const service = new PedidoService();
      try {
  
        const afirmative = await tripleOptionAlert("¿Estás seguro de querer borrar este pedido?", "Tienes dos opciones", "Eliminar y reestablecer stock", "Eliminar sin reestablecer stock", "Cancelar");
        
        if(afirmative === 3){
          const response = await service.deleteEnvioAfectandoStockById(pedido.id);
          godContest("El pedido y el stock se reestablecio correctamente")
          if(response.status === 204){
  
            setRecargar(!recargar);
  
          }

        }else if(afirmative === 2){
          const response = await service.eliminarSinAfectarStock(pedido.id);
          godContest("El pedido fue eliminado correctamente sin afectar stock")
          if(response.status === 204){
  
            setRecargar(!recargar);
  
          }
        }

  
  
        
      } catch (error) {
        badContest("No se pudo borrar el pedido: "+error)
      }
    }
  
    return (
      <div className= {style.card}>
          <div className={style.titulos}>
              <h3>{pedido.cliente}</h3>
              <h3>${pedido.total}</h3>
              <h3>{pedido.fechaPedido}</h3>
              <h3>{pedido.contacto}</h3><h3>
</h3>
          </div>
  
          
          <div className={style.iconos}>
              <Edit close={setEdit}></Edit>
              <Delete onDelete={onDelete}></Delete>
              <Info onClick={setVer}></Info>
          </div>
  
  
          {edit  ? 
          
          ReactDOM.createPortal(
          <CreatePedido edit={true} close={setEdit} idPedido={pedido.id}/> , 
                document.body
          ) 
        
          : null}

        {ver  ? 
          
          ReactDOM.createPortal(
          <VerPedido close={setVer} pedido={pedido}/> , 
                document.body
          ) 
        
          : null}
  
      </div>
    )
  }
  
