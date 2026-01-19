"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Target,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                TestMaster Hub
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Features
              </Link>
              <Link
                href="#categories"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Categories
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                How it works
              </Link>
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Admin
              </Link>
            </div>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Practice Makes Perfect
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
              Master Any Subject with{" "}
              <span className="text-primary">Interactive Quizzes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
              Prepare for your exams with our comprehensive mock tests. Real-time
              quizzes, instant feedback, and detailed analytics to track your
              progress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-8">
                  Start Test
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-24">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "500+", label: "Practice Tests" },
              { value: "50+", label: "Categories" },
              { value: "95%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to prepare
              effectively for any examination.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Timed Tests",
                description:
                  "Practice under real exam conditions with our countdown timer feature.",
              },
              {
                icon: Target,
                title: "Question Palette",
                description:
                  "Navigate easily between questions and track your progress visually.",
              },
              {
                icon: BarChart3,
                title: "Detailed Analytics",
                description:
                  "Get comprehensive results with correct answers and performance insights.",
              },
              {
                icon: Shield,
                title: "Save Progress",
                description:
                  "Save and continue your tests anytime with auto-save functionality.",
              },
              {
                icon: CheckCircle2,
                title: "Instant Feedback",
                description:
                  "Know your score immediately after completing each test.",
              },
              {
                icon: Users,
                title: "Multiple Categories",
                description:
                  "Choose from Math, Science, GK, English and many more subjects.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border border-border bg-card hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section id="categories" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Test Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide range of subjects and start practicing today.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Mathematics", questions: 100, color: "bg-primary" },
              { name: "Science", questions: 120, color: "bg-chart-2" },
              { name: "General Knowledge", questions: 150, color: "bg-chart-4" },
              { name: "English", questions: 80, color: "bg-chart-5" },
            ].map((category) => (
              <Card
                key={category.name}
                className="border border-border bg-card hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.questions}+ Questions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                View All Categories
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Category",
                description:
                  "Select from our wide range of test categories based on your preparation needs.",
              },
              {
                step: "02",
                title: "Take the Test",
                description:
                  "Answer questions within the time limit using our intuitive quiz interface.",
              },
              {
                step: "03",
                title: "Review Results",
                description:
                  "Get instant results with detailed explanations and track your progress.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Practicing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their scores with
            TestMaster Hub.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 px-10">
              Start Your First Test
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                TestMaster Hub
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 TestMaster Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
