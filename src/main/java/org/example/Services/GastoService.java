package org.example.Services;

import org.example.Entities.DTO.PaginaGastoDTO;
import org.example.Entities.DTO.PaginaPedidoDTO;
import org.example.Entities.DTO.PedidoDTO;
import org.example.Entities.Gasto;
import org.example.Entities.Pedido;
import org.example.Repositories.GastoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class GastoService extends BaseService<Gasto, Long, GastoRepository>{

    public PaginaGastoDTO findByFechaPedidoBetween(LocalDateTime desde, LocalDateTime hasta, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Gasto> gastosPage = repository.findByFechaCreacionBetweenOrderByFechaCreacionDesc(desde, hasta, pageable);

        PaginaGastoDTO dto = new PaginaGastoDTO();
        dto.setGastos(gastosPage.getContent());
        dto.setPaginaActual(gastosPage.getNumber());
        dto.setTotalPaginas(gastosPage.getTotalPages());
        dto.setTotalElementos(gastosPage.getTotalElements());

        return dto;
    }
}
