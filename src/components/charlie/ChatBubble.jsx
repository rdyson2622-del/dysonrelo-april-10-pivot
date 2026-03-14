import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatBubble({ message }) {
  const isCharlie = message.role === 'charlie';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`flex ${isCharlie ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isCharlie ? 'rounded-bl-sm' : 'rounded-br-sm'
        }`}
        style={isCharlie
          ? { background: '#1a1a1a', color: '#e8e8e8', border: '1px solid #2a2a2a' }
          : { background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#000', fontWeight: 500 }
        }
      >
        {isCharlie ? (
          <ReactMarkdown
            className="prose prose-sm max-w-none"
            components={{
              p: ({ children }) => <p className="my-1 text-gray-200">{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#D4AF37' }}>{children}</strong>,
              ul: ({ children }) => <ul className="my-1 ml-3 list-disc text-gray-300">{children}</ul>,
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