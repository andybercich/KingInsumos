package org.example.Repositories;

import org.example.Entities.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoRepository extends BaseRepository<Pedido,Long>{

    Page<Pedido> findByFechaPedidoBetweenOrderByFechaPedidoDesc(LocalDateTime desde, LocalDateTime hasta,
                                                                Pageable pageable);

    List<Pedido> findByFechaPedidoBetweenOrderByFechaPedidoDesc (LocalDateTime desde, LocalDateTime hasta);





}
