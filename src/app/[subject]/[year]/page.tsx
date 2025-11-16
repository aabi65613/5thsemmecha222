import Link from 'next/link';
import AccordionQuestion from '@/components/AccordionQuestion';
import { promises as fs } from 'fs';
import path from 'path';

// Define the structure of a question
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

// Function to dynamically load the JSON data
async function loadQuestions(subject: string, year: string): Promise<Question[]> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'subjects', subject, `${year}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.questions as Question[];
  } catch (error) {
    console.error(`Could not load data for ${subject} - ${year}:`, error);
    return [];
  }
}

const formatSubjectName = (slug: string) => {
  return slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Subject';
};

// Function to get all possible subject and year combinations for static generation
export async function generateStaticParams() {
  const subjectsDir = path.join(process.cwd(), 'src', 'data', 'subjects');
  const subjectFolders = await fs.readdir(subjectsDir);

  const allParams: { subject: string; year: string }[] = [];

  for (const subject of subjectFolders) {
    const subjectPath = path.join(subjectsDir, subject);
    const yearFiles = await fs.readdir(subjectPath);

    for (const file of yearFiles) {
      if (file.endsWith('.json')) {
        const year = file.replace('.json', '');
        allParams.push({ subject, year });
      }
    }
  }

  return allParams;
}

export default async function YearPage({ params }: { params: { subject: string, year: string } }) {
  const { subject, year } = params;
  const questions = await loadQuestions(subject, year);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/${subject}`} className="text-blue-600 hover:underline mb-4 block">
          ← Back to {formatSubjectName(subject)} Years
        </Link>
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          {formatSubjectName(subject)}
        </h1>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
          Year: {year}
        </h2>

        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <AccordionQuestion
                key={index}
                question={question}
                subject={subject}
                year={year}
              />
            ))
          ) : (
            <p className="text-center text-red-500">
              No questions found for {formatSubjectName(subject)} - {year}.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
