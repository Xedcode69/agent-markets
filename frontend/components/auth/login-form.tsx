import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function LoginForm(){
    return(
        <Card className="w-full max-w-md rounded-lg bg-card shadow-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold">Login to your account</CardTitle>
            </CardHeader>

            <form>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Create a password" required />
                    </div>
                    <Button type="submit" className="mt-2 w-full" size="lg">Login</Button>

                    <p className="text-center text-sm text-muted-foreground">
                        New to Agent Markets?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                        Sign Up
                        </Link>
                    </p>
                
                </CardContent>
            </form>
        </Card>
    )
}