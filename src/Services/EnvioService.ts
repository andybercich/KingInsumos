import axios, { AxiosResponse } from "axios";
import { Envio, EnvioCreate, EnvioDTO, PaginaEnvioDTO } from "../Models/Envio";



const envioService = import.meta.env.VITE_ENVIO_SERVICE;

export class EnvioService {
    private baseURL: string;

    constructor() {
        this.baseURL = envioService;
    }


    public async getEnvioDTOById(id:number): Promise<AxiosResponse<EnvioDTO>> {
        const url = `${this.baseURL}/dto/${id}`;
        return axios.get(url);
    }

    public async getEnvioFind(paramNombreContacto:string): Promise<AxiosResponse<EnvioDTO[]>> {
        const url = `${this.baseURL}/buscar?param=${paramNombreContacto}`;
        return axios.get(url);
    }

    public async crearEnvio(envio:EnvioCreate): Promise<AxiosResponse<EnvioDTO>> {
        const url = `${this.baseURL}/create`;
        return axios.post(url,envio,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    public async editarEnvio(envio:Envio, id:number): Promise<AxiosResponse<EnvioDTO>> {
        const url = `${this.baseURL}/update/${id}`;
        return axios.put(url,envio,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    public async eliminarSinAfectarStock(id:number): Promise<AxiosResponse<void>> {
        const url = `${this.baseURL}/${id}/noStock`;
        return axios.delete(url);
    }

    public async deleteEnvioAfectandoStockById(id: number): Promise<AxiosResponse<void>> {
        const url = `${this.baseURL}/${id}`;
        return axios.delete(url);
    }


    //GET localhost:8080/kinginsumos/envio/findByRangoFechas?desde=2025-04-01T00:00:00&hasta=2025-04-16T23:59:59&page=0&size=10
    public async getPageByDates(desde:string, hasta:string, size:number,page:number): Promise<AxiosResponse<PaginaEnvioDTO>> {
        
        const url = `${this.baseURL}/findByRangoFechas?desde=${desde}&hasta=${hasta}&page=${page}&size=${size}`
        return axios.get(url);

    }



}
