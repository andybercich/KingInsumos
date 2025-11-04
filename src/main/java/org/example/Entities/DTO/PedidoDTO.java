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
        private boolean pagadoTotalmente = false;
        private BigDecimal adelanto = BigDecimal.valueOf(0);
        private LocalDateTime fechaPedido;
        private String contacto;
        private String medioPago;
        private List<DetallePedidoDTO> detalles;


        public static PedidoDTO fromEntity(Pedido pedido) {
                PedidoDTO dto = new PedidoDTO();
                dto.setId(pedido.getId());
                dto.setCliente(pedido.getCliente());
                dto.setTotal(pedido.getTotal());
                dto.setContacto(pedido.getContacto());
                dto.setFechaPedido(pedido.getFechaPedido());
                dto.setPagadoTotalmente(pedido.isPagadoTotalmente());
                dto.setAdelanto(pedido.getAdelanto());
                dto.setMedioPago(pedido.getMedioPago().toString());
                dto.setDetalles(pedido.getDetalles().stream()
                        .map(DetallePedidoDTO::fromEntity)
                        .toList());
                return dto;
        }

        public static List<PedidoDTO> fromEntitys (List<Pedido> pedidos){
                List<PedidoDTO> pedidosDto = new ArrayList<>();

                for (Pedido p : pedidos){

                        pedidosDto.add(PedidoDTO.fromEntity(p));

                }
                return pedidosDto;
        }
 }

