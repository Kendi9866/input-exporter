import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DataFormProps {
  columns: string[];
  onAddRow: (data: Record<string, string>) => void;
  onAddColumn: (column: string) => void;
  onRemoveColumn: (column: string) => void;
}

const DataForm = ({ columns, onAddRow, onAddColumn, onRemoveColumn }: DataFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [newColumn, setNewColumn] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some((v) => v.trim())) {
      onAddRow(formData);
      setFormData({});
    }
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
            <Button
              type="button"
              size="sm"
              onClick={handleAddColumn}
              className="h-8"
            >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column} className="space-y-2">
            <Label htmlFor={column} className="text-sm font-medium">
              {column}
            </Label>
            <Input
              id={column}
              value={formData[column] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [column]: e.target.value }))
              }
              placeholder={`Digite ${column.toLowerCase()}`}
              className="transition-shadow focus:shadow-soft"
            />
          </div>
        ))}
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
