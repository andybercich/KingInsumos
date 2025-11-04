import { DetallePedido, DetallePedidoDTO, MedioPago } from "./Pedido";

export interface Envio{

    id:number;
    
    cliente:string;

    medioPago:MedioPago;

    totalSinEnvio:number;

    detalles:DetallePedido[];

    fechaPedido:string;

    contacto:string;

    provincia:string;

    localidad:string;

    codigoPostal:string;

    apartado:boolean;

    adelanto:number;

    calle:string;

    numero:number;

    edificio:string;

    departamento:string;

    pagadoEnEntrega: boolean;

    horaFechaEnvio:string;

    ganancia: number;

    descripcionesEspecificas:string;

    precioEnvio: number;
}


export interface EnvioCreate{

    cliente:string;

    medioPago:MedioPago;

    totalSinEnvio:number;

    detalles:DetallePedido[];

    fechaPedido:string;

    contacto:string;

    provincia:string;

    localidad:string;

    codigoPostal:string;

    apartado:boolean;

    adelanto:number;

    calle:string;

    numero:number;

    edificio:string;

    departamento:string;

    pagadoEnEntrega: boolean;

    horaFechaEnvio:string;

    ganancia: number;

    descripcionesEspecificas:string;

    precioEnvio: number;
}

export interface EnvioDTO{

    
    id:number;
    
    cliente:string;

    medioPago:MedioPago;

    totalSinEnvio:number;

    detalles:DetallePedidoDTO[];

    fechaPedido:string;

    contacto:string;

    provincia:string;

    localidad:string;

    codigoPostal:string;

    apartado:boolean;

    adelanto:number;

    calle:string;

    numero:number;

    edificio:string;

    departamento:string;

    pagadoEnEntrega: boolean;

    horaFechaEnvio:string;

    ganancia: number;

    descripcionesEspecificas:string;

    precioEnvio: number;

}

export interface PaginaEnvioDTO{
    envios: EnvioDTO[];
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
}