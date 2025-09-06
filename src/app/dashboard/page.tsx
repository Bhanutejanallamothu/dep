
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

export default function DashboardPage() {
  const { user, updateUser } = useAppContext();
  const pathname = usePathname();
  const isAccountPage = pathname.startsWith('/account');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser(values);
  }
  
  if (!user) {
    return null;
  }

  const PageHeader = () => (
     <h1 className="text-3xl font-bold font-headline mb-6 flex items-center gap-2"><LayoutDashboard className="h-7 w-7"/> User Dashboard</h1>
  );

  const content = (
     <div className="max-w-2xl mx-auto">
        <Card className={isAccountPage ? "border-0 shadow-none" : ""}>
            <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
                    <AvatarFallback className="text-4xl">{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Username" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )

  if (isAccountPage) {
    return content;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <PageHeader />
       {content}
    </div>
  );
}
