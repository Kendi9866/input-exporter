import { useState } from "react";
import { Plus, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DataFormProps {
  columns: string[];
  onAddRow: (data: Record<string, string>) => void;
  onAddColumn: (column: string) => void;
  onRemoveColumn: (column: string) => void;
}

// 1. CONFIGURAÇÃO: Colunas que devem ser Dropdowns
const FIELD_OPTIONS: Record<string, string[]> = {
  "Tipo": ["Entrada", "Saída"],
  "Status": ["Pendente", "Pago", "Cancelado"],
  "Forma de pagamento": ["Dinheiro", "Pix", "Cartão de Crédito", "Boleto"],
};

const DataForm = ({ columns, onAddRow, onAddColumn, onRemoveColumn }: DataFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [newColumn, setNewColumn] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Helper para identificar se a coluna é de data (case insensitive)
  const isDateColumn = (colName: string) => {
    return colName.toLowerCase().includes("data");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some((v) => v && v.trim())) {
      onAddRow(formData);
      setFormData({});
    }
  };

  const handleInputChange = (column: string, value: string) => {
    setFormData((prev) => ({ ...prev, [column]: value }));
  };

  const handleAddColumn = () => {
    if (newColumn.trim() && !columns.includes(newColumn.trim())) {
      onAddColumn(newColumn.trim());
      setNewColumn("");
      setShowAddColumn(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Área de Tags das Colunas --- */}
      <div className="flex flex-wrap gap-2 mb-4">
        {columns.map((column) => (
          <div
            key={column}
            className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full text-sm font-medium animate-fade-in"
          >
            <span>{column}</span>
            <button
              type="button"
              onClick={() => onRemoveColumn(column)}
              className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {showAddColumn ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <Input
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              placeholder="Nome da coluna"
              className="h-8 w-40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddColumn();
                }
                if (e.key === "Escape") {
                  setShowAddColumn(false);
                  setNewColumn("");
                }
              }}
            />
            <Button type="button" size="sm" onClick={handleAddColumn} className="h-8">
              Adicionar
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddColumn(true)}
            className="rounded-full h-8"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova coluna
          </Button>
        )}
      </div>

      {/* --- Grid de Inputs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column) => {
          
          // CASO 1: É uma coluna de DATA?
          if (isDateColumn(column)) {
            return (
              <div key={column} className="space-y-2">
                <Label htmlFor={column} className="text-sm font-medium">{column}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData[column] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData[column] ? (
                        formData[column]
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={undefined} // Não controlamos o objeto Date, apenas a string final
                      onSelect={(date) => {
                        if (date) {
                          // Formata para dd/MM/yyyy ao selecionar
                          handleInputChange(column, format(date, "dd/MM/yyyy"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            );
          }

          // CASO 2: É uma coluna de SELECT (Lista)?
          if (FIELD_OPTIONS[column]) {
            return (
              <div key={column} className="space-y-2">
                <Label htmlFor={column} className="text-sm font-medium">{column}</Label>
                <Select
                  value={formData[column] || ""}
                  onValueChange={(val) => handleInputChange(column, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS[column].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // CASO 3: Input de Texto Normal
          return (
            <div key={column} className="space-y-2">
              <Label htmlFor={column} className="text-sm font-medium">
                {column}
              </Label>
              <Input
                id={column}
                value={formData[column] || ""}
                onChange={(e) => handleInputChange(column, e.target.value)}
                placeholder={`Digite ${column.toLowerCase()}`}
                className="transition-shadow focus:shadow-soft"
              />
            </div>
          );
        })}
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={columns.length === 0}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar linha
      </Button>
    </form>
  );
};

export default DataForm;