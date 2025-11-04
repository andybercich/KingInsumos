import React from "react";
import style from "./TablaGenerica.module.css";
import { paginadorStore } from "../../../store/PaginaStore";

interface Props<T> {
  items: T[];
  paginaActual: number;
  totalPaginas: number;
  renderItem: (item: T) => React.ReactNode;
}

export function GenericTable<T>({ items, paginaActual, totalPaginas, renderItem }: Props<T>) {
  const { setNumeroPagina,recargar,setRecargar } = paginadorStore();

  const handlePrev = () => {
    if (paginaActual > 0) {
      setNumeroPagina(paginaActual - 1);
      setRecargar(!recargar)
    }
  };

  const handleNext = () => {
    if (paginaActual < totalPaginas - 1) {
      setNumeroPagina(paginaActual + 1);
      setRecargar(!recargar)
    }
  };

  return (
    <div className={style.mainDiv}>
      <div className={style.containerProducts}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <React.Fragment key={index}>
              {renderItem(item)}
            </React.Fragment>
          ))
        ) : (
          <div className="text-center p-4">
            No hay elementos para mostrar.
          </div>
        )}
      </div>

      <div className={style.arrows}>
        <span
          onClick={handlePrev}
          className={`
            material-symbols-outlined 
            text-3xl 
            ${paginaActual === 0 ? style.notAlowed : style.alowed}
          `}
        >
          chevron_left
        </span>

        <span>
          {totalPaginas !== 0
            ? `Página ${paginaActual + 1} de ${totalPaginas}`
            : "No hay resultados"}
        </span>

        <span
          onClick={handleNext}
          className={`
            material-symbols-outlined 
            text-3xl 
            ${(paginaActual === totalPaginas - 1 || totalPaginas === 0)
              ? style.notAlowed
              : style.alowed}
          `}
        >
          chevron_right
        </span>
      </div>
    </div>
  );
}
