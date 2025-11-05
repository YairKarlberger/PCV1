import EnvelopeHeader from '../EnvelopeHeader';
import { useState } from 'react';

export default function EnvelopeHeaderExample() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    date: "2025-01-15",
    audit: "",
    transNumber: "001",
    position: "Manager",
    checkNo: "1234",
    checkCashReceived: "500.00",
    vendorNumber: "",
    departmentTrackingNumber: "DEPT-2025-001",
    voucherNumber: "",
    pcEnvNumber: "PC-2025-001"
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return <EnvelopeHeader formData={formData} onChange={handleChange} />;
}
