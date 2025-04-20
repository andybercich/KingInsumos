package org.example.Controllers;

import org.example.Entities.Gasto;
import org.example.Repositories.GastoRepository;
import org.example.Services.GastoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kinginsumos/gasto")
public class GastoController extends BaseController<Gasto,Long, GastoRepository, GastoService>{
    public GastoController(GastoService service) {
        super(service);
    }
}
