import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserSelectorProps {
  users: string[];
  selectedUser: string;
  onUserChange: (user: string) => void;
  onAddUser: () => void;
}

export default function UserSelector({ users, selectedUser, onUserChange, onAddUser }: UserSelectorProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b bg-card">
      <div className="flex items-center gap-2 flex-1">
        <label className="text-sm font-medium whitespace-nowrap">Current User:</label>
        <Select value={selectedUser} onValueChange={onUserChange}>
          <SelectTrigger className="w-[240px]" data-testid="select-user">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user} value={user} data-testid={`option-user-${user}`}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" size="sm" onClick={onAddUser} data-testid="button-add-user">
        <UserPlus className="h-4 w-4 mr-2" />
        Add User
      </Button>
    </div>
  );
}
