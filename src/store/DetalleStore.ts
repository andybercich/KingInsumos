import { create } from 'zustand';
import { DetallePedidoListPedido } from '../Models/Pedido';

interface PedidoStore {
  detallesPedido: DetallePedidoListPedido[];
  total: number;
  setDetallesPedido: (detalles: DetallePedidoListPedido[]) => void;
  addDetalle: (detalle: DetallePedidoListPedido) => void;
  removeDetalleByProductoId: (productoId: number) => void;
  existeProducto: (productoId: number) => boolean;
  calcularTotal: () => void;
}

export const usePedidoStore = create<PedidoStore>((set, get) => ({
  detallesPedido: [],
  total: 0,
  setDetallesPedido: (detalles) => {
    set({ detallesPedido: detalles});
    get().calcularTotal();
},

addDetalle: (nuevoDetalle) => {
  const { detallesPedido, existeProducto } = get();
  const productoId = nuevoDetalle.producto.id;
  let nuevosDetalles: DetallePedidoListPedido[];

  if (existeProducto(productoId)) {
    nuevosDetalles = detallesPedido.map(d =>
      d.producto.id === productoId
        ? { ...d, ...nuevoDetalle } 
        : d
    );
  } else {
    nuevosDetalles = [...detallesPedido, nuevoDetalle];
  }

  get().calcularTotal();
  set({ detallesPedido: nuevosDetalles });
},


  removeDetalleByProductoId: (productoId) => {
    const nuevosDetalles = get().detallesPedido.filter(
      d => d.producto.id !== productoId
    );
    get().calcularTotal();
    set({ detallesPedido: nuevosDetalles});
  },

  existeProducto: (productoId) => {
    return get().detallesPedido.some(d => d.producto.id === productoId);
  },

calcularTotal: () => {
  const detalles = get().detallesPedido;
  const total = detalles.reduce((sum, d) => {
    const precioUnitario = d.producto.precioVenta;
    const cantidad = d.cantidad;
    const descuento = d.porcentajeDescontado;
    const agregado = d.porcentajeAgregado;

    const base = precioUnitario * cantidad;
    const descuentoCalculado = base * (descuento / 100);
    const agregadoCalculado = base * (agregado / 100);
    const subTotalCalculado = base - descuentoCalculado + agregadoCalculado;

    return sum + subTotalCalculado;
  }, 0);

  set({ total });
}
}));
