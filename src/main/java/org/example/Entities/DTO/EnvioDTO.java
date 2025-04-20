package org.example.Entities.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.Entities.Envio;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class EnvioDTO {

    private Long id;
    private String cliente;
    private BigDecimal total;
    private LocalDateTime fechaPedido;
    private String medioPago;
    private List<DetallePedidoDTO> detalles;

    private String contacto;

    private String provincia;

    private String localidad;

    private String codigoPostal;

    private String calle;

    private String numero;

    private boolean apartado = false;

    private BigDecimal adelanto = BigDecimal.valueOf(0);

    private String edificio;

    private String departamento;

    private boolean pagadoEnEntrega;

    private LocalDateTime horaFechaEnvio;

    private String descripcionesEspecificas;


    @NotNull(message = "Ingresa un precio para el envio")
    private BigDecimal precioEnvio;


    public static EnvioDTO fromEntity(Envio pedido) {
        EnvioDTO dto = new EnvioDTO();
        dto.setId(pedido.getId());
        dto.setCliente(pedido.getCliente());
        dto.setTotal(pedido.getTotalSinEnvio());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setMedioPago(pedido.getMedioPago().toString());

        dto.setDetalles(pedido.getDetalles().stream()
                .map(DetallePedidoDTO::fromEntity)
                .toList());

        dto.setContacto(pedido.getContacto());
        dto.setProvincia(pedido.getProvincia());
        dto.setLocalidad(pedido.getLocalidad());
        dto.setCodigoPostal(pedido.getCodigoPostal());
        dto.setCalle(pedido.getCalle());
        dto.setNumero(pedido.getNumero());
        if (pedido.isApartado() && pedido.getAdelanto() != null){
            dto.setApartado(true);
            dto.setAdelanto(pedido.getAdelanto());
        }
        dto.setEdificio(pedido.getEdificio());
        dto.setDepartamento(pedido.getDepartamento());
        dto.setPagadoEnEntrega(pedido.isPagadoEnEntrega());
        dto.setHoraFechaEnvio(pedido.getHoraFechaEnvio());
        dto.setDescripcionesEspecificas(pedido.getDescripcionesEspecificas());
        dto.setPrecioEnvio(pedido.getPrecioEnvio());

        return dto;
    }

    public static List<EnvioDTO> fromEntitys(List<Envio> envios){
        List<EnvioDTO> envioDTOS = new ArrayList<>();
        for (Envio e : envios){
            envioDTOS.add(EnvioDTO.fromEntity(e));
        }
        return envioDTOS;

    }

}
