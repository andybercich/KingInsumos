export interface ProductoDTO{

    
    id : number;

    codigo:number;

    nombre:string;

    categoria:Categoria;

    unidad: Unidad;

    medida: number;

    precioVenta:number;

    stock:number;

    stockMin: number;

    imagen:string;
    descripcion: string;


}

export interface Categoria{

    id:number,
    denominacion:string


}

export interface CategoriaCreate{
    denominacion:string
}


export enum Unidad{
    KG = "KG",
    MG = "MG",
    ML = "ML",
    L  = "L",
    CANTIDAD = "CANTIDAD",
    GR = "GR",
    OZ = "OZ",
}

export function stringToUnidad(value:string) {
    if(value == Unidad.KG.toString()){
        return Unidad.KG
    }else if(value == Unidad.MG.toString()){
        return Unidad.MG
    }else if(value == Unidad.GR.toString()){
        return Unidad.GR
    }else if(value == Unidad.L.toString()){
        return Unidad.L
    }else if(value == Unidad.CANTIDAD.toString()){
        return Unidad.CANTIDAD
    }else if(value == Unidad.ML.toString()){
        return Unidad.ML
    }else if(value == Unidad.OZ.toString()){
        return Unidad.OZ
    }else{
        throw new Error("No se encontró esta unidad");
        
    }
    
}


export function unidadToString(value:Unidad) {
    if(value == Unidad.KG.toString()){
        return "Kilogramos"
    }else if(value == Unidad.MG.toString()){
        return "Miligramos"
    }else if(value == Unidad.GR.toString()){
        return "Gramos"
    }else if(value == Unidad.L.toString()){
        return "Litro"
    }else if(value == Unidad.CANTIDAD.toString()){
        return "Unidades"
    }else if(value == Unidad.ML.toString()){
        return "Mililitro"
    }else if(value == Unidad.OZ.toString()){
        return "Onza"
    }else{
        throw new Error("No se encontró esta unidad");
        
    }
    
}

export interface Producto{
    
    id : number;

    codigo:string;

    nombre:string;

    categoria:CategoriaProducto;

    unidad: Unidad;

    medida: number;

    precioVenta:number;

    precioCompra: number;

    stock:number;

    stockMin: number;

    descripcion:string;

    imagen:string;
}

export interface ProductoDTOFind{

    id:number;
    codigo:number;
    nombre:string;
    precioVenta:number;
    imagen:string;
    stock:number;
    unidad:Unidad;
    medida:number;


}

export interface PaginaProductoDTO{
    paginaActual:number;
    totalPaginas:number;
    totalElementos:number;
    productos:ProductoDTO[];
}

export interface ProductoCreate{
    codigo:string;

    nombre:string;

    categoria:CategoriaProducto;

    unidad: Unidad;

    medida: number;

    precioVenta:number;

    precioCompra: number;

    stock:number;

    stockMin: number;

    descripcion:string;

    imagen:string;
}

export interface CategoriaProducto{
    id:number
    denominacion?: string
}