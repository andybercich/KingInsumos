package org.example.Services;

import org.example.Entities.Envio;
import org.example.Entities.Gasto;
import org.example.Entities.Pedido;
import org.example.Repositories.EnvioRepository;
import org.example.Repositories.GastoRepository;
import org.example.Repositories.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.Entities.Producto;
import org.springframework.stereotype.Service;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class BalanceExcelService {

    @Autowired
    PedidoRepository pedidoRepository;

    @Autowired
    EnvioRepository envioRepository;

    @Autowired
    GastoRepository gastoRepository;


    public ByteArrayInputStream exportarInforme(LocalDateTime desde, LocalDateTime hasta) {
        List<Pedido> pedidos = pedidoRepository.findByFechaPedidoBetweenOrderByFechaPedidoDesc(desde, hasta);
        List<Envio> envios = envioRepository.findByFechaPedidoBetweenOrderByFechaPedidoDesc(desde, hasta);
        List<Gasto> gastos = gastoRepository.findByFechaCreacionBetweenOrderByFechaCreacionDesc(desde, hasta);

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet hojaPedidos = workbook.createSheet("Pedidos");
            Sheet hojaEnvios = workbook.createSheet("Envios");
            Sheet hojaGastos = workbook.createSheet("Gastos");
            Sheet hojaResumen = workbook.createSheet("Resumen");

            AtomicInteger fila;

            // Pedidos
            fila = new AtomicInteger(0);
            Row cabeceraPedido = hojaPedidos.createRow(fila.getAndIncrement());
            cabeceraPedido.createCell(0).setCellValue("Cliente");
            cabeceraPedido.createCell(1).setCellValue("Fecha");
            cabeceraPedido.createCell(2).setCellValue("Total");
            cabeceraPedido.createCell(3).setCellValue("Ganancia");
            cabeceraPedido.createCell(4).setCellValue("Medio de Pago");

            BigDecimal totalPedidos = BigDecimal.ZERO;
            BigDecimal gananciaPedidos = BigDecimal.ZERO;

            for (Pedido p : pedidos) {
                Row row = hojaPedidos.createRow(fila.getAndIncrement());
                row.createCell(0).setCellValue(p.getCliente());
                row.createCell(1).setCellValue(p.getFechaPedido().toString());
                row.createCell(2).setCellValue(p.getTotal().doubleValue());
                row.createCell(3).setCellValue(p.getGanancia().doubleValue());
                row.createCell(4).setCellValue(p.getMedioPago().toString());

                totalPedidos = totalPedidos.add(p.getTotal());
                gananciaPedidos = gananciaPedidos.add(p.getGanancia());
            }

            // Envios
            fila.set(0);
            Row cabeceraEnvios = hojaEnvios.createRow(fila.getAndIncrement());
            cabeceraEnvios.createCell(0).setCellValue("Cliente");
            cabeceraEnvios.createCell(1).setCellValue("Fecha");
            cabeceraEnvios.createCell(2).setCellValue("Total sin envío");
            cabeceraEnvios.createCell(3).setCellValue("Ganancia");
            cabeceraEnvios.createCell(4).setCellValue("Medio de Pago");

            BigDecimal totalEnvios = BigDecimal.ZERO;
            BigDecimal gananciaEnvios = BigDecimal.ZERO;

            for (Envio e : envios) {
                Row row = hojaEnvios.createRow(fila.getAndIncrement());
                row.createCell(0).setCellValue(e.getCliente());
                row.createCell(1).setCellValue(e.getFechaPedido().toString());
                row.createCell(2).setCellValue(e.getTotalSinEnvio().doubleValue());
                row.createCell(3).setCellValue(e.getGanancia().doubleValue());
                row.createCell(4).setCellValue(e.getMedioPago().toString());

                totalEnvios = totalEnvios.add(e.getTotalSinEnvio());
                gananciaEnvios = gananciaEnvios.add(e.getGanancia());
            }

            // Gastos
            fila.set(0);
            Row cabeceraGastos = hojaGastos.createRow(fila.getAndIncrement());
            cabeceraGastos.createCell(0).setCellValue("Motivo");
            cabeceraGastos.createCell(1).setCellValue("Descripción");
            cabeceraGastos.createCell(2).setCellValue("Monto");

            BigDecimal totalGastos = BigDecimal.ZERO;

            for (Gasto g : gastos) {
                Row row = hojaGastos.createRow(fila.getAndIncrement());
                row.createCell(0).setCellValue(g.getMotivo());
                row.createCell(1).setCellValue(g.getDescripcion());
                row.createCell(2).setCellValue(g.getGasto().doubleValue());

                totalGastos = totalGastos.add(g.getGasto());
            }

            // Resumen
            Row resumen = hojaResumen.createRow(0);
            resumen.createCell(0).setCellValue("Resumen financiero");

            hojaResumen.createRow(2).createCell(0).setCellValue("Total pedidos:");
            hojaResumen.getRow(2).createCell(1).setCellValue(totalPedidos.doubleValue());

            hojaResumen.createRow(3).createCell(0).setCellValue("Ganancia pedidos:");
            hojaResumen.getRow(3).createCell(1).setCellValue(gananciaPedidos.doubleValue());

            hojaResumen.createRow(4).createCell(0).setCellValue("Total envíos:");
            hojaResumen.getRow(4).createCell(1).setCellValue(totalEnvios.doubleValue());

            hojaResumen.createRow(5).createCell(0).setCellValue("Ganancia envíos:");
            hojaResumen.getRow(5).createCell(1).setCellValue(gananciaEnvios.doubleValue());

            hojaResumen.createRow(6).createCell(0).setCellValue("Total gastos:");
            hojaResumen.getRow(6).createCell(1).setCellValue(totalGastos.doubleValue());

            hojaResumen.createRow(8).createCell(0).setCellValue("Ganancia neta:");
            hojaResumen.getRow(8).createCell(1).setCellValue(
                    gananciaPedidos.add(gananciaEnvios).subtract(totalGastos).doubleValue()
            );

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }

}
