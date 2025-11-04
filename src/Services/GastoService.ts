import axios, { AxiosResponse } from "axios";
import { GastoCreate, GastoPagina, GastoUpdate } from "../Models/Gasto";



const gastoService = import.meta.env.VITE_GASTO_SERVICE;

export class GastoService {
    private baseURL: string;

    constructor() {
        this.baseURL = gastoService;
    }




    public async getGasto(id:number): Promise<AxiosResponse<GastoUpdate>> {
        const url = `${this.baseURL}/${id}`;
        return axios.get(url);
    }

    public async deleteGasto(id:number): Promise<AxiosResponse<Response>> {
        const url = `${this.baseURL}/${id}`;
        return axios.delete(url);
    }
    public async crearGasto(gasto:GastoCreate): Promise<AxiosResponse<GastoUpdate>> {
        const url = `${this.baseURL}`;
        return axios.post(url,gasto,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    public async editarGasto(gasto:GastoUpdate, id:number): Promise<AxiosResponse<GastoUpdate>> {
        const url = `${this.baseURL}/${id}`;
        return axios.put(url,gasto,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    //localhost:8080/kinginsumos/pedido/findByRangoFechas?desde=2025-04-01T00:00:00&hasta=2025-04-16T23:59:59&page=0&size=10
    public async getPageByDates(desde:string, hasta:string, size:number,page:number): Promise<AxiosResponse<GastoPagina>> {
        
        const url = `${this.baseURL}/findByRangoFechas?desde=${desde}&hasta=${hasta}&page=${page}&size=${size}`
        console.log(url);
        return axios.get(url);

    }



}
