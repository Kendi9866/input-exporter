import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataRow {
  id: string;
  [key: string]: string;
}

interface DataTableProps {
  columns: string[];
  data: DataRow[];
  onDeleteRow: (id: string) => void;
}

const DataTable = ({ columns, data, onDeleteRow }: DataTableProps) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Nenhum dado adicionado</p>
          <p className="text-sm">Adicione dados usando o formulário acima</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            {columns.map((column) => (
              <TableHead
                key={column}
                className="font-semibold text-foreground"
              >
                {column}
              </TableHead>
            ))}
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id}
              className="animate-fade-in transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {columns.map((column) => (
                <TableCell key={column} className="font-medium">
                  {row[column] || "-"}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRow(row.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
