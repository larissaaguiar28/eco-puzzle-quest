import React, { createContext, useContext, useState, ReactNode } from "react";

export interface QuizQuestion {
  id: number;
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizState {
  completedSections: Set<number>;
  totalPieces: number;
  showCongrats: boolean;
  markCompleted: (sectionIndex: number) => void;
  isCompleted: (sectionIndex: number) => boolean;
  dismissCongrats: () => void;
}

const QuizContext = createContext<QuizState | undefined>(undefined);

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    section: "Impactos Ambientais",
    question: "Qual das seguintes é considerada uma fonte de energia renovável?",
    options: ["Carvão mineral", "Gás natural", "Energia solar", "Petróleo"],
    correctIndex: 2,
  },
  {
    id: 2,
    section: "Escassez & Desmatamento",
    question: "Aproximadamente quantos hectares de floresta são perdidos por ano no mundo?",
    options: ["1 milhão", "5 milhões", "10 milhões", "20 milhões"],
    correctIndex: 2,
  },
  {
    id: 3,
    section: "Mudanças Climáticas",
    question: "Qual é o principal gás responsável pelo efeito estufa?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Hélio"],
    correctIndex: 2,
  },
  {
    id: 4,
    section: "Boas Práticas",
    question: "Qual atitude contribui mais para a sustentabilidade no dia a dia?",
    options: [
      "Usar sacolas plásticas",
      "Separar o lixo para reciclagem",
      "Deixar luzes acesas",
      "Usar transporte individual",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    section: "Linha do Tempo",
    question: "Em que década o desmatamento da Amazônia brasileira atingiu seu pico histórico?",
    options: ["Anos 1970", "Anos 1990", "Anos 2000", "Anos 2020"],
    correctIndex: 2,
  },
  {
    id: 6,
    section: "Agrotóxicos",
    question: "Qual país é o maior consumidor de agrotóxicos do mundo?",
    options: ["Estados Unidos", "China", "Brasil", "Índia"],
    correctIndex: 2,
  },
];

export function QuizProvider({ children }: { children: ReactNode }) {
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showCongrats, setShowCongrats] = useState(false);

  const markCompleted = (sectionIndex: number) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(sectionIndex);
      if (next.size === 6) {
        setTimeout(() => setShowCongrats(true), 500);
      }
      return next;
    });
  };

  const isCompleted = (sectionIndex: number) => completedSections.has(sectionIndex);

  return (
    <QuizContext.Provider
      value={{
        completedSections,
        totalPieces: completedSections.size,
        showCongrats,
        markCompleted,
        isCompleted,
        dismissCongrats: () => setShowCongrats(false),
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
