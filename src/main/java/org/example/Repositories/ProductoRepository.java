package org.example.Repositories;

import org.example.Entities.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends BaseRepository<Producto, Long>{


    @Query("SELECT p FROM Producto p WHERE CAST(p.codigo AS string) LIKE %:param% OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :param, '%'))")
    List<Producto> buscarPorCodigoONombre(@Param("param") String param);

    List<Producto> findByCategoriaDenominacionContainingIgnoreCase(String denominacion);

    Page<Producto> findByCategoria_DenominacionOrderByNombreAsc(String denominacion, Pageable pageable);

    Page<Producto> findAllByOrderByCategoria_DenominacionAscNombreAsc(Pageable pageable);




}
