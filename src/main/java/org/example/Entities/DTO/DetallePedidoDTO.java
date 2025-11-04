package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.DetallePedido;
import org.example.Entities.Pedido;

import java.math.BigDecimal;


@Data
public class DetallePedidoDTO {
    private Long id;
    private int cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subTotal;
    private double porcentajeAgregado;
    private double porcentajeDescontado;
    private ProductoDTO producto;


    public static DetallePedidoDTO fromEntity(DetallePedido detalle) {
        DetallePedidoDTO dto = new DetallePedidoDTO();
        dto.setId(detalle.getId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubTotal(detalle.getSubTotal());
        dto.setPorcentajeAgregado(detalle.getPorcentajeAgregado());
        dto.setPorcentajeDescontado(detalle.getPorcentajeDescontado());
        dto.setProducto(ProductoDTO.fromEntity(detalle.getProducto()));
        return dto;
    }

}
