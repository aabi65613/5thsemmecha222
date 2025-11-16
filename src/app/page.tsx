import Link from 'next/link';

// Dummy subject list for the main page
const subjects = [
  { name: 'Advanced Manufacturing', slug: 'advanced-manufacturing' },
  { name: 'Automobile Engineering', slug: 'automobile-engineering' },
  { name: 'Power Engineering', slug: 'power-engineering' },
  { name: 'Fluid Mechanics', slug: 'fluid-mechanics' },
  { name: 'Material Handling', slug: 'material-handling' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          WBSC PYQ Diploma Project
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select a subject to view the previous year questions and solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.slug} href={`/${subject.slug}`} className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h2 className="text-xl font-semibold text-gray-800">{subject.name}</h2>
                <p className="text-sm text-green-600 mt-1">4 Years of Data Complete</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
