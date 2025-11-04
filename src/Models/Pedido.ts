import { Producto, ProductoDTO, ProductoDTOFind } from "./ProductoDTO";


export interface PedidoDTO{


    id: number;
    cliente:string;
    total:number;
    pagadoTotalmente: boolean;
    contacto: string;
    adelanto:number;
    fechaPedido: number;
    medioPago: MedioPago;
    detalles: DetallePedidoDTO[];

}

export interface PedidoUpdate{
        id: number;

   cliente:string;

   contacto: string;

    medioPago: MedioPago;

    total:number;

    detalles:DetallePedidoListPedido[];

    ganancia:number;

    pagadoTotalmente: boolean;

    adelanto: number;

    fechaPedido: string;

}

export interface Pedido{

    id: number;

   cliente:string;

   contacto: string;

    medioPago: MedioPago;

    total:number;

    detalles:DetallePedido[];

    ganancia:number;

    pagadoTotalmente: boolean;

    adelanto: number;

    fechaPedido: string;
}


export interface PedidoCreate{

   cliente:string;

   contacto: string;

    medioPago: MedioPago;

    total:number;

    detalles:DetallePedidoListPedido[];

    ganancia:number;

    pagadoTotalmente: boolean;

    adelanto: number;

    fechaPedido: string;
}


export interface DetallePedido{

    id?:number;

    cantidad: number;

    subTotal: number;

    porcentajeAgregado:number;

    porcentajeDescontado : number;

    producto: Producto;

    precioUnitario: number;

    pedido:{
        id: number
    };

    envio: {
        id:number
    };

}

export interface DetallePedidoListPedido{
    id?:number

    cantidad: number;

    subTotal: number;

    porcentajeAgregado:number;

    porcentajeDescontado : number;

    producto: ProductoDTOFind,

    precioUnitario: number;
    
}

export interface DetallePedidoDTO{
    id:number
    cantidad:number;
    precioUnitario:number;
    subTotal:number;
    porcentajeAgregado:number;
    porcentajeDescontado:number;
    producto:ProductoDTO;
}



export enum MedioPago {

    DEBITO, TRANSFERENCIA, CREDITO, QR, EFECTIVO

}

export const StringToMedioPago = (medioString: string): MedioPago => {
    switch (medioString.toUpperCase()) {
        case 'DEBITO':
            return MedioPago.DEBITO;
        case 'TRANSFERENCIA':
            return MedioPago.TRANSFERENCIA;
        case 'CREDITO':
            return MedioPago.CREDITO;
        case 'QR':
            return MedioPago.QR;
        case 'EFECTIVO':
            return MedioPago.EFECTIVO
        default:
            throw new Error(`Medio de pago no válido: ${medioString}`);
    }
};

export interface PaginaPedidoDTO{

    pedidos:PedidoDTO[];
    paginaActual:number;
    totalPaginas:number;
    totalElementos:number;


}