package org.example.Services;

import org.apache.poi.ss.usermodel.*;
import org.example.Entities.Enum.MedioPago;
import org.example.Entities.Envio;
import org.example.Entities.Gasto;
import org.example.Entities.OpcionesPago;
import org.example.Entities.Pedido;
import org.example.Repositories.EnvioRepository;
import org.example.Repositories.GastoRepository;
import org.example.Repositories.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
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

            Sheet hoja = workbook.createSheet("Informe");

            AtomicInteger fila = new AtomicInteger(0);

            Map<MedioPago, BigDecimal> totalesMedioPago = new HashMap<>();

            // -------- ESTILOS

            Font tituloFont = workbook.createFont();
            tituloFont.setBold(true);
            tituloFont.setFontHeightInPoints((short) 14);

            CellStyle tituloStyle = workbook.createCellStyle();
            tituloStyle.setFont(tituloFont);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
            dataStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);

            CellStyle moneyStyle = workbook.createCellStyle();
            moneyStyle.cloneStyleFrom(dataStyle);
            DataFormat format = workbook.createDataFormat();
            moneyStyle.setDataFormat(format.getFormat("$#,##0.00"));

            // estilo rojo gastos
            CellStyle gastoRojoStyle = workbook.createCellStyle();
            gastoRojoStyle.cloneStyleFrom(moneyStyle);
            Font rojo = workbook.createFont();
            rojo.setColor(IndexedColors.RED.getIndex());
            gastoRojoStyle.setFont(rojo);

            // estilo verde resultado
            CellStyle resultadoVerdeStyle = workbook.createCellStyle();
            resultadoVerdeStyle.cloneStyleFrom(moneyStyle);
            Font verde = workbook.createFont();
            verde.setColor(IndexedColors.DARK_GREEN.getIndex());
            resultadoVerdeStyle.setFont(verde);

            // ---------------- PEDIDOS

            Row tituloPedidos = hoja.createRow(fila.getAndIncrement());
            Cell tp = tituloPedidos.createCell(0);
            tp.setCellValue("PEDIDOS");
            tp.setCellStyle(tituloStyle);

            Row cabeceraPedido = hoja.createRow(fila.getAndIncrement());
            String[] headersPedidos = {"ID", "Cliente", "Fecha", "Total"};

            for (int i = 0; i < headersPedidos.length; i++) {
                Cell c = cabeceraPedido.createCell(i);
                c.setCellValue(headersPedidos[i]);
                c.setCellStyle(headerStyle);
            }

            for (Pedido p : pedidos) {

                Row row = hoja.createRow(fila.getAndIncrement());

                Cell c0 = row.createCell(0);
                c0.setCellValue(p.getId());
                c0.setCellStyle(dataStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(p.getCliente());
                c1.setCellStyle(dataStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(p.getFechaPedido().toString());
                c2.setCellStyle(dataStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(p.getTotal().doubleValue());
                c3.setCellStyle(moneyStyle);
            }

            fila.addAndGet(3);

            // ---------------- ENVIOS

            Row tituloEnvios = hoja.createRow(fila.getAndIncrement());
            Cell te = tituloEnvios.createCell(0);
            te.setCellValue("ENVIOS");
            te.setCellStyle(tituloStyle);

            Row cabeceraEnvio = hoja.createRow(fila.getAndIncrement());
            String[] headersEnvios = {"ID", "Cliente", "Fecha", "Total sin envío"};

            for (int i = 0; i < headersEnvios.length; i++) {
                Cell c = cabeceraEnvio.createCell(i);
                c.setCellValue(headersEnvios[i]);
                c.setCellStyle(headerStyle);
            }

            for (Envio e : envios) {

                Row row = hoja.createRow(fila.getAndIncrement());

                Cell c0 = row.createCell(0);
                c0.setCellValue(e.getId());
                c0.setCellStyle(dataStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(e.getCliente());
                c1.setCellStyle(dataStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(e.getFechaPedido().toString());
                c2.setCellStyle(dataStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(e.getTotalSinEnvio().doubleValue());
                c3.setCellStyle(moneyStyle);
            }

            fila.addAndGet(3);

            // ---------------- GASTOS

            Row tituloGastos = hoja.createRow(fila.getAndIncrement());
            Cell tg = tituloGastos.createCell(0);
            tg.setCellValue("GASTOS");
            tg.setCellStyle(tituloStyle);

            Row cabeceraGastos = hoja.createRow(fila.getAndIncrement());
            String[] headersGastos = {"Motivo", "Descripción", "Fecha", "Monto"};

            for (int i = 0; i < headersGastos.length; i++) {
                Cell c = cabeceraGastos.createCell(i);
                c.setCellValue(headersGastos[i]);
                c.setCellStyle(headerStyle);
            }

            BigDecimal totalGastos = BigDecimal.ZERO;

            for (Gasto g : gastos) {

                Row row = hoja.createRow(fila.getAndIncrement());

                Cell c0 = row.createCell(0);
                c0.setCellValue(g.getMotivo());
                c0.setCellStyle(dataStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(g.getDescripcion());
                c1.setCellStyle(dataStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(g.getFechaCreacion().toString());
                c2.setCellStyle(dataStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(g.getGasto().doubleValue());
                c3.setCellStyle(moneyStyle);

                totalGastos = totalGastos.add(g.getGasto());
            }

            fila.addAndGet(3);

            // ---------------- RESUMEN PAGOS

            Row tituloPagos = hoja.createRow(fila.getAndIncrement());
            Cell tpago = tituloPagos.createCell(0);
            tpago.setCellValue("PAGOS");
            tpago.setCellStyle(tituloStyle);

            Row cabeceraPagos = hoja.createRow(fila.getAndIncrement());
            String[] headersPagos = {"Pedido/Envio ID", "Tipo", "Info " +
                    "Adicional", "Fecha Pago", "Medio de Pago", "Monto"};

            for (int i = 0; i < headersPagos.length; i++) {
                Cell c = cabeceraPagos.createCell(i);
                c.setCellValue(headersPagos[i]);
                c.setCellStyle(headerStyle);
            }

            class PagoFila {
                Long id;
                String tipo;
                LocalDateTime fecha;
                MedioPago medio;
                BigDecimal monto;
                String info;

                PagoFila(Long id, String tipo, String info, LocalDateTime fecha, MedioPago medio, BigDecimal monto) {
                    this.id = id;
                    this.tipo = tipo;
                    this.fecha = fecha;
                    this.medio = medio;
                    this.monto = monto;
                    this.info = info;
                }
            }

            List<PagoFila> pagos = new ArrayList<>();

            for (Pedido p : pedidos) {
                if (p.getOpcionesPagos() == null) continue;

                for (OpcionesPago op : p.getOpcionesPagos()) {
                    BigDecimal montoFinal = calcularMontoConRecargo(op);

                    pagos.add(new PagoFila(
                            p.getId(),
                            "Pedido",
                            op.getInfo(),
                            op.getFechaPago(),
                            op.getMedioPago(),
                            montoFinal
                    ));
                }
            }

            for (Envio e : envios) {
                if (e.getOpcionesPagos() == null) continue;

                for (OpcionesPago op : e.getOpcionesPagos()) {
                    BigDecimal montoFinal = calcularMontoConRecargo(op);

                    pagos.add(new PagoFila(
                            e.getId(),
                            "Envio",
                            op.getInfo(),
                            op.getFechaPago(),
                            op.getMedioPago(),
                            montoFinal
                    ));
                }
            }

            pagos.sort(Comparator.comparing(p -> p.fecha));

            for (PagoFila pago : pagos) {

                Row row = hoja.createRow(fila.getAndIncrement());

                Cell c0 = row.createCell(0);
                c0.setCellValue(pago.id);
                c0.setCellStyle(dataStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(pago.tipo);
                c1.setCellStyle(dataStyle);

                Cell info = row.createCell(2);
                info.setCellValue(pago.info.toLowerCase());
                info.setCellStyle(dataStyle);

                Cell c2 = row.createCell(3);
                c2.setCellValue(pago.fecha.toString());
                c2.setCellStyle(dataStyle);


                Cell c3 = row.createCell(4);
                c3.setCellValue(pago.medio.toString());
                c3.setCellStyle(dataStyle);



                Cell monto = row.createCell(5);
                monto.setCellValue(pago.monto.doubleValue());
                monto.setCellStyle(moneyStyle);



                if (!pago.fecha.isBefore(desde) && !pago.fecha.isAfter(hasta)) {
                    totalesMedioPago.merge(pago.medio, pago.monto, BigDecimal::add);
                }
            }

            fila.addAndGet(3);

            // ---------------- TOTALES MEDIOS DE PAGO

            Row tituloTotales = hoja.createRow(fila.getAndIncrement());
            Cell tt = tituloTotales.createCell(0);
            tt.setCellValue("Totales por medio de pago");
            tt.setCellStyle(tituloStyle);

            for (Map.Entry<MedioPago, BigDecimal> entry : totalesMedioPago.entrySet()) {

                Row row = hoja.createRow(fila.getAndIncrement());

                row.createCell(0).setCellValue(entry.getKey().toString());

                Cell monto = row.createCell(1);
                monto.setCellValue(entry.getValue().doubleValue());
                monto.setCellStyle(moneyStyle);

                if (entry.getKey() == MedioPago.Efectivo && totalGastos.compareTo(BigDecimal.ZERO) > 0) {

                    Cell gastoCell = row.createCell(2);
                    gastoCell.setCellValue(totalGastos.doubleValue());
                    gastoCell.setCellStyle(gastoRojoStyle);

                    BigDecimal resultado = entry.getValue().subtract(totalGastos);

                    Cell resultadoCell = row.createCell(3);
                    resultadoCell.setCellValue(resultado.doubleValue());
                    resultadoCell.setCellStyle(resultadoVerdeStyle);
                }
            }

            for (int i = 0; i < 6; i++) {
                hoja.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }

    private BigDecimal calcularMontoConRecargo(OpcionesPago op) {

        BigDecimal pago = op.getPago();

        if (op.getAgregadoMedio() <= 0) {
            return pago;
        }

        BigDecimal porcentaje = BigDecimal.valueOf(op.getAgregadoMedio())
                .divide(BigDecimal.valueOf(100));

        BigDecimal recargo = pago.multiply(porcentaje);

        return pago.add(recargo);
    }

}

