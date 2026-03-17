import { Dispatch, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./CreatePedido.module.css"
import { paginadorStore } from "../../../../store/PaginaStore";
import { MedioPago, OpcionPago, PedidoCreate, PedidoDTO, PedidoUpdate, StringToMedioPago } from "../../../../Models/Pedido";
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
  { value: "DebitoPostnetMp", label: "Débito Postnet MP" },
  { value: "CreditoPostnetMp", label: "Crédito Postnet MP" },
  { value: "QR", label: "QR" },
  { value: "LinkMercadoPago", label: "Link Mercado Pago" },
  { value: "Efectivo", label: "Efectivo" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "GoCuotas", label: "Go Cuotas" }
];

export const CreatePedido = ({close,idPedido}:Props) => {

  const { setRecargar,recargar } = paginadorStore();
  const [pedido, setPedido] = useState<PedidoDTO>();

  const { detallesPedido,calcularTotal, setDetallesPedido, total } = usePedidoStore();

  const [pagos, setPagos] = useState<OpcionPago[]>([]);

  const fetchPedido= async ()=>{
    try {
      const service = new PedidoService();

      if(idPedido){
        const response = await service.getPedidoDTOById(idPedido);
        setPedido(response.data);
        console.log(response.data)
        setDetallesPedido(response.data.detalles);

        if(response.data.opcionesPagos){
          setPagos(response.data.opcionesPagos);
        }
      }

    } catch (error) {
      badContest("Error al obtener pedido con id");
    }
  }

  useEffect(() => {
    calcularTotal();
  }, [detallesPedido]);

  useEffect(() => {
    fetchPedido();
  }, []);

  useEffect(() => {
  if (pedido) {
    resetForm({
      cliente: pedido.cliente ?? "",
      contacto: pedido.contacto ?? "",
      fechaPedido: pedido.fechaPedido?.toString() ?? "",
      total: pedido.total ?? ""
    });
  }
}, [pedido]);

  

  const { values, handleChange, resetForm } = useForm({
    cliente: pedido?.cliente ? pedido.cliente : "",
    contacto: pedido?.contacto ?? "",
    fechaPedido: pedido?.fechaPedido?.toString() ?? "",
    total: pedido?.total ?? ""
  });

const addPago = () => {
  setPagos(prev => [
    ...prev,
    {
      medioPago:MedioPago.None,
      monto: 0,
      fechaPago: getLocalDateTimeString(),
      info: "",
      agregadoTotal:0,
      agregadoMedio:0
    }
  ]);
};

  const removePago = (index:number) => {
    setPagos(prev => prev.filter((_,i)=> i !== index));
  };

  const updatePago = (index:number, field:string, value:any) => {
    setPagos(prev => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [field]: value };
      return copia;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();

    const service = new PedidoService();

    if(detallesPedido.length === 0){
      badContest("No puedes crear un pedido sin detalles");
      return;
    }

    try {

      const opcionesPagos = pagos.map(p => ({
        medioPago: StringToMedioPago(p.medioPago as any),
        pago: Number(p.monto),
        fechaPago: p.fechaPago,
        info: p.info,
        agregadoMedio: p.agregadoMedio,
        agregadoTotal: p.agregadoTotal
      }));

      let response;

      if(pedido){

        const editPedido: PedidoUpdate = {
          id: pedido.id,
          cliente: values.cliente.toString(),
          contacto: values.contacto.toString(),
          total: 0,
          detalles: detallesPedido,
          ganancia: 0,
          fechaPedido: getLocalDateTimeString(),
          opcionesPagos: opcionesPagos
        };

        response = await service.editarPedido(editPedido, editPedido.id);

      }else{

        const pedidoNuevo: PedidoCreate = {
          cliente: values.cliente.toString(),
          contacto: values.contacto.toString(),
          detalles: detallesPedido,
          opcionesPagos: opcionesPagos
        };

        response = await service.crearPedido(pedidoNuevo);

      }

      if (response.status === 200) {

        godContest(`Se ha ${pedido ? "editado" :"creado"} el pedido correctamente`);

        resetForm();
        setDetallesPedido([]);
        setPagos([]);
        setRecargar(!recargar);
        close(false);

      } else {

        badContest("El pedido no se pudo crear correctamente");

      }

    }
    catch (error) {

      badContest("El pedido no se pudo crear correctamente: "+error);

    }

  };

  const extraMedioTotal = pagos.reduce((acc,p)=>{
    const monto = Number(p.monto || 0);
    return acc + (monto * (p.agregadoMedio || 0)) / 100;
  },0);

  const extraTotalPedido = pagos.reduce((acc,p)=>{
    const monto = Number(p.monto || 0);
    return acc + (monto * (p.agregadoTotal || 0)) / 100;
  },0);

  const totalPedidoFinal = total + extraMedioTotal + extraTotalPedido;

  const totalPagos = pagos.reduce((acc,p)=>{
    const monto = Number(p.monto || 0);
    const extraMedio = (monto * (p.agregadoMedio || 0)) / 100;
    return acc + monto + extraMedio;
  },0);

  const restante = totalPedidoFinal - totalPagos;

  return (
    <div className={styles.mainDiv}>
      <div className={styles.modalUser}>

        <h1 className={styles.titulo}>{pedido ? "Editar" : "Crear"} Pedido</h1>

        <div onClick={()=>{ setDetallesPedido([])}} className={styles.divClose}>
          <Close close={close} />
        </div>

        <form onSubmit={handleSubmit} className={styles.formularios}>

          <div className={styles.inputsMains}>

            <input
              id="cliente"
              name="cliente"
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
              value={Number(values.contacto) <= 0 ? "" : values.contacto}
              onChange={handleChange}
            />

          </div>

          <div className={styles.productoContainer}>
            <h3>Productos</h3>

            <div style={{display:"flex", flexDirection:"column", alignItems:"center",width:"60%"}}>
              <ProductoSearchBar isDetalle={true}/>
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

          <h3>Pagos</h3>

          <div className={styles.pagosContainer}>

{pagos.length > 0 ? (

  pagos.map((pago, index) => {

    const monto = Number(pago.monto || 0);
    const extraMedio = (monto * (pago.agregadoMedio || 0)) / 100;
    const aCobrar = monto + extraMedio;

    return (

      <div key={index} className={styles.pagoCard}>

<select
  value={pago.medioPago == MedioPago.None ? "" : pago.medioPago}
  onChange={(e) => updatePago(index, "medioPago", e.target.value)}
  className={styles.select}
  required
>

  <option value="" disabled>
    Elegir un medio de pago
  </option>

  {mediosPago.map((m) => (
    <option key={m.value} value={m.value}>
      {m.label}
    </option>
  ))}

</select>

<input
  type="number"
  placeholder="Monto"
  required
  min={0}
  value={pago.monto > 0 ? pago.monto : ""}
  onChange={(e)=>updatePago(index,"monto",Number(e.target.value))}
/>

<label>
  A cobrar: ${aCobrar}
</label>

<input
  type="number"
  min={0}
  placeholder="% al pago"
  value={pago.agregadoMedio || ""}
  onChange={(e)=>updatePago(index,"agregadoMedio",Number(e.target.value))}
/>

<input
  type="number"
  min={0}
  placeholder="% al total"
  value={pago.agregadoTotal || ""}
  onChange={(e)=>updatePago(index,"agregadoTotal",Number(e.target.value))}
/>

<input
  type="datetime-local"
  value={pago.fechaPago ? pago.fechaPago.substring(0,16) : ""}
  onChange={(e)=>updatePago(index,"fechaPago",e.target.value)}
/>

<input
  type="text"
  placeholder="Información adicional"
  value={pago.info || ""}
  onChange={(e)=>updatePago(index,"info",e.target.value)}
/>

<span
  className="material-symbols-outlined"
  style={{cursor:"pointer"}}
  onClick={()=>removePago(index)}
>
  close
</span>

</div>

    )
  })

) : (
  <p>No hay pagos agregados</p>
)}

          </div>

          <Button type="button" variant="outline-primary" onClick={addPago}>
            Agregar pago
          </Button>

          <h5>
            Total: ${totalPedidoFinal} | Pagado: ${totalPagos} | Restante: ${restante}
          </h5>

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