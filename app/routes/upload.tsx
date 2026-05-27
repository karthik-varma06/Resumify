import { type FormEvent, useState } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { extractResumeText } from "~/lib/extractText";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { usePuterStore } from "~/lib/puter";
import { motion } from "framer-motion";

const Upload = () => {
    const { auth, fs, kv, ai } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);


    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };
    const handleAnalyze = async ({
        companyName,
        jobTitle,
        jobDescription,
        file
    }: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        file: File
    }) => {


        setIsProcessing(true);

        try {
            const isAuth = await auth.checkAuthStatus();

            if (!isAuth) {
                await auth.signIn();

                const isAuthNow = await auth.checkAuthStatus();

                if (!isAuthNow) {
                    setStatusText("Login failed");
                    return;
                }
            }
        

            // ✅ FILE UPLOAD
            setStatusText('Uploading file...');
            const uploadedFile = await fs.upload([file]);

            if (!uploadedFile || !uploadedFile.path) {
                setStatusText('Error: Upload failed');
                return;
            }

            // ✅ CONVERT PDF → IMAGE
            setStatusText('Converting PDF...');
            const imageFile = await convertPdfToImage(file);

            if (!imageFile.file) {
                setStatusText('Error: PDF conversion failed');
                return;
            }

            // ✅ IMAGE UPLOAD
            setStatusText('Uploading image...');
            const uploadedImage = await fs.upload([imageFile.file]);

            if (!uploadedImage || !uploadedImage.path) {
                setStatusText('Error: Image upload failed');
                return;
            }

            // ✅ TEXT EXTRACTION (PDF direct text + OCR fallback)
            setStatusText('Extracting text from resume...');
            const resumeText = await extractResumeText(
                file,
                imageFile.file,
                async (img: File) => ai.img2txt(img)
            );

            if (!resumeText || resumeText.trim().length < 20) {
                setStatusText('Error: Could not extract text from resume. Please ensure the PDF is not corrupted.');
                return;
            }

            // ✅ PREP DATA
            const uuid = generateUUID();

            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: '',
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // ✅ AI CALL
            setStatusText('Analyzing resume with AI...');

            const prompt = prepareInstructions({
                jobTitle,
                jobDescription,
                resumeText,
            });

            const feedback = await ai.feedback(uploadedFile.path, prompt);
            if (!feedback) {
                setStatusText('Error: AI analysis failed. Please try again.');
                return;
            }

            // Extract the text content from the response (unified format)
            let feedbackText: string | undefined;

            if ((feedback as any)?.choices?.[0]?.message?.content) {
                feedbackText = (feedback as any).choices[0].message.content;
            } else if ((feedback as any)?.message?.content) {
                const content = (feedback as any).message.content;
                feedbackText = typeof content === "string"
                    ? content
                    : Array.isArray(content)
                        ? content.map((c: any) => c.text || "").join("")
                        : JSON.stringify(content);
            }

            let parsedFeedback;

            if (!feedbackText) {
                parsedFeedback = { error: "No AI response" };
            } else {
                try {
                    let clean = feedbackText.trim();
                    if (clean.startsWith("```")) {
                        clean = clean.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
                    }
                    const jsonMatch = clean.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        clean = jsonMatch[0];
                    }
                    parsedFeedback = JSON.parse(clean);

                } catch (err) {
                    parsedFeedback = { raw: feedbackText };
                }
            }

            data.feedback = parsedFeedback;

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analysis complete, redirecting...');

            setTimeout(() => {
                navigate(`/resume/${uuid}`);
            }, 1500);

        } catch (err) {
            console.error(err);
            setStatusText("Something went wrong. Please try again.");
        } 
    };
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) {
            return;
        }       

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-page transition-colors duration-300"
        >
            <Navbar />

            <section className="relative z-10 px-4 pb-20 mt-12">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-2xl mx-auto w-full flex flex-col items-center"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                            Smart feedback for your dream job
                        </h1>

                        {isProcessing ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-6 mt-8"
                            >
                                <h2 className="text-xl text-secondary font-medium animate-pulse">{statusText}</h2>
                                <div className="relative p-2 rounded-3xl bg-card border border-border shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl rounded-full" />
                                    <img src="/images/resume-scan.gif" className="w-64 h-64 object-cover rounded-2xl relative z-10" alt="Scanning..." />
                                </div>
                            </motion.div>
                        ) : (
                            <p className="text-lg text-secondary">
                                Drop your resume for an ATS score and improvement tips
                            </p>
                        )}
                    </div>

                    {!isProcessing && (
                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="w-full bg-card border border-border p-8 rounded-3xl shadow-lg flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <label htmlFor="company-name" className="text-sm font-semibold text-primary">Company Name (Optional)</label>
                                <input type="text" name="company-name" id="company-name" placeholder="e.g. Google" className="w-full px-4 py-3 rounded-xl bg-input border border-border text-primary focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="job-title" className="text-sm font-semibold text-primary">Job Title</label>
                                <input type="text" name="job-title" id="job-title" placeholder="e.g. Frontend Engineer" required className="w-full px-4 py-3 rounded-xl bg-input border border-border text-primary focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="job-description" className="text-sm font-semibold text-primary">Job Description</label>
                                <textarea rows={4} name="job-description" id="job-description" placeholder="Paste the job description here..." className="w-full px-4 py-3 rounded-xl bg-input border border-border text-primary focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-y" />
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-semibold text-primary">Upload Resume (PDF)</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                                type="submit"
                                disabled={!file}
                            >
                                Analyze Resume
                            </motion.button>
                        </motion.form>
                    )}
                </motion.div>
            </section>
        </motion.main>
    );
};

export default Upload;