import { Dispatch, FC } from "react";
import { useForm } from "../../../../Hooks/useForm";
import { Categoria, CategoriaCreate } from "../../../../Models/ProductoDTO";
import styles from "./Create.module.css"
import { CategoriaService } from "../../../../Services/CategoriaService";
import { badContest, godContest } from "../../PopUps/Alerts/ServerBadAlert";
import { Close } from "../../../Icons/CloseIcon/Close";
import { Button } from "react-bootstrap";

interface IProps{
    categoria?: Categoria
    fetchCategoria: ()=>void
    close: Dispatch<React.SetStateAction<boolean>>
}

export const ModalCreateCategoria: FC<IProps> = ({categoria, fetchCategoria, close}) => {
    const { values, handleChange, resetForm } = useForm({
        denominacion: categoria? categoria.denominacion : "" 
    });
  
    const handleSubmit = async (event: React.FormEvent)=>{
      event.preventDefault();
      const service = new CategoriaService();
    
  
  
  
      try {
  
          let response;
          if(categoria){ 
            const categoriaNew:Categoria = {
              id:categoria.id,
              denominacion: values.denominacion
          }
            response = await service.editarCategoria(categoriaNew,categoria.id);
          }else{
            const categoriaNew:CategoriaCreate = {
              denominacion:values.denominacion
            }
        
  
            response = await service.crearCategoria(categoriaNew);
          
          }
         
  
  
          if (response.status === 200) {
            
            godContest(`Se ha ${categoria ? "editado" :"creado"} la categoria correctamente`);
            fetchCategoria();
            resetForm();
            close(false);
  
          } else if (response.status === 400) {
  
            badContest("Error en la solicitud: Datos inválidos");
            resetForm();
            close(false);
          }else {
  
            badContest("Error en el servidor");
            resetForm();
            close(false);
          }
  
        }       catch (error) {
  
        console.log(error)
        badContest("La categoria no se pudo crear correctamente")
        resetForm();
        close(false);
      }
    }
  
  
  
  
  
    
  
  
    return (
      <div className={styles.mainDiv}>
        <div className={styles.modalUser}>
          {categoria ? (
            <h1 className={styles.titulo}>Editar Categoria</h1>
          ) : (
            <h1 className={styles.titulo}>Crear Categoria</h1>
          )}
    
          <div className={styles.divClose}>
            <Close close={close} />
          </div>
    
          <form onSubmit={handleSubmit} className={styles.formularios}>
  
  
            <input
              name="denominacion"
              placeholder="Ingrese el nombre de la categoria"
              type="text"
              required
              value={values.denominacion}
              onChange={handleChange}
            />
  
            <div className={styles.buttonContainer}>
              <Button type="submit" variant="outline-success">
                Confirmar
              </Button>
            </div>
  
            
          </form>
        </div>
      </div>
)}
