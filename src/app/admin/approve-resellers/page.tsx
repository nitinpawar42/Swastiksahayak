import { ResellerApprovalTable } from "@/components/admin/ResellerApprovalTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export default function ApproveResellersPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Approve Resellers</CardTitle>
                    <CardDescription className="font-body">
                        Review new reseller applications and approve or reject them.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-3 rounded-md border border-yellow-300 mb-6 text-sm">
                        <ShieldCheck className="w-5 h-5" />
                        <p>This is an admin-only page. In a real application, it should be protected by authentication.</p>
                    </div>
                    <Suspense fallback={<p>Loading applications...</p>}>
                        <ResellerApprovalTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
