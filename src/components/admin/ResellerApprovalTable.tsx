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

async function getPendingUsers(): Promise<User[]> {
    const q = query(collection(db, "users"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}


export async function ResellerApprovalTable() {
  const users = await getPendingUsers();
  
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
          <TableHead>Pincode</TableHead>
          <TableHead>Address Proof</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <ResellerApprovalTableRow key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
}

// Client component for the row to handle actions
function ResellerApprovalTableRow({ user }: { user: User }) {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleApproval = async (userId: string, newStatus: 'approved' | 'rejected') => {
        setIsUpdating(true);
        const userRef = doc(db, "users", userId);
        try {
            await updateDoc(userRef, { status: newStatus });
            toast({
                title: `User ${newStatus}`,
                description: `The reseller has been ${newStatus}. The list will update on next refresh.`,
            });
            // Note: We're not auto-refreshing here to keep it simple. 
            // A full solution might involve revalidating the path.
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not update the reseller status.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };
    
    return (
         <TableRow>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.pan}</TableCell>
            <TableCell>{user.aadhaar}</TableCell>
            <TableCell>{user.pincode}</TableCell>
            <TableCell>
              <Link href={user.addressProofUrl!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Document
              </Link>
            </TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" onClick={() => handleApproval(user.id, 'approved')} disabled={isUpdating}>
                {isUpdating ? '...' : 'Approve'}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleApproval(user.id, 'rejected')} disabled={isUpdating}>
                {isUpdating ? '...' : 'Reject'}
              </Button>
            </TableCell>
          </TableRow>
    )
}