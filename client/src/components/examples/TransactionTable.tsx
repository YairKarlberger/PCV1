import TransactionTable from '../TransactionTable';
import { useState } from 'react';

export default function TransactionTableExample() {
  const createEmptyLineItems = () => Array(18).fill(null).map(() => ({
    date: '',
    toWhomPaid: '',
    purposeDescription: '',
    co: '',
    loc: '',
    epi: '',
    detl: '',
    set: '',
    ff1: '',
    ff4: '',
    netAmount: '',
    pstAmount: '',
    gstAmount: '',
    totalReceipt: ''
  }));

  const [lineItems, setLineItems] = useState(createEmptyLineItems());
  const [vendors, setVendors] = useState(["Office Depot", "Staples", "Amazon", "Local Hardware"]);

  const handleChange = (index: number, field: string, value: string) => {
    setLineItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleAddVendor = (vendorName: string) => {
    setVendors(prev => [...prev, vendorName]);
    console.log('Added vendor:', vendorName);
  };

  const totals = lineItems.reduce((acc, item) => ({
    netAmount: acc.netAmount + (parseFloat(item.netAmount) || 0),
    pstAmount: acc.pstAmount + (parseFloat(item.pstAmount) || 0),
    gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
    totalReceipt: acc.totalReceipt + (parseFloat(item.totalReceipt) || 0),
  }), { netAmount: 0, pstAmount: 0, gstAmount: 0, totalReceipt: 0 });

  return (
    <TransactionTable 
      lineItems={lineItems} 
      vendors={vendors}
      onChange={handleChange} 
      onAddVendor={handleAddVendor}
      totals={totals} 
    />
  );
}
