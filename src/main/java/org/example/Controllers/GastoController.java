package org.example.Controllers;

import org.example.Entities.DTO.PaginaGastoDTO;
import org.example.Entities.Gasto;
import org.example.Repositories.GastoRepository;
import org.example.Services.GastoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/kinginsumos/gasto")
public class GastoController extends BaseController<Gasto,Long, GastoRepository, GastoService>{
    public GastoController(GastoService service) {
        super(service);
    }

    @GetMapping("/findByRangoFechas")
    public ResponseEntity<PaginaGastoDTO> findById(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(name = "page") int page,
            @RequestParam(name = "size") int size) {
        try{
            PaginaGastoDTO paginaGastoDTO = service.findByFechaPedidoBetween(desde,hasta,page,size);
            return ResponseEntity.ok(paginaGastoDTO);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }
}
