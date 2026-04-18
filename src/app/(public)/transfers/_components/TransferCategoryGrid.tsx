'use client';

import { motion } from 'framer-motion';
import TransferCategoryTile from '@/components/public/transfers/TransferCategoryTile';
import { transferCategoryCards } from '@/data/transfers';

const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const cardReveal = {
    hidden: { opacity: 0, y: 32, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function TransferCategoryGrid() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {transferCategoryCards.map((category) => (
                <motion.div key={category.slug} variants={cardReveal}>
                    <TransferCategoryTile
                        slug={category.slug}
                        title={category.title}
                        subtitle={category.subtitle}
                        image={category.image}
                        startingFromLkr={category.startingFromLkr}
                        typicalDuration={category.typicalDuration}
                        bestFor={category.bestFor}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
