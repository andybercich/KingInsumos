import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import ReactDOM from 'react-dom';
import style from './ProductoSearchBar.module.css';
import { ProductoDTOFind, unidadToString } from '../../../Models/ProductoDTO';
import { DetallePedidoListPedido } from '../../../Models/Pedido';
import { CreateProductoModal } from '../Modals/CreateProducto/CreateProductoModal';
import { badContest } from '../PopUps/Alerts/ServerBadAlert';
import { usePedidoStore } from '../../../store/DetalleStore';

interface Props {
  isDetalle: boolean;
}

const ProductoSearchBar = ({ isDetalle}: Props) => {
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState<ProductoDTOFind[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [id,setId] = useState<number>(0);

  const { detallesPedido, addDetalle } = usePedidoStore();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        fetchProductos(query);
      } else {
        setProductos([]);
        setShowDropdown(false);
      }
    }, 50);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchProductos = async (nombreCodigo: string) => {
    try {
      const response: AxiosResponse<ProductoDTOFind[]> = await axios.get(
        `http://localhost:8081/kinginsumos/producto/find/${nombreCodigo}`
      );
      setProductos(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setProductos([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (producto: ProductoDTOFind) => {

    if(isDetalle){
      const yaExiste = detallesPedido.some(p => p.producto.id === producto.id);

      if (yaExiste) {
        badContest("Ya seleccionaste este producto en el pedido");
        return;
      }

      if (producto.stock === 0) {
        badContest("No queda más stock de este producto");
        return;
      }

      const newDetalle: DetallePedidoListPedido = {
        cantidad: 1,
        subTotal: 0,
        porcentajeAgregado: 0,
        porcentajeDescontado: 0,
        producto,
        precioUnitario: 0,
      };

      addDetalle(newDetalle);
      setShowDropdown(false);
      setQuery('');
    }else{
      setId(producto.id)
      setEdit(true);
    }

  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
<input
  className={style.mainDiv}
  type="text"
  onBlur={() => {
    if (isDetalle) {
      setTimeout(() => setShowDropdown(false), 100);
    }
  }}
  onFocus={() => query && setShowDropdown(true)}
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Buscar producto por nombre o código"
/>

      {showDropdown && productos.length > 0 && (
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
          {productos.map((prod) => (
            <li
              key={prod.id}
              onClick={() => handleSelect(prod)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '2px solid #eee',
              }}
            >
              <strong>{prod.nombre}</strong> - {prod.codigo} - <strong>Medida:</strong> {prod.medida}
              {unidadToString(prod.unidad)} - stock: {prod.stock} - precio: {prod.precioVenta}
              {prod.imagen &&
                <div className={style.divImage}>
                  <div
                    style={{
                      backgroundImage: `url(${prod.imagen})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '100px',
                      height: '100px',
                    }}
                  />
                </div>
              }
            </li>
          ))}
        </ul>
      )}

      {edit &&
        ReactDOM.createPortal(
          <CreateProductoModal close={setEdit} idProduct={id} />,
          document.body
        )}
    </div>
  );
};

export default ProductoSearchBar;
