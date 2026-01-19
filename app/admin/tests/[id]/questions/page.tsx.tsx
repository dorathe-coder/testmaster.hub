"use client";

import React from "react"

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin, type AdminQuestion } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Upload,
  Pencil,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  HelpCircle,
} from "lucide-react";

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

interface QuestionFormData {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
  explanation: string;
}

const initialFormData: QuestionFormData = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctAnswer: "",
  explanation: "",
};

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    getTest,
    addQuestion,
    addBulkQuestions,
    updateQuestion,
    deleteQuestion,
  } = useAdmin();

  const [test, setTest] = useState<ReturnType<typeof getTest>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>(initialFormData);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkUploadResult, setBulkUploadResult] = useState<{
    success: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin");
      return;
    }

    if (!isLoading && isAuthenticated) {
      const foundTest = getTest(id);
      if (foundTest) {
        setTest(foundTest);
      } else {
        setNotFound(true);
      }
    }
  }, [isAuthenticated, isLoading, router, getTest, id]);

  // Re-fetch test when questions change
  useEffect(() => {
    if (!isLoading && isAuthenticated && !notFound) {
      const updatedTest = getTest(id);
      setTest(updatedTest);
    }
  }, [isAuthenticated, isLoading, getTest, id, notFound]);

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

  if (notFound || !test) {
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

  const handleFormChange = (field: keyof QuestionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingQuestion(null);
  };

  const handleAddQuestion = () => {
    const options = [
      formData.option1,
      formData.option2,
      formData.option3,
      formData.option4,
    ];
    const correctIndex = parseInt(formData.correctAnswer) - 1;

    if (editingQuestion) {
      updateQuestion(id, editingQuestion.id, {
        question: formData.question,
        options,
        correctAnswer: correctIndex,
        explanation: formData.explanation,
      });
    } else {
      addQuestion(id, {
        question: formData.question,
        options,
        correctAnswer: correctIndex,
        explanation: formData.explanation,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditQuestion = (question: AdminQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      option1: question.options[0] || "",
      option2: question.options[1] || "",
      option3: question.options[2] || "",
      option4: question.options[3] || "",
      correctAnswer: (question.correctAnswer + 1).toString(),
      explanation: question.explanation,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(id, questionId);
  };

  const isFormValid =
    formData.question.trim() !== "" &&
    formData.option1.trim() !== "" &&
    formData.option2.trim() !== "" &&
    formData.option3.trim() !== "" &&
    formData.option4.trim() !== "" &&
    formData.correctAnswer !== "";

  // CSV/Excel Parsing
  const parseCSV = (content: string): Omit<AdminQuestion, "id">[] => {
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    const questions: Omit<AdminQuestion, "id">[] = [];
    const errors: string[] = [];

    // Skip header row if present
    const startIndex = lines[0]?.toLowerCase().includes("question") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Handle both comma and semicolon delimiters, and handle quoted values
      const values = parseCSVLine(line);

      if (values.length >= 6) {
        const correctAnswer = parseInt(values[5]) - 1;
        if (correctAnswer >= 0 && correctAnswer <= 3) {
          questions.push({
            question: values[0].trim(),
            options: [
              values[1].trim(),
              values[2].trim(),
              values[3].trim(),
              values[4].trim(),
            ],
            correctAnswer,
            explanation: values[6]?.trim() || "",
          });
        } else {
          errors.push(`Row ${i + 1}: Invalid correct answer (must be 1-4)`);
        }
      } else {
        errors.push(`Row ${i + 1}: Not enough columns`);
      }
    }

    setBulkUploadResult({ success: questions.length, errors });
    return questions;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === "," || char === ";") && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);

    return result.map((s) => s.replace(/^"|"$/g, "").trim());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkUploadResult(null);

    try {
      const content = await file.text();
      const questions = parseCSV(content);

      if (questions.length > 0) {
        addBulkQuestions(id, questions);
      }
    } catch {
      setBulkUploadResult({
        success: 0,
        errors: ["Failed to parse file. Please check the format."],
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Question,Option 1,Option 2,Option 3,Option 4,Correct Answer (1-4),Explanation
"What is 2 + 2?","3","4","5","6","2","2 + 2 equals 4"
"What is the capital of France?","London","Paris","Berlin","Madrid","2","Paris is the capital of France"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <Link href={`/admin/tests/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Test Details
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{test.title}</h1>
            <p className="text-muted-foreground mt-1">
              Manage questions for this test ({test.questions.length} questions)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Bulk Upload Dialog */}
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Questions</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with multiple questions at once
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* File Format Info */}
                  <div className="rounded-lg border border-border p-4 bg-muted/50">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV Format Requirements
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Column 1: Question text</li>
                      <li>Column 2-5: Four options</li>
                      <li>Column 6: Correct answer (1-4)</li>
                      <li>Column 7: Explanation (optional)</li>
                    </ul>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 mt-2"
                      onClick={downloadTemplate}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download Template
                    </Button>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="csv-upload">Upload CSV File</Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv,.txt"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </div>

                  {/* Upload Result */}
                  {bulkUploadResult && (
                    <div className="space-y-2">
                      {bulkUploadResult.success > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-md">
                          <CheckCircle2 className="h-4 w-4" />
                          Successfully added {bulkUploadResult.success} questions
                        </div>
                      )}
                      {bulkUploadResult.errors.length > 0 && (
                        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-4 w-4" />
                            {bulkUploadResult.errors.length} error(s):
                          </div>
                          <ul className="list-disc list-inside text-xs">
                            {bulkUploadResult.errors.slice(0, 5).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                            {bulkUploadResult.errors.length > 5 && (
                              <li>
                                ...and {bulkUploadResult.errors.length - 5} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsBulkDialogOpen(false);
                      setBulkUploadResult(null);
                    }}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Question Dialog */}
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the question details below
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Question */}
                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter the question"
                      rows={3}
                      value={formData.question}
                      onChange={(e) =>
                        handleFormChange("question", e.target.value)
                      }
                    />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="option1">Option 1 *</Label>
                      <Input
                        id="option1"
                        placeholder="First option"
                        value={formData.option1}
                        onChange={(e) =>
                          handleFormChange("option1", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option2">Option 2 *</Label>
                      <Input
                        id="option2"
                        placeholder="Second option"
                        value={formData.option2}
                        onChange={(e) =>
                          handleFormChange("option2", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option3">Option 3 *</Label>
                      <Input
                        id="option3"
                        placeholder="Third option"
                        value={formData.option3}
                        onChange={(e) =>
                          handleFormChange("option3", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option4">Option 4 *</Label>
                      <Input
                        id="option4"
                        placeholder="Fourth option"
                        value={formData.option4}
                        onChange={(e) =>
                          handleFormChange("option4", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="space-y-2">
                    <Label htmlFor="correct">Correct Answer *</Label>
                    <Select
                      value={formData.correctAnswer}
                      onValueChange={(value) =>
                        handleFormChange("correctAnswer", value)
                      }
                    >
                      <SelectTrigger id="correct">
                        <SelectValue placeholder="Select the correct option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Option 1</SelectItem>
                        <SelectItem value="2">Option 2</SelectItem>
                        <SelectItem value="3">Option 3</SelectItem>
                        <SelectItem value="4">Option 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explain why this answer is correct"
                      rows={2}
                      value={formData.explanation}
                      onChange={(e) =>
                        handleFormChange("explanation", e.target.value)
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddQuestion} disabled={!isFormValid}>
                    {editingQuestion ? "Save Changes" : "Add Question"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              All questions in this test. Click to expand and see details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {test.questions.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No questions yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add questions manually or upload them in bulk
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsBulkDialogOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {test.questions.map((question, index) => (
                  <AccordionItem key={question.id} value={question.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge
                          variant="outline"
                          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <span className="line-clamp-1">{question.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-11 space-y-4">
                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`px-3 py-2 rounded-md text-sm ${
                                optIndex === question.correctAnswer
                                  ? "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                                  : "bg-muted"
                              }`}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              {option}
                              {optIndex === question.correctAnswer && (
                                <CheckCircle2 className="h-3.5 w-3.5 inline-block ml-2" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="bg-muted/50 rounded-md p-3">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Question
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this question?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
