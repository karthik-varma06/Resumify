import { Link } from "react-router";
import { motion } from "framer-motion";
import { useThemeStore } from "~/lib/theme";

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const Navbar = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4"
        >
            <div className="flex items-center justify-between h-16 px-6 bg-card/80 backdrop-blur-xl border border-border rounded-full shadow-sm">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">RESUMIFY</span>
                </Link>

                <div className="flex items-center gap-3">
                    <motion.button
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.9, rotate: 15 }}
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-input border border-border text-secondary hover:text-primary transition-colors"
                        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? <MoonIcon /> : <SunIcon />}
                    </motion.button>

                    <Link to="/upload">
                        <motion.span
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload
                        </motion.span>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
