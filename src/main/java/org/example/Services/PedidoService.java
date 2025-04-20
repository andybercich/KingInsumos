package org.example.Services;

import org.example.Entities.DTO.PaginaPedidoDTO;
import org.example.Entities.DTO.PedidoDTO;
import org.example.Entities.DetallePedido;
import org.example.Entities.Pedido;
import org.example.Entities.Producto;
import org.example.Repositories.DetallePedidoRepository;
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
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PedidoService extends BaseService<Pedido, Long, org.example.Repositories.PedidoRepository>{

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DetallePedidoService detallePedidoService;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    public boolean deleteByIdSinStock(Long id){
        try {
            Pedido pedido = repository.findById(id).orElseThrow();

            for (DetallePedido d : detallePedidoRepository.findByPedidoId(pedido.getId())) {
                detallePedidoRepository.deleteById(d.getId());
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

            repository.deleteById(id);
            return true;

        } catch (Exception e) {
            throw new RuntimeException("No se pudo borrar el pedido con id " + id + ": " + e.getMessage());
        }
    }

    @Override
    public Pedido save(Pedido newPedido){
        try{
            BigDecimal ganancia = BigDecimal.valueOf(0L);
            List<DetallePedido> detallePedidos = newPedido.getDetalles();
            for (DetallePedido d : detallePedidos){
                d.setProducto(productoRepository.getReferenceById(d.getProducto().getId()));
                d.setPedido(newPedido);
                d.calculateSubTotal();
                if (Objects.equals(d.getProducto().getPrecioCompra(), BigDecimal.valueOf(0L))){
                    ganancia =ganancia.add(d.getSubTotal());
                }else {
                    BigDecimal precioCompra = d.getProducto().getPrecioCompra();
                    BigDecimal cantidad = BigDecimal.valueOf(d.getCantidad());
                    BigDecimal subTotal = d.getSubTotal();

                    ganancia =ganancia.add(subTotal.subtract(cantidad.multiply(precioCompra)));

                }
            }
            newPedido.setDetalles(detallePedidos);
            newPedido.calculateTotal();
            newPedido.setGanancia(ganancia);
            newPedido.setTime();
            repository.save(newPedido);

            for (DetallePedido d : detallePedidos){
                detallePedidoService.save(d);
            }


            return newPedido;
        }catch (Exception e){
            throw new RuntimeException("Error al crear pedido: "+ e.getMessage());
        }



    }

    @Override
    @Transactional
    public Pedido update(Long id, Pedido updatePedido) {
        try {
            Pedido existingPedido = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));

            List<DetallePedido> detallesDB = detallePedidoRepository.findByPedidoId(existingPedido.getId());

            Map<Long, DetallePedido> nuevosDetallesMap = new HashMap<>();
            List<DetallePedido> nuevos = new ArrayList<>();
            for (DetallePedido d : updatePedido.getDetalles()) {
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

            for (DetallePedido d : updatePedido.getDetalles()) {
                d.setPedido(existingPedido);
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

            existingPedido.setCliente(updatePedido.getCliente());
            existingPedido.setMedioPago(updatePedido.getMedioPago());
            existingPedido.setGanancia(ganancia);
            existingPedido.setTime();
            existingPedido.calculateTotal();

            return repository.saveAndFlush(existingPedido);

        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el pedido: " + e.getMessage(), e);
        }
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
