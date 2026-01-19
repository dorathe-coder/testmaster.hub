"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface AdminQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AdminTest {
  id: string;
  title: string;
  category: string;
  duration: number; // in minutes
  marksPerQuestion: number;
  negativeMarking: number;
  questions: AdminQuestion[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface AdminStats {
  totalTests: number;
  totalStudents: number;
  totalQuestions: number;
}

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  tests: AdminTest[];
  stats: AdminStats;
  login: (password: string) => boolean;
  logout: () => void;
  createTest: (test: Omit<AdminTest, "id" | "createdAt" | "updatedAt" | "questions">) => AdminTest;
  updateTest: (id: string, updates: Partial<AdminTest>) => void;
  deleteTest: (id: string) => void;
  getTest: (id: string) => AdminTest | undefined;
  addQuestion: (testId: string, question: Omit<AdminQuestion, "id">) => void;
  addBulkQuestions: (testId: string, questions: Omit<AdminQuestion, "id">[]) => void;
  updateQuestion: (testId: string, questionId: string, updates: Partial<AdminQuestion>) => void;
  deleteQuestion: (testId: string, questionId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Simple password for demo - in production, use proper auth
const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "testmaster_admin_data";
const AUTH_KEY = "testmaster_admin_auth";

// Sample initial tests
const initialTests: AdminTest[] = [
  {
    id: "test-1",
    title: "Mathematics Fundamentals",
    category: "math",
    duration: 30,
    marksPerQuestion: 4,
    negativeMarking: 1,
    questions: [
      {
        id: "q1",
        question: "What is the value of x if 2x + 5 = 15?",
        options: ["3", "5", "7", "10"],
        correctAnswer: 1,
        explanation: "2x + 5 = 15, so 2x = 10, therefore x = 5",
      },
      {
        id: "q2",
        question: "What is the area of a circle with radius 7 cm? (Use π = 22/7)",
        options: ["154 cm²", "144 cm²", "132 cm²", "168 cm²"],
        correctAnswer: 0,
        explanation: "Area = πr² = (22/7) × 7² = 154 cm²",
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    isPublished: true,
  },
  {
    id: "test-2",
    title: "General Science Quiz",
    category: "science",
    duration: 20,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    questions: [
      {
        id: "q1",
        question: "What is the chemical symbol for Gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Au comes from the Latin word 'Aurum' meaning gold",
      },
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    isPublished: true,
  },
  {
    id: "test-3",
    title: "World Knowledge Challenge",
    category: "gk",
    duration: 15,
    marksPerQuestion: 1,
    negativeMarking: 0,
    questions: [],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    isPublished: false,
  },
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState<AdminTest[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTests(
          parsed.map((t: AdminTest) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          }))
        );
      } catch {
        setTests(initialTests);
      }
    } else {
      setTests(initialTests);
    }
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever tests change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    }
  }, [tests, isLoading]);

  const stats: AdminStats = {
    totalTests: tests.length,
    totalStudents: 1247, // Simulated
    totalQuestions: tests.reduce((acc, test) => acc + test.questions.length, 0),
  };

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const createTest = useCallback(
    (test: Omit<AdminTest, "id" | "createdAt" | "updatedAt" | "questions">): AdminTest => {
      const newTest: AdminTest = {
        ...test,
        id: generateId(),
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTests((prev) => [...prev, newTest]);
      return newTest;
    },
    []
  );

  const updateTest = useCallback((id: string, updates: Partial<AdminTest>) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === id
          ? { ...test, ...updates, updatedAt: new Date() }
          : test
      )
    );
  }, []);

  const deleteTest = useCallback((id: string) => {
    setTests((prev) => prev.filter((test) => test.id !== id));
  }, []);

  const getTest = useCallback(
    (id: string): AdminTest | undefined => {
      return tests.find((test) => test.id === id);
    },
    [tests]
  );

  const addQuestion = useCallback(
    (testId: string, question: Omit<AdminQuestion, "id">) => {
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                questions: [
                  ...test.questions,
                  { ...question, id: generateId() },
                ],
                updatedAt: new Date(),
              }
            : test
        )
      );
    },
    []
  );

  const addBulkQuestions = useCallback(
    (testId: string, questions: Omit<AdminQuestion, "id">[]) => {
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                questions: [
                  ...test.questions,
                  ...questions.map((q) => ({ ...q, id: generateId() })),
                ],
                updatedAt: new Date(),
              }
            : test
        )
      );
    },
    []
  );

  const updateQuestion = useCallback(
    (testId: string, questionId: string, updates: Partial<AdminQuestion>) => {
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId
            ? {
                ...test,
                questions: test.questions.map((q) =>
                  q.id === questionId ? { ...q, ...updates } : q
                ),
                updatedAt: new Date(),
              }
            : test
        )
      );
    },
    []
  );

  const deleteQuestion = useCallback((testId: string, questionId: string) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === testId
          ? {
              ...test,
              questions: test.questions.filter((q) => q.id !== questionId),
              updatedAt: new Date(),
            }
          : test
      )
    );
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        tests,
        stats,
        login,
        logout,
        createTest,
        updateTest,
        deleteTest,
        getTest,
        addQuestion,
        addBulkQuestions,
        updateQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
