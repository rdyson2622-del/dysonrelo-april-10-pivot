import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatBubble({ message }) {
  const isCharlie = message.role === 'charlie';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex ${isCharlie ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isCharlie
            ? 'bg-slate-100 text-slate-800 rounded-bl-sm'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-sm'
        }`}
      >
        {isCharlie ? (
          <ReactMarkdown
            className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            components={{
              p: ({ children }) => <p className="my-1">{children}</p>,
              ul: ({ children }) => <ul className="my-1 ml-3 list-disc">{children}</ul>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </motion.div>
  );
}