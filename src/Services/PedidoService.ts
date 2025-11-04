import axios, { AxiosResponse } from "axios";
import { PaginaPedidoDTO, PedidoCreate, PedidoDTO, PedidoUpdate } from "../Models/Pedido";



const pedidoService = import.meta.env.VITE_PEDIDO_SERVICE;

export class PedidoService {
    private baseURL: string;

    constructor() {
        this.baseURL = pedidoService;
    }




    public async getPedidoDTOById(id:number): Promise<AxiosResponse<PedidoDTO>> {
        const url = `${this.baseURL}/dto/${id}`;
        return axios.get(url);
    }

    public async getPedidoFind(paramNombreContacto:string): Promise<AxiosResponse<PedidoDTO[]>> {
        const url = `${this.baseURL}/buscar?param=${paramNombreContacto}`;
        return axios.get(url);
    }

    public async crearPedido(pedido:PedidoCreate): Promise<AxiosResponse<PedidoDTO>> {
        const url = `${this.baseURL}/create`;
        return axios.post(url,pedido,{
            headers: {
                "Content-Type": "application/json",
            },
        } );
    }

    public async editarPedido(pedido:PedidoUpdate, id:number): Promise<AxiosResponse<PedidoDTO>> {
        const url = `${this.baseURL}/update/${id}`;
        return axios.put(url,pedido,{
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


    //localhost:8080/kinginsumos/pedido/findByRangoFechas?desde=2025-04-01T00:00:00&hasta=2025-04-16T23:59:59&page=0&size=10
    public async getPageByDates(desde:string, hasta:string, size:number,page:number): Promise<AxiosResponse<PaginaPedidoDTO>> {
        
        const url = `${this.baseURL}/findByRangoFechas?desde=${desde}&hasta=${hasta}&page=${page}&size=${size}`
        console.log(url);
        return axios.get(url);

    }



}
