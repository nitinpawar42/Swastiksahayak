"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function ResellerApprovalTable() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const fetchPendingUsers = async () => {
    const q = query(collection(db, "users"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    const pendingUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    setUsers(pendingUsers);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApproval = async (userId: string, newStatus: 'approved' | 'rejected') => {
    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, { status: newStatus });
      toast({
        title: `User ${newStatus}`,
        description: `The reseller has been ${newStatus}.`,
      });
      fetchPendingUsers(); // Refresh the list
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update the reseller status.",
        variant: "destructive",
      });
    }
  };

  if (users.length === 0) {
    return <p>No pending reseller applications.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>PAN</TableHead>
          <TableHead>Aadhaar</TableHead>
          <TableHead>Address Proof</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.pan}</TableCell>
            <TableCell>{user.aadhaar}</TableCell>
            <TableCell>
              <Link href={user.addressProofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Document
              </Link>
            </TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" onClick={() => handleApproval(user.id, 'approved')}>
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleApproval(user.id, 'rejected')}>
                Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
