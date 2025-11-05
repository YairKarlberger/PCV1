import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function InstructionsBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <strong className="font-semibold">Important Instructions</strong>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2"
              data-testid="button-toggle-instructions"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {isExpanded && (
            <p className="text-sm mt-2 text-muted-foreground">
              ** STAPLE PC ENVELOPE TO NUMBERED RECEIPTS TAPED TO LETTER SIZE PAPER<br />
              SCAN BACKUP PLUS EMAIL SIGNED PDF OF EXCEL FORM TO calmcurrent.ap@hboprod.com (label email CC-DEPT-NAME-INITIALS#)
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
