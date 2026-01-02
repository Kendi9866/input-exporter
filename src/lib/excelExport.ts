import ExcelJS from 'exceljs';
import { DataRow } from "@/components/DataTable";

export const exportToExcel = async (data: DataRow[], columns: string[], filename: string = "dados") => {
  // 1. Criação do Workbook e Worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Dados");

  // 2. Configuração das Colunas
  // No ExcelJS, definimos as colunas antes. O 'key' deve bater com a propriedade do seu objeto DataRow.
  worksheet.columns = columns.map((col) => ({
    header: col, // O texto que aparece na primeira linha
    key: col,    // A chave do objeto JSON para mapear o dado
    width: Math.max(col.length, 15), // Mantive sua lógica de largura mínima
  }));

  // 3. Inserção dos Dados
  // O ExcelJS mapeia automaticamente as propriedades do objeto baseadas na 'key' definida acima.
  // Não precisamos fazer aquele map manual para 'newRow' que você tinha antes.
  worksheet.addRows(data);

  // bônus: Como você mudou para ExcelJS, vamos deixar o Header em negrito (opcional)
  worksheet.getRow(1).font = { bold: true };

  // 4. Geração do Buffer e Download
  // O ExcelJS gera um buffer array
  const buffer = await workbook.xlsx.writeBuffer();
  
  // Criamos o Blob para o navegador entender que é um arquivo Excel
  const blob = new Blob([buffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });

  // Disparo manual do download
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.xlsx`;
  anchor.click();

  // Limpeza de memória
  window.URL.revokeObjectURL(url);
};