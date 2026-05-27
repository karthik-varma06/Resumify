import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { motion } from "framer-motion";

const Category = ({ title, score, index }: { title: string, score: number, index: number }) => {
    const textColor = score > 70 ? 'text-badge-green-text'
            : score > 49
        ? 'text-badge-yellow-text' : 'text-badge-red-text';

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center justify-between p-4 bg-input border border-border rounded-2xl hover:border-indigo-500/30 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                    {score > 70 ? (
                        <svg className="w-5 h-5 text-badge-green-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    ) : score > 49 ? (
                        <svg className="w-5 h-5 text-badge-yellow-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    ) : (
                        <svg className="w-5 h-5 text-badge-red-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-primary">{title}</h3>
                    <div className="mt-1 flex">
                        <ScoreBadge score={score} />
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-3xl font-bold flex items-baseline gap-1">
                    <span className={textColor}>{score}</span>
                    <span className="text-secondary text-lg font-medium">/100</span>
                </p>
            </div>
        </motion.div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-card border border-border rounded-3xl shadow-sm p-6 md:p-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-border">
                <div className="flex-shrink-0">
                    <ScoreGauge score={feedback.overallScore} />
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-primary">Your Resume Score</h2>
                    <p className="text-secondary">
                        This score reflects the overall strength of your resume based on ATS compatibility, content quality, formatting, and keyword optimization.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Category index={1} title="Tone & Style" score={feedback.toneAndStyle.score} />
                <Category index={2} title="Content" score={feedback.content.score} />
                <Category index={3} title="Structure" score={feedback.structure.score} />
                <Category index={4} title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary
