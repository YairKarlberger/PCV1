import { useState } from "react";
import UserSelector from "@/components/UserSelector";
import EnvelopeHeader from "@/components/EnvelopeHeader";
import TransactionTable from "@/components/TransactionTable";
import GLSummary from "@/components/GLSummary";
import ActionBar from "@/components/ActionBar";
import InstructionsBanner from "@/components/InstructionsBanner";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function PettyCashEnvelope() {
  const { toast } = useToast();
  
  const [users, setUsers] = useState(["John Doe", "Jane Smith", "Mike Johnson"]);
  const [selectedUser, setSelectedUser] = useState("John Doe");
  const [vendors, setVendors] = useState(["Office Depot", "Staples", "Amazon", "Local Hardware", "Petty Cash"]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0],
    audit: "",
    transNumber: "",
    position: "",
    checkNo: "",
    checkCashReceived: "",
    vendorNumber: "",
    departmentTrackingNumber: "",
    voucherNumber: "",
    pcEnvNumber: "",
  });

  const [appliedAgainstAdvance, setAppliedAgainstAdvance] = useState("");

  const createEmptyLineItems = (): LineItemData[] => 
    Array(18).fill(null).map(() => ({
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

  const [lineItems, setLineItems] = useState<LineItemData[]>(createEmptyLineItems());

  const handleHeaderChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleLineItemChange = (index: number, field: string, value: string) => {
    setLineItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
    setHasUnsavedChanges(true);
  };

  const handleAddVendor = (vendorName: string) => {
    if (!vendors.includes(vendorName)) {
      setVendors(prev => [...prev, vendorName]);
      toast({
        title: "Vendor Added",
        description: `${vendorName} has been added to the vendor list.`,
      });
    }
  };

  const totals = lineItems.reduce((acc, item) => ({
    netAmount: acc.netAmount + (parseFloat(item.netAmount) || 0),
    pstAmount: acc.pstAmount + (parseFloat(item.pstAmount) || 0),
    gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
    totalReceipt: acc.totalReceipt + (parseFloat(item.totalReceipt) || 0),
  }), { netAmount: 0, pstAmount: 0, gstAmount: 0, totalReceipt: 0 });

  const handleSave = () => {
    toast({
      title: "Envelope Saved",
      description: "Your petty cash envelope has been saved successfully.",
    });
    setHasUnsavedChanges(false);
    console.log('Saving envelope:', { formData, lineItems, appliedAgainstAdvance, totals });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting to PDF",
      description: "Your petty cash envelope is being prepared for download.",
    });
    console.log('Exporting to PDF');
  };

  const handleClear = () => {
    setShowClearDialog(true);
  };

  const confirmClear = () => {
    setFormData({
      name: "",
      date: new Date().toISOString().split('T')[0],
      audit: "",
      transNumber: "",
      position: "",
      checkNo: "",
      checkCashReceived: "",
      vendorNumber: "",
      departmentTrackingNumber: "",
      voucherNumber: "",
      pcEnvNumber: "",
    });
    setLineItems(createEmptyLineItems());
    setAppliedAgainstAdvance("");
    setHasUnsavedChanges(false);
    setShowClearDialog(false);
    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  const handleLoad = () => {
    toast({
      title: "Load Envelope",
      description: "Loading previous envelope functionality coming soon.",
    });
    console.log('Loading envelope');
  };

  const handleAddUser = () => {
    setShowAddUserDialog(true);
  };

  const confirmAddUser = () => {
    if (newUserName.trim()) {
      setUsers(prev => [...prev, newUserName.trim()]);
      setSelectedUser(newUserName.trim());
      setNewUserName("");
      setShowAddUserDialog(false);
      toast({
        title: "User Added",
        description: `${newUserName} has been added successfully.`,
      });
    }
  };

  const handleAppliedChange = (value: string) => {
    setAppliedAgainstAdvance(value);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <UserSelector
        users={users}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        onAddUser={handleAddUser}
      />
      
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        <InstructionsBanner />
        
        <EnvelopeHeader formData={formData} onChange={handleHeaderChange} />
        
        <TransactionTable
          lineItems={lineItems}
          vendors={vendors}
          onChange={handleLineItemChange}
          onAddVendor={handleAddVendor}
          totals={totals}
        />
        
        <GLSummary
          appliedAgainstAdvance={appliedAgainstAdvance}
          totalReceipt={totals.totalReceipt}
          onAppliedChange={handleAppliedChange}
        />
      </div>

      <ActionBar
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onClear={handleClear}
        onLoad={handleLoad}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Form?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all fields in the envelope. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClear} data-testid="button-confirm-clear">
              Clear Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the name of the new user to track their petty cash envelopes.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="User name"
            data-testid="input-new-user-name"
            onKeyDown={(e) => e.key === 'Enter' && confirmAddUser()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)} data-testid="button-cancel-add-user">
              Cancel
            </Button>
            <Button onClick={confirmAddUser} data-testid="button-confirm-add-user">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
