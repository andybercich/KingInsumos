package org.example.Services;


import org.example.Controllers.Specification.ProductoSpecification;
import org.example.Entities.DTO.PaginaProductoDTO;
import org.example.Entities.DTO.ProductoDTO;
import org.example.Entities.Enum.Orden;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.example.Entities.Producto;
import org.example.Repositories.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService extends BaseService<Producto,Long, ProductoRepository > {



    public List<Producto> buscarProductos(String texto) {
        return repository.findAll(ProductoSpecification.buscar(texto));
    }




    public List<Producto> buscarPorNombreCategoria(String nombre) {

        try{

            return repository.findByCategoriaDenominacionContainingIgnoreCase(nombre);

        }catch (Exception e){
            throw new RuntimeException("No se pudo realizar la busqueda del objeto con la categoria "+nombre+ e.getMessage());
        }
    }

    public PaginaProductoDTO findByCategoria(String categoria, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> pagina =  repository.findByCategoria_DenominacionOrderByNombreAsc(categoria, pageable);
        PaginaProductoDTO paginaDto = new PaginaProductoDTO();
        paginaDto.setProductos(ProductoDTO.fromEntitys(pagina.getContent(), Orden.Nombre));
        paginaDto.setPaginaActual(pagina.getNumber());
        paginaDto.setTotalPaginas(pagina.getTotalPages());
        paginaDto.setTotalElementos(pagina.getTotalElements());
        return paginaDto;

    }

    public PaginaProductoDTO findAllPages(int page, int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> pagina =  repository.findAllByOrderByCategoria_DenominacionAscNombreAsc( pageable);
        PaginaProductoDTO paginaDto = new PaginaProductoDTO();
        paginaDto.setProductos(ProductoDTO.fromEntitys(pagina.getContent(), Orden.Nombre));
        paginaDto.setPaginaActual(pagina.getNumber());
        paginaDto.setTotalPaginas(pagina.getTotalPages());
        paginaDto.setTotalElementos(pagina.getTotalElements());
        return paginaDto;
    }


    public boolean deleteById(Long id){
        try {

            repository.deleteById(id);
            return true;
        }catch (Exception e){
            throw new RuntimeException("No se pudo eliminar el producto con id "+ id+": "+ e.getMessage());
        }
    }

}
