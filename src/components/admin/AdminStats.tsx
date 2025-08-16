import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users } from "lucide-react";

async function getStats() {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const pendingUsersSnapshot = await getDocs(query(collection(db, 'users'), where('status', '==', 'pending')));

    const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + doc.data().totalAmount, 0);
    const totalProducts = productsSnapshot.size;
    const pendingResellers = pendingUsersSnapshot.size;

    return { totalRevenue, totalProducts, pendingResellers };
}


export async function AdminStats() {
    const { totalRevenue, totalProducts, pendingResellers } = await getStats();

    const stats = [
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6 text-muted-foreground" />
        },
        {
            title: "Pending Resellers",
            value: pendingResellers,
            icon: <Users className="w-6 h-6 text-muted-foreground" />
        },
        {
            title: "Total Products",
            value: totalProducts,
            icon: <Package className="w-6 h-6 text-muted-foreground" />
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
