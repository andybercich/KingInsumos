package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.Enum.Orden;
import org.example.Entities.Enum.Unidad;
import org.example.Entities.Producto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Data
public class ProductoDTOFind {
    private Long id;
    private Long codigo;
    private String nombre;
    private BigDecimal precioVenta;
    private String imagen;
    private boolean borrado;
    private Unidad unidad;
    private double medida;
    private int stock;


    public static ProductoDTOFind fromEntity(Producto producto) {
        ProductoDTOFind dto = new ProductoDTOFind();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setPrecioVenta(producto.getPrecioVenta());
        dto.setImagen(producto.getImagen());
        dto.setCodigo(producto.getCodigo());
        dto.setStock(producto.getStock());
        dto.setBorrado(producto.isBorrado());
        dto.setUnidad(producto.getUnidad());
        dto.setMedida(producto.getMedida());
        return dto;
    }

    public static List<ProductoDTOFind> fromEntitys(List<Producto> productos){

        List<ProductoDTOFind> productoDTOFinds = new ArrayList<>();
        for(Producto p: productos){
            productoDTOFinds.add(ProductoDTOFind.fromEntity(p));
        }
        return productoDTOFinds;
    }



}

