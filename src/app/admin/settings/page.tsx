
import { SeedDatabaseButton } from "@/components/admin/SeedDatabaseButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Admin Settings</CardTitle>
                    <CardDescription className="font-body">
                       Manage site-wide settings and data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-3 rounded-md border border-yellow-300 mb-6 text-sm">
                        <ShieldCheck className="w-5 h-5" />
                        <p>This is an admin-only page. Actions here can have major effects.</p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Database</CardTitle>
                                <CardDescription>Seed the database with initial demo products. This should only be done once on a fresh database.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SeedDatabaseButton />
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
