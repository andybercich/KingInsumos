package org.example.Controllers.Specification;

import jakarta.persistence.criteria.Predicate;
import org.example.Entities.Producto;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductoSpecification {

    public static Specification<Producto> buscar(String texto) {
        return (root, query, cb) -> {

            String[] palabras = texto.toLowerCase().trim().split("\\s+");

            List<Predicate> predicates = new ArrayList<>();

            // buscar por codigo
            Predicate codigo = cb.like(
                    cb.lower(root.get("codigo")),
                    "%" + texto.toLowerCase() + "%"
            );

            // buscar por nombre con todas las palabras
            List<Predicate> nombrePredicates = new ArrayList<>();

            for (String palabra : palabras) {
                nombrePredicates.add(
                        cb.like(cb.lower(root.get("nombre")), "%" + palabra + "%")
                );
            }

            Predicate nombre = cb.and(nombrePredicates.toArray(new Predicate[0]));

            return cb.or(codigo, nombre);
        };
    }
}