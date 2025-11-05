import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface LineItemData {
  date: string;
  toWhomPaid: string;
  purposeDescription: string;
  co: string;
  loc: string;
  epi: string;
  detl: string;
  set: string;
  ff1: string;
  ff4: string;
  netAmount: string;
  pstAmount: string;
  gstAmount: string;
  totalReceipt: string;
}

interface TransactionTableProps {
  lineItems: LineItemData[];
  onChange: (index: number, field: string, value: string) => void;
  totals: {
    netAmount: number;
    pstAmount: number;
    gstAmount: number;
    totalReceipt: number;
  };
}

export default function TransactionTable({ lineItems, onChange, totals }: TransactionTableProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Transaction Line Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-xs font-semibold uppercase tracking-wide text-left p-2 w-8">#</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-left p-2 w-28">Date</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-left p-2 w-40">To Whom Paid</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-left p-2 w-52">Purpose/Description</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-16">CO</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-16">LOC</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-16">EPI</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-20">DETL</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-16">SET</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-16">FF1</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-center p-2 w-16">FF4</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-right p-2 w-28">Net Amount<br/><span className="text-[10px] font-normal text-muted-foreground">*Before GST*</span></th>
                <th className="text-xs font-semibold uppercase tracking-wide text-right p-2 w-24">PST Amount</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-right p-2 w-24">GST Amount</th>
                <th className="text-xs font-semibold uppercase tracking-wide text-right p-2 w-28">Total Receipt</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className={`border-b hover-elevate ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <td className="p-2 text-muted-foreground font-medium">{index + 1}</td>
                  <td className="p-1">
                    <Input
                      type="date"
                      value={item.date}
                      onChange={(e) => onChange(index, 'date', e.target.value)}
                      className="h-8 px-2 text-sm border-0 focus:border"
                      data-testid={`input-date-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.toWhomPaid}
                      onChange={(e) => onChange(index, 'toWhomPaid', e.target.value)}
                      className="h-8 px-2 text-sm border-0 focus:border"
                      placeholder="Vendor name"
                      data-testid={`input-to-whom-paid-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Textarea
                      value={item.purposeDescription}
                      onChange={(e) => onChange(index, 'purposeDescription', e.target.value)}
                      className="min-h-8 h-8 px-2 py-1 text-sm resize-none border-0 focus:border"
                      placeholder="Description"
                      data-testid={`input-purpose-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.co}
                      onChange={(e) => onChange(index, 'co', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-co-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.loc}
                      onChange={(e) => onChange(index, 'loc', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-loc-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.epi}
                      onChange={(e) => onChange(index, 'epi', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-epi-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.detl}
                      onChange={(e) => onChange(index, 'detl', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-detl-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.set}
                      onChange={(e) => onChange(index, 'set', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-set-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.ff1}
                      onChange={(e) => onChange(index, 'ff1', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-ff1-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={item.ff4}
                      onChange={(e) => onChange(index, 'ff4', e.target.value)}
                      className="h-8 px-2 text-sm text-center border-0 focus:border"
                      data-testid={`input-ff4-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.netAmount}
                      onChange={(e) => onChange(index, 'netAmount', e.target.value)}
                      className="h-8 px-2 text-sm text-right border-0 focus:border"
                      placeholder="0.00"
                      data-testid={`input-net-amount-${index}`}
                    />
                  </td>
                  <td className="p-1">
                    <div className="h-8 px-2 flex items-center justify-end text-sm bg-muted/50 rounded text-muted-foreground" data-testid={`text-pst-amount-${index}`}>
                      {item.pstAmount ? `$${parseFloat(item.pstAmount).toFixed(2)}` : '-'}
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="h-8 px-2 flex items-center justify-end text-sm bg-muted/50 rounded text-muted-foreground" data-testid={`text-gst-amount-${index}`}>
                      {item.gstAmount ? `$${parseFloat(item.gstAmount).toFixed(2)}` : '-'}
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="h-8 px-2 flex items-center justify-end text-sm font-semibold bg-muted/50 rounded" data-testid={`text-total-receipt-${index}`}>
                      {item.totalReceipt ? `$${parseFloat(item.totalReceipt).toFixed(2)}` : '-'}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border bg-accent font-bold">
                <td colSpan={11} className="p-2 text-right text-sm uppercase tracking-wide">Totals:</td>
                <td className="p-2 text-right text-sm" data-testid="text-total-net-amount">${totals.netAmount.toFixed(2)}</td>
                <td className="p-2 text-right text-sm" data-testid="text-total-pst-amount">${totals.pstAmount.toFixed(2)}</td>
                <td className="p-2 text-right text-sm" data-testid="text-total-gst-amount">${totals.gstAmount.toFixed(2)}</td>
                <td className="p-2 text-right text-sm" data-testid="text-total-receipt-amount">${totals.totalReceipt.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
