import { Dispatch, useEffect, useState } from "react";
import styles from "./CreateEnvio.module.css";
import { paginadorStore } from "../../../../store/PaginaStore";
import { Envio, EnvioCreate, EnvioDTO } from "../../../../Models/Envio";
import { DetallePedido,  StringToMedioPago } from "../../../../Models/Pedido";
import { EnvioService } from "../../../../Services/EnvioService";
import { badContest, godContest } from "../../PopUps/Alerts/ServerBadAlert";
import { useForm } from "../../../../Hooks/useForm";
import { Close } from "../../../Icons/CloseIcon/Close";
import ProductoSearchBar from "../../SearchBar/ProductoSearchBar";
import { CardDetalle } from "../../CardDetallePedido/CardDetalle";
import { Button, FormCheck } from "react-bootstrap";
import { getLocalDateTimeString } from "../../../../Models/FuncionDate";
import { usePedidoStore } from "../../../../store/DetalleStore";

interface Props {
  idEnvio?: number;
  close: Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
}
const mediosPago = [
      { value: "DEBITO", label: "Debito" },
      { value: "TRANSFERENCIA", label: "TRANSFERENCIA" },
      { value: "CREDITO", label: "CREDITO" },
      { value: "QR", label: "QR" },
      { value: "EFECTIVO", label: "EFECTIVO" },
];
interface MediosPago {
  value: string;
  label: string;
}

