package org.example.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.example.Entities.Enum.MedioPago;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "OpcionesPago")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class OpcionesPago extends Base {

    @ManyToOne
    private Pedido pedido;

    @NotNull(message = "La opcion de pago debe tener una fecha")
    protected LocalDateTime fechaPedido;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "SE NECESITA UN MEDIO DE PAGO PARA CREAR UN MEDIO DE PAGO")
    private MedioPago medioPago;

    @ManyToOne
    private Envio envio;

    private BigDecimal pago;

    private double agregado;

    private double descontado;

    public void calcularTotal(){

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal porcentajeAgregadoBD = BigDecimal.valueOf(agregado);
        BigDecimal porcentajeDescontadoBD = BigDecimal.valueOf(descontado);
        BigDecimal cien = BigDecimal.valueOf(100);


        BigDecimal descuentoCalculado = pago.multiply(porcentajeDescontadoBD)
                .divide(cien, 2, RoundingMode.HALF_UP);

        BigDecimal agregadoCalculado = pago.multiply(porcentajeAgregadoBD)
                .divide(cien, 2, RoundingMode.HALF_UP);

        subtotal = pago.subtract(descuentoCalculado).add(agregadoCalculado);

        this.pago = subtotal;
    }
}
