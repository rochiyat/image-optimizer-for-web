import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 10) {
        setError('Maximum 10 gambar yang diperbolehkan');
        return;
      }
      setFiles(droppedFiles);
      setError(null);
      setResults(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
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
        <meta name="description" content="Enterprise-grade image optimization with AI-powered compression. Upload up to 10 images at once and reduce file sizes by 87% on average." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#a855f7" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Image Optimizer - Professional Edition" />
        <meta property="og:description" content="Enterprise-grade image optimization with AI-powered compression" />
        <meta property="og:image" content="/favicon.svg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Image Optimizer - Professional Edition" />
        <meta name="twitter:description" content="Enterprise-grade image optimization with AI-powered compression" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          {/* Hero Header */}
          <div className="text-center mb-16 pt-8">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-6 mx-auto transform hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">⚡</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
              Image Optimizer
            </h1>
            <p className="text-2xl text-purple-200 mb-3 font-semibold">
              Professional Edition v2.0
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade image optimization with AI-powered compression
            </p>
            
            {/* Stats Bar */}
            <div className="flex justify-center gap-8 mt-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">87%</div>
                <div className="text-sm text-gray-400">Avg. Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10</div>
                <div className="text-sm text-gray-400">Bulk Upload</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">&lt;2s</div>
                <div className="text-sm text-gray-400">Per Image</div>
              </div>
            </div>
          </div>

          {/* Bulk Upload Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Upload & Optimize
                </h2>
              </div>
              
              <div className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-500/20 scale-105' 
                      : 'border-gray-500 bg-white/5 hover:bg-white/10 hover:border-purple-500'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xl font-semibold text-white mb-2">
                        {dragActive ? 'Drop files here' : 'Drag & drop your images'}
                      </p>
                      <p className="text-gray-400 mb-4">
                        or click to browse (Max 10 files)
                      </p>
                      <button
                        onClick={handleButtonClick}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose Files
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        JPG, PNG, WebP
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Max 50MB each
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">
                          {files.length}
                        </span>
                        Files Selected
                      </h3>
                      <button
                        onClick={() => setFiles([])}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Optimizing Magic...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Start Optimization</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm flex items-center gap-3 animate-shake">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* Results */}
                {results && (
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-6 backdrop-blur-sm animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Optimization Complete!
                          </h3>
                          <p className="text-sm text-green-200">
                            {results.summary.success} successful • {results.summary.failed} failed
                          </p>
                        </div>
                      </div>
                      {results.summary.success > 0 && (
                        <button
                          onClick={handleDownloadAll}
                          className="bg-white text-green-600 py-3 px-6 rounded-xl font-bold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download All
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {results.results.map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-5 rounded-xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-102 ${
                            result.success 
                              ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                              : 'bg-red-500/20 border-red-500/50'
                          }`}
                        >
                          {result.success ? (
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate mb-1">
                                    {result.originalName}
                                  </p>
                                  <div className="flex items-center gap-3 text-sm">
                                    <span className="text-gray-300">
                                      {formatBytes(result.originalSize)}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    <span className="text-gray-300">
                                      {formatBytes(result.optimizedSize)}
                                    </span>
                                    <span className="px-3 py-1 bg-green-500 text-white rounded-full font-bold text-xs">
                                      -{result.savedPercent}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownload(result.downloadUrl, result.fileName)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 flex-shrink-0"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="font-semibold text-red-200">
                                  {result.originalName}
                                </p>
                                <p className="text-sm text-red-300">
                                  {result.error}
                                </p>
                              </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon="🎯"
              title="Smart Optimization"
              description="Binary search algorithm untuk menemukan quality optimal"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon="🌉"
              title="Bridge Pattern"
              description="Flexible processor abstraction (Sharp, Cloudinary)"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon="⚡"
              title="High Performance"
              description="Batch processing dengan concurrency support"
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon="🔧"
              title="Easy Configuration"
              description="Environment-based config dengan validation"
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon="📊"
              title="Professional Logging"
              description="Structured logging dengan multiple levels"
              gradient="from-red-500 to-pink-500"
            />
            <FeatureCard
              icon="🧪"
              title="Testing Ready"
              description="Unit & integration tests included"
              gradient="from-indigo-500 to-purple-500"
            />
          </div>

          {/* Quick Links */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                  ⚡
                </span>
                Quick Access
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <QuickLink
                  href="/admin/upload"
                  title="Single Upload"
                  description="Upload satu gambar via admin panel"
                  icon="📤"
                  gradient="from-blue-500 to-cyan-500"
                />
                <QuickLink
                  href="/gallery"
                  title="Gallery"
                  description="Lihat koleksi gambar yang sudah dioptimize"
                  icon="🖼️"
                  gradient="from-purple-500 to-pink-500"
                />
                <QuickLink
                  href="/docs"
                  title="Documentation"
                  description="API reference dan panduan lengkap"
                  icon="📚"
                  gradient="from-green-500 to-emerald-500"
                />
              </div>

              {/* CLI Commands */}
              <div className="pt-8 border-t border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            <StatCard label="Processors" value="2" icon="⚙️" />
            <StatCard label="Endpoints" value="3" icon="🔌" />
            <StatCard label="Coverage" value="Ready" icon="✅" />
            <StatCard label="Version" value="2.0" icon="🚀" />
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 pb-8">
            <p className="mb-2">Built with ❤️ using Next.js & Sharp</p>
            <p className="text-sm">© 2025 Image Optimizer Professional Edition</p>
          </div>
        </div>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function QuickLink({ href, title, description, icon, gradient }) {
  return (
    <Link href={href}>
      <div className={`group bg-gradient-to-br ${gradient} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-4xl">{icon}</div>
          <svg className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <h4 className="font-bold text-white text-lg mb-2">{title}</h4>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </Link>
  );
}

function CodeBlock({ command, description }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group">
      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors">
        <code className="block text-green-400 px-4 py-3 font-mono text-sm">
          <span className="text-gray-500">$</span> {command}
        </code>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2 ml-1">{description}</p>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
}
