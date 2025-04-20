package org.example.Entities.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PaginaEnvioDTO {
    private List<EnvioDTO> envios;
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;
}
