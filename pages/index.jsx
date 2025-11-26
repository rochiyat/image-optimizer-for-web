import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      setError('Maximum 10 gambar yang diperbolehkan');
      return;
    }
    setFiles(selectedFiles);
    setError(null);
    setResults(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Pilih gambar terlebih dahulu');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/bulk-optimize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload gagal');
      }

      setResults(data);
      setFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    if (!results?.results) return;
    results.results.forEach(result => {
      if (result.success) {
        setTimeout(() => handleDownload(result.downloadUrl, result.fileName), 100);
      }
    });
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <Head>
        <title>Image Optimizer - Professional Edition</title>
        <meta name="description" content="Professional image optimization system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Image Optimizer
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Professional Edition v2.0
            </p>
            <p className="text-gray-500">
              Enterprise-grade image optimization with Bridge Pattern architecture
            </p>
          </div>

          {/* Bulk Upload Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🚀 Upload & Optimize Gambar
              </h2>
              
              <div className="space-y-6">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Gambar (Max 10)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Format: JPG, PNG, WebP | Max: 50MB per file
                  </p>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {files.length} Gambar Dipilih:
                    </h3>
                    <ul className="space-y-1">
                      {files.map((file, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {file.name} ({formatBytes(file.size)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? '⏳ Mengoptimasi...' : '✨ Upload & Optimize'}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    ❌ {error}
                  </div>
                )}

                {/* Results */}
                {results && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-900">
                        ✅ Optimasi Selesai!
                      </h3>
                      {results.summary.success > 0 && (
                        <button
                          onClick={handleDownloadAll}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          📥 Download Semua
                        </button>
                      )}
                    </div>

                    <div className="mb-4 text-sm text-green-800">
                      Berhasil: {results.summary.success} | Gagal: {results.summary.failed}
                    </div>

                    <div className="space-y-3">
                      {results.results.map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg ${
                            result.success ? 'bg-white' : 'bg-red-50'
                          }`}
                        >
                          {result.success ? (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {result.originalName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatBytes(result.originalSize)} → {formatBytes(result.optimizedSize)}
                                  <span className="text-green-600 font-semibold ml-2">
                                    (-{result.savedPercent}%)
                                  </span>
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownload(result.downloadUrl, result.fileName)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                              >
                                📥 Download
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium text-red-900">
                                {result.originalName}
                              </p>
                              <p className="text-sm text-red-600">
                                Error: {result.error}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon="🎯"
              title="Smart Optimization"
              description="Binary search algorithm untuk menemukan quality optimal"
            />
            <FeatureCard
              icon="🌉"
              title="Bridge Pattern"
              description="Flexible processor abstraction (Sharp, Cloudinary)"
            />
            <FeatureCard
              icon="⚡"
              title="High Performance"
              description="Batch processing dengan concurrency support"
            />
            <FeatureCard
              icon="🔧"
              title="Easy Configuration"
              description="Environment-based config dengan validation"
            />
            <FeatureCard
              icon="📊"
              title="Professional Logging"
              description="Structured logging dengan multiple levels"
            />
            <FeatureCard
              icon="🧪"
              title="Testing Ready"
              description="Unit & integration tests included"
            />
          </div>

          {/* Quick Links */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Start
              </h2>

              <div className="space-y-4">
                <QuickLink
                  href="/admin/upload"
                  title="Upload Images"
                  description="Upload dan optimize images via web interface"
                  icon="📤"
                />
                <QuickLink
                  href="/gallery"
                  title="View Gallery"
                  description="Lihat gallery images yang sudah dioptimize"
                  icon="🖼️"
                />
                <QuickLink
                  href="/docs"
                  title="Documentation"
                  description="Baca dokumentasi lengkap dan API reference"
                  icon="📚"
                />
              </div>

              {/* CLI Commands */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  CLI Commands
                </h3>
                <div className="space-y-3">
                  <CodeBlock
                    command="npm run images:optimize:v2"
                    description="Run professional optimization script"
                  />
                  <CodeBlock
                    command="npm run images:stats"
                    description="Check optimization statistics"
                  />
                  <CodeBlock
                    command="npm test"
                    description="Run test suite"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatCard label="Processors" value="2" />
            <StatCard label="API Endpoints" value="2" />
            <StatCard label="Test Coverage" value="Ready" />
            <StatCard label="Version" value="2.0" />
          </div>
        </div>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function QuickLink({ href, title, description, icon }) {
  return (
    <Link href={href}>
      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function CodeBlock({ command, description }) {
  return (
    <div>
      <code className="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg font-mono text-sm">
        $ {command}
      </code>
      <p className="text-sm text-gray-600 mt-1 ml-1">{description}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
      <div className="text-3xl font-bold text-indigo-600 mb-2">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
