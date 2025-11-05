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

  const handleChange = (index: number, field: string, value: string) => {
    setLineItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'netAmount') {
        const netAmount = parseFloat(value) || 0;
        const pstAmount = netAmount * 0.07;
        const gstAmount = netAmount * 0.05;
        const totalReceipt = netAmount + pstAmount + gstAmount;
        
        newItems[index].pstAmount = pstAmount.toFixed(2);
        newItems[index].gstAmount = gstAmount.toFixed(2);
        newItems[index].totalReceipt = totalReceipt.toFixed(2);
      }
      
      return newItems;
    });
  };

  const totals = lineItems.reduce((acc, item) => ({
    netAmount: acc.netAmount + (parseFloat(item.netAmount) || 0),
    pstAmount: acc.pstAmount + (parseFloat(item.pstAmount) || 0),
    gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
    totalReceipt: acc.totalReceipt + (parseFloat(item.totalReceipt) || 0),
  }), { netAmount: 0, pstAmount: 0, gstAmount: 0, totalReceipt: 0 });

  return <TransactionTable lineItems={lineItems} onChange={handleChange} totals={totals} />;
}
