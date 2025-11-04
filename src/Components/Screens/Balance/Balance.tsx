import { useEffect, useState } from "react";
import style from "./Balance.module.css";
import { GastoPagina } from "../../../Models/Gasto";
import { paginadorStore } from "../../../store/PaginaStore";
import { GastoService } from "../../../Services/GastoService";
import { GenericTable } from "../../UI/TablaGenerica/TablaGenerica";
import { Gasto } from "../../UI/GastoCard/Gasto";
import { Form, FormCheck } from "react-bootstrap";
import { CreateGasto } from "../../UI/Modals/CreateGasto/CreateGasto";
import { formatDateLocal } from "../../../Models/FuncionDate";

export const Balance = () => {
  const [createGasto, setCreateGasto] = useState<boolean>(false);
  const [pagina, setPagina] = useState<GastoPagina>();
  const { numeroPagina, setNumeroPagina, recargar } = paginadorStore();
  const [hoy, setHoy] = useState<boolean>(true);
  const [desde, setDesde] = useState<string>("");
  const [hasta, setHasta] = useState<string>("");


  
  const handleDownloadExcel = async () => {
    try {

      const response = await fetch('http://localhost:8081/kinginsumos/producto/export/excel', {
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
  };


    
  const handleDownloadExcelBalance = async () => {
    try {

        const { desdeHoy, hastaHoy } = getTodayRangeFormatted();
        let response;
        if(hoy){
            response = await fetch(`http://localhost:8081/exportar-informe?desde=${desdeHoy}&hasta=${hastaHoy}`, {
                method: 'GET',
              });
        }else{
            response = await fetch(`http://localhost:8081/exportar-informe?desde=${desde}&hasta=${hasta}`, {
                method: 'GET',
              });
        }



      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      if(hoy){
        link.setAttribute('download', `balance Dia:${desdeHoy}.xlsx`);
      }else{
        link.setAttribute('download', `balance Desde:${desde} Hasta:${hasta} .xlsx`);
      }
      
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Hubo un problema al descargar el archivo:', error);
    }
  };


  function getTodayRangeFormatted() {
    const now = new Date();
    const from = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const to = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    return {
      desdeHoy: formatDateLocal(from),
      hastaHoy: formatDateLocal(to),
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
      if (desde && new Date(value) < new Date(desde)) {
        setDesde(value);
      }
    }
  };

  const fetchPaginaGastos = async (page: number) => {
    const service = new GastoService();

    if (hoy) {
      const { desdeHoy, hastaHoy } = getTodayRangeFormatted();
      const response = await service.getPageByDates(
        desdeHoy,
        hastaHoy,
        5,
        page
      );
      setPagina(response.data);
    } else {
      const response = await service.getPageByDates(desde, hasta, 5, page);
      setPagina(response.data);
    }
  };

  useEffect(() => {
    fetchPaginaGastos(numeroPagina);
  }, [hoy, recargar, desde, hasta]);

  useEffect(() => {
    fetchPaginaGastos(0);
    setNumeroPagina(0);
  }, []);

  useEffect(() => {
    fetchPaginaGastos(numeroPagina);
  }, [recargar, numeroPagina]);

  return (
    <div className={style.main}>
      {/*
*/}
      <div className={style.subHeader}>
        {hoy ? (
          <>
            <Form.Control
              placeholder="desde"
              type="datetime-local"
              style={{ width: "10rem" }}
              disabled
            />
            <Form.Control
              placeholder="hasta"
              type="datetime-local"
              style={{ width: "10rem" }}
              disabled
            />
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
        <FormCheck
          checked={hoy}
          onChange={() => {
            setHoy(!hoy);
          }}
          label="Hoy"
        ></FormCheck>
          <button onClick={()=>{handleDownloadExcel()}}>
            Descargar stock productos
          </button>
          <button onClick={()=>{handleDownloadExcelBalance()}}>
            Descargar balance segun fechas
          </button>
        <div className={style.buttonAgregarProduct}>
          <button className={style.agregarProduct} onClick={() => {setCreateGasto(true)}}>
            Agregar Gasto
          </button>
        </div>
      </div>

      <div className={style.containerProducts}>
        {pagina ? (
          <GenericTable
            items={pagina.gastos}
            paginaActual={pagina.paginaActual}
            totalPaginas={pagina.totalPaginas}
            renderItem={(gastos) => <Gasto gasto={gastos} />}
          />
        ) : null}
      </div>
      {createGasto ? <CreateGasto close={setCreateGasto}></CreateGasto> : null}
    </div>
  );
};
