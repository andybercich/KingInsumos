import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import style from "./SearchCliente.module.css"
import { EnvioDTO } from '../../../Models/Envio';
import { PedidoDTO } from '../../../Models/Pedido';
import { EnvioService } from '../../../Services/EnvioService';
import { PedidoService } from '../../../Services/PedidoService';
import { CreatePedido } from '../Modals/CreatePedido/CreatePedido';
import { CreateEnvio } from '../Modals/CreateEnvio/CreateEnvio';

interface IProps{
  envio:boolean
}

const SearchCliente = ({envio}:IProps) => {
  const [query, setQuery] = useState('');
  const [envios, setEnvios] = useState<EnvioDTO[]>([]);
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [id,setId]= useState<number>(0);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        fetchPedidosEnvios(query);
      } else {
        setEnvios([]);
        setPedidos([]);
        setShowDropdown(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchPedidosEnvios = async (nombreContacto: string) => {
    try {
      if(envio){
        const service = new EnvioService();
        const response = await service.getEnvioFind(nombreContacto); 
        setEnvios(response.data);
        setPedidos([])
        setShowDropdown(true);
      }else{
        const service = new PedidoService();
        const response = await service.getPedidoFind(nombreContacto); 
        setPedidos(response.data);
        setShowDropdown(true);
        setEnvios([])
      }

    } catch (error) {
      console.error(`Error al buscar ${envio ? "envios" : "pedidos"}:`, error);
      setEnvios([]);
      setPedidos([])
      setShowDropdown(false);
    }
  };

  const handleSelect = (producto: PedidoDTO | EnvioDTO) => {
    setQuery(producto.cliente);
    setShowDropdown(false);
    setId(producto.id)
    setEdit(true);
  };

  return (
    <div  style={{ position: 'relative', maxWidth: '400px' }}>
      <input
        className={style.mainDiv}
        type="text"
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        onFocus={() => query && setShowDropdown(true)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Buscar ${envio ? "envio": "pedido"} por contacto/cliente`}

      />
      {showDropdown && (pedidos.length > 0 || envio && envios.length>0)  && (
        <ul
          style={{
            listStyle: 'none',
            padding: '4px',
            position: 'absolute',
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {envio === false ?
                  (pedidos.map((prod) => (
                    <li
                      key={prod.id}
                      onClick={() => handleSelect(prod)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '2px solid #eee',
                      }}
                    >
                      <strong>Cliente: </strong>{prod.cliente}- <strong>Fecha: </strong>{prod.fechaPedido} -<strong>Contacto: </strong>{prod.contacto} - <strong>Total: </strong>{prod.total} - <strong>Medio pago:</strong> {prod.medioPago}  - <strong>Adelanto:</strong>  {prod.adelanto} {prod.adelanto > 0  ? `- Total menos adelanto: ${prod.total-prod.adelanto}` : null}
        
                      {prod.detalles.length > 0 ? prod.detalles.map((ped) => (
        
                        <>
                          <p><strong> Producto Nombre:</strong>{ped.producto.nombre} - <strong>Cantidad: </strong>{ped.cantidad} - <strong>Subtotal: </strong>{ped.subTotal}</p>
                          {ped.producto.imagen != "" && ped.producto.imagen ?
                          <div className={style.divImage}>
                          <div
                          style={{
                            backgroundImage: `url(${ped.producto.imagen})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100px',
                            height: '100px',
                          }}
                          ></div>
                          </div>
                          : null }
                        </>
        
        
        
        
                      )) : null}
                    </li>
                  ))):
                  (envios.map((prod) => (
                    <li
                      key={prod.id}
                      onClick={() => handleSelect(prod)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '2px solid #eee',
                      }}
                    >
                      <strong>Cliente: </strong>{prod.cliente} - <strong>Fecha: </strong>{prod.fechaPedido} -<strong>Contacto: </strong>{prod.contacto} -<strong>Total sin envio: </strong>{prod.totalSinEnvio} - <strong>Medio pago:</strong> {prod.medioPago}  - <strong>Adelanto:</strong>  {prod.adelanto} {prod.adelanto > 0  ? `- Total menos adelanto: ${prod.totalSinEnvio-prod.adelanto}` : null}
        
                      {prod.detalles.length > 0 ? prod.detalles.map((ped) => (
        
                        <>
                          <p><strong> Producto Nombre:</strong>{ped.producto.nombre} - <strong>Cantidad: </strong>{ped.cantidad} - <strong>Subtotal: </strong>{ped.subTotal}</p>
                          {ped.producto.imagen != "" && ped.producto.imagen ?
                          <div className={style.divImage}>
                          <div
                          style={{
                            backgroundImage: `url(${ped.producto.imagen})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100px',
                            height: '100px',
                          }}
                          ></div>
                          </div>
                          : null }
                        </>
        
        
        
        
                      )) : null}
                    </li>
                  )))
        }



        </ul>
      )}
        {edit && envio === false  ? 
        ReactDOM.createPortal(
        <CreatePedido close={setEdit} idPedido={id} edit={true}/> , 
              document.body
        ) :
      
        edit && envio ?          ReactDOM.createPortal(
          <CreateEnvio close={setEdit} idEnvio={id} edit={true}/> , 
                document.body
          )  : null}
    </div>
  );
};

export default SearchCliente;
