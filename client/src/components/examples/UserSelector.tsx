import UserSelector from '../UserSelector';
import { useState } from 'react';

export default function UserSelectorExample() {
  const [selectedUser, setSelectedUser] = useState("John Doe");
  const users = ["John Doe", "Jane Smith", "Mike Johnson"];

  return (
    <UserSelector 
      users={users}
      selectedUser={selectedUser}
      onUserChange={setSelectedUser}
      onAddUser={() => console.log('Add user triggered')}
    />
  );
}
