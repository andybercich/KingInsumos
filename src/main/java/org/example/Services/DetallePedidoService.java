package org.example.Services;

import org.example.Entities.DTO.DetallePedidoDTO;
import org.example.Entities.DetallePedido;
import org.example.Entities.Producto;
import org.example.Repositories.DetallePedidoRepository;
import org.example.Repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class DetallePedidoService extends BaseService<DetallePedido, Long, DetallePedidoRepository>{

    @Autowired
    private ProductoRepository productoRepository;

    public boolean deleteById(Long id){
        try {
            DetallePedido detalle = repository.findById(id).orElseThrow();

            Producto producto = productoRepository.findById(detalle.getProducto().getId()).orElseThrow();
            producto.setStock(producto.getStock()+detalle.getCantidad());
            productoRepository.saveAndFlush(producto);

            repository.deleteById(id);
            return true;
        }catch (Exception e){
            throw new RuntimeException("No se pudo eliminar el detalle con id "+ id+": "+ e.getMessage());
        }

    }

    public DetallePedido save (DetallePedido nuevoDetalle){

        try{
            Producto p = productoRepository.findById(nuevoDetalle.getProducto().getId()).orElseThrow();

            if (p.getStock() < nuevoDetalle.getCantidad()){

                throw new Error("El stock del producto "+ p.getNombre()+ " es menor al requerido en el detalle "+ nuevoDetalle.getId());

            }else {

                p.setStock(p.getStock()-nuevoDetalle.getCantidad());
                productoRepository.saveAndFlush(p);

                return repository.save(nuevoDetalle);

            }




        }catch (RuntimeException e){
            throw new RuntimeException("No se pudo guardar el detalle pedido correctamente: "+ e.getMessage());
        }



    }

    public DetallePedido update (Long id, DetallePedido nuevoDetalle){

        try{
            DetallePedido viejoDetalle = repository.findById(id).orElseThrow();
            Producto p = productoRepository.findById(nuevoDetalle.getProducto().getId()).orElseThrow();

            if (!Objects.equals(p.getId(), viejoDetalle.getProducto().getId())){
                Producto productoViejo = productoRepository.findById(viejoDetalle.getProducto().getId()).orElseThrow();

                productoViejo.setStock(productoViejo.getStock()+viejoDetalle.getCantidad());

                if (p.getStock() < nuevoDetalle.getCantidad()){
                    throw new Error("El stock del producto "+ p.getNombre()+ " es menor al requerido en el detalle "+ nuevoDetalle.getId());
                }else{

                    p.setStock(p.getStock()-nuevoDetalle.getCantidad());
                    productoRepository.saveAndFlush(p);

                    return repository.saveAndFlush(nuevoDetalle);

                }

            } else {


                if ((p.getStock() + viejoDetalle.getCantidad()) < nuevoDetalle.getCantidad()){
                    throw new Error("El stock del producto "+ p.getNombre()+ " es menor al requerido en el detalle "+ nuevoDetalle.getId());
                }else{
                    p.setStock(p.getStock()+viejoDetalle.getCantidad()-nuevoDetalle.getCantidad());

                    productoRepository.saveAndFlush(p);

                    return repository.saveAndFlush(nuevoDetalle);
                }

            }




        }catch (RuntimeException e){
            throw new RuntimeException("No se pudo editar el detalle pedido correctamente: "+ e.getMessage());
        }

    }

}
