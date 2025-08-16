
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BarChart2, CheckCircle, FileUp, ListOrdered, Settings, ShieldCheck, Upload, Users } from "lucide-react";
import Link from "next/link";

const adminFeatures = [
    {
        title: "Approve Resellers",
        description: "Review and approve/reject new reseller applications.",
        icon: <Users className="w-8 h-8 text-primary" />,
        href: "#"
    },
    {
        title: "Manage Products",
        description: "Add, edit, and remove products from your catalog.",
        icon: <ListOrdered className="w-8 h-8 text-primary" />,
        href: "/admin/upload"
    },
    {
        title: "Track Orders",
        description: "View and manage all orders, payments, and shipping.",
        icon: <CheckCircle className="w-8 h-8 text-primary" />,
        href: "#"
    },
    {
        title: "Sales Performance",
        description: "Analyze sales data and reseller performance.",
        icon: <BarChart2 className="w-8 h-8 text-primary" />,
        href: "#"
    },
    {
        title: "Bulk Upload",
        description: "Upload products in bulk using CSV/Excel files.",
        icon: <FileUp className="w-8 h-8 text-primary" />,
        href: "#"
    },
    {
        title: "Site Settings",
        description: "Manage banners, tax settings, and site content.",
        icon: <Settings className="w-8 h-8 text-primary" />,
        href: "#"
    }
]

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground font-body">Welcome, Admin. Manage your store here.</p>
            </div>

             <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-4 rounded-md border border-yellow-300 mb-8 text-sm">
                <ShieldCheck className="w-6 h-6" />
                <p>This page should be password-protected and accessible only by authorized personnel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures.map((feature) => (
                    <Link href={feature.href} key={feature.title}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4">
                                {feature.icon}
                                <div>
                                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                                    <CardDescription className="font-body">{feature.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
