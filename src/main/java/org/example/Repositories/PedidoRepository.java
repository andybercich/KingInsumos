package org.example.Repositories;

import org.example.Entities.Envio;
import org.example.Entities.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoRepository extends BaseRepository<Pedido,Long>{

    Page<Pedido> findByFechaPedidoBetweenOrderByFechaPedidoDesc(LocalDateTime desde, LocalDateTime hasta,
                                                                Pageable pageable);

    List<Pedido> findByFechaPedidoBetweenOrderByFechaPedidoDesc (LocalDateTime desde, LocalDateTime hasta);

    @Query("SELECT p FROM Pedido p WHERE " +
            "LOWER(p.cliente) LIKE LOWER(CONCAT('%', :param, '%')) " +
            "OR LOWER(p.contacto) LIKE LOWER(CONCAT('%', :param, '%'))")
    List<Pedido> buscarPorClienteOContacto(@Param("param") String param);



}
