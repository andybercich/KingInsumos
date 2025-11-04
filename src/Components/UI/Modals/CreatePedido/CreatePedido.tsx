import { Dispatch, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./CreatePedido.module.css"
import { paginadorStore } from "../../../../store/PaginaStore";
import { PedidoCreate, PedidoDTO, PedidoUpdate, StringToMedioPago } from "../../../../Models/Pedido";
import { PedidoService } from "../../../../Services/PedidoService";
import { badContest, godContest } from "../../PopUps/Alerts/ServerBadAlert";
import { useForm } from "../../../../Hooks/useForm";
import { Close } from "../../../Icons/CloseIcon/Close";
import ProductoSearchBar from "../../SearchBar/ProductoSearchBar";
import { CardDetalle } from "../../CardDetallePedido/CardDetalle";
import { getLocalDateTimeString } from "../../../../Models/FuncionDate";
import { usePedidoStore } from "../../../../store/DetalleStore";
interface Props{
  idPedido?: number
  close: Dispatch<React.SetStateAction<boolean>>
  edit: boolean;
}

const mediosPago = [
  { value: "DEBITO", label: "Debito" },
  { value: "TRANSFERENCIA", label: "TRANSFERENCIA" },
  { value: "CREDITO", label: "CREDITO" },
  { value: "QR", label: "QR" },
  { value: "EFECTIVO", label: "EFECTIVO" }
];
interface MediosPago{
    value:string;
    label:string;
}

export const CreatePedido = ({close,idPedido,edit}:Props) => {
    const { setRecargar,recargar } = paginadorStore();
    const [pedido, setPedido] = useState<PedidoDTO>();
    const [pagado, setPagado] = useState<boolean>(false);
    const { detallesPedido,calcularTotal, setDetallesPedido, total } = usePedidoStore();
    const fetchPedido= async ()=>{
      
      try {
        const service = new PedidoService();
        if(idPedido){
          const response = await service.getPedidoDTOById(idPedido);
          setPedido(response.data);
          console.log(response.data);
          setDetallesPedido(response.data.detalles)
        }
        
      } catch (error) {
        badContest("Error al obtener pedido con id");
      }
  
    }

useEffect(() => {
  console.log(detallesPedido);
  calcularTotal();
}, [detallesPedido]);

    useEffect(() => {
      fetchPedido();
    }, []);


    
    useEffect(()=>{
      
      filtrarMedios();
      if (pedido) {
        resetForm({
            cliente: pedido.cliente,
            contacto: pedido.contacto,
            adelanto: pedido.adelanto,
            MedioPago: pedido.medioPago.toString(),
            fechaPedido:  pedido.fechaPedido.toString(),
            total: pedido.total
        });
        setPagado(pedido.pagadoTotalmente);
      }
    }, [pedido])
  
  
  
    const [mediosPagos, setMediosPagos] = useState<MediosPago[]>(mediosPago);
  
      const { values, handleChange, resetForm } = useForm({
        cliente: pedido && pedido.cliente   ?  pedido.cliente : "",
        contacto: pedido && pedido.contacto   ?  pedido.contacto : "",
        adelanto: pedido && pedido.adelanto   ?  pedido.adelanto : "",
        MedioPago: "",
        fechaPedido: pedido && pedido.fechaPedido.toString()  ? pedido.fechaPedido.toString() : "",
        total: pedido && pedido.total  ?  pedido.total : ""
      });
    
      const filtrarMedios = async ()=>{
  
        try {

            console.log(mediosPago);
          if(pedido){
            const mediosPagos = mediosPago.filter(
  
              (unidad) => unidad.value !== pedido.medioPago.toString()
            )
            setMediosPagos(mediosPagos);
            console.log(mediosPagos)
          }
  
        } catch (error) {
          console.log(error)
          badContest("No se pudo cargar niguna categoria")
  
        }
  
      }
  
      
  
    
      const handleSubmit = async (event: React.FormEvent)=>{
        event.preventDefault();
        const service = new PedidoService();
        if(detallesPedido.length === 0){
          badContest("No puedes crear un pedido sin detalles")
          return;
        }
        try {
    
            let response;
            if(!pagado && Number(values.adelanto) <=0){
              badContest("Si el pedido no está señado, debe agregarse un adelanto");
              return;
            }
            if(pedido){ 
  
              const editProducto:PedidoUpdate = {
                  id: pedido.id,
                  cliente:values.cliente.toString() ,
                  medioPago:StringToMedioPago(values.MedioPago),
                  total: 0,
                  detalles: detallesPedido,
                  ganancia: 0,
                  pagadoTotalmente: pagado,
                  adelanto: Number(values.adelanto),
                  fechaPedido: String(pedido.fechaPedido),
                  contacto: values.contacto.toString()
              }
              console.log(editProducto)
              response = await service.editarPedido( editProducto,editProducto.id);
            }else{
                
              const pedidoNuevo:PedidoCreate = {
                cliente:values.cliente.toString() ,
                medioPago: StringToMedioPago(values.MedioPago),
                total: 0,
                detalles: detallesPedido,
                ganancia: 0,
                fechaPedido: getLocalDateTimeString(),
                pagadoTotalmente: pagado,
                adelanto: Number(values.adelanto),
                contacto: values.contacto.toString()
              }
              console.log(pedidoNuevo)
    
              response = await service.crearPedido(pedidoNuevo);
              
            }
           
    
    
            if (response.status === 200) {
  
              godContest(`Se ha ${pedido ? "editado" :"creado"} el pedido correctamente`);
              resetForm();
              setDetallesPedido([])
              setRecargar(!recargar);
              close(false);
    
            } else if (response.status === 400) {
    
              badContest("El pedido no se pudo crear correctamente")
              
            }else {
              badContest("El pedido no se pudo crear correctamente")
  
            }
    
          }catch (error) {
    
          badContest("El pedido no se pudo crear correctamente: "+error)
          console.log(error);
          
          setDetallesPedido([])
        }    
      }
  
      
    
    
      return (
        <div className={styles.mainDiv}>
          <div className={styles.modalUser}>
  
              <h1 className={styles.titulo}>{pedido ? "Editar" : "Crear"} Pedido</h1>
      
            <div onClick={()=>{
              setDetallesPedido([])}} className={styles.divClose}>
              <Close  close={close} />
            </div>
      
            <form onSubmit={handleSubmit} className={styles.formularios}>
        <div className={styles.inputsMains}>
            
          <input
            id="cliente"
            name="cliente"
            type="string"
            required
            placeholder="Nombre Cliente"
            value={values.cliente}
            onChange={handleChange}
          />
    
              <input
                id="contacto"
                name="contacto"
                placeholder="Ingrese el contacto del cliente"
                type="number"
                value={Number(values.contacto) <= 0 ? "": values.contacto}
                onChange={handleChange}
              />
  
  
              <input
                id="adelanto"
                name="adelanto"
                type="number"
                placeholder="Adelanto"
                value={Number(values.adelanto) <= 0 ?''  :values.adelanto }
                onChange={handleChange}
              />
            </div>
             <select
              id="MedioPago"
              name="MedioPago"
              value={values.MedioPago}
              onChange={handleChange}
              required
              className={styles.select}
              >
              {pedido ? <option key={pedido.medioPago} value={pedido.medioPago}>{pedido.medioPago}</option>:<option value="" disabled>Medio Pago</option> }
              { pedido ? mediosPagos.map((type) => (
                  <option key={type.value} value={type.value}>
                  {type.label}
                  </option>
              )) : mediosPago.map((type) => (
                <option key={type.value} value={type.value}>
                {type.label}
                </option>
            ))  }
              </select>
            
            <div className={styles.chekPagado}>
              <p>Pagado totalmente: </p>
              <input type="checkbox" onChange={()=>{setPagado(!pagado)}} checked={pagado}></input>

            </div>

            <div className={styles.productoContainer}>
                <div style={{  display:"flex", flexDirection:"column", alignItems:"center",justifyItems:"center",width:"60%"}}>
                {pedido && edit ? 
                  (<ProductoSearchBar    isDetalle={true}  ></ProductoSearchBar>):
                  <ProductoSearchBar  isDetalle={true}   ></ProductoSearchBar>}

                </div>
                <div className={styles.detallePedidoContainer}>
                
                {detallesPedido.length > 0 ? (
                  detallesPedido.map((d) => (
                    <CardDetalle key={d.producto.id} detalle={d} {...(pedido ? { pedido } : null)} />
                  ))
                ) : (
                  <p>No se ha seleccionado ningún producto</p>
                )}


                </div>
            </div>

            <h5  style={{textAlign:"right",width:"80%"}}>Total:${total}-${values.adelanto}= {total-Number(values.adelanto)}</h5>
  
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="outline-success">
                  Confirmar
                </Button>
              </div>
    
              
            </form>
          </div>
        </div>
      )
  }
  
