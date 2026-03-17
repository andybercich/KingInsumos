package org.example.Entities.DTO;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.example.Entities.Categoria;
import org.example.Entities.Enum.Orden;
import org.example.Entities.Enum.Unidad;
import org.example.Entities.Producto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Data
public class ProductoDTO {

    private Long id;

    private String codigo;

    private String nombre;

    private Categoria categoria;

    private Unidad unidad;

    private double medida;

    private BigDecimal precioVenta;

    private boolean borrado;

    private int stock;

    private int stockMin;

    private String imagen;

    private String descripcion;

    public static ProductoDTO fromEntity(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setPrecioVenta(producto.getPrecioVenta());
        dto.setImagen(producto.getImagen());
        dto.setCodigo(producto.getCodigo());
        dto.setCategoria(producto.getCategoria());
        dto.setUnidad(producto.getUnidad());
        dto.setMedida(producto.getMedida());
        dto.setStock(producto.getStock());
        dto.setStockMin(producto.getStockMin());
        dto.setBorrado(producto.isBorrado());

        return dto;
    }

    public static List<ProductoDTO> fromEntitys(List<Producto> productos, Orden orden) {
        List<ProductoDTO> productoDTOS= new ArrayList<>();

        for (Producto p:productos){
            productoDTOS.add(ProductoDTO.fromEntity(p));
        }
        return productoDTOS;
    }
}
