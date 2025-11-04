import { Dispatch, useEffect, useState } from "react"
import { Producto} from "../../../../Models/ProductoDTO"
import style from "./Verproducto.module.css"
import { Close } from "../../../Icons/CloseIcon/Close"
import { ProductoService } from "../../../../Services/ProductoService"

interface IVer {
    idProducto: number
    close: Dispatch<React.SetStateAction<boolean>>
}
export const VerProducto = ({idProducto, close}:IVer) => {
    const [producto, setProducto]= useState<Producto>();
    const fetchProdcuto = async ()=>{
        const service = new ProductoService();
        try {
            const response = await service.getProductoById(idProducto);
            console.log(response.data)
            setProducto(response.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchProdcuto();
    }, []);
  return (
    <div className={style.mainDiv}>
        <div className={style.modalUser}>
            <div className={style.divClose}>
                <Close close={close}></Close>
            </div>
            <h1>{producto?.nombre}</h1>
            
            <div className={style.textDiv}>
                <h4><b>Medida:</b> {producto?.medida} {producto?.unidad}</h4>
                <h4><b>Stock:</b> {producto?.stock}</h4>
                <h4><b>Stock alert:</b> {producto?.stockMin}</h4>
                <h4><b>Descripcion:</b> {producto?.descripcion}</h4>
            </div>
           
            <div className={style.divImage}>
                <img src={producto?.imagen} alt="imagen del producto" />
            </div>
        </div>
        
    </div>
  )
}
