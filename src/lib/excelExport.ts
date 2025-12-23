import * as XLSX from "xlsx";
import { DataRow } from "@/components/DataTable";

export const exportToExcel = (data: DataRow[], columns: string[], filename: string = "dados") => {
  // Prepare data for export (remove id column)
  const exportData = data.map((row) => {
    const newRow: Record<string, string> = {};
    columns.forEach((col) => {
      newRow[col] = row[col] || "";
    });
    return newRow;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData, { header: columns });

  // Set column widths
  const columnWidths = columns.map((col) => ({
    wch: Math.max(col.length, 15),
  }));
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  // Generate and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
