import { type FormEvent, useState } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { usePuterStore } from "~/lib/puter";

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

            console.log("UPLOAD:", uploadedFile);

            if (!uploadedFile || !uploadedFile.path) {
                setStatusText('Error: Upload failed');
                return;
            }

            // ✅ CONVERT PDF → IMAGE
            setStatusText('Converting PDF...');
            const imageFile = await convertPdfToImage(file);
            console.log("PDF RESULT:", imageFile);

            if (!imageFile.file) {
                setStatusText('Error: PDF conversion failed');
                return;
            }

            // ✅ IMAGE UPLOAD
            setStatusText('Uploading image...');
            const uploadedImage = await fs.upload([imageFile.file]);

            console.log("IMAGE UPLOAD:", uploadedImage);

            if (!uploadedImage || !uploadedImage.path) {
                setStatusText('Error: Image upload failed');
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
            setStatusText('Analyzing...');

            const prompt = prepareInstructions({
                jobTitle,
                jobDescription
            });

            const feedback = await ai.feedback(uploadedFile.path, prompt);
            console.log("🔥 RAW FEEDBACK:", feedback);
            if (!feedback) {
                setStatusText('Error: AI failed');
                return;
            }

            let feedbackText;

            if ((feedback as any)?.choices) {
                // OpenRouter style
                feedbackText = (feedback as any).choices[0].message.content;
            } else if ((feedback as any)?.message) {
                // Puter style
                feedbackText = typeof feedback.message.content === "string"
                    ? feedback.message.content
                    : feedback.message.content[0].text;
            }
            console.log("🧠 EXTRACTED TEXT:", feedbackText);

            let parsedFeedback;

            if (!feedbackText) {
                console.log("❌ EMPTY RESPONSE (likely 429)");
                parsedFeedback = { error: "No AI response" };
            } else {
                try {
                    let clean = feedbackText;

                    if (clean.startsWith("```")) {
                        clean = clean.replace(/```json/g, "").replace(/```/g, "").trim();
                    }

                    parsedFeedback = JSON.parse(clean);

                } catch (err) {
                    console.log("❌ PARSE FAILED:", feedbackText);
                    parsedFeedback = { raw: feedbackText };
                }
            }

            data.feedback = parsedFeedback;

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analysis complete, redirecting...');
            console.log("FINAL DATA:", data);

            setTimeout(() => {
                navigate(`/resume/${uuid}`);
            }, 1500);

        } catch (err) {
            console.error(err);
            setStatusText("Something broke");
        } 
    };
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("FORM SUBMITTED");
        const formData = new FormData(e.currentTarget);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) {
            console.log("NO FILE SELECTED");
            return;
        }       

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}

                    {!isProcessing && (
                        <form
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mt-8"
                        >

                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" id="company-name" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" id="job-title" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label>Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};



export default Upload;