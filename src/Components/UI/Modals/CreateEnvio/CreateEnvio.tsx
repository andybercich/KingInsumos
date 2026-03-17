import { Dispatch, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./CreateEnvio.module.css";

import { paginadorStore } from "../../../../store/PaginaStore";
import { EnvioCreate, EnvioDTO, Envio } from "../../../../Models/Envio";
import { MedioPago, OpcionPago, StringToMedioPago } from "../../../../Models/Pedido";

import { EnvioService } from "../../../../Services/EnvioService";
import { badContest, godContest } from "../../PopUps/Alerts/ServerBadAlert";

import { useForm } from "../../../../Hooks/useForm";
import { Close } from "../../../Icons/CloseIcon/Close";
import ProductoSearchBar from "../../SearchBar/ProductoSearchBar";
import { CardDetalle } from "../../CardDetallePedido/CardDetalle";

import { getLocalDateTimeString } from "../../../../Models/FuncionDate";
import { usePedidoStore } from "../../../../store/DetalleStore";

interface Props {
  idEnvio?: number;
  close: Dispatch<React.SetStateAction<boolean>>;
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

export const CreateEnvio = ({ close, idEnvio }: Props) => {

  const { setRecargar, recargar } = paginadorStore();
  const [envio, setEnvio] = useState<EnvioDTO>();

  const { detallesPedido, calcularTotal, setDetallesPedido, total } = usePedidoStore();

  const [pagos, setPagos] = useState<OpcionPago[]>([]);

  const fetchEnvio = async () => {
    try {

      const service = new EnvioService();

      if (idEnvio) {

        const response = await service.getEnvioDTOById(idEnvio);

        setEnvio(response.data);

        setDetallesPedido(response.data.detalles);

        if (response.data.opcionesPagos) {
          setPagos(response.data.opcionesPagos);
        }

      }

    } catch {
      badContest("Error al obtener envio");
    }
  };

  useEffect(() => {
    calcularTotal();
  }, [detallesPedido]);

  useEffect(() => {
    fetchEnvio();
  }, []);

  useEffect(() => {

    if (envio) {

      resetForm({
        cliente: envio.cliente,
        contacto: envio.contacto,
        provincia: envio.provincia,
        localidad: envio.localidad,
        codigoPostal: envio.codigoPostal,
        calle: envio.calle,
        numero: envio.numero,
        edificio: envio.edificio,
        departamento: envio.departamento,
        precioEnvio: Number(envio.precioEnvio),
        descripcionesEspecificas: envio.descripcionesEspecificas
      });

    }

  }, [envio]);

  const { values, handleChange, resetForm } = useForm({

    cliente: "",
    contacto: "",
    provincia: "",
    localidad: "",
    codigoPostal: "",
    calle: "",
    numero: "",
    edificio: "",
    departamento: "",
    precioEnvio: 0,
    descripcionesEspecificas: ""

  });

  const addPago = () => {

    setPagos(prev => [

      ...prev,

      {
        medioPago: MedioPago.None,
        monto: 0,
        fechaPago: getLocalDateTimeString(),
        info: "",
        agregadoMedio: 0,
        agregadoTotal: 0
      }

    ]);

  };

  const removePago = (index: number) => {

    setPagos(prev => prev.filter((_, i) => i !== index));

  };

  const updatePago = (index: number, field: string, value: any) => {

    setPagos(prev => {

      const copia = [...prev];

      copia[index] = { ...copia[index], [field]: value };

      return copia;

    });

  };

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();

    const service = new EnvioService();

    if (detallesPedido.length === 0) {

      badContest("No puedes crear un envio sin productos");

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

      if (envio) {

        const envioUpdate: Envio = {

          id: envio.id,

          cliente: values.cliente,

          contacto: values.contacto,

          detalles: detallesPedido,

          opcionesPagos: opcionesPagos,

          provincia: values.provincia,

          localidad: values.localidad,

          codigoPostal: values.codigoPostal,

          calle: values.calle,

          numero: values.numero,

          edificio: values.edificio,

          departamento: values.departamento,

          precioEnvio: Number(values.precioEnvio),

          descripcionesEspecificas: values.descripcionesEspecificas,

          totalSinEnvio: 0,

          fechaPedido: envio.fechaPedido,

          ganancia: 0,

          horaFechaEnvio: ""

        };

        response = await service.editarEnvio(envioUpdate, envio.id);

      }

      else {

        const envioNuevo: EnvioCreate = {

          cliente: values.cliente,

          contacto: values.contacto,

          detalles: detallesPedido,

          opcionesPagos: opcionesPagos,

          provincia: values.provincia,

          localidad: values.localidad,

          codigoPostal: values.codigoPostal,

          calle: values.calle,

          numero: values.numero,

          edificio: values.edificio,

          departamento: values.departamento,

          precioEnvio: Number(values.precioEnvio),

          descripcionesEspecificas: values.descripcionesEspecificas

        };

        response = await service.crearEnvio(envioNuevo);

      }

      if (response.status === 200) {

        godContest(`Se ha ${envio ? "editado" : "creado"} el envio correctamente`);

        resetForm();

        setDetallesPedido([]);

        setPagos([]);

        setRecargar(!recargar);

        close(false);

      }

      else {

        badContest("El envio no se pudo crear correctamente");

      }

    }

    catch (error) {

      badContest("Error al crear envio: " + error);

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

  const totalPedidoFinal = total + Number(values.precioEnvio || 0) + extraMedioTotal + extraTotalPedido;

  const totalPagos = pagos.reduce((acc,p)=>{
    const monto = Number(p.monto || 0);
    const extraMedio = (monto * (p.agregadoMedio || 0)) / 100;
    return acc + monto + extraMedio;
  },0);

  const restante = totalPedidoFinal - totalPagos;

  return (

    <div className={styles.mainDiv}>

      <div className={styles.modalUser}>

        <h1 className={styles.titulo}>{envio ? "Editar" : "Crear"} Envio</h1>

        <div onClick={() => setDetallesPedido([])} className={styles.divClose}>
          <Close close={close} />
        </div>

        <form onSubmit={handleSubmit} className={styles.formularios}>

          <div className={styles.inputsMains}>

            <input name="cliente" placeholder="Nombre Cliente" value={values.cliente} onChange={handleChange} required />
            <input name="contacto" placeholder="Contacto" value={values.contacto} onChange={handleChange} />
            <input name="provincia" placeholder="Provincia" value={values.provincia} onChange={handleChange} />
            <input name="localidad" placeholder="Localidad" value={values.localidad} onChange={handleChange} />
            <input name="codigoPostal" placeholder="Código Postal" value={values.codigoPostal} onChange={handleChange} />
            <input name="calle" placeholder="Calle" value={values.calle} onChange={handleChange} />
            <input name="numero" placeholder="Número" value={values.numero} onChange={handleChange} />
            <input name="edificio" placeholder="Edificio" value={values.edificio} onChange={handleChange} />
            <input name="departamento" placeholder="Departamento" value={values.departamento} onChange={handleChange} />

            <input
              name="precioEnvio"
              type="number"
              placeholder="Precio envío"
              value={values.precioEnvio == 0 ? "" : values.precioEnvio}
              onChange={handleChange}
              required
            />

          </div>

          <input
            name="descripcionesEspecificas"
            placeholder="Descripción del envío"
            value={values.descripcionesEspecificas}
            onChange={handleChange}
          />

          
          <div className={styles.productoContainer}>
            <h3>Productos</h3>

            <div style={{display:"flex", flexDirection:"column", alignItems:"center",width:"60%"}}>
              <ProductoSearchBar isDetalle={true}/>
            </div>

            <div className={styles.detallePedidoContainer}>

              {detallesPedido.length > 0 ? (
                detallesPedido.map((d) => (
                  <CardDetalle key={d.producto.id} detalle={d} {...(envio ? { envio } : null)} />
                ))
              ) : (
                <p>No se ha seleccionado ningún producto</p>
              )}

            </div>

          </div>

          <h3>Pagos</h3>

          <div className={styles.pagosContainer}>

            {pagos.map((pago, index) => {

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

                    <option value="" disabled>Medio de pago</option>

                    {mediosPago.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}

                  </select>

                  <input
                    type="number"
                    placeholder="Monto"
                    value={pago.monto || ""}
                    required
                    onChange={(e) => updatePago(index, "monto", Number(e.target.value))}
                  />

                  <label>A cobrar: ${aCobrar}</label>

                  <input
                    type="number"
                    placeholder="% al pago"
                    value={pago.agregadoMedio || ""}
                    onChange={(e)=>updatePago(index,"agregadoMedio",Number(e.target.value))}
                  />

                  <input
                    type="number"
                    placeholder="% al total"
                    value={pago.agregadoTotal || ""}
                    onChange={(e)=>updatePago(index,"agregadoTotal",Number(e.target.value))}
                  />

                  <input
                    type="datetime-local"
                    value={pago.fechaPago?.substring(0,16)}
                    onChange={(e) => updatePago(index, "fechaPago", e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Info"
                    value={pago.info}
                    onChange={(e) => updatePago(index, "info", e.target.value)}
                  />

                  <span style={{ cursor: "pointer" }} onClick={() => removePago(index)}>✕</span>

                </div>

              )

            })}

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

  );

};