import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";
import { motion } from "framer-motion";

export const meta = () => ([
    { title: 'Resumify | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1] || '/';
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next, navigate])

    return (
        <main className="min-h-screen flex items-center justify-center bg-page relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-screen pointer-events-none" />

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative z-10 w-full max-w-md p-8 sm:p-12 mx-4 bg-card/80 backdrop-blur-2xl border border-border rounded-3xl shadow-2xl"
            >
                <div className="flex flex-col items-center gap-3 text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/30">
                        <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Welcome to Resumify</h1>
                    <p className="text-secondary">Log in to unlock AI-powered resume insights and land your dream job.</p>
                </div>

                <div className="w-full">
                    {isLoading ? (
                        <button disabled className="w-full py-4 rounded-xl bg-card border border-border flex items-center justify-center gap-3 text-secondary font-medium animate-pulse cursor-not-allowed">
                            <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                            Signing you in...
                        </button>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl bg-card border border-border text-primary font-bold shadow-sm hover:bg-card-hover transition-all" 
                                    onClick={auth.signOut}
                                >
                                    Log Out
                                </motion.button>
                            ) : (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2" 
                                    onClick={auth.signIn}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4L3 9.31372L10.5 13.5M20 4L14.5 21L10.5 13.5M20 4L10.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    Continue with Puter
                                </motion.button>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </main>
    )
}

export default Auth
