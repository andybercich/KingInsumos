package org.example.Repositories;

import org.example.Entities.Base;
import org.example.Entities.Categoria;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends BaseRepository<Categoria, Long> {
}
