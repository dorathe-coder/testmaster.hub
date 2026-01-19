"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface QuizState {
  category: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, number | null>;
  timeRemaining: number;
  isComplete: boolean;
  startTime: number | null;
}

interface QuizContextType {
  quizState: QuizState | null;
  startQuiz: (category: string) => void;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  setTimeRemaining: (time: number) => void;
  getScore: () => { correct: number; total: number; percentage: number };
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const quizData: Record<string, Question[]> = {
  math: [
    {
      id: 1,
      question: "What is the value of x if 2x + 5 = 15?",
      options: ["3", "5", "7", "10"],
      correctAnswer: 1,
      category: "math",
    },
    {
      id: 2,
      question: "What is the area of a circle with radius 7 cm? (Use π = 22/7)",
      options: ["154 cm²", "144 cm²", "132 cm²", "168 cm²"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 3,
      question: "Simplify: (3² × 3³) ÷ 3⁴",
      options: ["3", "9", "27", "1"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 4,
      question: "What is the sum of interior angles of a hexagon?",
      options: ["540°", "720°", "900°", "1080°"],
      correctAnswer: 1,
      category: "math",
    },
    {
      id: 5,
      question: "If sin θ = 3/5, what is cos θ?",
      options: ["4/5", "3/4", "5/3", "5/4"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 6,
      question: "What is the derivative of x³ + 2x?",
      options: ["3x² + 2", "3x² + 2x", "x² + 2", "3x + 2"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 7,
      question: "What is the LCM of 12 and 18?",
      options: ["36", "72", "54", "24"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 8,
      question: "Solve: √(144) + √(81)",
      options: ["21", "23", "25", "27"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 9,
      question: "What is 15% of 240?",
      options: ["36", "32", "40", "28"],
      correctAnswer: 0,
      category: "math",
    },
    {
      id: 10,
      question:
        "If a = 3 and b = 4, what is the value of a² + b² + 2ab?",
      options: ["49", "25", "36", "64"],
      correctAnswer: 0,
      category: "math",
    },
  ],
  science: [
    {
      id: 1,
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      category: "science",
    },
    {
      id: 2,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
      correctAnswer: 1,
      category: "science",
    },
    {
      id: 3,
      question: "What is the speed of light in vacuum?",
      options: [
        "3 × 10⁶ m/s",
        "3 × 10⁸ m/s",
        "3 × 10¹⁰ m/s",
        "3 × 10⁴ m/s",
      ],
      correctAnswer: 1,
      category: "science",
    },
    {
      id: 4,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: 2,
      category: "science",
    },
    {
      id: 5,
      question: "What is the atomic number of Carbon?",
      options: ["4", "6", "8", "12"],
      correctAnswer: 1,
      category: "science",
    },
    {
      id: 6,
      question: "What type of bond is formed between Sodium and Chlorine?",
      options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
      correctAnswer: 1,
      category: "science",
    },
    {
      id: 7,
      question: "What is the SI unit of force?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correctAnswer: 2,
      category: "science",
    },
    {
      id: 8,
      question: "Which gas is most abundant in Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correctAnswer: 2,
      category: "science",
    },
    {
      id: 9,
      question: "What is the process by which plants make food?",
      options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
      correctAnswer: 1,
      category: "science",
    },
    {
      id: 10,
      question: "What is the pH of pure water?",
      options: ["0", "7", "14", "1"],
      correctAnswer: 1,
      category: "science",
    },
  ],
  gk: [
    {
      id: 1,
      question: "Which is the largest ocean in the world?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Pacific Ocean",
        "Arctic Ocean",
      ],
      correctAnswer: 2,
      category: "gk",
    },
    {
      id: 2,
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Michelangelo",
      ],
      correctAnswer: 2,
      category: "gk",
    },
    {
      id: 3,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      category: "gk",
    },
    {
      id: 4,
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2,
      category: "gk",
    },
    {
      id: 5,
      question: "What is the currency of Japan?",
      options: ["Yuan", "Won", "Yen", "Ringgit"],
      correctAnswer: 2,
      category: "gk",
    },
    {
      id: 6,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Japan", "Thailand", "Vietnam"],
      correctAnswer: 1,
      category: "gk",
    },
    {
      id: 7,
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
      correctAnswer: 1,
      category: "gk",
    },
    {
      id: 8,
      question: "Who wrote 'Romeo and Juliet'?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      correctAnswer: 1,
      category: "gk",
    },
    {
      id: 9,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
      correctAnswer: 2,
      category: "gk",
    },
    {
      id: 10,
      question: "Which river is the longest in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correctAnswer: 1,
      category: "gk",
    },
  ],
  english: [
    {
      id: 1,
      question: "What is the past tense of 'go'?",
      options: ["Goed", "Gone", "Went", "Going"],
      correctAnswer: 2,
      category: "english",
    },
    {
      id: 2,
      question: "Which word is a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
      category: "english",
    },
    {
      id: 3,
      question: "What is the plural of 'child'?",
      options: ["Childs", "Childrens", "Children", "Childies"],
      correctAnswer: 2,
      category: "english",
    },
    {
      id: 4,
      question: "Identify the adjective: 'The beautiful flower bloomed.'",
      options: ["The", "Beautiful", "Flower", "Bloomed"],
      correctAnswer: 1,
      category: "english",
    },
    {
      id: 5,
      question: "What is an antonym of 'ancient'?",
      options: ["Old", "Historic", "Modern", "Antique"],
      correctAnswer: 2,
      category: "english",
    },
    {
      id: 6,
      question: "Which sentence is grammatically correct?",
      options: [
        "She don't like apples.",
        "She doesn't likes apples.",
        "She doesn't like apples.",
        "She not like apples.",
      ],
      correctAnswer: 2,
      category: "english",
    },
    {
      id: 7,
      question: "What type of noun is 'team'?",
      options: ["Proper noun", "Collective noun", "Abstract noun", "Common noun"],
      correctAnswer: 1,
      category: "english",
    },
    {
      id: 8,
      question: "Choose the correct spelling:",
      options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
      correctAnswer: 1,
      category: "english",
    },
    {
      id: 9,
      question: "What is the comparative form of 'good'?",
      options: ["Gooder", "More good", "Better", "Best"],
      correctAnswer: 2,
      category: "english",
    },
    {
      id: 10,
      question: "'She sings beautifully.' What part of speech is 'beautifully'?",
      options: ["Adjective", "Adverb", "Noun", "Verb"],
      correctAnswer: 1,
      category: "english",
    },
  ],
};

const QUIZ_TIME = 600; // 10 minutes in seconds

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  const startQuiz = useCallback((category: string) => {
    const questions = quizData[category] || [];
    const initialAnswers: Record<number, number | null> = {};
    questions.forEach((q) => {
      initialAnswers[q.id] = null;
    });

    setQuizState({
      category,
      questions,
      currentQuestionIndex: 0,
      answers: initialAnswers,
      timeRemaining: QUIZ_TIME,
      isComplete: false,
      startTime: Date.now(),
    });
  }, []);

  const selectAnswer = useCallback(
    (questionId: number, answerIndex: number) => {
      if (!quizState || quizState.isComplete) return;

      setQuizState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: answerIndex,
          },
        };
      });
    },
    [quizState]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (!quizState || quizState.isComplete) return;
      if (index >= 0 && index < quizState.questions.length) {
        setQuizState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentQuestionIndex: index,
          };
        });
      }
    },
    [quizState]
  );

  const nextQuestion = useCallback(() => {
    if (!quizState || quizState.isComplete) return;
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      });
    }
  }, [quizState]);

  const previousQuestion = useCallback(() => {
    if (!quizState || quizState.isComplete) return;
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      });
    }
  }, [quizState]);

  const submitQuiz = useCallback(() => {
    if (!quizState) return;
    setQuizState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isComplete: true,
      };
    });
  }, [quizState]);

  const resetQuiz = useCallback(() => {
    setQuizState(null);
  }, []);

  const setTimeRemaining = useCallback((time: number) => {
    setQuizState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        timeRemaining: time,
      };
    });
  }, []);

  const getScore = useCallback(() => {
    if (!quizState) return { correct: 0, total: 0, percentage: 0 };

    let correct = 0;
    quizState.questions.forEach((question) => {
      if (quizState.answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const total = quizState.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, total, percentage };
  }, [quizState]);

  return (
    <QuizContext.Provider
      value={{
        quizState,
        startQuiz,
        selectAnswer,
        goToQuestion,
        nextQuestion,
        previousQuestion,
        submitQuiz,
        resetQuiz,
        setTimeRemaining,
        getScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
