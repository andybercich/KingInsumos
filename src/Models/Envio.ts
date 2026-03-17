import { DetallePedido, DetallePedidoDTO, OpcionPago } from "./Pedido";

export interface Envio {

    id: number;
    
    cliente: string;

    totalSinEnvio: number;

    detalles: DetallePedido[];

    fechaPedido: string;

    contacto: string;

    provincia: string;

    localidad: string;

    codigoPostal: string;

    calle: string;

    numero: string;

    edificio: string;

    departamento: string;

    horaFechaEnvio: string;

    ganancia: number;

    descripcionesEspecificas: string;

    precioEnvio: number;

    opcionesPagos: OpcionPago[];

}

export interface EnvioCreate {

    cliente: string;

    detalles: DetallePedido[];

    contacto: string;

    provincia: string;

    localidad: string;

    codigoPostal: string;

    apartado: boolean;

    calle: string;

    numero: string;

    edificio: string;

    departamento: string;

    horaFechaEnvio: string;

    descripcionesEspecificas: string;

    precioEnvio: number;

    opcionesPagos: OpcionPago[];

}

export interface EnvioDTO {

    id: number;
    
    cliente: string;

    totalSinEnvio: number;

    detalles: DetallePedidoDTO[];

    fechaPedido: string;

    contacto: string;

    provincia: string;

    localidad: string;

    codigoPostal: string;

    apartado: boolean;

    calle: string;

    numero: string;

    edificio: string;

    departamento: string;

    horaFechaEnvio: string;

    ganancia: number;

    descripcionesEspecificas: string;

    precioEnvio: number;

    opcionesPagos: OpcionPago[];

}

export interface PaginaEnvioDTO {

    envios: EnvioDTO[];

    paginaActual: number;

    totalPaginas: number;

    totalElementos: number;

}