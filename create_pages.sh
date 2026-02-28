#!/bin/bash
routes=(
    "src/app/(public)/destinations/region/[region]"
    "src/app/(public)/transfers/[...slug]"
    "src/app/(public)/build-tour/how-it-works"
    "src/app/(public)/build-tour/proposal"
    "src/app/(public)/build-tour/faqs"
    "src/app/(public)/guide/best-time-to-visit"
    "src/app/(public)/guide/regions"
    "src/app/(public)/guide/blog"
)

# Generic Next.js page template
TEMPLATE="export default function Page() {
    return (
        <div className=\"min-h-screen bg-[#0a1f15] pt-32 pb-24 flex items-center justify-center\">
            <div className=\"text-center space-y-6 max-w-2xl px-6\">
                <span className=\"text-antique-gold font-nav tracking-[0.3em] uppercase text-xs\">Coming Soon</span>
                <h1 className=\"text-4xl md:text-5xl font-display text-white\">Page Under Construction</h1>
                <p className=\"text-white/60 font-nav font-light leading-relaxed\">Our team of local specialists is currently crafting this experience. Please check back later.</p>
            </div>
        </div>
    );
}"

for dir in "${routes[@]}"; do
    mkdir -p "$dir"
    if [ ! -f "$dir/page.tsx" ]; then
        echo "$TEMPLATE" > "$dir/page.tsx"
        echo "Created: $dir/page.tsx"
    fi
done
