package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.Producto;

import java.util.List;

@Data
public class PaginaProductoDTO {
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;
    private List<ProductoDTO> productos;



}