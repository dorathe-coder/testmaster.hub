"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  ArrowRight,
} from "lucide-react";
import { useQuiz } from "@/lib/quiz-context";
import { cn } from "@/lib/utils";

export default function ResultPage() {
  const router = useRouter();
  const { quizState, getScore, resetQuiz } = useQuiz();

  useEffect(() => {
    if (!quizState || !quizState.isComplete) {
      router.push("/dashboard");
    }
  }, [quizState, router]);

  if (!quizState || !quizState.isComplete) {
    return null;
  }

  const { correct, total, percentage } = getScore();
  const incorrect = total - correct;

  const categoryNames: Record<string, string> = {
    math: "Mathematics",
    science: "Science",
    gk: "General Knowledge",
    english: "English",
  };

  const getGrade = (percent: number) => {
    if (percent >= 90) return { grade: "A+", message: "Outstanding!", color: "text-success" };
    if (percent >= 80) return { grade: "A", message: "Excellent!", color: "text-success" };
    if (percent >= 70) return { grade: "B", message: "Good job!", color: "text-primary" };
    if (percent >= 60) return { grade: "C", message: "Keep practicing!", color: "text-chart-4" };
    if (percent >= 50) return { grade: "D", message: "Needs improvement", color: "text-warning-foreground" };
    return { grade: "F", message: "Try again", color: "text-destructive" };
  };

  const { grade, message, color } = getGrade(percentage);

  const handleRetake = () => {
    const category = quizState.category;
    resetQuiz();
    router.push("/dashboard");
  };

  const handleNewTest = () => {
    resetQuiz();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                TestMaster Hub
              </span>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Score Card */}
        <Card className="border border-border mb-8 overflow-hidden">
          <div className="bg-primary/5 border-b border-border p-6 md:p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              Test Completed
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {categoryNames[quizState.category] || quizState.category} Test
              Results
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s how you performed
            </p>
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="text-primary"
                    strokeDasharray={`${(percentage / 100) * 440} 440`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">
                    {percentage}%
                  </span>
                  <span className={cn("text-lg font-semibold", color)}>
                    {grade}
                  </span>
                </div>
              </div>
              <p className={cn("text-xl font-medium", color)}>{message}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="border border-border bg-muted/30">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{total}</p>
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                </CardContent>
              </Card>
              <Card className="border border-success/30 bg-success/5">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{correct}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </CardContent>
              </Card>
              <Card className="border border-destructive/30 bg-destructive/5">
                <CardContent className="p-4 text-center">
                  <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{incorrect}</p>
                  <p className="text-xs text-muted-foreground">Incorrect</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRetake} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Retake Test
              </Button>
              <Button onClick={handleNewTest} className="gap-2">
                Try Another Category
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {quizState.questions.map((question, index) => {
                const userAnswer = quizState.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = userAnswer !== null;

                return (
                  <div key={question.id} className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          isCorrect
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              isCorrect
                                ? "bg-success/10 text-success"
                                : "bg-destructive/10 text-destructive"
                            )}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        </div>
                        <p className="text-foreground mb-4">
                          {question.question}
                        </p>

                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer =
                              question.correctAnswer === optIndex;

                            return (
                              <div
                                key={optIndex}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg text-sm",
                                  isCorrectAnswer
                                    ? "bg-success/10 border border-success/30"
                                    : isUserAnswer && !isCorrectAnswer
                                      ? "bg-destructive/10 border border-destructive/30"
                                      : "bg-muted/50 border border-border"
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                                    isCorrectAnswer
                                      ? "bg-success text-success-foreground"
                                      : isUserAnswer
                                        ? "bg-destructive text-destructive-foreground"
                                        : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span
                                  className={cn(
                                    "flex-1",
                                    isCorrectAnswer
                                      ? "text-success font-medium"
                                      : isUserAnswer && !isCorrectAnswer
                                        ? "text-destructive"
                                        : "text-foreground"
                                  )}
                                >
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <span className="text-xs text-success font-medium">
                                    Correct Answer
                                  </span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="text-xs text-destructive font-medium">
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
