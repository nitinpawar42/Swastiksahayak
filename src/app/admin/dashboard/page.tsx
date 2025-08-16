
import { AdminStats } from "@/components/admin/AdminStats";
import { SalesChart } from "@/components/admin/SalesChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileUp, Settings, Users, ListOrdered, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const adminFeatures = [
    {
        title: "Approve Resellers",
        description: "Review and approve new reseller applications.",
        icon: <Users className="w-8 h-8 text-primary" />,
        href: "/admin/approve-resellers"
    },
    {
        title: "Manage Products",
        description: "Add, edit, or remove products.",
        icon: <ListOrdered className="w-8 h-8 text-primary" />,
        href: "/admin/upload"
    },
    {
        title: "Track Orders",
        description: "View and manage all customer orders.",
        icon: <CheckCircle className="w-8 h-8 text-primary" />,
        href: "#" // Future implementation
    },
    {
        title: "Bulk Upload",
        description: "Upload products in bulk via CSV.",
        icon: <FileUp className="w-8 h-8 text-primary" />,
        href: "#" // Future implementation
    },
    {
        title: "Site Settings",
        description: "Manage site-wide configurations and data.",
        icon: <Settings className="w-8 h-8 text-primary" />,
        href: "/admin/settings"
    }
]

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground font-body">An overview of your store's performance.</p>
            </div>

             <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-4 rounded-md border border-yellow-300 mb-8 text-sm">
                <ShieldCheck className="w-6 h-6" />
                <p>This page should be password-protected and accessible only by authorized personnel.</p>
            </div>

            <Suspense fallback={<p>Loading stats...</p>}>
                <AdminStats />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>A chart showing this month's sales.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <SalesChart />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    {adminFeatures.map((feature) => (
                        <Link href={feature.href} key={feature.title}>
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {feature.icon}
                                    <div>
                                        <CardTitle className="font-headline text-lg">{feature.title}</CardTitle>
                                        <CardDescription className="font-body text-sm">{feature.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
