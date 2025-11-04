export interface GastoCreate{

    motivo:string,
    descripcion:string,
    gasto: number,
    fechaCreacion: string
}

export interface GastoUpdate{
    id:number
    motivo:string,
    descripcion:string,
    gasto: number,
    fechaCreacion: string
}

export interface GastoPagina{
    gastos: GastoUpdate[],
    paginaActual: number,
    totalPaginas:number,
    totalElementos: number
}