package org.example.Entities;


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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "Envio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Envio extends Base {

    @NotNull(message = "Ingresa un cliente para el pedido")
    @NotBlank(message = "Ingresa un cliente para el pedido")
    protected String cliente;

    // @Enumerated(EnumType.STRING)
    // @NotNull(message = "Ingresa un medio de pago del pedido")
    // protected MedioPago medioPago;

    protected BigDecimal totalSinEnvio;

    @OneToMany(mappedBy = "envio", cascade = CascadeType.ALL, orphanRemoval = true)
    protected List<DetallePedido> detalles = new ArrayList<>();

    @OneToMany(mappedBy = "envio", cascade = CascadeType.ALL, orphanRemoval = true)
    protected List<OpcionesPago> opcionesPagos = new ArrayList<>();

    protected LocalDateTime fechaPedido;

    private String contacto;

    private String provincia;
    private String localidad;
    private String codigoPostal;

    private boolean apartado = false;

    // private BigDecimal adelanto;
    // Redundante con múltiples pagos

    private String calle;
    private String numero;
    private String edificio;
    private String departamento;

    private LocalDateTime horaFechaEnvio;

    private BigDecimal ganancia;

    @Column(length = 300)
    private String descripcionesEspecificas;

    @NotNull(message = "Ingresa un precio para el envio")
    private BigDecimal precioEnvio;

    public void setTime() {
        fechaPedido = LocalDateTime.now();
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

        this.totalSinEnvio = total.add(extraTotal);
    }

}