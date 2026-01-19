"use client";

import React from "react"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";

const categories = [
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "gk", label: "General Knowledge" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
];

interface EditTestPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTestPage({ params }: EditTestPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading, getTest, updateTest } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: 30,
    marksPerQuestion: 4,
    negativeMarking: 1,
    isPublished: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin");
      return;
    }

    if (!isLoading && isAuthenticated) {
      const test = getTest(id);
      if (test) {
        setFormData({
          title: test.title,
          category: test.category,
          duration: test.duration,
          marksPerQuestion: test.marksPerQuestion,
          negativeMarking: test.negativeMarking,
          isPublished: test.isPublished,
        });
      } else {
        setNotFound(true);
      }
    }
  }, [isAuthenticated, isLoading, router, getTest, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Test Not Found
          </h1>
          <p className="text-muted-foreground">
            The test you're looking for doesn't exist.
          </p>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateTest(id, {
      title: formData.title,
      category: formData.category,
      duration: formData.duration,
      marksPerQuestion: formData.marksPerQuestion,
      negativeMarking: formData.negativeMarking,
      isPublished: formData.isPublished,
    });

    router.push("/admin/dashboard");
  };

  const isValid =
    formData.title.trim() !== "" &&
    formData.category !== "" &&
    formData.duration > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Link href={`/admin/tests/${id}/questions`}>
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Manage Questions
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Edit Test</h1>
          <p className="text-muted-foreground mt-1">
            Update your test details and configuration
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>
                Modify the information for your test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Test Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Chapter 1 Quiz"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={180}
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              {/* Marks Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks per Question</Label>
                  <Input
                    id="marks"
                    type="number"
                    min={0}
                    step={0.5}
                    value={formData.marksPerQuestion}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        marksPerQuestion: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negative">Negative Marking</Label>
                  <Input
                    id="negative"
                    type="number"
                    min={0}
                    step={0.25}
                    value={formData.negativeMarking}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        negativeMarking: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Publish Status */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this test available to students
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPublished: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
