'use client';

import { useState } from 'react';
import Image from 'next/image';

// Types for the landing page data
interface Section {
  type: string;
  props: any;
}

interface LandingPageData {
  _id: string;
  idea: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

// Component for rendering different section types
const SectionRenderer = ({ section }: { section: Section }) => {
  switch (section.type) {
    case 'hero':
      return (
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">{section.props.heading}</h1>
            <p className="text-xl mb-8">{section.props.subheading}</p>
            {section.props.buttonLabel && (
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                {section.props.buttonLabel}
              </button>
            )}
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {section.props.title && (
              <h2 className="text-3xl font-bold text-center mb-12">{section.props.title}</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.props.features?.map((feature: any, index: number) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            {section.props.title && (
              <h2 className="text-3xl font-bold text-center mb-12">{section.props.title}</h2>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              {section.props.testimonials?.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold text-blue-600">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-16 px-8 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{section.props.heading}</h2>
            <p className="text-xl mb-8">{section.props.subheading}</p>
            {section.props.buttonLabel && (
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                {section.props.buttonLabel}
              </button>
            )}
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{section.props.title}</h2>
            <p className="text-lg text-gray-600">{section.props.description}</p>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="py-16 px-8 bg-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <div className="space-y-2">
              {section.props.email && (
                <p className="text-lg">
                  Email: <a href={`mailto:${section.props.email}`} className="text-blue-600 hover:underline">
                    {section.props.email}
                  </a>
                </p>
              )}
              {section.props.phone && (
                <p className="text-lg">
                  Phone: <a href={`tel:${section.props.phone}`} className="text-blue-600 hover:underline">
                    {section.props.phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
      );

    default:
      return (
        <section className="py-8 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500">Unknown section type: {section.type}</p>
          </div>
        </section>
      );
  }
};

export default function Home() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [landingPage, setLandingPage] = useState<LandingPageData | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Sending request to API...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/landing-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data: LandingPageData = await response.json();
      console.log('Success! Generated landing page:', data);
      setLandingPage(data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the API. Make sure the backend server is running on http://localhost:3000');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLandingPage(null);
    setIdea('');
    setError('');
  };

  // If we have a generated landing page, show it
  if (landingPage) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header with reset button */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Generated Landing Page</h1>
            <button
              onClick={handleReset}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate New Page
            </button>
          </div>
        </header>

        {/* Generated landing page content */}
        <main>
          {landingPage.sections.map((section, index) => (
            <SectionRenderer key={index} section={section} />
          ))}
        </main>

        {/* Footer with metadata */}
        <footer className="bg-gray-900 text-white py-8 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400">
              Generated from idea: "{landingPage.idea}" • 
              Created: {new Date(landingPage.createdAt).toLocaleDateString()}
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Input form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Landing Page Generator
          </h1>
          <p className="text-lg text-gray-600">
            Describe your business idea and we'll generate a beautiful landing page for you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                Your Business Idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., A modern fitness app for busy professionals, An eco-friendly food delivery service, A productivity tool for remote teams..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                rows={4}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Landing Page'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Examples you can try:</h3>
            <div className="space-y-1">
              {[
                "A modern fitness app for busy professionals",
                "An eco-friendly meal planning service",
                "A productivity tool for remote teams",
                "A local bakery specializing in artisanal breads"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setIdea(example)}
                  className="block text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}