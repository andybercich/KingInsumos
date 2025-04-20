package org.example.Controllers;

import org.example.Services.BalanceExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins = "*")
@Validated
public class BalanceController {

    @Autowired
    private BalanceExcelService balanceExcelService;


    //http://localhost:8080/exportar-informe?desde=2025-04-01T00:00:00&hasta=2025-04-20T23:59:59
    @GetMapping("/exportar-informe")
    public ResponseEntity<byte[]> exportarExcel(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        try {
            ByteArrayInputStream excel = balanceExcelService.exportarInforme(desde, hasta);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=informe_financiero.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excel.readAllBytes());

        }catch (Exception e){
            throw  new RuntimeException(e.getMessage());
        }

    }

}
