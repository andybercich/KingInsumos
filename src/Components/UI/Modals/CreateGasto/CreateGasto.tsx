import { Dispatch } from "react";
import { useForm } from "../../../../Hooks/useForm";
import { GastoCreate, GastoUpdate } from "../../../../Models/Gasto";
import { Close } from "../../../Icons/CloseIcon/Close";
import styles from "./CreateGasto.module.css";
import { GastoService } from "../../../../Services/GastoService";
import { badContest, godContest } from "../../PopUps/Alerts/ServerBadAlert";
import { Button } from "react-bootstrap";
import { paginadorStore } from "../../../../store/PaginaStore";
import { getLocalDateTimeString } from "../../../../Models/FuncionDate";
interface IGasto {
  gasto?: GastoUpdate;
  close: Dispatch<React.SetStateAction<boolean>>;
}
export const CreateGasto = ({ gasto, close }: IGasto) => {
    const {recargar,setRecargar} = paginadorStore();
  const { values, handleChange, resetForm } = useForm({
    motivo: gasto ? gasto.motivo : "",
    descripcion: gasto ? gasto.descripcion : "",
    gasto: gasto ? gasto.gasto : "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const service = new GastoService();

    try {
      if (gasto) {
        const updateGasto: GastoUpdate = {
          id: gasto.id,
          motivo: values.motivo,
          descripcion: values.descripcion,
          gasto: Number(values.gasto),
          fechaCreacion: gasto.fechaCreacion,
        };
        const response = await service.editarGasto(updateGasto, updateGasto.id);
        {
          response.status === 200
            ? godContest("Se ha editado el gasto correctamente")
            : badContest("No se pudo editar el gasto");
            close(false);
            resetForm();
            setRecargar(!recargar)
        }
      } else {
        const nuevoGasto: GastoCreate = {
          motivo: values.motivo,
          descripcion: values.descripcion,
          gasto: Number(values.gasto),
          fechaCreacion: getLocalDateTimeString()
        };
        const response = await service.crearGasto(nuevoGasto);
        {
          response.status === 200
            ? godContest("Se ha creado el gasto correctamente")
            : badContest("No se pudo crear el gasto");
        }
        close(false);
        resetForm();
        setRecargar(!recargar)
      }
    } catch (error) {
      badContest("No se puede crear/editar el gasto en el servidor");
      console.log(error);
    }
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.modalUser}>
        <h1 className={styles.titulo}>{gasto ? "Editar" : "Crear"} Gasto</h1>

        <div className={styles.divClose}>
          <Close close={close} />
        </div>

        <form onSubmit={handleSubmit} className={styles.formularios}>
          <div className={styles.mainInputs}>
            <input
              onChange={handleChange}
              placeholder="Motivo"
              type="text"
              required
              id="motivo"
              name="motivo"
              value={values.motivo}
            />
            <input
              onChange={handleChange}
              placeholder="Gasto"
              type="number"
              required
              id="gasto"
              name="gasto"
              value={Number(values.gasto) > 0 ? values.gasto : ""}
            />
          </div>

          <textarea
            className={styles.textArea}
            onChange={handleChange}
            placeholder="Descripcion"
            id="descripcion"
            name="descripcion"
            value={values.descripcion}
        
          />

          <div className={styles.buttonContainer}>
            <Button type="submit" variant="outline-success">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
