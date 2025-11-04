import { useEffect, useState } from "react";
import style from "./Productos.module.css";
import { Categoria, PaginaProductoDTO } from "../../../Models/ProductoDTO";
import { CategoriaService } from "../../../Services/CategoriaService";
import { ProductoService } from "../../../Services/ProductoService";
import { Add } from "../../Icons/AddIcon/Add";
import { Edit } from "../../Icons/EditIcon/Edit";
import { Delete } from "../../Icons/DeleteIcon/Delete";
import { ModalCreateCategoria } from "../../UI/Modals/CreateCategoria/ModalCreateCategoria";
import { badContest, confirmAlert, godContest } from "../../UI/PopUps/Alerts/ServerBadAlert";
import { CreateProductoModal } from "../../UI/Modals/CreateProducto/CreateProductoModal";
import { paginadorStore } from "../../../store/PaginaStore";
import ProductoSearchBar from "../../UI/SearchBar/ProductoSearchBar";
import { GenericTable } from "../../UI/TablaGenerica/TablaGenerica";
import { ProductoCard } from "../../UI/ProductoCard/ProductoCard";


export const Productos = () => {

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [createCategoria, setCreateCategoria] = useState<boolean>(false);
  const [editCategoria, setEditCategoria] = useState<boolean>(false);
  const [createProducto, setCreateProducto] = useState<boolean>(false);
  const [pagina, setPagina] = useState<PaginaProductoDTO>();
  const { numeroPagina, setNumeroPagina,recargar } = paginadorStore();
  
  const handleDelete= async ()=>{

    try {
      
      const service = new CategoriaService();
      if(categoria){
        const response = await confirmAlert("¿Estás seguro que quieres eliminar esta categoria?")
      
        if(response && categoria){

          service.eliminarCategoria(categoria?.id);
          godContest("Se logró borrar la categoria")
          fetchCategorias();
        }
      }




      
    } catch (error) {
      badContest("No se pudo eliminar la categoria "+ categoria?.denominacion+ " asegurate que no tenga ningun producto relacionado")
      
    }


  }

  const fetchCategorias = async () => {
    try {
      const service = new CategoriaService();

      const response = await service.getAllCategoria();

      setCategorias(response.data);
    } catch (error) {
      console.log("No se pudieron cargar las categorias para el select", error);
    }
  };

  const fetchPaginaProducto = async (page:number) => {
    const service = new ProductoService();
    try {
      if (categoria) {
        const response = await service.getPaginaProductoByCategoria(
          categoria.denominacion,
          10,
          page
        );
        setPagina(response.data);
      } else {
        const response = await service.findAllByPage(page, 10);
        setPagina(response.data);
      }

    } catch (error) {
      badContest(`${error}`)
      throw new Error(        "Error al obtener productos de la categoria " +
        categoria?.denominacion +
        error);

    }
  };
  /*
  const handleDownloadExcel = async () => {
    try {

      const response = await fetch('http://localhost:8080/kinginsumos/producto/export/excel', {
        method: 'GET',
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'productos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Hubo un problema al descargar el archivo:', error);
    }
  };*/
  useEffect(() => {
    fetchPaginaProducto(0);
    fetchCategorias();
    setNumeroPagina(0);
  }, []);

  useEffect (()=>{

    fetchPaginaProducto(0);
    setNumeroPagina(0);
  }, [categoria,categorias])

  useEffect(()=>{
    fetchPaginaProducto(numeroPagina);
  },[recargar, numeroPagina])

  return (
    <div className={style.main}>
      {/*
<button onClick={()=>{handleDownloadExcel()}}>
  Descargar Excel
</button>*/}
      <div className={style.subHeader}>
        <select
          id="option"
          name="option"
          required
          className={style.select}
          onChange={(e) => {
            const valor = e.target.value;
            if (valor === "") {
              // Sin categoría filtrada
              setCategoria(null);
            } else {
              const selected = categorias.find(c => c.denominacion === valor);
              if (selected) setCategoria(selected);
            }
            setNumeroPagina(0);
          }}
          value={categoria?.denominacion ?? ""} 
        >
          <option value="">
            Todas las categorias
          </option>
          {categorias.length > 0
            ? categorias.map((categoria) => (
                <option
                  key={categoria.denominacion}
                  value={categoria.denominacion}
                >
                  {categoria.denominacion}
                </option>
              ))
            : null}
        </select>

        <div className={style.buttonsCategorias}>
          <Add onClick={()=>{setCreateCategoria(true)}}></Add>
          <span style={{"alignItems":"center", "display":"flex", "justifyContent":"center"}} onClick={()=>{setEditCategoria(true)}}>          <Edit close={()=>{}}></Edit></span>
          <span style={{"alignItems":"center", "display":"flex", "justifyContent":"center"}} onClick={()=>{handleDelete()}}><Delete></Delete></span>    
          
        </div>

        <div className={style.containerSearch}>
          <ProductoSearchBar isDetalle={false}></ProductoSearchBar>
        </div>


        <div className={style.buttonAgregarProduct}>
          <button className={style.agregarProduct} onClick={()=>{setCreateProducto(true)}}>Agregar producto</button>
        </div>

      </div>

      <div className={style.containerProducts}>

      {pagina ? <GenericTable
  items={pagina.productos}
  paginaActual={pagina.paginaActual}
  totalPaginas={pagina.totalPaginas}
  renderItem={(product) => <ProductoCard product={product} />}
/>: null } 



            
      </div>
      {createCategoria ? <ModalCreateCategoria fetchCategoria={fetchCategorias} close={setCreateCategoria}></ModalCreateCategoria>: null}
      {editCategoria && categoria ? <ModalCreateCategoria categoria={categoria} fetchCategoria={fetchCategorias} close={setEditCategoria}></ModalCreateCategoria> : null}
      {createProducto ? <CreateProductoModal close={setCreateProducto}></CreateProductoModal> : null}
    </div>
  );
};
