package org.example.Entities;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.example.Entities.Enum.MedioPago;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Entity
@Table(name = "Pedido")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Pedido extends Base {

    @NotNull(message = "Ingresa un cliente para el pedido")
    @NotBlank(message = "Ingresa un cliente para el pedido")
    protected String cliente;

    private String contacto;

    // private BigDecimal adelanto;

    // @Enumerated(EnumType.STRING)
    // protected MedioPago medioPago;
    // Redundante si ahora existen múltiples pagos

    protected BigDecimal total;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    protected List<DetallePedido> detalles = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    protected List<OpcionesPago> opcionesPagos = new ArrayList<>();

    private BigDecimal ganancia;

    protected LocalDateTime fechaPedido;

    public void setTime() {
        this.fechaPedido = LocalDateTime.now();
    }

    public void calculateTotal() {
        BigDecimal total = BigDecimal.ZERO;

        if (!detalles.isEmpty()) {
            total = detalles.stream()
                    .map(DetallePedido::getSubTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        BigDecimal extraTotal = BigDecimal.ZERO;

        if (opcionesPagos != null && !opcionesPagos.isEmpty()) {
            extraTotal = opcionesPagos.stream()
                    .map(op -> {

                        BigDecimal monto = op.getPago() != null
                                ? op.getPago()
                                : BigDecimal.ZERO;

                        int porcentaje = op.getAgregadoMedio() != 0
                                ? op.getAgregadoMedio()
                                : op.getAgregadoTotal();

                        if (porcentaje == 0) return BigDecimal.ZERO;

                        return monto
                                .multiply(BigDecimal.valueOf(porcentaje))
                                .divide(BigDecimal.valueOf(100));
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        this.total = total.add(extraTotal);
    }

}