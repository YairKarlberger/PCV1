import GLSummary from '../GLSummary';
import { useState } from 'react';

export default function GLSummaryExample() {
  const [appliedAgainstAdvance, setAppliedAgainstAdvance] = useState("100.00");
  const totalReceipt = 500.00;

  return (
    <GLSummary
      appliedAgainstAdvance={appliedAgainstAdvance}
      totalReceipt={totalReceipt}
      onAppliedChange={setAppliedAgainstAdvance}
    />
  );
}
