package org.example.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "DetallePedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class DetallePedido extends Base{

    @Min(value = 0, message = "Ingresa una cantidad mayor a 0(cero)")
    private int cantidad;

    private BigDecimal subTotal;

    private double porcentajeAgregado;

    private double porcentajeDescontado;

    @NotNull(message = "El detalle pedido debe tener una relacion con un producto")
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private BigDecimal precioUnitario = new BigDecimal(0);

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "envio_id")
    private Envio envio;

    public void calculateSubTotal(){
        BigDecimal subtotal = BigDecimal.ZERO;
        this.precioUnitario = producto.getPrecioVenta();
        BigDecimal cantidadBD = new BigDecimal(cantidad);
        BigDecimal porcentajeAgregadoBD = BigDecimal.valueOf(porcentajeAgregado);
        BigDecimal porcentajeDescontadoBD = BigDecimal.valueOf(porcentajeDescontado);

        subtotal = precioUnitario.multiply(cantidadBD)
                    .subtract(precioUnitario.multiply(porcentajeDescontadoBD).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                    .add(precioUnitario.multiply(porcentajeAgregadoBD).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));

        this.subTotal = subtotal;

    }



}
