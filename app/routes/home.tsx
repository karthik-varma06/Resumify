import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumify | Dashboard" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  const loadResumes = async () => {
    setLoadingResumes(true);
    const resumes = (await kv.list('resume:*', true)) as KVItem[];
    const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
    ))
    setResumes(parsedResumes || []);
    setLoadingResumes(false);
  }

  useEffect(() => {
    loadResumes()
  }, []);

  const handleDeleteAll = async () => {
    if (confirm("Are you sure you want to clear all your resumes? This action cannot be undone.")) {
      setLoadingResumes(true);
      const files = (await fs.readDir("./")) as FSItem[];
      for (const file of files) {
          await fs.delete(file.path);
      }
      await kv.flush();
      await loadResumes();
    }
  };

  const handleDelete = async (id: string, imagePath: string, resumePath: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
        setResumes(prev => prev.filter(r => r.id !== id));
        await kv.delete(`resume:${id}`);
        try {
            if (imagePath) await fs.delete(imagePath);
            if (resumePath) await fs.delete(resumePath);
        } catch(e) {
            console.error("Error deleting files", e);
        }
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-page transition-colors duration-300"
    >
      <Navbar />

      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col items-center gap-4 py-16 text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Track Your Applications
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-secondary"
          >
            {!loadingResumes && resumes?.length === 0 
              ? "No resumes found. Upload your first resume to get feedback."
              : "Review your submissions and check AI-powered feedback."}
          </motion.p>
          
          {!loadingResumes && resumes?.length > 0 && (
             <motion.button
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleDeleteAll}
               className="mt-4 px-6 py-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-semibold flex items-center gap-2 border border-red-500/20 hover:border-red-500 shadow-sm"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
               Clear All Data
             </motion.button>
          )}
        </div>

        {loadingResumes && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </motion.div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            <AnimatePresence>
              {resumes.map((resume, index) => (
                  <ResumeCard 
                    key={resume.id} 
                    resume={resume} 
                    index={index}
                    onDelete={() => handleDelete(resume.id, resume.imagePath, resume.resumePath)}
                  />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center mt-10 gap-4"
            >
              <Link to="/upload" className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Your First Resume
              </Link>
            </motion.div>
        )}
      </section>
    </motion.main>
  )
}
