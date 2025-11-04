package org.example.Services;

import org.example.Entities.DTO.EnvioDTO;
import org.example.Entities.DTO.PaginaEnvioDTO;
import org.example.Entities.DetallePedido;
import org.example.Entities.Envio;
import org.example.Repositories.DetallePedidoRepository;
import org.example.Repositories.EnvioRepository;
import org.example.Repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EnvioService extends BaseService<Envio, Long, EnvioRepository>{


    @Autowired
    private DetallePedidoService detallePedidoService;


    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public boolean deleteByIdSinStock(Long id){
        try {
            Envio envio = repository.findById(id).orElseThrow();

            for (DetallePedido d : detallePedidoRepository.findByPedidoId(envio.getId())) {
                detallePedidoRepository.deleteById(d.getId());
            }

            repository.deleteById(id);
            return true;

        } catch (Exception e) {
            throw new RuntimeException("No se pudo borrar el envio con id " + id + ": " + e.getMessage());
        }
    }

    @Transactional
    public boolean deleteById(Long id) {
        try {
            Envio envio = repository.findById(id).orElseThrow();

            for (DetallePedido d : detallePedidoRepository.findByPedidoId(envio.getId())) {
                detallePedidoService.deleteById(d.getId());
            }

            repository.deleteById(id);
            return true;

        } catch (Exception e) {
            throw new RuntimeException("No se pudo borrar el pedido con id " + id + ": " + e.getMessage());
        }
    }

    @Override
    public Envio save(Envio newEnvio){
        try{

            BigDecimal ganancia = BigDecimal.valueOf(0L);
            List<DetallePedido> detallePedidos = newEnvio.getDetalles();
            for (DetallePedido d : detallePedidos){
                d.setProducto(productoRepository.getReferenceById(d.getProducto().getId()));
                d.setEnvio(newEnvio);
                d.calculateSubTotal();

                if (Objects.equals(d.getProducto().getPrecioCompra(), BigDecimal.valueOf(0L))){
                    ganancia = ganancia.add(d.getSubTotal());
                }else {
                    BigDecimal precioCompra = d.getProducto().getPrecioCompra();
                    BigDecimal cantidad = BigDecimal.valueOf(d.getCantidad());
                    BigDecimal subTotal = d.getSubTotal();

                    ganancia =ganancia.add(subTotal.subtract(cantidad.multiply(precioCompra)));

                }
            }
            newEnvio.setDetalles(detallePedidos);
            newEnvio.setGanancia(ganancia);
            newEnvio.calculateTotal();

            repository.save(newEnvio);

            for (DetallePedido d : detallePedidos){
                detallePedidoService.save(d);
            }


            return newEnvio;
        }catch (Exception e){
            throw new RuntimeException("Error al crear pedido: "+ e.getMessage());
        }

    }

    @Override
    @Transactional
    public Envio update(Long id, Envio envioUpdate) {
        try {
            Envio existingEnvio = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));

            List<DetallePedido> detallesDB = detallePedidoRepository.findByEnvioId(existingEnvio.getId());

            Map<Long, DetallePedido> nuevosDetallesMap = new HashMap<>();
            List<DetallePedido> nuevos = new ArrayList<>();
            for (DetallePedido d : envioUpdate.getDetalles()) {
                if (d.getId() != null) {
                    nuevosDetallesMap.put(d.getId(), d);
                } else {
                    nuevos.add(d);
                }
            }


            for (DetallePedido viejo : detallesDB) {
                if (!nuevosDetallesMap.containsKey(viejo.getId())) {
                    detallePedidoService.deleteById(viejo.getId());
                }
            }


            BigDecimal ganancia = BigDecimal.valueOf(0L);
            for (DetallePedido d : envioUpdate.getDetalles()) {
                d.setEnvio(existingEnvio);
                d.setProducto(productoRepository.getReferenceById(d.getProducto().getId()));
                d.calculateSubTotal();

                if (Objects.equals(d.getProducto().getPrecioCompra(), BigDecimal.valueOf(0L))){
                    ganancia = ganancia.add(d.getSubTotal());
                } else {
                    BigDecimal precioCompra = d.getProducto().getPrecioCompra();
                    BigDecimal cantidad = BigDecimal.valueOf(d.getCantidad());
                    BigDecimal subTotal = d.getSubTotal();

                    ganancia = ganancia.add(subTotal.subtract(cantidad.multiply(precioCompra)));
                }

                if (d.getId() != null && detallePedidoRepository.existsById(d.getId())) {
                    detallePedidoService.update(d.getId(), d);
                } else {
                    detallePedidoService.save(d);
                }
            }

            existingEnvio.setCliente(envioUpdate.getCliente());
            existingEnvio.setMedioPago(envioUpdate.getMedioPago());
            existingEnvio.setNumero(envioUpdate.getNumero());
            existingEnvio.setCalle(envioUpdate.getCalle());
            existingEnvio.setProvincia(envioUpdate.getProvincia());
            existingEnvio.setCodigoPostal(envioUpdate.getCodigoPostal());
            existingEnvio.setDepartamento(envioUpdate.getDepartamento());
            existingEnvio.setAdelanto(envioUpdate.getAdelanto());
            existingEnvio.setContacto(envioUpdate.getContacto());
            existingEnvio.setLocalidad(envioUpdate.getLocalidad());
            existingEnvio.setEdificio(envioUpdate.getEdificio());
            existingEnvio.setPagadoEnEntrega(envioUpdate.isPagadoEnEntrega());
            existingEnvio.setAdelanto(envioUpdate.getAdelanto());
            existingEnvio.setGanancia(ganancia);
            existingEnvio.calculateTotal();

            return repository.saveAndFlush(existingEnvio);

        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el pedido: " + e.getMessage(), e);
        }
    }

    public List<EnvioDTO> getAllDto (){

        try {
            List<Envio> envios = repository.findAll();
            List<EnvioDTO> envioDTOS = envios.stream()
                    .map(EnvioDTO::fromEntity)
                    .toList();
            return envioDTOS;


        }catch (Exception e){
            throw new RuntimeException("Error al obtener todos los envios dto: "+ e.getMessage(), e);
        }

    }

    public EnvioDTO getEnvioDTO(Long id){

        try {
            Envio envio = repository.findById(id).orElse(null);
            EnvioDTO envioDTO = EnvioDTO.fromEntity(envio);
            return envioDTO;
        }catch (Exception e){
            throw new RuntimeException("Error al obtener el pedido dto con id "+ id +": "+ e.getMessage(), e);
        }
    }


    public PaginaEnvioDTO findByFechaEnvioBetween(LocalDateTime desde, LocalDateTime hasta, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Envio> envioPage = repository.findByFechaPedidoBetweenOrderByFechaPedidoDesc(desde, hasta, pageable);

        PaginaEnvioDTO dto = new PaginaEnvioDTO();
        dto.setEnvios(EnvioDTO.fromEntitys(envioPage.getContent()));
        dto.setPaginaActual(envioPage.getNumber());
        dto.setTotalPaginas(envioPage.getTotalPages());
        dto.setTotalElementos(envioPage.getTotalElements());

        return dto;
    }

    public List<Envio> buscarPorClienteOContacto(String param) {
        return repository.buscarPorClienteOContacto(param);

    }



}
