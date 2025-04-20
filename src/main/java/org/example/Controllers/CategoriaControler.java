package org.example.Controllers;

import org.example.Entities.Categoria;
import org.example.Repositories.CategoriaRepository;
import org.example.Services.CategoriaService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kinginsumos/categoria")
public class CategoriaControler extends BaseController<Categoria,Long, CategoriaRepository, CategoriaService>{

    public CategoriaControler(CategoriaService service) {
        super(service);
    }
}
