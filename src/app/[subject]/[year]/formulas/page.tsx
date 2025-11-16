import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';

type Props = {
  params: { subject: string; year: string };
};

// Function to get all possible subjects and years for static generation
export async function generateStaticParams() {
  const subjectsDir = path.join(process.cwd(), 'src', 'data', 'subjects');
  const subjectFolders = await fs.readdir(subjectsDir);

  const allParams: { subject: string; year: string }[] = [];

  for (const subject of subjectFolders) {
    const subjectPath = path.join(subjectsDir, subject, 'formulas');
    
    // Check if the formulas directory exists
    try {
      const yearFiles = await fs.readdir(subjectPath);

      for (const file of yearFiles) {
        if (file.endsWith('.json')) {
          const year = file.replace('.json', '');
          allParams.push({ subject, year });
        }
      }
    } catch (error) {
      // Ignore if formulas directory does not exist for a subject
    }
  }

  return allParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = params.subject.replace(/-/g, ' ').toUpperCase();
  const year = params.year.replace('-', ' ').toUpperCase();
  return {
    title: `${subject} ${year} - Formulas`,
    description: `Key formulas for ${subject} ${year} WBSC exam`,
  };
}

export default function FormulaPage({ params }: Props) {
  const { subject, year } = params;

  const filePath = path.join(
    process.cwd(),
    'src',
    'data',
    'subjects',
    subject,
    'formulas',
    `${year}.json`
  );

  // Note: fs.existsSync is synchronous and should be avoided in async functions,
  // but for static generation data loading, it's often used.
  // We will use a try/catch block to handle the file read error instead of fs.existsSync
  let formulas: any[] = [];
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    formulas = JSON.parse(fileContents);
  } catch (e) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">
        {subject.replace(/-/g, ' ').toUpperCase()}
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        {year.replace('-', ' ').toUpperCase()} — Formula Sheet
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {formulas.map((f: any) => (
          <div
            key={f.id}
            className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{f.name}</h3>
            <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
              {f.latex}
            </div>
            {f.usedIn && f.usedIn.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                Used in: Q{f.usedIn.join(', Q')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={`/${subject}/${year}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Questions
        </a>
      </div>
    </div>
  );
}
