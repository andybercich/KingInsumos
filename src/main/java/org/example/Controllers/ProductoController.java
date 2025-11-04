package org.example.Controllers;
import org.example.Entities.Categoria;
import org.example.Entities.DTO.PaginaProductoDTO;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;
import org.example.Entities.DTO.ProductoDTOFind;
import org.example.Entities.Producto;
import org.example.Repositories.ProductoRepository;
import org.example.Services.ProductoExcelService;
import org.example.Services.ProductoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kinginsumos/producto")
public class ProductoController extends BaseController<Producto, Long, ProductoRepository, ProductoService>{

    private final ProductoExcelService excelService;

    public ProductoController(ProductoService service, ProductoExcelService excelService) {
        super(service);
        this.excelService = excelService;
    }

    @GetMapping("/export/excel")
    public ResponseEntity<Resource> exportToExcel() throws Exception {
        List<Producto> productos = service.findAll();

        ByteArrayInputStream in = excelService.exportProductosToExcel(productos);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=productos.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping("/find/{codigoNombreParam}")
    public ResponseEntity<List<ProductoDTOFind>> findByCodigoNombre(@PathVariable String codigoNombreParam){

        try {


            List<ProductoDTOFind> productoDTOFind =
                    ProductoDTOFind.fromEntitys(service.findProducto(codigoNombreParam));
            return ResponseEntity.ok(productoDTOFind);

        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }

    }

    // findByPageAll?page=1&size=10
    @GetMapping("/findByPageAll")
    public ResponseEntity<PaginaProductoDTO> getAllPaginas(@RequestParam(name = "page", defaultValue = "0") int nroPagina,
                                                           @RequestParam(name = "size", defaultValue = "10") int largo){
        try {

            PaginaProductoDTO productoDTOFind = service.findAllPages(nroPagina, largo);
            return ResponseEntity.ok(productoDTOFind);

        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }

    }

   // findByPageAll/otros?page=1&size=10
    @GetMapping("/findByPageCategory/{denominacion}")
    public ResponseEntity<PaginaProductoDTO> getAllPaginas(@PathVariable String denominacion,
                                                           @RequestParam(name = "page", defaultValue = "0") int nroPagina,
                                                           @RequestParam(name = "size", defaultValue = "10") int largo){
        try {

            PaginaProductoDTO productoDTOFind = service.findByCategoria(denominacion,nroPagina, largo);
            return ResponseEntity.ok(productoDTOFind);

        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }

    }


    @GetMapping("/findByCategory/{nombreCategoria}")
    public ResponseEntity<List<ProductoDTOFind>> findByCategory(@PathVariable String nombreCategoria){

        try {

            List<ProductoDTOFind> productoDTOFind =
                    ProductoDTOFind.fromEntitys(service.buscarPorNombreCategoria(nombreCategoria));
            return ResponseEntity.ok(productoDTOFind);

        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }

    }

}
