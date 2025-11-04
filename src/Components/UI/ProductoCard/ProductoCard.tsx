import ReactDOM from "react-dom"
import { ProductoDTO } from "../../../Models/ProductoDTO"
import { Delete } from "../../Icons/DeleteIcon/Delete"
import { Edit } from "../../Icons/EditIcon/Edit"
import { Info } from "../../Icons/InfoIcon/Info"
import style from "./ProductoCard.module.css"
import { useState } from "react"
import { CreateProductoModal } from "../Modals/CreateProducto/CreateProductoModal"
import { paginadorStore } from "../../../store/PaginaStore"
import { badContest, confirmAlert, godContest } from "../PopUps/Alerts/ServerBadAlert"
import { ProductoService } from "../../../Services/ProductoService"
import { VerProducto } from "../Info/VerProducto/VerProducto"

interface IProps{
  product: ProductoDTO
}

export const ProductoCard = ({product}:IProps) => {
  const {setRecargar,recargar} = paginadorStore();
  const [edit,setEdit] = useState<boolean>(false);
  const [ver, setVer] = useState<boolean>(false);
  const onDelete= async()=>{
    const service = new ProductoService();
    try {

      const afirmative = await confirmAlert("¿Estás seguro de querer borrar este producto? Para eliminarlo no debe estar relacionado con ningun pedido/envio");

      if(afirmative){
        const response = await service.deleteProductoById(product.id);
        godContest("El producto se elimino con éxito")
        if(response.status === 204){

          setRecargar(!recargar);

        }
      }



      
    } catch (error) {
      badContest("No se pudo borrar el producto: "+error)
    }
  }

  return (
    <div className= {product.stock > product.stockMin ? style.card : style.cardStock}>
        <div className={style.titulos}>
            <h3>{product.codigo}</h3>
            <h3>{product.categoria.denominacion}</h3>
            <h3>{product.nombre}</h3>
            <h3>{product.medida+product.unidad}</h3>

            <h3>{product.stock}</h3>
            <h3>${product.precioVenta}</h3>
        </div>

        
        <div className={style.iconos}>
            <Edit close={setEdit}></Edit>
            <Delete onDelete={onDelete}></Delete>
            <Info onClick={setVer}></Info>
        </div>


        {edit  ? 
        
        ReactDOM.createPortal(
        <CreateProductoModal close={setEdit} idProduct={product.id}/> , 
              document.body
        ) 
      
        : null}
        {ver  ? 
        
        ReactDOM.createPortal(
        <VerProducto close={setVer} idProducto={product.id}/> , 
              document.body
        ) 
      
        : null}

    </div>
  )
}
