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


    @Query("""
    SELECT p FROM Producto p
    WHERE 
        CAST(p.codigo AS string) LIKE CONCAT('%', :param, '%')
        OR (
            LOWER(p.nombre) LIKE LOWER(CONCAT('%', :word1, '%')) 
            AND LOWER(p.nombre) LIKE LOWER(CONCAT('%', :word2, '%'))
        )
""")
    List<Producto> buscarPorCodigoONombreAvanzado(
            @Param("param") String param,
            @Param("word1") String word1,
            @Param("word2") String word2
    );


    List<Producto> findByCategoriaDenominacionContainingIgnoreCase(String denominacion);

    Page<Producto> findByCategoria_DenominacionOrderByNombreAsc(String denominacion, Pageable pageable);

    Page<Producto> findAllByOrderByCategoria_DenominacionAscNombreAsc(Pageable pageable);




}
