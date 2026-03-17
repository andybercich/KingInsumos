package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.OpcionesPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OpcionesPagoDTO {

    private Long id;
    private String medioPago;
    private BigDecimal monto;
    private LocalDateTime fechaPago;
    private String info;
    private int agregadoTotal;
    private int agregadoMedio;

    public static OpcionesPagoDTO fromEntity(OpcionesPago op){
        OpcionesPagoDTO dto = new OpcionesPagoDTO();

        dto.setId(op.getId());
        dto.setMedioPago(op.getMedioPago().toString());
        dto.setMonto(op.getPago());
        dto.setFechaPago(op.getFechaPago());
        dto.setAgregadoMedio(op.getAgregadoMedio());
        dto.setAgregadoTotal(op.getAgregadoTotal());
        dto.setInfo(op.getInfo());

        return dto;
    }

    public static List<OpcionesPagoDTO> fromEntities(List<OpcionesPago> pagos){
        return pagos.stream()
                .map(OpcionesPagoDTO::fromEntity)
                .toList();
    }
}
