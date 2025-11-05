import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnvelopeHeaderProps {
  formData: {
    name: string;
    date: string;
    audit: string;
    transNumber: string;
    position: string;
    checkNo: string;
    checkCashReceived: string;
    vendorNumber: string;
    departmentTrackingNumber: string;
    voucherNumber: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function EnvelopeHeader({ formData, onChange }: EnvelopeHeaderProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">Petty Cash Envelope</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Trans #:</label>
            <Input
              value={formData.transNumber}
              onChange={(e) => onChange('transNumber', e.target.value)}
              className="flex-1"
              data-testid="input-trans-number"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Vendor #:</label>
            <Input
              value={formData.vendorNumber}
              onChange={(e) => onChange('vendorNumber', e.target.value)}
              className="flex-1"
              data-testid="input-vendor-number"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Audit:</label>
            <Input
              value={formData.audit}
              onChange={(e) => onChange('audit', e.target.value)}
              className="flex-1"
              data-testid="input-audit"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Voucher #:</label>
            <Input
              value={formData.voucherNumber}
              onChange={(e) => onChange('voucherNumber', e.target.value)}
              className="flex-1"
              data-testid="input-voucher-number"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Name:</label>
            <Input
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="flex-1"
              data-testid="input-name"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Date:</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="flex-1"
              data-testid="input-date"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Position:</label>
            <Input
              value={formData.position}
              onChange={(e) => onChange('position', e.target.value)}
              className="flex-1"
              data-testid="input-position"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium min-w-[80px]">Check No:</label>
            <Input
              value={formData.checkNo}
              onChange={(e) => onChange('checkNo', e.target.value)}
              className="flex-1"
              data-testid="input-check-no"
            />
          </div>

          <div className="flex items-center gap-2 lg:col-span-2">
            <label className="text-sm font-medium min-w-[100px] whitespace-nowrap">Check/Cash:</label>
            <Input
              type="number"
              step="0.01"
              value={formData.checkCashReceived}
              onChange={(e) => onChange('checkCashReceived', e.target.value)}
              className="flex-1"
              placeholder="0.00"
              data-testid="input-check-cash-received"
            />
          </div>

          <div className="flex items-center gap-2 lg:col-span-2">
            <label className="text-sm font-medium min-w-[100px] whitespace-nowrap">Dept Track #:</label>
            <Input
              value={formData.departmentTrackingNumber}
              onChange={(e) => onChange('departmentTrackingNumber', e.target.value)}
              className="flex-1"
              data-testid="input-dept-tracking"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
