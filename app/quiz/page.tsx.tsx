"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Check,
} from "lucide-react";
import { useQuiz } from "@/lib/quiz-context";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const router = useRouter();
  const {
    quizState,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    setTimeRemaining,
  } = useQuiz();

  // Redirect if no quiz state
  useEffect(() => {
    if (!quizState) {
      router.push("/dashboard");
    }
  }, [quizState, router]);

  // Timer logic
  useEffect(() => {
    if (!quizState || quizState.isComplete) return;

    const timer = setInterval(() => {
      if (quizState.timeRemaining <= 1) {
        clearInterval(timer);
        submitQuiz();
        router.push("/result");
      } else {
        setTimeRemaining(quizState.timeRemaining - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, setTimeRemaining, submitQuiz, router]);

  const handleSubmit = useCallback(() => {
    submitQuiz();
    router.push("/result");
  }, [submitQuiz, router]);

  const handleSaveAndNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  if (!quizState) {
    return null;
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const minutes = Math.floor(quizState.timeRemaining / 60);
  const seconds = quizState.timeRemaining % 60;
  const isLastQuestion =
    quizState.currentQuestionIndex === quizState.questions.length - 1;
  const answeredCount = Object.values(quizState.answers).filter(
    (a) => a !== null
  ).length;

  const categoryNames: Record<string, string> = {
    math: "Mathematics",
    science: "Science",
    gk: "General Knowledge",
    english: "English",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Timer */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-foreground">
                  TestMaster Hub
                </span>
                <span className="text-muted-foreground mx-2">|</span>
                <span className="text-sm text-muted-foreground">
                  {categoryNames[quizState.category] || quizState.category}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold",
                quizState.timeRemaining <= 60
                  ? "bg-destructive/10 text-destructive"
                  : quizState.timeRemaining <= 120
                    ? "bg-warning/10 text-warning-foreground"
                    : "bg-primary/10 text-primary"
              )}
            >
              <Clock className="w-5 h-5" />
              <span>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Question Section */}
          <div className="flex-1 order-2 lg:order-1">
            <Card className="border border-border">
              <CardHeader className="border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {quizState.currentQuestionIndex + 1} of{" "}
                    {quizState.questions.length}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                    {currentQuestion.category.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Question Text */}
                <div className="mb-8">
                  <p className="text-lg text-foreground leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected =
                      quizState.answers[currentQuestion.id] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(currentQuestion.id, index)}
                        className={cn(
                          "w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center gap-4",
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <span
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span
                          className={cn(
                            "text-base",
                            isSelected
                              ? "text-foreground font-medium"
                              : "text-foreground"
                          )}
                        >
                          {option}
                        </span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={quizState.currentQuestionIndex === 0}
                    className="gap-2 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-3">
                    {isLastQuestion ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="gap-2">
                            Submit Test
                            <Send className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You have answered {answeredCount} out of{" "}
                              {quizState.questions.length} questions. Are you
                              sure you want to submit your test? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Review Answers</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>
                              Submit Test
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button onClick={handleSaveAndNext} className="gap-2">
                        Save & Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Palette */}
          <div className="lg:w-80 order-1 lg:order-2">
            <Card className="border border-border lg:sticky lg:top-24">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Question Palette</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary" />
                    <span className="text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-muted border border-border" />
                    <span className="text-muted-foreground">Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border-2 border-primary bg-primary/10" />
                    <span className="text-muted-foreground">Current</span>
                  </div>
                </div>

                {/* Question Numbers Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {quizState.questions.map((question, index) => {
                    const isAnswered = quizState.answers[question.id] !== null;
                    const isCurrent =
                      index === quizState.currentQuestionIndex;

                    return (
                      <button
                        key={question.id}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200",
                          isCurrent
                            ? "border-2 border-primary bg-primary/10 text-primary"
                            : isAnswered
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-muted text-muted-foreground border border-border hover:border-primary/50"
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Progress Info */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {answeredCount} / {quizState.questions.length} answered
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{
                        width: `${(answeredCount / quizState.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full mt-4 gap-2">
                      <Send className="w-4 h-4" />
                      Submit Test
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have answered {answeredCount} out of{" "}
                        {quizState.questions.length} questions. Are you sure you
                        want to submit your test? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Review Answers</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        Submit Test
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
