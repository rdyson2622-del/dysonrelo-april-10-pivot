import React from 'react';
import { motion } from 'framer-motion';

export default function CharlieAvatar({ size = 'md', speaking = false, onClick }) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${sizes[size]}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow ring when speaking */}
      {speaking && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Main avatar circle */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 shadow-lg flex items-center justify-center overflow-hidden border-2 border-white">
        {/* Face */}
        <div className="relative w-[70%] h-[70%] flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-[20%] mb-[8%]">
            <motion.div
              className="w-[18%] aspect-square bg-slate-800 rounded-full relative"
              animate={speaking ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 2 }}
            >
              <div className="absolute top-[15%] left-[25%] w-[35%] aspect-square bg-white rounded-full" />
            </motion.div>
            <motion.div
              className="w-[18%] aspect-square bg-slate-800 rounded-full relative"
              animate={speaking ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 2, delay: 0.1 }}
            >
              <div className="absolute top-[15%] left-[25%] w-[35%] aspect-square bg-white rounded-full" />
            </motion.div>
          </div>

          {/* Mouth */}
          <motion.div
            className="w-[35%] bg-slate-800 rounded-full overflow-hidden flex items-center justify-center"
            animate={speaking ? { height: ['12%', '22%', '12%'] } : { height: '8%' }}
            transition={{ duration: 0.4, repeat: speaking ? Infinity : 0 }}
          >
            {speaking && (
              <div className="w-[60%] h-[40%] bg-red-400 rounded-full mt-auto" />
            )}
          </motion.div>
        </div>

        {/* Hair */}
        <div className="absolute top-0 left-[15%] right-[15%] h-[28%] bg-slate-700 rounded-t-full" />
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-0 right-0 w-[25%] aspect-square bg-green-400 rounded-full border-2 border-white" />
    </motion.div>
  );
}