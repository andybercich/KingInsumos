package org.example.Entities.DTO;

import lombok.Data;
import org.example.Entities.Envio;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EnvioDTO {

    private Long id;
    private String cliente;
    private BigDecimal totalSinEnvio;
    private LocalDateTime fechaPedido;

    private List<DetallePedidoDTO> detalles;
    private List<OpcionesPagoDTO> opcionesPagos;

    private String contacto;
    private String provincia;
    private String localidad;
    private String codigoPostal;
    private String calle;
    private String numero;

    private boolean apartado;
    private String edificio;
    private String departamento;

    private LocalDateTime horaFechaEnvio;

    private String descripcionesEspecificas;

    private BigDecimal precioEnvio;

    public static EnvioDTO fromEntity(Envio envio){

        EnvioDTO dto = new EnvioDTO();

        dto.setId(envio.getId());
        dto.setCliente(envio.getCliente());
        dto.setTotalSinEnvio(envio.getTotalSinEnvio());
        dto.setFechaPedido(envio.getFechaPedido());

        dto.setDetalles(
                envio.getDetalles().stream()
                        .map(DetallePedidoDTO::fromEntity)
                        .toList()
        );

        dto.setOpcionesPagos(
                OpcionesPagoDTO.fromEntities(envio.getOpcionesPagos())
        );

        dto.setContacto(envio.getContacto());
        dto.setProvincia(envio.getProvincia());
        dto.setLocalidad(envio.getLocalidad());
        dto.setCodigoPostal(envio.getCodigoPostal());
        dto.setCalle(envio.getCalle());
        dto.setNumero(envio.getNumero());

        dto.setApartado(envio.isApartado());

        dto.setEdificio(envio.getEdificio());
        dto.setDepartamento(envio.getDepartamento());

        dto.setHoraFechaEnvio(envio.getHoraFechaEnvio());
        dto.setDescripcionesEspecificas(envio.getDescripcionesEspecificas());
        dto.setPrecioEnvio(envio.getPrecioEnvio());

        return dto;
    }

    public static List<EnvioDTO> fromEntitys(List<Envio> envios){
        return envios.stream()
                .map(EnvioDTO::fromEntity)
                .toList();
    }
}