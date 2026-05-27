import React from 'react'
import { motion } from 'framer-motion'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const isGood = score > 69;
  const isWarn = score > 49 && score <= 69;
  
  const bgClass = isGood ? 'bg-badge-green' : isWarn ? 'bg-badge-yellow' : 'bg-badge-red';
  const textClass = isGood ? 'text-badge-green-text' : isWarn ? 'text-badge-yellow-text' : 'text-badge-red-text';

  const subtitle = isGood ? 'Great Job!' : isWarn ? 'Good Start' : 'Needs Improvement';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border shadow-sm p-6 md:p-8 ${bgClass}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-card shadow-sm ${textClass}`}>
             {isGood ? (
                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             ) : isWarn ? (
                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
             ) : (
                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
             )}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textClass}`}>ATS Score: {score}/100</h2>
            <h3 className={`text-lg font-medium opacity-80 ${textClass}`}>{subtitle}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <p className={`text-sm md:text-base opacity-90 ${textClass}`}>
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="grid gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index} 
              className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border shadow-sm"
            >
              <div className="mt-0.5 flex-shrink-0">
                {suggestion.type === "good" ? (
                   <svg className="w-5 h-5 text-badge-green-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                   <svg className="w-5 h-5 text-badge-yellow-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                )}
              </div>
              <p className={`text-sm md:text-base font-medium ${suggestion.type === "good" ? "text-badge-green-text" : "text-badge-yellow-text"}`}>
                {suggestion.tip}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ATS
