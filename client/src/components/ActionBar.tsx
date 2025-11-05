import { Button } from "@/components/ui/button";
import { Save, FileDown, Trash2, FolderOpen } from "lucide-react";

interface ActionBarProps {
  onSave: () => void;
  onExportPDF: () => void;
  onClear: () => void;
  onLoad: () => void;
  hasUnsavedChanges?: boolean;
}

export default function ActionBar({ onSave, onExportPDF, onClear, onLoad, hasUnsavedChanges }: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t bg-card">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onSave} data-testid="button-save">
          <Save className="h-4 w-4 mr-2" />
          Save Envelope
        </Button>
        <Button variant="secondary" onClick={onExportPDF} data-testid="button-export-pdf">
          <FileDown className="h-4 w-4 mr-2" />
          Export to PDF
        </Button>
        <Button variant="outline" onClick={onLoad} data-testid="button-load">
          <FolderOpen className="h-4 w-4 mr-2" />
          Load Previous
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {hasUnsavedChanges && (
          <span className="text-sm text-muted-foreground">Unsaved changes</span>
        )}
        <Button variant="destructive" onClick={onClear} data-testid="button-clear">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Form
        </Button>
      </div>
    </div>
  );
}
