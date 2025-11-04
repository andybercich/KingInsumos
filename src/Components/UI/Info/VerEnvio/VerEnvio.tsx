import { Dispatch, useEffect, useState } from "react";
import { EnvioDTO } from "../../../../Models/Envio";
import style from "./VerEnvio.module.css"
import { Close } from "../../../Icons/CloseIcon/Close";
import { EnvioService } from "../../../../Services/EnvioService";

interface IVer {
    envioId: number;
    close: Dispatch<React.SetStateAction<boolean>>;
  }
  export const VerEnvio = ({ envioId, close }: IVer) => {

    const [envio,setEnvio]= useState<EnvioDTO>();

    const fetchEnvio = async()=>{
      const service = new EnvioService();
      try {
        const response = await service.getEnvioDTOById(envioId);
        setEnvio(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      fetchEnvio();
    }, []);

    return (
      <div className={style.mainDiv}>
        <div className={style.modalUser}>
          <div className={style.divClose}>
            <Close close={close}></Close>
          </div>
          <div className={style.info}>
            <h3><b>Cliente: </b>{envio?.cliente}</h3>
  
            {envio?.contacto ? <h3><b>Contacto:</b>{envio.contacto}</h3> : null}
            <h3><b>Fecha:</b> {envio?.fechaPedido}</h3>
          </div>
            <div className={style.datos}>
                <p><b>Provincia:</b> {envio?.provincia}</p>
                <p><b>Localidad:</b> {envio?.localidad}</p>
                <p><b>Calle:</b> {envio?.calle}</p>
                <p><b>Numero:</b> {envio?.numero}</p>
                <p><b>Edificio:</b> {envio?.edificio}</p>
                <p><b>Departamento:</b> {envio?.departamento}</p>
                <p><b>Pagado en entrega:</b> {envio?.pagadoEnEntrega}</p>
                <p><b>Precio envio:</b> {envio?.precioEnvio}</p>
                <p><b>Codigo Postal:</b> {envio?.codigoPostal}</p>

          </div>
              {envio &&envio.detalles.length > 0 ? (
                envio?.detalles.map((d) => (
                  <div key={d.id} className={style.card}>
                    <div className={style.titulos}>
                      <h3>{d.producto.nombre}</h3>
                      <h3>Cantd:{d.cantidad}</h3>
                      <h3>{d.producto.medida}{d.producto.unidad}</h3>
                    {d.porcentajeDescontado > 0 ? <h3>Desc:{d.porcentajeDescontado}%</h3> : null}
                    {d.porcentajeAgregado > 0 ? <h3>Agre:{d.porcentajeAgregado}%</h3> : null}
                      <h3>${d.precioUnitario}c/u</h3>
                      <h3>SubTotal:${d.subTotal}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay detalles</p>
              )}
  
          <div className={style.total}>
            <p>
              Total: $
              {envio && envio.adelanto > 0
                ? `${envio.totalSinEnvio} - ${envio.adelanto}(seña) = ${
                    envio.totalSinEnvio - envio.adelanto
                  }`
                : envio?.totalSinEnvio}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
