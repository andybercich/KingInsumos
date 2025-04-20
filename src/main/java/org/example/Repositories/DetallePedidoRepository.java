package org.example.Repositories;

import org.example.Entities.DetallePedido;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends BaseRepository<DetallePedido,Long>{
    List<DetallePedido> findByPedidoId(Long pedidoId);
    List<DetallePedido> findByEnvioId(Long envioId);

}
