import React, { useState } from 'react';
import Navbar from './Navbar';
import { FaMagic, FaSpinner, FaExclamationTriangle, FaCopy, FaCheck } from 'react-icons/fa';

function SummarizeNote() {
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!note.trim()) return;
    
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const res = await fetch('https://mapito.onrender.com/api/summarize-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
      });

      if (!res.ok) {
        throw new Error(res.status === 429 ? 
          'Too many requests. Please try again later.' : 
          'Failed to summarize. Please try again.');
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || 'Network error. Please check your connection.');
      console.error('Summarization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setError('Failed to copy text');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <FaMagic className="text-indigo-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Summarize your note with AI</h2>
            </div>
            
            <div className="mb-6">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your note
              </label>
              <textarea
                id="note"
                className="w-full border border-gray-300 rounded-lg p-4 h-48 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Paste your long note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              onClick={handleSummarize}
              disabled={loading || !note.trim()}
              className={`flex items-center justify-center w-full px-6 py-3 rounded-lg font-medium text-white transition-all ${
                loading || !note.trim() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-indigo-700 shadow-md hover:shadow-lg'
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

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-3" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {summary && (
              <div className="mt-6 bg-indigo-50 rounded-lg overflow-hidden transition-all duration-300 border border-indigo-100">
                <div className="flex justify-between items-center p-4 bg-indigo-100 border-b border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 flex items-center">
                    <FaMagic className="mr-2" />
                    Summary
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
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
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Enter your text and get a concise summary instantly.</p>
        </div>
      </div>
    </div>
  );
}

export default SummarizeNote;
