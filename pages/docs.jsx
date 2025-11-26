import Head from 'next/head';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <>
      <Head>
        <title>Documentation - Image Optimizer</title>
        <meta name="description" content="Complete documentation and API reference for Image Optimizer" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#a855f7" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <span className="text-xl font-bold text-gray-900 cursor-pointer">
                  Image Optimizer
                </span>
              </Link>
              <nav className="flex gap-6">
                <Link href="/admin/upload">
                  <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Upload</span>
                </Link>
                <Link href="/gallery">
                  <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Gallery</span>
                </Link>
                <Link href="/docs">
                  <span className="text-indigo-600 font-medium cursor-pointer">Docs</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Documentation
            </h1>

            {/* Documentation Links */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <DocCard
                title="README Professional"
                description="Complete guide untuk professional edition"
                file="README_PROFESSIONAL.md"
                icon="📖"
              />
              <DocCard
                title="Architecture"
                description="System architecture dan design patterns"
                file="ARCHITECTURE.md"
                icon="🏗️"
              />
              <DocCard
                title="API Documentation"
                description="API endpoints dan usage examples"
                file="docs/API.md"
                icon="🔌"
              />
              <DocCard
                title="Upgrade Guide"
                description="Migration dari v1 ke v2"
                file="UPGRADE_GUIDE.md"
                icon="⬆️"
              />
              <DocCard
                title="Quick Reference"
                description="Cheat sheet untuk common commands"
                file="QUICKREF.md"
                icon="⚡"
              />
              <DocCard
                title="Changelog"
                description="Version history dan changes"
                file="CHANGELOG.md"
                icon="📝"
              />
            </div>

            {/* Quick Start */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Start
              </h2>

              <div className="space-y-6">
                <Section
                  title="1. Installation"
                  code="npm install"
                />
                <Section
                  title="2. Setup Environment"
                  code="cp .env.example .env"
                />
                <Section
                  title="3. Run Optimization"
                  code="npm run images:optimize:v2"
                />
                <Section
                  title="4. Check Statistics"
                  code="npm run images:stats"
                />
              </div>
            </div>

            {/* API Examples */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                API Examples
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Upload Image
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`const formData = new FormData();
formData.append('image', fileObject);

const response = await fetch('/api/upload-image', {
  method: 'POST',
  body: formData
});

const result = await response.json();`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Optimize Image
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`const response = await fetch('/api/optimize-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputPath: './temp-uploads/photo.jpg',
    outputPath: './public/images/photo.jpg'
  })
});

const result = await response.json();`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function DocCard({ title, description, file, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a
        href={`https://github.com/your-repo/blob/main/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
      >
        View on GitHub →
      </a>
    </div>
  );
}

function Section({ title, code }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <code className="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg font-mono text-sm">
        $ {code}
      </code>
    </div>
  );
}
