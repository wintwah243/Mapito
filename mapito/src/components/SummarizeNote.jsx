import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaMagic, FaSpinner, FaExclamationTriangle, FaCopy, FaCheck, FaInfoCircle } from 'react-icons/fa';

function SummarizeNote() {
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [warning, setWarning] = useState('');
  const [summarySource, setSummarySource] = useState('');

  const handleSummarize = async () => {
    if (!note.trim()) return;

    setLoading(true);
    setError('');
    setSummary('');
    setWarning('');

    try {
      const res = await fetch('https://mapito.onrender.com/api/summarize-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          data.error ||
          (data.details ? `${data.error}: ${JSON.stringify(data.details)}` : 'Failed to summarize. Please try again.');
        throw new Error(errorMsg);
      }

      setSummary(data.summary);
      if (data.warning) setWarning(data.warning);
      setSummarySource(data.source || 'unknown');
    } catch (err) {
      let userFriendlyError = err.message;
      if (err.message.includes('Failed to summarize note')) {
        userFriendlyError =
          'Our summarization service is currently limited. The summary may be less detailed than usual.';
      } else if (err.message.includes('Hugging Face API key not configured')) {
        userFriendlyError = 'Service temporarily unavailable. Please try again later.';
      }

      setError(userFriendlyError);
      console.error('Summarization error:', err);

      if (!summary) {
        setSummary(note.length > 200 ? `${note.substring(0, 200)}...` : note);
        setWarning('Showing partial content as summary failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        setError('Failed to copy text');
      });
  };

  return (
    <section className="min-h-screen bg-white pt-20 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow-xl">
        {/* Header */}
        <header className="flex items-center mb-8">
          <FaMagic className="text-blue-600 text-3xl mr-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Summarize Your Long Notes Instantly
          </h1>
        </header>

        {/* How it Works & Why it Helps */}
        <section className="mb-10 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col space-y-4 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
            <h2 className="flex items-center text-xl font-semibold text-blue-700 mb-2">
              <FaInfoCircle className="mr-2" /> How It Works
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our smart summarization engine uses Google Gemini AI to
              analyze your long notes and extract the most important points. Simply paste your text, click
              summarize, and get a concise, easy-to-read summary in seconds.
            </p>
          </div>

          <div className="flex flex-col space-y-4 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
            <h2 className="flex items-center text-xl font-semibold text-blue-700 mb-2">
              <FaInfoCircle className="mr-2" /> Why It Helps
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Summaries save you time and boost productivity by focusing on key ideas without the clutter. This
              tool is perfect for students, professionals, or anyone who needs quick insights from lengthy texts.
            </p>
          </div>
        </section>

        {/* Input Section */}
        <section className="mb-8">
          <label htmlFor="note" className="block mb-2 text-lg font-medium text-gray-800">
            Enter Your Note
          </label>
          <textarea
            id="note"
            className="w-full rounded-lg border border-gray-300 p-4 h-52 resize-y focus:outline-none focus:ring-4 focus:ring-blue-400 transition-shadow"
            placeholder="Paste your long note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            spellCheck="false"
          />
          <button
            onClick={handleSummarize}
            disabled={loading || !note.trim()}
            className={`mt-4 w-full flex justify-center items-center rounded-lg py-3 text-white font-semibold transition ${
              loading || !note.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-800 shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <FaMagic className="mr-2" />
                Summarize
              </>
            )}
          </button>
        </section>

        {/* Output Section */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 rounded">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-600 mr-3" />
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {summary && (
          <section className="mb-10 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
            <header className="flex justify-between items-center bg-blue-100 p-4 border-b border-blue-300">
              <h3 className="flex items-center text-blue-900 font-semibold text-lg">
                <FaMagic className="mr-2" />
                Summary
              </h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-blue-700 hover:text-blue-900 transition-colors font-medium"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <FaCheck className="mr-1 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </header>
            <article className="p-6 text-gray-800 whitespace-pre-wrap leading-relaxed text-base">{summary}</article>

            {warning && (
              <div className="px-6 pb-4 text-sm text-yellow-700 font-semibold">
                ⚠️ <em>{warning}</em>
              </div>
            )}

            {summarySource && (
              <footer className="px-6 pb-6 text-xs text-blue-600 italic">
                Source: <strong>{summarySource}</strong>
              </footer>
            )}
          </section>
        )}

        {/* Intentions Section */}
        <section className="mb-12 px-6 py-8 bg-white border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Our Intentions</h2>
          <p className="text-gray-700 leading-relaxed">
            We aim to make complex information accessible and manageable. Whether you're studying for exams,
            preparing reports, or just organizing your thoughts, our tool helps you cut through the noise and
            focus on what truly matters. We continuously improve our algorithms to provide accurate, helpful
            summaries while respecting your privacy and data security.
          </p>
        </section>
      </main>

      <Footer />
    </section>
  );
}

export default SummarizeNote;
