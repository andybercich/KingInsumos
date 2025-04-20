package org.example.Controllers;

import jakarta.validation.Valid;
import org.example.Entities.DTO.EnvioDTO;
import org.example.Entities.DTO.PaginaEnvioDTO;
import org.example.Entities.DTO.PaginaPedidoDTO;
import org.example.Entities.DTO.PedidoDTO;
import org.example.Entities.Envio;
import org.example.Entities.Pedido;
import org.example.Repositories.EnvioRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/kinginsumos/envio")
public class EnvioController extends BaseController<Envio,Long, EnvioRepository, org.example.Services.EnvioService>{
    public EnvioController(org.example.Services.EnvioService service) {
        super(service);
    }




    @PostMapping("/create")
    public ResponseEntity<EnvioDTO> creates (@Valid @RequestBody Envio envio){

        try {

            Envio createdEntity = service.save(envio);
            return ResponseEntity.ok(EnvioDTO.fromEntity(createdEntity));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}/noStock")
    public ResponseEntity<Void> deleteNoStock(@PathVariable Long id) {
        try {
            boolean deleted = service.deleteByIdSinStock(id);
            if (!deleted) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<EnvioDTO> updates (@Valid @RequestBody Envio envio, @PathVariable Long id){

        try {

            Envio updatedEntity = service.update(id, envio);
            return ResponseEntity.ok(EnvioDTO.fromEntity(updatedEntity));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    @GetMapping("/dto")
    public ResponseEntity<List<EnvioDTO>> findAllDto() {
        try {
            return ResponseEntity.ok(service.getAllDto());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/dto/{id}")
    public ResponseEntity<EnvioDTO> findDtoById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getEnvioDTO(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    //GET localhost:8080/kinginsumos/envio/findByRangoFechas?desde=2025-04-01T00:00:00&hasta=2025-04-16T23:59:59&page=0
    // &size=10
    @GetMapping("/findByRangoFechas")
    public ResponseEntity<PaginaEnvioDTO> getEnviosByRango(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        try {
            PaginaEnvioDTO result = service.findByFechaEnvioBetween(desde, hasta, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


}
