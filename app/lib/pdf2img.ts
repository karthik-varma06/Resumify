import worker from "pdfjs-dist/build/pdf.worker?url";

export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}


export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        // prevent SSR crash
        if (typeof window === "undefined") {
            return {
                imageUrl: "",
                file: null,
                error: "SSR environment",
            };
        }
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return {
                imageUrl: "",
                file: null,
                error: "Canvas context not available",
            };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderTask = page.render({
            canvasContext: context,
            viewport,
        } as any);

        await renderTask.promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return resolve({
                        imageUrl: "",
                        file: null,
                        error: "Blob creation failed",
                    });
                }

                const imageFile = new File(
                    [blob],
                    file.name.replace(/\.pdf$/i, ".png"),
                    { type: "image/png" }
                );

                resolve({
                    imageUrl: URL.createObjectURL(blob),
                    file: imageFile,
                });
            });
        });

    } catch (err) {
        console.error("PDF ERROR:", err);

        return {
            imageUrl: "",
            file: null,
            error: String(err),
        };
    }
}