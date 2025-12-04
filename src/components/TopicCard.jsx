import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';

const TopicCard = ({ topic }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Function to get status badge color
    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
        const statusLower = status.toLowerCase();
        if (statusLower.includes('completed') || statusLower.includes('done')) {
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        } else if (statusLower.includes('in progress') || statusLower.includes('ongoing')) {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        } else if (statusLower.includes('pending') || statusLower.includes('not started')) {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 cursor-pointer flex items-center justify-between group"
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {topic.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {topic.subtopics.length} subtopics
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {topic.overallStatus && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(topic.overallStatus)}`}>
                            {topic.overallStatus}
                        </span>
                    )}
                    {topic.link && (
                        <a
                            href={topic.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Open Documentation"
                        >
                            <ExternalLink size={18} />
                        </a>
                    )}
                    <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                    >
                        <ul className="p-5 pt-2 space-y-2">
                            {topic.subtopics.map((sub, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start justify-between gap-2 text-gray-600 dark:text-gray-300 text-sm pl-2 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                                >
                                    <span className="py-1">{typeof sub === 'string' ? sub : sub.name}</span>
                                    {typeof sub === 'object' && sub.status && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    )}
                                </motion.li>
                            ))}
                            {topic.subtopics.length === 0 && (
                                <li className="text-sm text-gray-400 italic pl-2">No subtopics listed.</li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TopicCard;
