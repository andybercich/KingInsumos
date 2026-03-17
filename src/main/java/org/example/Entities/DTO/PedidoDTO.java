package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.Pedido;
import org.example.Entities.Producto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
public class PedidoDTO {

        private Long id;
        private String cliente;
        private BigDecimal total;
        private boolean pagadoTotalmente;
        private LocalDateTime fechaPedido;
        private String contacto;

        private List<DetallePedidoDTO> detalles;
        private List<OpcionesPagoDTO> opcionesPagos;

        public static PedidoDTO fromEntity(Pedido pedido) {

                PedidoDTO dto = new PedidoDTO();

                dto.setId(pedido.getId());
                dto.setCliente(pedido.getCliente());
                dto.setTotal(pedido.getTotal());
                dto.setContacto(pedido.getContacto());
                dto.setFechaPedido(pedido.getFechaPedido());

                dto.setDetalles(
                        pedido.getDetalles().stream()
                                .map(DetallePedidoDTO::fromEntity)
                                .toList()
                );

                dto.setOpcionesPagos(
                        OpcionesPagoDTO.fromEntities(pedido.getOpcionesPagos())
                );

                return dto;
        }

        public static List<PedidoDTO> fromEntitys(List<Pedido> pedidos){
                return pedidos.stream()
                        .map(PedidoDTO::fromEntity)
                        .toList();
        }
}