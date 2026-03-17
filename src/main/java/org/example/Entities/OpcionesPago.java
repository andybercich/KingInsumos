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

    private String info;

    @NotNull(message = "La opcion de pago debe tener una fecha")
    private LocalDateTime fechaPago;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "SE NECESITA UN MEDIO DE PAGO PARA CREAR UN MEDIO DE PAGO")
    private MedioPago medioPago;

    private BigDecimal pago;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "envio_id")
    private Envio envio;


    private int agregadoTotal = 0;

    private int agregadoMedio = 0;

}