package org.example.Services;

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
import java.util.Comparator;
import java.util.List;


@Service
public class ProductoExcelService {
    public ByteArrayInputStream exportProductosToExcel(List<Producto> productos) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Productos");


            Row headerRow = sheet.createRow(0);
            String[] headers = {"Código", "Nombre", "Stock", "Descripción", "Precio Compra", "Precio Venta", "Denominación Categoría"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            productos.sort(
                    Comparator.comparing((Producto p) -> p.getCategoria().getDenominacion())
                            .thenComparing(Producto::getNombre)
            );

            int rowIdx = 1;
            for (Producto producto : productos) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(producto.getCodigo());
                row.createCell(1).setCellValue(producto.getNombre());
                row.createCell(2).setCellValue(producto.getStock());
                row.createCell(3).setCellValue(producto.getDescripcion());
                row.createCell(4).setCellValue(producto.getPrecioCompra().doubleValue()); // Asumiendo que precioCompra es BigDecimal
                row.createCell(5).setCellValue(producto.getPrecioVenta().doubleValue());  // Asumiendo que precioVenta es BigDecimal
                row.createCell(6).setCellValue(producto.getCategoria().getDenominacion()); // Asumiendo que la categoría tiene la propiedad 'denominacion'
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }
}
