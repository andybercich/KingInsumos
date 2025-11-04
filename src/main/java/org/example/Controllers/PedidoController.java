package org.example.Controllers;

import jakarta.validation.Valid;
import org.example.Entities.DTO.PaginaPedidoDTO;
import org.example.Entities.DTO.PedidoDTO;
import org.example.Entities.Pedido;
import org.example.Repositories.PedidoRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/kinginsumos/pedido")
public class PedidoController extends BaseController<Pedido, Long, PedidoRepository, org.example.Services.PedidoService>{
    public PedidoController(org.example.Services.PedidoService service) {
        super(service);
    }


    @PostMapping("/create")
    public ResponseEntity<PedidoDTO> creates (@Valid @RequestBody Pedido pedido){

        try {

            Pedido createdEntity = service.save(pedido);
            return ResponseEntity.ok(PedidoDTO.fromEntity(createdEntity));

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
    public ResponseEntity<PedidoDTO> updates (@Valid @RequestBody Pedido pedido, @PathVariable Long id){

        try {

            Pedido updatedEntity = service.update(id, pedido);
            return ResponseEntity.ok(PedidoDTO.fromEntity(updatedEntity));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/dto")
    public ResponseEntity<List<PedidoDTO>> findAllDto() {
        try {
            return ResponseEntity.ok(service.getAllDto());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/dto/{id}")
    public ResponseEntity<PedidoDTO> findDtoById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getPedidoDTO(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PedidoDTO>> buscarPorClienteOContacto(@RequestParam String param) {
        List<Pedido> pedidos = service.buscarPorClienteOContacto(param);
        return ResponseEntity.ok(PedidoDTO.fromEntitys(pedidos));
    }


    //GET localhost:8080/kinginsumos/pedido/findByRangoFechas?desde=2025-04-01T00:00:00&hasta=2025-04-16T23:59:59&page=0&size=10
    @GetMapping("/findByRangoFechas")
    public ResponseEntity<PaginaPedidoDTO> getPedidosPorRango(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(name = "page") int page,
            @RequestParam(name = "size") int size) {

        try {
            PaginaPedidoDTO result = service.findByFechaPedidoBetween(desde, hasta, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
