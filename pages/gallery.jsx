import Head from 'next/head';
import Link from 'next/link';
import { GalleryGrid } from '../components/Gallery';

export default function GalleryPage() {
  return (
    <>
      <Head>
        <title>Gallery - Image Optimizer</title>
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
                  <span className="text-indigo-600 font-medium cursor-pointer">Gallery</span>
                </Link>
                <Link href="/docs">
                  <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Docs</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <GalleryGrid />
        </main>
      </div>
    </>
  );
}
