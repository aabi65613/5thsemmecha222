import Link from 'next/link';

// Dummy year list for a subject page
const years = ['2024-dec', '2024-jan', '2023', '2022'];

const formatSubjectName = (slug: string) => {
  return slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Subject';
};

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const { subject } = params;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 block">
          ← Back to Subjects
        </Link>
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          {formatSubjectName(subject)}
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select a year to view the questions and solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {years.map((year) => (
            <Link key={year} href={`/${subject}/${year}`} className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h2 className="text-xl font-semibold text-gray-800">Year: {year}</h2>
                <p className="text-sm text-green-600 mt-1">View Full Paper</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
