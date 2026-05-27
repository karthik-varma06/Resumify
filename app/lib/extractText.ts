import worker from "pdfjs-dist/build/pdf.worker?url";

/**
 * Extract text from a PDF file using pdfjs-dist's built-in text content layer.
 * This works for all digitally-created PDFs (the vast majority of resumes).
 * Returns the concatenated text of ALL pages.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
    if (typeof window === "undefined") {
        return "";
    }

    try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const pageTexts: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            pageTexts.push(pageText);
        }

        return pageTexts.join("\n\n").trim();
    } catch (err) {
        console.error("PDF text extraction error:", err);
        return "";
    }
}

/**
 * Extract text from a resume PDF.
 * Strategy:
 *   1. Try direct PDF text extraction via pdfjs-dist (fast, accurate for digital PDFs)
 *   2. If that yields no text (scanned/image PDF), fall back to Puter OCR (img2txt)
 *
 * @param file         The original PDF File object
 * @param imageFile    The PNG File converted from the PDF (for OCR fallback)
 * @param puterImg2txt The Puter ai.img2txt function
 */
export async function extractResumeText(
    file: File,
    imageFile: File,
    puterImg2txt: (image: File) => Promise<string | undefined>
): Promise<string> {
    // Step 1: Try direct text extraction
    console.log("📄 Attempting direct PDF text extraction...");
    const directText = await extractTextFromPdf(file);

    if (directText && directText.length > 50) {
        console.log(`✅ Direct extraction succeeded (${directText.length} chars)`);
        return directText;
    }

    // Step 2: Fall back to OCR via Puter img2txt
    console.log("🔍 Direct extraction yielded little text. Falling back to OCR...");
    try {
        const ocrText = await puterImg2txt(imageFile);
        if (ocrText && ocrText.length > 20) {
            console.log(`✅ OCR extraction succeeded (${ocrText.length} chars)`);
            return ocrText;
        }
    } catch (err) {
        console.error("❌ OCR fallback failed:", err);
    }

    // Step 3: If both fail, return whatever we got from direct extraction
    if (directText) {
        console.warn("⚠️ OCR also failed. Using partial direct text.");
        return directText;
    }

    return "";
}
