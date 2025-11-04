package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.Gasto;

import java.util.List;

@Data
public class PaginaGastoDTO {
    private List<Gasto> gastos;
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;
}
