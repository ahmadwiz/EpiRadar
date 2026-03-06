# Application Pages

This `pages` directory serves as the top-level route boundary for the EpiRadar frontend application. Every folder within this directory corresponds to a major route or view within the app.

## Directory Structure
- `/Auth`: Login and Registration flows.
- `/Home`: The public landing page explaining EpiRadar's mission.
- `/Portal`: The interactive map and AI triage tool for citizens.
- `/Hospital`: The internal dashboard for healthcare workers.

### Architecture Note 
All files in here should primarily act as "Page Components." They assemble smaller, reusable UI components (often located in `@/components`) and handle layout logic, data fetching, and context usage (such as `useAuth`) specific to that route.
