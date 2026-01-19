"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ArrowLeft, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simulate slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid password. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter your password to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !password}
              >
                {isSubmitting ? "Authenticating..." : "Login"}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Demo password: <code className="bg-muted px-1.5 py-0.5 rounded">admin123</code>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
