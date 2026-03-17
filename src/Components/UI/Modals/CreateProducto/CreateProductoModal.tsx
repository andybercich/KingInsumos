import { Dispatch, useEffect, useState } from "react"
import { Categoria, Producto, ProductoCreate, stringToUnidad, Unidad, unidadToString } from "../../../../Models/ProductoDTO"
import { badContest, godContest } from "../../PopUps/Alerts/ServerBadAlert"
import { useForm } from "../../../../Hooks/useForm"
import { ProductoService } from "../../../../Services/ProductoService"
import { Close } from "../../../Icons/CloseIcon/Close"
import styles from "./CreateProducto.module.css"
import { Button } from "react-bootstrap"
import { CategoriaService } from "../../../../Services/CategoriaService"
import { paginadorStore } from "../../../../store/PaginaStore"
interface Props{
  idProduct?: number
  close: Dispatch<React.SetStateAction<boolean>>
}

const unidades = [
  { value: "KG", label: "Kilogramo" },
  { value: "GR", label: "Gramo" },
  { value: "MG", label: "Miligramo" },
  { value: "OZ", label: "Onza" },
  { value: "L", label: "Litro" },
  { value: "ML", label: "Mililitro" },
  { value: "CANTIDAD", label: "Cantidad" }
];
type UnidadOption = {
  value: string;
  label: string;
};
export const CreateProductoModal = ({ close,idProduct}: Props) => {
  const { setRecargar,recargar } = paginadorStore();
  const [categorias, setCategorias]= useState<Categoria[]>([]);
  const [producto, setProducto] = useState<Producto>();

  const fetchProducto= async ()=>{

    try {
      const service = new ProductoService();
      if(idProduct){
        const response = await service.getProductoById(idProduct);
        setProducto(response.data);
        console.log(response.data);
      }
      
    } catch (error) {
      badContest("Error al obtener producto con id");
    }

  }
  useEffect(() => {
    fetchProducto();
    fetchCategoria();
  }, []);
  
  useEffect(()=>{
    
    fetchCategoria();
    if (producto) {
      resetForm({
        codigo: producto.codigo ?? "",
        nombre: producto.nombre ?? "",
        categoriaId: producto.categoria.id.toString(),
        unidad: producto.unidad,
        medida: producto.medida.toString(),
        stock: producto.stock.toString(),
        stockMin: producto.stockMin.toString(),
        precioCompra: producto.precioCompra.toString(),
        precioVenta: producto.precioVenta.toString(),
        descripcion: producto.descripcion ?? "",
        imagen: producto.imagen ?? ""
      });
    }
  }, [producto])



  const [unidadesFiltradas, setUnidadesFiltradas] = useState<UnidadOption[]>([]);

    const { values, handleChange, resetForm } = useForm({
      codigo: producto && producto.codigo   ?  producto.codigo : "",
      nombre: producto && producto.nombre   ?  producto.nombre : "",
      categoriaId: "",
      unidad: "",
      medida: producto && producto.medida.toString()   ?  producto.medida.toString() : "",
      stock: producto && producto.stock.toString()   ?  producto.stock.toString() : "",
      stockMin: producto && producto.stockMin.toString()   ?  producto.stockMin.toString() : "",
      precioCompra:  producto && producto.precioCompra  ?  producto.precioCompra.toString(): '',
      precioVenta: producto && producto.precioVenta.toString()   ?  producto.precioVenta.toString() : "",
      descripcion:producto && producto.descripcion   ?  producto.descripcion : "",
      imagen: producto && producto.imagen ? producto.imagen :  ""
    });

    const porcentaje = ((Number(values.precioVenta) - Number(values.precioCompra) ) / Number(values.precioCompra)) * 100;
    const fetchCategoria = async ()=>{

      try {
        const service = new CategoriaService();
        const response = await service.getAllCategoria();
        const categorias = response.data;
        if(producto){
          const categoriasFiltradas = categorias.filter(
            (categoria) => categoria.id !== producto.categoria.id
          );
          const unidadesFiltradas = unidades.filter(

            (unidad) => unidad.value !== producto.unidad
          )
          setCategorias(categoriasFiltradas);
          setUnidadesFiltradas(unidadesFiltradas);
          console.log(categoriasFiltradas)
          console.log(unidadesFiltradas)
        }else{
          setCategorias(categorias);
        }

      } catch (error) {
        console.log(error)
        badContest("No se pudo cargar niguna categoria")

      }

    }

    

  
    const handleSubmit = async (event: React.FormEvent)=>{
      event.preventDefault();
      const service = new ProductoService();
      try {
  
          let response;
          if(producto){ 

            const editProducto:Producto = {
                id: producto.id,
                nombre: values.nombre,
                codigo: values.codigo,
                categoria: {id:Number(values.categoriaId)},
                unidad: stringToUnidad(values.unidad),
                medida: Number(values.medida),
                stock: Number(values.stock),
                stockMin: Number(values.stockMin),
                precioCompra: Number(values.precioCompra),
                precioVenta:values.precioVenta != "" ? Number(values.precioVenta): 0 ,
                descripcion: values.descripcion,
                imagen: values.imagen
            }
            console.log(editProducto)
            response = await service.updateProducto(editProducto.id, editProducto);
          }else{
            console.log(values.categoriaId);
            console.log(String(Unidad.KG));
            const preoductoCreate:ProductoCreate = {
              nombre: values.nombre,
              codigo: values.codigo,
              categoria: {id:Number(values.categoriaId)},
              unidad: stringToUnidad(values.unidad),
              medida: Number(values.medida),
              stock: Number(values.stock),
              stockMin: Number(values.stockMin),
              precioCompra: Number(values.precioCompra),
              precioVenta:values.precioVenta != "" ? Number(values.precioVenta): 0 ,
              descripcion: values.descripcion,
              imagen: values.imagen
              }
            console.log(preoductoCreate)
  
            response = await service.createProducto(preoductoCreate);
            
          }
         
  
  
          if (response.status === 200) {

            godContest(`Se ha ${producto ? "editado" :"creado"} el ejercicio correctamente`);
            resetForm();
            setRecargar(!recargar);
            close(false);
  
          } else if (response.status === 400) {
  
            badContest("El producto no se pudo crear correctamente, parece que este codigo ya está usado por otro producto")

          }else {
            badContest("El producto no se pudo crear correctamente, parece que este codigo ya está usado por otro producto")

          }
  
        }catch (error) {
  
        badContest("El producto no se pudo crear correctamente, parece que este codigo ya está usado por otro producto")

      }    
    }

    
  
  
    return (
      <div className={styles.mainDiv}>
        <div className={styles.modalUser}>

            <h1 className={styles.titulo}>{producto ? "Editar" : "Crear"} Producto</h1>
    
          <div className={styles.divClose}>
            <Close close={close} />
          </div>
    
          <form onSubmit={handleSubmit} className={styles.formularios}>
            <div className={styles.mainInputs}>

                
        <div className={styles.leftColum}>
        <input
          id="codigo"
          name="codigo"
          type="text"
          placeholder="Código"
          required
          value={values.codigo}
          onChange={handleChange}
        />
  
            <input
              id="nombre"
              name="nombre"
              placeholder="Ingrese el nombre del producto"
              type="text"
              required
              value={values.nombre}
              onChange={handleChange}
            />

            <select
              id="categoriaId"
              name="categoriaId"
              value={values.categoriaId}
              onChange={handleChange}
              required
              className={styles.select}
            >

              {producto ? <option value={producto.categoria.id}>{producto.categoria.denominacion}</option> : <option value="" disabled>Categoria</option>  }

              {categorias.map(c => (
                <option key={c.id} value={c.id}>
                  {c.denominacion}
                </option>
              ))}
            </select>


            <div className={styles.inputsCortos}>
              
            <select
            id="unidad"
            name="unidad"
            value={values.unidad}
            onChange={handleChange}
            required
            className={styles.select}
            >
            {producto ? <option key={producto.unidad} value={producto.unidad}>{unidadToString(producto.unidad)+" "+ producto.unidad}</option>:<option value="" disabled>Unidad</option> }
            { producto ? unidadesFiltradas.map((type) => (
                <option key={type.value} value={type.value}>
                {type.label}
                </option>
            )) : unidades.map((type) => (
              <option key={type.value} value={type.value}>
              {type.label}
              </option>
          ))  }
            </select>


            <input
              id="medida"
              name="medida"
              type="number"
              placeholder="Medida"
              required
              value={Number(values.medida) !== 0 ? values.medida : ''}
              onChange={handleChange}
            />
            <input
              id="stock"
              name="stock"
              placeholder="Stock"
              type="number"
              required
              value={Number(values.stock) >= 0 ? values.stock : ''}
              onChange={handleChange}
            />

            <input
              id="stockMin"
              name="stockMin"
              type="number"
              placeholder="StockMin"
              value={Number(values.stockMin) !== 0 ? values.stockMin : ''}
              onChange={handleChange}
            />

            <input
              id="precioCompra"
              name="precioCompra"
              placeholder="Precio compra"
              type="number"
              value={Number(values.precioCompra) != 0 ? values.precioCompra : ""}
              onChange={handleChange}
              
            />
            <input
              id="precioVenta"
              name="precioVenta"
              placeholder="Precio Venta"
              type="number"
              required
              value={Number(values.precioVenta) != 0 ? values.precioVenta : ""}
              onChange={handleChange}
            />

            </div>

            <div className={styles.ganancia}>
              <label>Ganancia: ${Number(values.precioVenta)-Number(values.precioCompra)}</label>
              <label>Porcentaje: {isFinite(porcentaje) ? `${porcentaje.toFixed(1)}%` : "%%%"}</label>
            </div>

        </div>
          <div className={styles.inputsGrandes}>

          <textarea 
            id="descripcion"
            name="descripcion"
            placeholder="Descripcion producto"
            value={values.descripcion}
            onChange={handleChange}/>


            <div className={styles.imagenDiv} style={{backgroundImage:`url(${values.imagen})`}}>
            <input type="text" id="imagen" onChange={handleChange} name="imagen" value={values.imagen} placeholder="Ingresa una url imagen"/>
            </div>




          </div>

            </div>


            <div className={styles.buttonContainer}>
              <Button type="submit" variant="outline-success">
                Confirmar
              </Button>
            </div>
  
            
          </form>
        </div>
      </div>
    )
}
