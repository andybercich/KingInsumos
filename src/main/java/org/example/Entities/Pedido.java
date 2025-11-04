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
public class Pedido extends  Base{

    @NotNull(message = "Ingresa un cliente para el pedido")
    @NotBlank(message = "Ingresa un cliente para el pedido")
    protected String cliente;

    private String contacto;

    private BigDecimal adelanto;

    @Enumerated(EnumType.STRING)
    protected MedioPago medioPago;

    protected BigDecimal total;

    @OneToMany(mappedBy = "pedido", orphanRemoval = true)
    protected List<DetallePedido> detalles = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", orphanRemoval = true)
    protected List<OpcionesPago> opcionesPagos = new ArrayList<>();

    private BigDecimal ganancia;

    private boolean pagadoTotalmente = false;

    protected LocalDateTime fechaPedido;

    public void setTime (){
        this.fechaPedido = LocalDateTime.now();
    }

    public void calculateTotal(){
        BigDecimal total = BigDecimal.valueOf(0.0);
        if (detalles.isEmpty() ){

            this.total = total;
        }else {

            total = detalles.stream()
                    .map(detalle -> detalle.getSubTotal())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);



            this.total = total;

        }
    }



}
