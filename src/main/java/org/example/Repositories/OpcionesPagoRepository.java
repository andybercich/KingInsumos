package org.example.Repositories;

import org.example.Entities.OpcionesPago;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpcionesPagoRepository extends BaseRepository<OpcionesPago,Long> {

    List<OpcionesPago> findByPedidoId(Long pedidoId);

    List<OpcionesPago> findByEnvioId(Long envioId);
}
