# Auth

This directory contains the authentication interfaces for the EpiRadar platform.

## Key Files
- `Login.tsx`: A visually styled login component that authenticates users utilizing the overarching `AuthContext`. 

## Functionality
- **Role-based Routing**: Upon successful login, the application checks the user's role and automatically routes them to either the `/hospital/dashboard` (for healthcare administrators) or the `/portal` (for general public users).
- **UI/UX**: Features animated decorative elements (blobs), loading states, error handling, and a clean, accessible layout designed for quick entry.
