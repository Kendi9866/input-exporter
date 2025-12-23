import { useState } from "react";
import { Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataForm from "@/components/DataForm";
import DataTable, { DataRow } from "@/components/DataTable";
import { exportToExcel } from "@/lib/excelExport";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [columns, setColumns] = useState<string[]>(["Nome", "Email", "Telefone"]);
  const [data, setData] = useState<DataRow[]>([]);
  const [filename, setFilename] = useState("meus_dados");

  const handleAddColumn = (column: string) => {
    setColumns((prev) => [...prev, column]);
    toast({
      title: "Coluna adicionada",
      description: `A coluna "${column}" foi adicionada com sucesso.`,
    });
  };

  const handleRemoveColumn = (column: string) => {
    setColumns((prev) => prev.filter((c) => c !== column));
    setData((prev) =>
      prev.map((row) => {
        const newRow = { ...row };
        delete newRow[column];
        return newRow;
      })
    );
    toast({
      title: "Coluna removida",
      description: `A coluna "${column}" foi removida.`,
    });
  };

  const handleAddRow = (rowData: Record<string, string>) => {
    const newRow: DataRow = {
      id: crypto.randomUUID(),
      ...rowData,
    };
    setData((prev) => [...prev, newRow]);
    toast({
      title: "Linha adicionada",
      description: "Os dados foram adicionados à tabela.",
    });
  };

  const handleDeleteRow = (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
    toast({
      title: "Linha removida",
      description: "Os dados foram removidos da tabela.",
    });
  };

  const handleClearAll = () => {
    setData([]);
    toast({
      title: "Tabela limpa",
      description: "Todos os dados foram removidos.",
    });
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Adicione alguns dados antes de exportar.",
        variant: "destructive",
      });
      return;
    }
    exportToExcel(data, columns, filename);
    toast({
      title: "Arquivo exportado!",
      description: `O arquivo "${filename}.xlsx" foi baixado com sucesso.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerador de Excel</h1>
              <p className="text-sm text-muted-foreground">
                Crie planilhas personalizadas facilmente
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Form Card */}
          <Card className="shadow-medium animate-fade-in">
            <CardHeader>
              <CardTitle>Adicionar Dados</CardTitle>
              <CardDescription>
                Configure as colunas e adicione os dados que deseja exportar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataForm
                columns={columns}
                onAddRow={handleAddRow}
                onAddColumn={handleAddColumn}
                onRemoveColumn={handleRemoveColumn}
              />
            </CardContent>
          </Card>

          {/* Data Preview Card */}
          <Card className="shadow-medium animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Visualização dos Dados</CardTitle>
                  <CardDescription>
                    {data.length} {data.length === 1 ? "linha" : "linhas"} adicionadas
                  </CardDescription>
                </div>
                {data.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar tudo
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data}
                onDeleteRow={handleDeleteRow}
              />
            </CardContent>
          </Card>

          {/* Export Card */}
          <Card className="shadow-medium animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Exportar</CardTitle>
              <CardDescription>
                Configure o nome do arquivo e baixe sua planilha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Input
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      placeholder="Nome do arquivo"
                      className="flex-1"
                    />
                    <span className="text-muted-foreground text-sm">.xlsx</span>
                  </div>
                </div>
                <Button onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Baixar Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
