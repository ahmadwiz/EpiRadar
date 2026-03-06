# EpiRadar

> **Predict outbreak hotspots, estimate hospital resource needs, and route resources with minimal manual effort.**

EpiRadar is a state-of-the-art AI-driven platform designed to monitor, predict, and mitigate the spread of infectious diseases. By aggregating anonymized hospital data and applying advanced spatial clustering, we provide real-time insights into emerging health threats — days before traditional systems catch them.

## 🎯 Key Features

- **AI-Powered Predictions** - Advanced machine learning algorithms to forecast disease outbreaks before they become critical
- **Real-time Monitoring** - Live tracking of disease hotspots across multiple regions using hospital data
- **HIPAA Compliant** - Secure, anonymized data handling for hospital partners
- **Multi-role Access** - Separate dashboards for hospitals and public health users
- **Interactive Map** - Global outbreak visualization with disease severity indicators
- **Resource Optimization** - Intelligent recommendations for hospital resource allocation

## 🏗️ Project Structure

```
EpiRadar/
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   │   └── RootLayout/          # Main app layout with navbar/footer
│   │   ├── pages/
│   │   │   ├── Auth/                # Login page
│   │   │   ├── Home/                # Public homepage
│   │   │   ├── Hospital/            # Hospital dashboard (protected)
│   │   │   └── Portal/              # Public portal with global map
│   │   └── router.tsx               # Route configuration
│   ├── components/
│   │   ├── Orb.tsx                  # Animated 3D orb component
│   │   ├── ProtectedRoute.tsx        # Role-based route protection
│   │   └── ui/                       # Reusable UI components
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication state management
│   ├── styles/
│   │   └── globals.css               # Global styles
│   └── main.tsx                      # React entry point
├── public/                           # Static assets
├── package.json
├── vite.config.ts                    # Vite configuration with path aliases
├── tsconfig.json                     # TypeScript configuration
└── tailwind.config.js                # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.8+ (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EpiRadar
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies** (from the `backend/` directory)
   ```bash
   pip install -r requirements.txt
   ```

### Running the Development Server

1. **Start the backend** (Flask API on `http://localhost:5000`)
   ```bash
   cd ../backend
   python app.py
   ```

2. **Start the frontend development server** (in the `EpiRadar/` directory)
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (or the port shown in terminal)

## 📦 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **Tailwind CSS** - Utility-first CSS framework
- **React Router 7** - Client-side routing with role-based protection
- **Tabler Icons & Lucide React** - Icon libraries
- **OGL** - WebGL library for 3D graphics (animated orb effect)
- **Motion** - Animation library
- **ESLint** - Code quality and linting

### Backend
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **bcrypt** - Password hashing and verification

## 🔐 Authentication & Authorization

EpiRadar implements role-based access control (RBAC) with two main user roles:

### **Hospital Role**
- Access to `/hospital/dashboard`
- Dedicated analytics and resource management interface
- Hospital-specific data and insights

### **User/Public Role**
- Access to `/portal` for public health data
- View global outbreak map
- Access to anonymized epidemiological insights

### **Authentication Flow**
1. User logs in via `/login` page
2. Backend validates credentials and returns role and auth token
3. Token stored in localStorage for session persistence
4. Protected routes use `ProtectedRoute` component to verify user role
5. Unauthorized access redirects to login page

## 📄 Pages & Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | HomePage | Public | Landing page with platform overview |
| `/login` | Login | Public | User authentication |
| `/portal` | PublicPortal | Public | Interactive global disease outbreak map |
| `/hospital/dashboard` | HospitalDashboard | Hospital Only | Hospital-specific analytics dashboard |

## 🎨 Design & UI

- **Modern Gradient Design** - EpiRadar branding with green gradient (#a8edcb to #4aad2a)
- **Responsive Layout** - Mobile-first design using Tailwind CSS
- **Interactive Elements** - Animated 3D orb on homepage using OGL library
- **Accessible Navigation** - Resizable navbar for optimal UX
- **Dark Mode Ready** - Extensible color system for light/dark themes

## 🔄 State Management

- **React Context API** - `AuthContext` manages global authentication state
- **Local Storage** - Persists user info and auth tokens between sessions
- **Component State** - useState hooks for UI state (forms, modals, etc.)

## 🛠️ Available Scripts

```bash
# Start development server with HMR
npm run dev

# Type check and build for production
npm run build

# Run ESLint to check code quality
npm lint

# Preview production build locally
npm run preview
```

## 🌐 API Integration

The frontend communicates with the backend API (default: `http://localhost:5000/api`) for:

- **`POST /api/login`** - User authentication
- **`POST /api/register`** - User registration
- **Additional endpoints** - Epidemic data, hospital metrics, resource recommendations

> 💡 **Production Note:** Update the `API_BASE_URL` in [AuthContext.tsx](src/context/AuthContext.tsx) for production deployments.

## 🚨 Key Components

### **Orb Component** (`Orb.tsx`)
Animated 3D orb using OGL/WebGL. Features:
- Dynamic hue and rotation
- Hover intensity effects
- Performance optimized rendering

### **ProtectedRoute Component** (`ProtectedRoute.tsx`)
Role-based route protection wrapper:
- Checks user authentication status
- Verifies required role access
- Redirects unauthorized users to login

### **AuthContext** (`AuthContext.tsx`)
Global authentication state provider:
- Login/Register functions
- User session persistence
- Role-based state management

## 📱 Responsive Design

- Uses `clamp()` for fluid typography
- Tailwind breakpoints for responsive layouts
- Mobile-optimized navigation
- Touch-friendly interactive elements

## 🔒 Security Considerations

- **HIPAA Compliance** - For handling protected health information (PHI)
- **Password Hashing** - bcrypt on backend for secure password storage
- **Token-based Auth** - JWT tokens for API authentication (stored in localStorage)
- **CORS Enabled** - Backend configured to accept requests from frontend domain
- **Data Anonymization** - Hospital data aggregated and anonymized before analysis

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### Backend API Connection Error
- Ensure Flask backend is running on `http://localhost:5000`
- Check CORS configuration in `backend/app.py`
- Verify API endpoint in [AuthContext.tsx](src/context/AuthContext.tsx)

### TypeScript Type Errors
```bash
# Run type check
tsc --noEmit

# Or let Vite handle it during build
npm run build
```

## 📚 Project Statistics

- **Frontend Pages:** 4 main pages (Home, Login, Hospital Dashboard, Public Portal)
- **Components:** 10+ reusable React components
- **Routes:** 6 route paths with role-based protection
- **TypeScript Coverage:** ~80% of codebase
- **Dependencies:** 9 production + 10 dev dependencies

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Follow the TypeScript and ESLint configuration
3. Test component behavior with various user roles
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to branch and create a Pull Request

## 📋 Future Enhancements

- [ ] Real-time notifications for outbreak alerts
- [ ] Advanced predictive analytics with ML models
- [ ] Hospital collaboration tools
- [ ] Mobile app (React Native)
- [ ] 3D globe visualization improvements
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Advanced filtering and search on disease outbreaks

## 📄 License

[Add your license information here]

## 📞 Support

For issues, questions, or feature requests, please open an issue or contact the development team.

---

**Built with ❤️ for global health**

