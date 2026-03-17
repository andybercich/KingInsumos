package org.example.Services;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.Entities.*;
import org.example.Entities.DTO.EnvioDTO;
import org.example.Entities.DTO.PaginaEnvioDTO;
import org.example.Repositories.DetallePedidoRepository;
import org.example.Repositories.EnvioRepository;
import org.example.Repositories.OpcionesPagoRepository;
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


    @Autowired
    private OpcionesPagoRepository opcionesPagoRepository;

    @Transactional
    public boolean deleteByIdSinStock(Long id){
        try {
            Envio envio = repository.findById(id).orElseThrow();

            for (DetallePedido d : detallePedidoRepository.findByEnvioId(envio.getId())) {
                detallePedidoRepository.deleteById(d.getId());
            }

            for (OpcionesPago p : opcionesPagoRepository.findByEnvioId(envio.getId())) {
                opcionesPagoRepository.deleteById(p.getId());
            }

            repository.deleteById(id);
            return true;

        } catch (Exception e) {
            throw new RuntimeException("No se pudo borrar el pedido con id " + id + ": " + e.getMessage());
        }
    }

    @Transactional
    public boolean deleteById(Long id) {
        try {
            Envio envio = repository.findById(id).orElseThrow();
            System.out.println("Entrando a deleteById con id: "+ id);
            for (DetallePedido d : detallePedidoRepository.findByEnvioId(envio.getId())) {
                System.out.println("Eliminando envio de id: "+ envio.getId() + " con detalle de id: "+ d.getId());
                detallePedidoService.deleteById(d.getId());
            }

            for (OpcionesPago p : opcionesPagoRepository.findByEnvioId(envio.getId())) {
                opcionesPagoRepository.deleteById(p.getId());
            }
            repository.deleteById(id);
            return true;

        } catch (Exception e) {
            throw new RuntimeException("No se pudo borrar el pedido con id " + id + ": " + e.getMessage());
        }
    }


    @Override
    @Transactional
    public Envio save(Envio envio) {

        for (DetallePedido d : envio.getDetalles()) {

            Producto producto = productoRepository.findById(d.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < d.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - d.getCantidad());
            productoRepository.save(producto);

            d.setEnvio(envio);
            d.setProducto(producto);
            d.calculateSubTotal();
        }
        if (envio.getOpcionesPagos() == null || envio.getOpcionesPagos().isEmpty()) {
            throw new RuntimeException("Debe ingresar al menos una opción de pago para el envío");
        }


        for (OpcionesPago op : envio.getOpcionesPagos()) {
            op.setEnvio(envio);
        }
        envio.setTime();
        envio.calculateTotal();

        return repository.save(envio);
    }

    @Override
    @Transactional
    public Envio update(Long id, Envio nuevoEnvio) {

        Envio envioExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envio no encontrado"));

        for (DetallePedido dViejo : envioExistente.getDetalles()) {

            Producto producto = productoRepository.findById(dViejo.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            producto.setStock(producto.getStock() + dViejo.getCantidad());
            productoRepository.save(producto);
        }

        envioExistente.getDetalles().clear();
        envioExistente.getOpcionesPagos().clear();

        for (DetallePedido d : nuevoEnvio.getDetalles()) {

            Producto producto = productoRepository.findById(d.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < d.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - d.getCantidad());
            productoRepository.save(producto);

            d.setEnvio(envioExistente);
            d.setProducto(producto);
            d.calculateSubTotal();

            envioExistente.getDetalles().add(d);
        }

        if (nuevoEnvio.getOpcionesPagos() == null || nuevoEnvio.getOpcionesPagos().isEmpty()) {
            throw new RuntimeException("Debe ingresar al menos una opción de pago para el envío");
        }

        for (OpcionesPago op : nuevoEnvio.getOpcionesPagos()) {
            op.setEnvio(envioExistente);
            envioExistente.getOpcionesPagos().add(op);
        }

        envioExistente.calculateTotal();
        envioExistente.setTime();
        envioExistente.setCliente(nuevoEnvio.getCliente());
        envioExistente.setLocalidad(nuevoEnvio.getLocalidad());
        envioExistente.setEdificio(nuevoEnvio.getEdificio());
        envioExistente.setDepartamento(nuevoEnvio.getDepartamento());
        envioExistente.setContacto(nuevoEnvio.getContacto());
        envioExistente.setCalle(nuevoEnvio.getCalle());
        envioExistente.setNumero(nuevoEnvio.getNumero());
        envioExistente.setProvincia(nuevoEnvio.getProvincia());
        envioExistente.setCodigoPostal(nuevoEnvio.getCodigoPostal());
        envioExistente.setDescripcionesEspecificas(nuevoEnvio.getDescripcionesEspecificas());
        envioExistente.setPrecioEnvio(nuevoEnvio.getPrecioEnvio());
        envioExistente.setHoraFechaEnvio(nuevoEnvio.getHoraFechaEnvio());

        return repository.save(envioExistente);
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
