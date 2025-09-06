
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyListingsPage from "@/app/my-listings/page";
import PurchasesPage from "@/app/purchases/page";
import DashboardPage from "@/app/dashboard/page";
import { ArrowLeft } from "lucide-react";

export default function AccountPage() {
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center gap-4">
                 <Button asChild variant="ghost" size="icon" className="-ml-4">
                    <Link href="/">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-headline">My Account</h1>
            </div>
            
            <Card>
                <Tabs defaultValue="listings" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="listings">My Listings</TabsTrigger>
                        <TabsTrigger value="purchases">My Purchases</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="listings" className="p-0">
                       <MyListingsPage />
                    </TabsContent>
                    <TabsContent value="purchases" className="p-0">
                       <PurchasesPage />
                    </TabsContent>
                    <TabsContent value="profile" className="p-0">
                        <DashboardPage />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
