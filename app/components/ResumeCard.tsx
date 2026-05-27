import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import { motion } from "framer-motion";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath }, index, onDelete }: { resume: Resume, index?: number, onDelete?: () => void }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            try {
                const blob = await fs.read(imagePath);
                if(!blob) return;
                let url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (e) {
                console.error("Error loading resume image", e);
            }
        }

        loadResume();
    }, [imagePath]);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index ? index * 0.1 : 0 }}
            className="group relative"
        >
            <Link to={`/resume/${id}`} className="block h-full bg-card hover:bg-card-hover border border-border transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-glow overflow-hidden">
                <div className="flex flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-primary truncate">
                            {companyName || "Resume"}
                        </h2>
                        {jobTitle && (
                            <h3 className="text-sm font-medium text-secondary truncate">
                                {jobTitle}
                            </h3>
                        )}
                    </div>
                    <div className="flex-shrink-0 relative z-10 flex items-start gap-2">
                        <ScoreCircle score={feedback?.overallScore || 0} />
                        {onDelete && (
                            <button 
                                onClick={handleDeleteClick}
                                className="p-2 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                title="Delete resume"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        )}
                    </div>
                </div>
                
                {resumeUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 aspect-[1/1.4] flex items-center justify-center">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 aspect-[1/1.4] flex items-center justify-center animate-pulse">
                        <svg className="w-12 h-12 text-secondary opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                )}
            </Link>
        </motion.div>
    )
}
export default ResumeCard
