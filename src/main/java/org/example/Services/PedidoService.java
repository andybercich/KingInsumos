package org.example.Services;

import org.example.Entities.DTO.PaginaPedidoDTO;
import org.example.Entities.DTO.PedidoDTO;
import org.example.Entities.DetallePedido;
import org.example.Entities.OpcionesPago;
import org.example.Entities.Pedido;
import org.example.Entities.Producto;
import org.example.Repositories.DetallePedidoRepository;
import org.example.Repositories.OpcionesPagoRepository;
import org.example.Repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PedidoService extends BaseService<Pedido, Long, org.example.Repositories.PedidoRepository>{

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DetallePedidoService detallePedidoService;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private OpcionesPagoRepository opcionesPagoRepository;

    @Transactional
    public boolean deleteByIdSinStock(Long id){
        try {
            Pedido pedido = repository.findById(id).orElseThrow();

            for (DetallePedido d : detallePedidoRepository.findByPedidoId(pedido.getId())) {
                detallePedidoRepository.deleteById(d.getId());
            }

            for (OpcionesPago p : opcionesPagoRepository.findByPedidoId(pedido.getId())) {
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
            Pedido pedido = repository.findById(id).orElseThrow();

            for (DetallePedido d : detallePedidoRepository.findByPedidoId(pedido.getId())) {
                detallePedidoService.deleteById(d.getId());
            }

            for (OpcionesPago p : opcionesPagoRepository.findByPedidoId(pedido.getId())) {
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
    public Pedido save(Pedido pedido) {

        for (DetallePedido d : pedido.getDetalles()) {

            Producto producto = productoRepository.findById(d.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));



            if (producto.getStock() < d.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - d.getCantidad());
            productoRepository.save(producto);

            d.setPedido(pedido);
            d.setProducto(producto);
            d.calculateSubTotal();
        }

        if (pedido.getOpcionesPagos() == null || pedido.getOpcionesPagos().isEmpty()) {
            throw new RuntimeException("Debe ingresar al menos una opción de pago para el envío");
        }

        System.out.println(pedido.getOpcionesPagos());
        for (OpcionesPago op : pedido.getOpcionesPagos()) {
            op.setPedido(pedido);
        }

        pedido.calculateTotal();
        pedido.setTime();

        return repository.save(pedido);
    }

    @Override
    @Transactional
    public Pedido update(Long id, Pedido nuevoPedido) {

        Pedido pedidoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        for (DetallePedido dViejo : pedidoExistente.getDetalles()) {

            Producto producto = productoRepository.findById(dViejo.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            producto.setStock(producto.getStock() + dViejo.getCantidad());
            productoRepository.save(producto);
        }

        pedidoExistente.getDetalles().clear();
        pedidoExistente.getOpcionesPagos().clear();

        for (DetallePedido d : nuevoPedido.getDetalles()) {

            Producto producto = productoRepository.findById(d.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < d.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - d.getCantidad());
            productoRepository.save(producto);

            d.setPedido(pedidoExistente);
            d.setProducto(producto);
            d.calculateSubTotal();

            pedidoExistente.getDetalles().add(d);

        }

        if (nuevoPedido.getOpcionesPagos() == null || nuevoPedido.getOpcionesPagos().isEmpty()) {
            throw new RuntimeException("Debe ingresar al menos una opción de pago para el pedido");
        }

        System.out.println(nuevoPedido.getOpcionesPagos());

        for (OpcionesPago op : nuevoPedido.getOpcionesPagos()) {

            op.setPedido(pedidoExistente);
            pedidoExistente.getOpcionesPagos().add(op);

        }

        pedidoExistente.setTime();
        pedidoExistente.calculateTotal();
        pedidoExistente.setContacto(nuevoPedido.getContacto());
        pedidoExistente.setCliente(nuevoPedido.getCliente());

        return repository.save(pedidoExistente);
    }

    public List<Pedido> buscarPorClienteOContacto(String param) {
        return repository.buscarPorClienteOContacto(param);
    }

    public PaginaPedidoDTO findByFechaPedidoBetween(LocalDateTime desde, LocalDateTime hasta, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pedido> pedidosPage = repository.findByFechaPedidoBetweenOrderByFechaPedidoDesc(desde, hasta, pageable);

        PaginaPedidoDTO dto = new PaginaPedidoDTO();
        dto.setPedidos(PedidoDTO.fromEntitys(pedidosPage.getContent()));
        dto.setPaginaActual(pedidosPage.getNumber());
        dto.setTotalPaginas(pedidosPage.getTotalPages());
        dto.setTotalElementos(pedidosPage.getTotalElements());

        return dto;
    }

    public List<PedidoDTO> getAllDto (){

        try {
            List<Pedido> pedidos = repository.findAll();
            List<PedidoDTO> pedidoDTOS = pedidos.stream()
                    .map(PedidoDTO::fromEntity)
                    .toList();
            return pedidoDTOS;


        }catch (Exception e){
            throw new RuntimeException("Error al obtener todos los pedidos dto: "+ e.getMessage(), e);
        }

    }

    public PedidoDTO getPedidoDTO(Long id){

        try {
            Pedido pedido = repository.findById(id).orElse(null);
            PedidoDTO pedidoDTO = PedidoDTO.fromEntity(pedido);
            return pedidoDTO;
        }catch (Exception e){
            throw new RuntimeException("Error al obtener el pedido dto con id "+ id +": "+ e.getMessage(), e);
        }
    }


}
