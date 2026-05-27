import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { motion } from "framer-motion";
import Navbar from "~/components/Navbar";

export const meta = () => [
  { title: "Resumify | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, id, navigate]);

  useEffect(() => {
    let resumeUrlTemp = "";
    let imageUrlTemp = "";

    const loadResume = async () => {
      if (!id) return;

      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      try {
          const resumeBlob = await fs.read(data.resumePath);
          if (resumeBlob) {
              const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
              resumeUrlTemp = URL.createObjectURL(pdfBlob); 
              setResumeUrl(resumeUrlTemp);
          }
      } catch (e) {
          console.error("Resume blob missing", e);
      }

      try {
          const imageBlob = await fs.read(data.imagePath);
          if (imageBlob) {
              imageUrlTemp = URL.createObjectURL(imageBlob); 
              setImageUrl(imageUrlTemp);
          }
      } catch (e) {
          console.error("Image blob missing", e);
      }

      const safeFeedback = {
        overallScore: data.feedback?.overallScore || 0,
        ATS: data.feedback?.ATS || { score: 0, tips: [] },
        toneAndStyle: data.feedback?.toneAndStyle || { score: 0, tips: [] },
        content: data.feedback?.content || { score: 0, tips: [] },
        structure: data.feedback?.structure || { score: 0, tips: [] },
        skills: data.feedback?.skills || { score: 0, tips: [] },
      };

      setFeedback(safeFeedback);
    };

    loadResume();

    return () => {
      if (resumeUrlTemp) URL.revokeObjectURL(resumeUrlTemp);
      if (imageUrlTemp) URL.revokeObjectURL(imageUrlTemp);
    };
  }, [id, fs, kv]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-page transition-colors duration-300 flex flex-col"
    >
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left column - Document Preview */}
        <section className="w-full lg:w-5/12 xl:w-1/2 h-[calc(100vh-140px)] sticky top-28 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-primary hover:bg-card-hover transition-colors font-medium text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Dashboard
            </Link>
            
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors font-medium text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download PDF
              </a>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-card border border-border rounded-2xl overflow-hidden shadow-lg p-2 flex items-center justify-center"
          >
            {imageUrl ? (
              <div className="w-full h-full relative rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                <img
                  src={imageUrl}
                  className="max-w-full max-h-full object-contain"
                  alt="resume preview"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-border border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Right column - Feedback */}
        <section className="w-full lg:w-7/12 xl:w-1/2 flex flex-col gap-6 pb-20 pt-10 lg:pt-0">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </span>
            Analysis Results
          </motion.h2>

          {feedback ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-8"
            >
              <Summary feedback={feedback} />
              <ATS
                score={feedback?.ATS?.score || 0}
                suggestions={feedback?.ATS?.tips || []}
              />
              <Details feedback={feedback} />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-3xl"
            >
              <div className="relative p-2 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 mb-6">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl rounded-full" />
                 <img src="/images/resume-scan-2.gif" className="w-48 h-48 object-cover rounded-xl relative z-10 mix-blend-screen" alt="Loading analysis..." />
              </div>
              <p className="text-xl font-medium text-secondary animate-pulse">Loading analysis...</p>
            </motion.div>
          )}
        </section>
      </div>
    </motion.main>
  );
};

export default Resume;