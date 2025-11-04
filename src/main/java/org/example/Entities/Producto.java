package org.example.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.Entities.Enum.Unidad;
import org.hibernate.validator.constraints.UniqueElements;

import java.math.BigDecimal;

@Entity
@Table(name = "Producto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Producto extends Base {

    @NotNull(message = "Ingresa un código para el producto")
    @Column(unique = true)
    private Long codigo;

    @NotBlank(message = "Ingresa un nombre para el producto")
    @NotNull(message = "Ingresa un nombre para el producto")
    private String nombre;

    @NotNull(message = "Ingresa una categoria para el producto")
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Ingresa una unidad de medida para el producto")
    private Unidad unidad;

    private double medida;

    @NotNull(message = "Ingresa un precio para el producto")
    private BigDecimal precioVenta;

    @NotNull(message = "El valor de precio compra no puede ser null")
    @Builder.Default
    private BigDecimal precioCompra = BigDecimal.valueOf(0);

    private int stock;

    private int stockMin;

    private boolean borrado;

    @Column(length = 300)
    private String descripcion;

    @Column(length = 400)
    private String imagen;

}
