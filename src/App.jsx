import React, { useState, useMemo } from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';
import TopicCard from './components/TopicCard';
import SearchBar from './components/SearchBar';
import topicsData from './data/topics.json';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Filter Logic
  const filteredTopics = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return topicsData.filter(topic => {
      const matchesTitle = topic.title.toLowerCase().includes(term);
      const matchesSubtopic = topic.subtopics.some(sub => {
        const subName = typeof sub === 'string' ? sub : sub.name;
        return subName.toLowerCase().includes(term);
      });
      return matchesTitle || matchesSubtopic;
    });
  }, [searchTerm]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Learning Topics
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your learning journey
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search topics or subtopics..."
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Showing {filteredTopics.length} topics
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => (
              <TopicCard key={index} topic={topic} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No topics found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400 dark:text-gray-600 pb-8">
          <p>Built for Abhilash • Generated from Excel Workbook</p>
        </footer>

      </div>
    </div>
  );
}

export default App;
