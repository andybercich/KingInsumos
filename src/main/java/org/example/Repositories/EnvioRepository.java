package org.example.Repositories;

import org.example.Entities.Envio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnvioRepository extends BaseRepository<Envio,Long>{

    Page<Envio> findByFechaPedidoBetweenOrderByFechaPedidoDesc(LocalDateTime desde, LocalDateTime hasta,
                                                               Pageable pageable);


    List<Envio> findByFechaPedidoBetweenOrderByFechaPedidoDesc(LocalDateTime desde, LocalDateTime hasta);

    @Query("SELECT e FROM Envio e WHERE " +
            "LOWER(e.cliente) LIKE LOWER(CONCAT('%', :param, '%')) " +
            "OR LOWER(e.contacto) LIKE LOWER(CONCAT('%', :param, '%'))")
    List<Envio> buscarPorClienteOContacto(@Param("param") String param);
}
