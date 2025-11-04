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
public class Envio extends Base{

    @NotNull(message = "Ingresa un cliente para el pedido")
    @NotBlank(message = "Ingresa un cliente para el pedido")
    protected String cliente;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Ingresa un medio de pago del pedido")
    @Column(length = 30)
    protected MedioPago medioPago;

    protected BigDecimal totalSinEnvio;

    @OneToMany(mappedBy = "envio", orphanRemoval = true)
    protected List<DetallePedido> detalles = new ArrayList<>();

    protected LocalDateTime fechaPedido;

    private String contacto;

    private String provincia;

    private String localidad;

    private String codigoPostal;

    private boolean apartado = false;

    private BigDecimal adelanto = null;

    private String calle;

    private String numero;

    private String edificio;

    private String departamento;

    private boolean pagadoEnEntrega;

    private LocalDateTime horaFechaEnvio;

    private BigDecimal ganancia;

    @Column(length =300)
    private String descripcionesEspecificas;

    @NotNull(message = "Ingresa un precio para el envio")
    private BigDecimal precioEnvio;

    public void setTime (){
        fechaPedido = LocalDateTime.now();
    }

    public void calculateTotal(){
        BigDecimal total = BigDecimal.valueOf(0.0);
        if (detalles.isEmpty() ){
            this.totalSinEnvio = total;
        }else {
            total = detalles.stream()
                    .map(detalle -> detalle.getSubTotal())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            this.totalSinEnvio = total;
        }

    }

}
