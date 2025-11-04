import { useEffect, useState } from "react";
import style from "./Pedido.module.css"
import { paginadorStore } from "../../../store/PaginaStore";
import { Form, FormCheck } from "react-bootstrap";
import SearchCliente from "../../UI/SearchCliente/SearchCliente";
import { CreatePedido } from "../../UI/Modals/CreatePedido/CreatePedido";
import { EnvioService } from "../../../Services/EnvioService";
import { PaginaEnvioDTO } from "../../../Models/Envio";
import { PaginaPedidoDTO } from "../../../Models/Pedido";
import { PedidoService } from "../../../Services/PedidoService";
import { GenericTable } from "../../UI/TablaGenerica/TablaGenerica";
import { CardPedido } from "../../UI/CardPedido/CardPedido";
import { CardEnvio } from "../../UI/CardEnvio/CardEnvio";
import { CreateEnvio } from "../../UI/Modals/CreateEnvio/CreateEnvio";
import { formatDateLocal } from "../../../Models/FuncionDate";

export const Pedidos = () => {

    const [option, setOption] = useState<string>("Pedidos");
    const{setNumeroPagina, numeroPagina, recargar} = paginadorStore();
    const[createEnvio, setCreateEnvio] = useState<boolean>(false);
    const[createPedido, setCreatePedido] = useState<boolean>(false);
    const [paginaEnvio, setPaginaEnvio] = useState<PaginaEnvioDTO>();
    const [paginaPedido, setPaginaPedido] = useState<PaginaPedidoDTO>();
    const[hoy, setHoy]= useState<boolean>(true);
    const[desde, setDesde]= useState<string>("")
    const [hasta, setHasta]=useState<string>("");

    useEffect(() => {
      console.log(option);
    }, [option]);

    function getTodayRangeFormatted() {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0 , 0 , 0);
      const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
 
      return {
        
        desdeHoy: formatDateLocal(from),
        hastaHoy: formatDateLocal(to)
      };
    }

    const onChangeDate = (field: "desde" | "hasta", value: string) => {
      if (field === "desde") {
        setDesde(value);
        if (hasta && new Date(value) > new Date(hasta)) {
          setHasta(value);
        }
      } else if (field === "hasta") {
        setHasta(value);
        // Si el nuevo hasta es menor que desde, actualizar desde también
        if (desde && new Date(value) < new Date(desde)) {
          setDesde(value);
        }
      }
    };
    

  const fetchPaginaProducto = async (page:number) =>{
    try {
      const { desdeHoy, hastaHoy } = getTodayRangeFormatted();
      console.log(desdeHoy,hastaHoy);
      if (option === "Envios") {
        const service = new EnvioService();
        if(hoy){
          const response = await service.getPageByDates(desdeHoy, hastaHoy, 5,page );
          setPaginaEnvio(response.data);
          console.log(hoy);
        }else{
          const response = await service.getPageByDates(desde,hasta,5, page)
          setPaginaEnvio(response.data);
        }
      } else if (option === "Pedidos"){
        const service = new PedidoService();
        if(hoy){
          const response = await service.getPageByDates(desdeHoy, hastaHoy, 5,page );
          setPaginaPedido(response.data);
        }else{
          const response = await service.getPageByDates(desde,hasta,5, page)
          setPaginaPedido(response.data);
        }
      }

    } catch (error) {
      console.log(error);
  }
};

useEffect(() => {
  fetchPaginaProducto(numeroPagina);
}, [hoy, recargar, desde, hasta, option]);

  return (
    <div className={style.main}>

      <div className={style.subHeader}>
      <select
          id="option"
          name="option"
          required
          className={style.select}
          onChange={(e) => {
            const valor = e.target.value;
            if (valor === "") {
              setOption("");
            } else {
              if (valor !== option) setOption(valor);
            }
            setNumeroPagina(0);
          }}
        >
          <option value="Pedidos">
            Pedidos
          </option>
          <option value="Envios">
            Envios
          </option>

          
        </select>

        <div className={style.containerSearch}>
          <SearchCliente envio={option === "" ? false : option == "Envios" ? true : false}></SearchCliente>
        </div>
        {hoy ? (
  <>
    <Form.Control placeholder="desde" type="datetime-local" style={{width:"10rem"}}  disabled />
    <Form.Control placeholder="hasta" type="datetime-local" style={{width:"10rem"}} disabled />
  </>
) : (
  <>
<Form.Control
  type="datetime-local"
  style={{ width: "10rem" }}
  value={desde}
  onChange={(e) => onChangeDate("desde", e.target.value)}
/>
<Form.Control
  type="datetime-local"
  style={{ width: "10rem" }}
  value={hasta}
  onChange={(e) => onChangeDate("hasta", e.target.value)}
/>

  </>
)}


        <FormCheck  checked={hoy} onChange={()=>{setHoy(!hoy)}} label="Hoy"></FormCheck>

        <div className={style.buttonAgregarProduct}>
          <button className={style.agregarProduct} 
          
          onClick={()=>{
            if(option === "Envios")
              {setCreateEnvio(true)}
              else if(option === "Pedidos")
              {setCreatePedido(true)}}}>Agregar {option === "Envios" ? "Envio" : "Pedido"}</button>
        </div>
        
      </div>
      <div className={style.table}>
        {option === "Pedidos" && paginaPedido ? 
        <GenericTable
        items={paginaPedido.pedidos}
        paginaActual={paginaPedido.paginaActual}
        totalPaginas={paginaPedido.totalPaginas}
        renderItem={(pedido) => (
          <CardPedido pedido={pedido}></CardPedido>
        )}
      />
      
        : option === "Envios" && paginaEnvio ? 
        <GenericTable
        items={paginaEnvio.envios}
        paginaActual={paginaEnvio.paginaActual}
        totalPaginas={paginaEnvio.totalPaginas}
        renderItem={(envios) => (
          <CardEnvio envio={envios}></CardEnvio>
        )}
      />: null
      } 
        </div>
    {createPedido ? <CreatePedido edit={false} close={setCreatePedido}></CreatePedido> : null}
    {createEnvio ? <CreateEnvio edit={false} close={setCreateEnvio}></CreateEnvio> : null}
    </div>
  )
  }

