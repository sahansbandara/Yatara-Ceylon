# Task: Redesign Destinations & Packages Pages

## Objective
Elevate the luxury aesthetic and functionality of the `/destinations` and `/packages` pages in the Yatara Ceylon web app. The platform must move away from sparse "skeleton" layouts to an immersive, content-rich editorial experience.

## Key Goals
1.  **Packages Design:** Implement a premium, parallax-driven hero section and enhance the `JourneysGrid` with a sticky floating search and filter toolbar, resolving previous tag mapping logic issues.
2.  **Destinations Architecture & Detail Pages:** Establish a deeply immersive and content-rich layout for the individual district detail pages (`/destinations/[slug]/page.tsx`). This includes:
    *   Curated "At a Glance" facts (ideal for, recommended stay, mood).
    *   Luxury editorial positioning via a "The Essence" narrative.
    *   Dynamic grid of handpicked places within that district.
    *   Sidebar with concierge and bespoke tour calls-to-action.
3.  **Destinations Landing Page Preservation:** Maintain the original, highly acclaimed visual design of the `/destinations` landing page. This page should continue using the immersive `FeaturedDestinationSpotlight` and `DestinationCard` layout, showcasing destinations globally rather than strictly by mapping directly to districts.
4.  **Data Backbone:** Implement a sustainable data structure (`districtContent.ts`) to manage premium editorial copy decoupled from database operations, ensuring immediate visual impact.

## Deliverables
- [x] Restructured `/packages` page with immersive hero.
- [x] Responsive floating search/toolbar integrated into `JourneysGrid`.
- [x] Fix logic mapping for 'cultural' / 'family' in search packages.
- [x] Build editorial district data structure (`districtContent.ts`) for all 25 districts.
- [x] Radically redesign `/destinations/[slug]/page.tsx` into a content-heavy layout.
- [x] Restore `/destinations/page.tsx` to its original acclaimed design based on user feedback.
