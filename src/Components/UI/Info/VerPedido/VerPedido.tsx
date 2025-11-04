import { Dispatch } from "react";
import { PedidoDTO } from "../../../../Models/Pedido";
import style from "./VerPedido.module.css";
import { Close } from "../../../Icons/CloseIcon/Close";

interface IVer {
  pedido: PedidoDTO;
  close: Dispatch<React.SetStateAction<boolean>>;
}
export const VerPedido = ({ pedido, close }: IVer) => {
  return (
    <div className={style.mainDiv}>
      <div className={style.modalUser}>
        <div className={style.divClose}>
          <Close close={close}></Close>
        </div>
        <div className={style.info}>
            <h3><b>Cliente: </b>{pedido.cliente}</h3>

          {pedido.contacto ? <h3><b>Contacto:</b>{pedido.contacto}</h3> : null}
          <h3><b>Fecha:</b> {pedido.fechaPedido}</h3>
        </div>
        <div className={style.detalles}>
          <div className={style.detalles}>
            {pedido.detalles.length > 0 ? (
              pedido.detalles.map((d) => (
                <div key={d.id} className={style.card}>
                  <div className={style.titulos}>
                    <h3>{d.producto.nombre}</h3>
                    <h3>Cantd:{d.cantidad}</h3>
                    <h3>{d.producto.medida}{d.producto.unidad}</h3>
                    <h3>${d.precioUnitario}c/u</h3>
                    {d.porcentajeDescontado > 0 ? <h3>Desc:{d.porcentajeDescontado}%</h3> : null}
                    {d.porcentajeAgregado > 0 ? <h3>Agre:{d.porcentajeAgregado}%</h3> : null}
                    <h3>SubTotal:${d.subTotal}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay detalles</p>
            )}
          </div>
        </div>

        {}
        <div className={style.total}>
          <p>{pedido.pagadoTotalmente ? "Pagado" : "Señado"}</p>
          <p>
            Total: $
            {pedido.adelanto > 0
              ? `${pedido.total} - ${pedido.adelanto}(seña) = ${
                  pedido.total - pedido.adelanto
                }`
              : pedido.total}
          </p>
        </div>
      </div>
    </div>
  );
};
