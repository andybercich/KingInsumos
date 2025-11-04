import {  useEffect, useState } from 'react';
import {  DetallePedidoListPedido, PedidoDTO } from '../../../Models/Pedido'
import style from './CardDetalle.module.css'
import { usePedidoStore } from '../../../store/DetalleStore';
import { EnvioDTO } from '../../../Models/Envio';
import { badContest } from '../PopUps/Alerts/ServerBadAlert';
interface Props{
  detalle: DetallePedidoListPedido
  pedido?: PedidoDTO| EnvioDTO
}
export const CardDetalle = ({detalle,pedido}: Props) => {
  const { addDetalle, removeDetalleByProductoId } = usePedidoStore();
  const [cantidadDetallOriginal, setCantidad] = useState<number>(0);

  useEffect(() => {
    if (pedido) {
      const detalleExistente = pedido.detalles.find(d => d.producto.id === detalle.producto.id);
      if (detalleExistente) {
        setCantidad(detalleExistente.cantidad);
      }
    }
  }, []);

  const [values, setValues] = useState({
    cantidad: detalle.cantidad || 0,
    descuento: detalle.porcentajeDescontado || 0,
    agregado: detalle.porcentajeAgregado || 0
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numericValue = Number(value);

    if (name === "cantidad" && numericValue > detalle.producto.stock && detalle.id == null) {
      badContest("No puede agregar más cantidad porque no queda stock de este producto");
      return;
    }else if(name === "cantidad" && numericValue > cantidadDetallOriginal+detalle.producto.stock && detalle.id != null){
      badContest("No puede agregar más cantidad porque no queda stock de este producto");
      return;
    }

setValues((prev) => {
  const newValues = { ...prev, [name]: numericValue };

  const updatedDetalle: DetallePedidoListPedido = {
    cantidad: newValues.cantidad,
    porcentajeDescontado: newValues.descuento,
    porcentajeAgregado: newValues.agregado,
    subTotal: 0,
    precioUnitario: detalle.producto.precioVenta,
    producto: detalle.producto
  };

  addDetalle(updatedDetalle);
  return newValues;
});
  };
  

  const calcularSubtotal = () => {
    const precioUnitario = detalle.producto.precioVenta;
    const cantidad = values.cantidad;
    const descuento = values.descuento;
    const agregado = values.agregado;
  
    const base = precioUnitario * cantidad;
    const descuentoCalculado = base * (descuento / 100);
    const agregadoCalculado = base * (agregado / 100);
    return base - descuentoCalculado + agregadoCalculado;
  };

  return (
    <div className={style.mainDiv}>
      <p>{detalle.producto.nombre}</p>
      <p>Stock: {detalle.producto.stock+cantidadDetallOriginal}</p>
      <p>Precio:${detalle.producto.precioVenta}</p>

      <input id="cantidad" name="cantidad" onChange={handleChange} value={values.cantidad > 0 ? values.cantidad : ""} type="number" required placeholder="Cantidad" />
      <input id="descuento"  name="descuento" onChange={handleChange} value={values.descuento > 0 ? values.descuento : ""} type="number" placeholder="Descuento (%)" />
      <input id="agregado" name="agregado" onChange={handleChange} value={values.agregado > 0 ? values.agregado : ""} type="number" placeholder="Agregado (%)" />

      <p>Subtotal:${calcularSubtotal()}</p>

    <div className={style.closeButton}>
<span onClick={() => {
  removeDetalleByProductoId(detalle.producto.id);
}} className={`material-symbols-outlined ${style.icono}`}>
  close
</span>
    </div>


    </div>
  );
}


