import { Producto, ProductoDTO, ProductoDTOFind } from "./ProductoDTO";

export interface OpcionPago {

    id?: number;

    medioPago: MedioPago;

    monto: number;

    fechaPago: string;
    info?: string;

    agregadoTotal: number;

    agregadoMedio: number;

}

export interface PedidoDTO{

    id: number;

    cliente: string;

    total: number;

    fechaPedido: string;

    contacto: string;

    detalles: DetallePedidoDTO[];

    opcionesPagos: OpcionPago[];

}

export interface PedidoUpdate{

    id: number;

    cliente: string;

    contacto: string;

    total: number;

    detalles: DetallePedidoListPedido[];

    ganancia: number;

    fechaPedido: string;

    opcionesPagos: OpcionPago[];

}

export interface Pedido{

    id: number;

    cliente: string;

    contacto: string;

    total: number;

    detalles: DetallePedido[];

    ganancia: number;

    fechaPedido: string;

    opcionesPagos: OpcionPago[];

}

export interface PedidoCreate{

    cliente: string;

    contacto: string;

    detalles: DetallePedidoListPedido[];

    opcionesPagos: OpcionPago[];

}

export interface DetallePedido{

    id?: number;

    cantidad: number;

    subTotal: number;

    porcentajeAgregado: number;

    porcentajeDescontado: number;

    producto: Producto;

    precioUnitario: number;

    pedido:{
        id: number
    };

    envio:{
        id:number
    };

}

export interface DetallePedidoListPedido{

    id?: number;

    cantidad: number;

    subTotal: number;

    porcentajeAgregado: number;

    porcentajeDescontado: number;

    producto: ProductoDTOFind;

    precioUnitario: number;

}

export interface DetallePedidoDTO{

    id: number;

    cantidad: number;

    precioUnitario: number;

    subTotal: number;

    porcentajeAgregado: number;

    porcentajeDescontado: number;

    producto: ProductoDTO;

}

export enum MedioPago {

    DebitoPostnetMp,
    CreditoPostnetMp,
    QR,
    LinkMercadoPago,
    Efectivo,
    Transferencia,
    GoCuotas,
    None

}

export const StringToMedioPago = (medioString: string): string => {
    switch (medioString.toUpperCase()) {
        case 'DEBITOPOSTNETMP':
            return "DebitoPostnetMp";
        case 'CREDITOPOSTNETMP':
            return "CreditoPostnetMp";
        case 'QR':
            return "QR";
        case 'LINKMERCADOPAGO':
            return "LinkMercadoPago";
        case 'EFECTIVO':
            return "Efectivo";
        case 'TRANSFERENCIA':
            return "Transferencia";
        case 'GOCUOTAS':
            return "GoCuotas";
        default:
            throw new Error(`Medio de pago no válido: ${medioString}`);
    }
};

export interface PaginaPedidoDTO{

    pedidos: PedidoDTO[];

    paginaActual: number;

    totalPaginas: number;

    totalElementos: number;

}