# Portal

This directory houses the core public-facing application: the Live Operational Radar and AI Health Advisor.

## Key Files
- `PublicPortal.tsx`: A highly complex, interactive map interface integrating Leaflet, GSAP, and Anthropics' Claude AI.

## Functionality
- **Interactive Global Map**: Utilizes `Leaflet` to map out active global disease clusters (Malaria, Cholera, Dengue, Influenza, etc.).
- **Visual Heat/Spread Analysis**: Generates geographic "zones" (radii) based on outbreak severity and case counts, and draws visual bridges (dashed lines and tapering corridors) between nearby outbreaks of the same disease to indicate regional spread.
- **Geolocation & Triage**: Users can click "Locate Me" to pinpoint their coordinates and automatically calculate their distance to documented active outbreaks.
- **AI Health Advisor**: Integrates directly with Anthropic's `claude-sonnet` model. By clicking on a specific threat or providing their location, the AI generates a situational overview, top 3 immediate priorities, and advice on when to seek help, all tailored to low-resource settings and cultural sensitivities.
