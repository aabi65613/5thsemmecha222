'use client'
import { useState } from 'react'
import Link from 'next/link'

// Define the structure of a question for type safety
interface Question {
  id: string;
  text: string;
  options?: string[];
  answer: number | string;
  chapter: string;
  type: 'mcq' | 'short' | 'long';
  marks: number;
  diagram?: boolean;
  formula?: string;
  formulaId?: string;
  repeatedIn?: { year: string; qno: string }[];
}

interface AccordionQuestionProps {
  question: Question;
  subject: string;
  year: string;
}

export default function AccordionQuestion({ question, subject, year }: AccordionQuestionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 font-medium flex justify-between items-center hover:bg-gray-50"
      >
        <div>
          <span className="font-bold text-blue-600">Q{question.id}:</span>{' '}
          <span>{question.text}</span>
          {question.marks && (
            <span className="ml-2 text-sm text-gray-600">({question.marks} marks)</span>
          )}
        </div>
        <span className="text-xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="p-4 border-t space-y-3">
          {/* MCQ Answer */}
          {question.options && (
            <p className="font-semibold text-green-600">
              Answer: {question.options[question.answer as number]}
            </p>
          )}

          {/* Short or Long Answer */}
          {!question.options && question.answer && (
            <div>
              <p className="font-semibold text-green-600 mb-2">
                Answer:
              </p>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {question.answer}
              </div>
            </div>
          )}

          {/* Chapter */}
          <p className="text-sm">
            <strong>Chapter:</strong> {question.chapter}
          </p>

          {/* Formula */}
          {question.formula && (
            <p className="text-sm">
              <strong>Formula:</strong>{' '}
              <Link 
                href={`/${subject}/${year}/formulas#${question.formulaId}`} 
                className="text-blue-600 underline"
              >
                View
              </Link>
            </p>
          )}

          {/* Diagram Note */}
          {question.diagram && (
            <p className="text-sm italic text-amber-700">
              Diagram required in exam (sketch tool + abrasive slurry)
            </p>
          )}

          {/* Repeats */}
          {question.repeatedIn && question.repeatedIn.length > 0 && (
            <p className="text-sm">
              <strong>Repeated in:</strong>{' '}
              {question.repeatedIn.map((r, i) => (
                <span key={i}>
                  {r.year} ({r.qno}){i < question.repeatedIn.length - 1 && ', '}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
