import axios, { AxiosResponse } from "axios";
import { Categoria, CategoriaCreate } from "../Models/ProductoDTO";


const categoriaService = import.meta.env.VITE_CATEGORIA_SERVICE;

export class CategoriaService {
    private baseURL: string;

    constructor() {
        this.baseURL = categoriaService;
    }


    public async getCategoriaById(id:number): Promise<AxiosResponse<Categoria>> {
        const url = `${this.baseURL}/${id}`;
        return axios.get(url);
    }

    public async getAllCategoria(): Promise<AxiosResponse<Categoria[]>> {
        const url = `${this.baseURL}`;
        return axios.get(url);
    }

    public async crearCategoria(categoria:CategoriaCreate): Promise<AxiosResponse<Categoria>> {
        const url = `${this.baseURL}`;
        return axios.post(url,categoria,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    public async editarCategoria(categoria:Categoria, id:number): Promise<AxiosResponse<Categoria>> {
        const url = `${this.baseURL}/${id}`;
        return axios.put(url,categoria,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    public async eliminarCategoria(id:number): Promise<AxiosResponse<void>> {
        const url = `${this.baseURL}/${id}`;
        return axios.delete(url);
    }


}
