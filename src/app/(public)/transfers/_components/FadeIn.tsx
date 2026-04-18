'use client';

import { motion } from 'framer-motion';

export default function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
