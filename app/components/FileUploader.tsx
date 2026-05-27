import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '~/lib/utils'
import { motion } from 'framer-motion'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setSelectedFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    return (
        <div className="w-full">
            <div 
                {...getRootProps()} 
                className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-border bg-input hover:border-indigo-400/50 hover:bg-card-hover'} p-8 text-center cursor-pointer`}
            >
                <input {...getInputProps()} />

                <div className="space-y-4">
                    {selectedFile ? (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center space-x-4 overflow-hidden">
                                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="text-sm font-semibold text-primary truncate">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-secondary mt-1">
                                        {formatSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="p-2 ml-4 rounded-full hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                    onFileSelect?.(null)
                                }}
                                title="Remove file"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </motion.div>
                    ): (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-4"
                        >
                            <div className="w-16 h-16 mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            </div>
                            <p className="text-lg text-primary mb-1">
                                <span className="font-semibold text-indigo-500">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-secondary">PDF (max {formatSize(maxFileSize)})</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
