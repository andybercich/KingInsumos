import axios, { AxiosResponse } from "axios";
import { PaginaProductoDTO, Producto, ProductoCreate, ProductoDTOFind } from "../Models/ProductoDTO";



const productoService = import.meta.env.VITE_PRODUCTO_SERVICE;

export class ProductoService {
    private baseURL: string;

    constructor() {
        this.baseURL = productoService;
        console.log("Producto service: "+ productoService)
    }


    public async getProductoById(id:number): Promise<AxiosResponse<Producto>> {
        const url = `${this.baseURL}/${id}`;
        return axios.get(url);
    }

    public async getByNombreCodigo(nombreCodigo:string): Promise<AxiosResponse<ProductoDTOFind[]>> {
        const url = `${this.baseURL}/find/${nombreCodigo}`;
        return axios.get(url);
    }

    public async getPaginaProductoByCategoria(categoria:string, sizePage: number, page:number): Promise<AxiosResponse<PaginaProductoDTO>> {
        const url = `${this.baseURL}/findByPageCategory/${categoria}?page=${page}&size=${sizePage}`;
        return axios.get(url);
    }

    public async getBalanceProducto(): Promise<AxiosResponse<Blob>> {
        
        const url = `${this.baseURL}/export/excel`
        return axios.get(url, {
            responseType: 'blob',
          });

    }

    // findByPageAll?page=1&size=10
    public async findAllByPage(page: number, size:number): Promise<AxiosResponse<PaginaProductoDTO>> {
        const url = `${this.baseURL}/findByPageAll?page=${page}&size=${size}`;
        return axios.get(url);
    }

    public async createProducto(producto: ProductoCreate): Promise<AxiosResponse<Producto>> {
        const url = `${this.baseURL}`;
        return axios.post(url, producto, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }


    public async updateProducto(id: number, producto: Producto): Promise<AxiosResponse<Producto>> {
        const url = `${this.baseURL}/${id}`;
        return axios.put(url, producto, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public async deleteProductoById(id: number): Promise<AxiosResponse<void>> {
        const url = `${this.baseURL}/${id}`;
        return axios.delete(url);
    }
}
