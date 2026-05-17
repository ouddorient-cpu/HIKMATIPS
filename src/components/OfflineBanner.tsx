"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setIsOnline(navigator.onLine)

        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (!mounted) return null

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 text-sm font-medium shadow-lg"
                    role="alert"
                    aria-live="polite"
                >
                    <WifiOff className="w-4 h-4 flex-shrink-0" />
                    <span>Pas de connexion — Mode hors ligne</span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
