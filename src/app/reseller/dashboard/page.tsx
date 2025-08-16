
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BarChart2, DollarSign, HelpCircle, List, Send, ShieldCheck, ShoppingBag, Share2, Package } from "lucide-react";
import Link from 'next/link';

const resellerFeatures = [
    {
        title: "View Products",
        description: "Browse available products and see your commission.",
        icon: <ShoppingBag className="w-8 h-8 text-primary" />,
        href: "/#products"
    },
    {
        title: "Track My Orders",
        description: "See the status of orders from your referrals.",
        icon: <Package className="w-8 h-8 text-primary" />,
        href: "#"
    },
    {
        title: "My Earnings",
        description: "View your earnings, history, and request payouts.",
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        href: "#"
    },
    {
        title: "Contact Support",
        description: "Get help from the admin team.",
        icon: <HelpCircle className="w-8 h-8 text-primary" />,
        href: "/contact"
    }
];

export default function ResellerDashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Reseller Dashboard</h1>
                <p className="text-muted-foreground font-body">Welcome back! Here's your reseller hub.</p>
            </div>

             <div className="flex items-center gap-2 bg-blue-100 text-blue-800 p-4 rounded-md border border-blue-300 mb-8 text-sm">
                <ShieldCheck className="w-6 h-6" />
                <p>This page should only be accessible after a reseller logs in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resellerFeatures.map((feature) => (
                     <Link href={feature.href} key={feature.title}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                             <CardHeader className="flex flex-row items-center gap-4">
                                {feature.icon}
                                <div>
                                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-body text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
