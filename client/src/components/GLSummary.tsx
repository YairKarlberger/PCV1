import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GLSummaryProps {
  appliedAgainstAdvance: string;
  totalReceipt: number;
  onAppliedChange: (value: string) => void;
}

export default function GLSummary({ appliedAgainstAdvance, totalReceipt, onAppliedChange }: GLSummaryProps) {
  const toBeReimbursed = totalReceipt - (parseFloat(appliedAgainstAdvance) || 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">G.L. Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide">Applied Against Advance</label>
            <Input
              type="number"
              step="0.01"
              value={appliedAgainstAdvance}
              onChange={(e) => onAppliedChange(e.target.value)}
              className="text-lg h-12 text-right"
              placeholder="0.00"
              data-testid="input-applied-against-advance"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide">To Be Reimbursed</label>
            <div className="text-2xl font-bold h-12 px-4 flex items-center justify-end bg-primary/10 rounded-md border-2 border-primary" data-testid="text-to-be-reimbursed">
              ${toBeReimbursed.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
