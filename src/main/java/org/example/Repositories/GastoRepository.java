package org.example.Repositories;

import org.example.Entities.Gasto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GastoRepository extends BaseRepository<Gasto,Long>{


    Page<Gasto> findByFechaCreacionBetweenOrderByFechaCreacionDesc(LocalDateTime desde, LocalDateTime hasta,
                                                                Pageable pageable);


    List<Gasto> findByFechaCreacionBetweenOrderByFechaCreacionDesc (LocalDateTime desde, LocalDateTime hasta);



}
