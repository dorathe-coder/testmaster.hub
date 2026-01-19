"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  PenTool,
  Clock,
  HelpCircle,
  ArrowLeft,
  Play,
} from "lucide-react";
import { useQuiz } from "@/lib/quiz-context";

const categories = [
  {
    id: "math",
    name: "Mathematics",
    description: "Algebra, Geometry, Calculus, and more",
    icon: Calculator,
    questions: 10,
    duration: "10 min",
    color: "bg-primary",
    iconColor: "text-primary",
    bgLight: "bg-primary/10",
  },
  {
    id: "science",
    name: "Science",
    description: "Physics, Chemistry, Biology concepts",
    icon: FlaskConical,
    questions: 10,
    duration: "10 min",
    color: "bg-chart-2",
    iconColor: "text-chart-2",
    bgLight: "bg-chart-2/10",
  },
  {
    id: "gk",
    name: "General Knowledge",
    description: "World facts, History, Geography",
    icon: Globe,
    questions: 10,
    duration: "10 min",
    color: "bg-chart-4",
    iconColor: "text-chart-4",
    bgLight: "bg-chart-4/10",
  },
  {
    id: "english",
    name: "English",
    description: "Grammar, Vocabulary, Comprehension",
    icon: PenTool,
    questions: 10,
    duration: "10 min",
    color: "bg-chart-5",
    iconColor: "text-chart-5",
    bgLight: "bg-chart-5/10",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { startQuiz } = useQuiz();

  const handleStartQuiz = (categoryId: string) => {
    startQuiz(categoryId);
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold text-foreground">
                  TestMaster Hub
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Select a Test Category
          </h1>
          <p className="text-muted-foreground">
            Choose a subject to begin your practice test. Each test contains 10
            questions with a 10-minute time limit.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12">
          <Card className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">40</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">10</p>
                <p className="text-xs text-muted-foreground">Min/Test</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-5/10 rounded-lg flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Free</p>
                <p className="text-xs text-muted-foreground">Always</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="border border-border bg-card hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 ${category.bgLight} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <category.icon
                        className={`w-7 h-7 ${category.iconColor}`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-card-foreground">
                        {category.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>{category.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{category.duration}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartQuiz(category.id)}
                    className="gap-2"
                  >
                    Start Test
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 md:mt-12 border border-border bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Test Instructions
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each test has 10 multiple choice questions. You have 10 minutes
                  to complete the test. Use the question palette to navigate
                  between questions. Click &apos;Save & Next&apos; to save your
                  answer and move forward. You can review and change your answers
                  before submitting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