export const CreateEnvio = ({ close, idEnvio, edit }: Props) => {
  const { setRecargar, recargar } = paginadorStore();
  const [envio, setEnvio] = useState<EnvioDTO>();
  const { detallesPedido,calcularTotal, setDetallesPedido, total } = usePedidoStore();
  const [envioPagadoEntrega, setEnvioPagado] = useState<boolean>(false);

  const fetchEnvio = async () => {
    try {
      const service = new EnvioService();
      if (idEnvio) {
        const response = await service.getEnvioDTOById(idEnvio);
        setEnvio(response.data);
        setDetallesPedido(response.data.detalles);
      }
    } catch (error) {
      badContest("Error al obtener envio con id");
    }
  };


useEffect(() => {
  console.log(detallesPedido);
  calcularTotal();
}, [detallesPedido]);

  useEffect(() => {

    fetchEnvio();
    console.log(mediosPago);
    
    console.log(mediosPagos);
}, []);



useEffect(() => {
  filtrarMedios();
  if (envio) {
    resetForm({
      precioEnvio: envio.precioEnvio,
      descripcionesEspecificas: envio.descripcionesEspecificas,
      calle: envio.calle,
      numero: envio.numero,
      edificio: envio.edificio,
      departamento: envio.departamento,
      provincia: envio.provincia,
      codigoPostal: envio.codigoPostal,
      localidad: envio.localidad,
      cliente: envio.cliente,
      contacto: envio.contacto,
      adelanto: envio.adelanto,
      MedioPago: envio.medioPago.toString(),
      total: envio.totalSinEnvio
    });
    setEnvioPagado(envio.pagadoEnEntrega);
  }
}, [envio]);

  const [mediosPagos, setMediosPagos] = useState<MediosPago[]>(mediosPago);


  const { values, handleChange, resetForm } = useForm({
    precioEnvio: 0,
    descripcionesEspecificas: "",
    departamento: "",
    calle: "",
    numero: 0,
    edificio: "",
    provincia: "",
    localidad: "",
    codigoPostal: "",
    cliente: "",
    contacto: "",
    adelanto: 0,
    MedioPago: "",
    total:0,
  });

      const filtrarMedios = async ()=>{
  
        try {

          if(envio){

            const mediosPagos = mediosPago.filter(
  
              (unidad) => unidad.value !== envio.medioPago.toString()
            )
            setMediosPagos(mediosPagos);
            console.log(mediosPagos)
          }
  
        } catch (error) {
          console.log(error)
          badContest("No se pudo cargar nigun medio de pago")
  
        }
  
      }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const service = new EnvioService();
    if (detallesPedido.length === 0) {
      badContest("No puedes crear un envio sin detalles");
      return;
    }
    try {
      let response;
      if (envio) {
        const envioUpdate: Envio = {
          id: envio.id,
          cliente: values.cliente.toString(),
          medioPago: StringToMedioPago(values.MedioPago),
          detalles: detallesPedido as DetallePedido[],
          ganancia: 0,
          apartado: Number(values.adelanto) > 0 ? true : false,
          adelanto: Number(values.adelanto),
          fechaPedido: envio.fechaPedido,
          contacto: values.contacto.toString(),
          precioEnvio: Number(values.precioEnvio),
          provincia: values.provincia,
          localidad: values.localidad,
          codigoPostal: values.codigoPostal,
          edificio: values.edificio,
          numero: Number(values.numero),
          calle: values.calle,
          departamento: values.departamento,
          descripcionesEspecificas: values.descripcionesEspecificas,
          pagadoEnEntrega: envioPagadoEntrega,
          totalSinEnvio: 0,
          horaFechaEnvio: ""
        };
        console.log(envioUpdate);
        response = await service.editarEnvio(envioUpdate, envioUpdate.id);
      } else {
        const envioNuevo: EnvioCreate = {
          cliente: values.cliente.toString(),
          medioPago: StringToMedioPago(values.MedioPago),
          detalles: detallesPedido as DetallePedido[],
          ganancia: 0,
          apartado: Number(values.adelanto) > 0 ? true : false,
          adelanto: Number(values.adelanto),
          contacto: values.contacto.toString(),
          precioEnvio: Number(values.precioEnvio),
          provincia: values.provincia,
          localidad: values.localidad,
          fechaPedido: getLocalDateTimeString(),
          codigoPostal: values.codigoPostal,
          edificio: values.edificio,
          numero: Number(values.numero),
          calle: values.calle,
          departamento: values.departamento,
          descripcionesEspecificas: values.descripcionesEspecificas,
          pagadoEnEntrega: envioPagadoEntrega,
          totalSinEnvio: 0,
          horaFechaEnvio: ""
        };
        console.log(envioNuevo);
        

        response = await service.crearEnvio(envioNuevo);
      }

      if (response.status === 200) {
        godContest(
          `Se ha ${envio ? "editado" : "creado"} el envio correctamente`
        );
        resetForm();
        setRecargar(!recargar);
        close(false);
        setDetallesPedido([])
      } else if (response.status === 400) {
        badContest("El envio no se pudo crear correctamente");
        setDetallesPedido([])
        close(false);
      } else {
        badContest("El envio no se pudo crear correctamente");
        setDetallesPedido([])
        close(false);
      }
    } catch (error) {
      badContest("El envio no se pudo crear correctamente: " + error);
      setDetallesPedido([])
      close(false);
    }
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.modalUser}>
        <h1 className={styles.titulo}>{envio ? "Editar" : "Crear"} Envio</h1>

        <div onClick={()=>{ setDetallesPedido([])}} className={styles.divClose}>
          <Close close={close} />
        </div>

        <form onSubmit={handleSubmit} className={styles.formularios}>
          <div className={styles.inputsMains}>
            <input
              id="cliente"
              name="cliente"
              type="string"
              placeholder="Nombre Cliente"
              value={values.cliente}
              onChange={handleChange}
            />

            <input
              id="contacto"
              name="contacto"
              placeholder="Ingrese el contacto del cliente"
              type="number"
              value={ Number(values.contacto) <= 0 ? "" : values.contacto}
              onChange={handleChange}
            />

            <input
              id="adelanto"
              name="adelanto"
              type="number"
              placeholder="Adelanto"
              value={Number(values.adelanto) <= 0 ? "" : values.adelanto}
              onChange={handleChange}
            />
          </div>

          <div className={styles.secondInputs}>
            <input
              id="provincia"
              name="provincia"
              type="text"
              placeholder="Provincia"
              value={values.provincia}
              onChange={handleChange}
            />

            <input
              id="localidad"
              name="localidad"
              placeholder="Localidad"
              type="text"
              value={values.localidad}
              onChange={handleChange}
            />

            <input
              id="codigoPostal"
              name="codigoPostal"
              type="number"
              placeholder="Codigo postal"
              value={Number(values.codigoPostal) <= 0 ? "" : values.codigoPostal}
              onChange={handleChange}
            />

            <input
              id="calle"
              name="calle"
              type="text"
              placeholder="Calle"
              value={values.calle}
              onChange={handleChange}
            />

            <input
              id="numero"
              name="numero"
              type="number"
              placeholder="Numero"
              value={Number(values.numero) <= 0 ? "" : values.numero}
              onChange={handleChange}
            />

            <input
              id="edificio"
              name="edificio"
              type="text"
              placeholder="Edificio"
              value={values.edificio}
              onChange={handleChange}
            />
          </div>
          <div className={styles.thirdInputs}>
            <input
              id="departamento"
              name="departamento"
              type="text"
              placeholder="Departamento"
              value={values.departamento}
              onChange={handleChange}
            />

            <div className={styles.checkDiv}>
                <FormCheck label="Envio pagado en entrega" checked={envioPagadoEntrega}  onChange={()=>{setEnvioPagado(!envioPagadoEntrega)}}></FormCheck>
            </div>

            <input
              id="precioEnvio"
              name="precioEnvio"
              type="text"
              placeholder="Precio de envio"
              value={values.precioEnvio}
              onChange={handleChange}
              required
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
              {envio ? <option key={envio.medioPago} value={envio.medioPago}>{envio.medioPago}</option>:<option value="" disabled>Medio Pago</option> }
              { envio ? mediosPagos.map((type) => (
                  <option key={type.value} value={type.value}>
                  {type.label}
                  </option>
              )) : mediosPago.map((type) => (
                <option key={type.value} value={type.value}>
                {type.label}
                </option>
            ))  }
              </select>

          <div className={styles.productoContainer}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyItems: "center",
                width: "60%",
              }}
            >
              {envio && edit ? (
                <ProductoSearchBar
                  isDetalle={true}
                ></ProductoSearchBar>
              ) : (
                <ProductoSearchBar
                isDetalle={true}
                ></ProductoSearchBar>
              )}
            </div>
            <div className={styles.detallePedidoContainer}>
            {envio ? (
              detallesPedido.length > 0 ? (
                detallesPedido.map((d) => (
                  <CardDetalle pedido={envio} key={d.producto.id} detalle={d} />
                ))
              ) : (
                <p>No se ha seleccionado ningún producto</p>
              )
            ) : (
              detallesPedido.length > 0 ? (
                detallesPedido.map((d) => (
                  <CardDetalle key={d.producto.id} detalle={d} />
                ))
              ) : (
                <p>No se ha seleccionado ningún producto</p>
              )
            )}
            </div>
          </div>

          <h5 style={{ textAlign: "right", width: "80%" }}>
            Total sin envio:${total}-${values.adelanto}={" "}
            {total - Number(values.adelanto)}
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
