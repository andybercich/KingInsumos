package org.example.Entities.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PaginaPedidoDTO {

        private List<PedidoDTO> pedidos;
        private int paginaActual;
        private int totalPaginas;
        private long totalElementos;



}
