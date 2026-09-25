import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './index.css';
import db from './data/database.js';
import questionBank from './data/questionBank.js';

// AI Assistant
import { AIProvider } from './context/AIContext.jsx';
import AIAssistantOrb from './components/AIAssistantOrb.jsx';
import AIAssistantDrawer from './components/AIAssistantDrawer.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import Learning from './pages/Learning.jsx';
import LearningModule from './pages/LearningModule.jsx';
import PracticeExam from './pages/PracticeExam.jsx';
import ExamSimulation from './pages/ExamSimulation.jsx';
import QuestionBankPage from './pages/QuestionBankPage.jsx';
import Progress from './pages/Progress.jsx';
import Mistakes from './pages/Mistakes.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Settings from './pages/Settings.jsx';
import ExamSession from './pages/ExamSession.jsx';
import ExamResults from './pages/ExamResults.jsx';
import Admin from './pages/Admin.jsx';

// Context
export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

// Navigation items
const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊', section: 'main' },
  { path: '/learning', label: 'Learning', icon: '📚', section: 'main' },
  { path: '/practice', label: 'Practice Exam', icon: '✏️', section: 'exam' },
  { path: '/simulation', label: 'Exam Simulation', icon: '🎯', section: 'exam' },
  { path: '/questions', label: 'Question Bank', icon: '🗃️', section: 'study' },
  { path: '/progress', label: 'Progress', icon: '📈', section: 'study' },
  { path: '/mistakes', label: 'Mistakes Review', icon: '🔍', section: 'study' },
  { path: '/bookmarks', label: 'Bookmarks', icon: '🔖', section: 'study' },
  { path: '/admin', label: 'Admin', icon: '⚙️', section: 'admin' },
  { path: '/settings', label: 'Settings', icon: '🔧', section: 'admin' },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const stats = db.getOverallStats();
  const reviewCount = db.getReviewQueue().length;

  const sections = {
    main: 'Overview',
    exam: 'Examination',
    study: 'Study Tools',
    admin: 'Management'
  };

  let currentSection = '';

  return (
    <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">dM</div>
        <div>
          <div className="sidebar-title">dMAT Prep</div>
          <div className="sidebar-subtitle">General Academic Module</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const showSection = item.section !== currentSection;
          if (showSection) currentSection = item.section;

          return (
            <div key={item.path}>
              {showSection && (
                <div className="nav-section-label">{sections[item.section]}</div>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
                end={item.path === '/'}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.path === '/mistakes' && stats.unmasteredMistakes > 0 && (
                  <span className="nav-item-badge">{stats.unmasteredMistakes}</span>
                )}
                {item.path === '/' && reviewCount > 0 && (
                  <span className="nav-item-badge">{reviewCount}</span>
                )}
              </NavLink>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function PageHeader({ title, children }) {
  return (
    <header className="main-header">
      <h1>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {children}
      </div>
    </header>
  );
}

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide sidebar during exam sessions
  const isExamSession = location.pathname.startsWith('/exam-session');

  if (isExamSession) {
    return (
      <>
        <Routes>
          <Route path="/exam-session/:examId" element={<ExamSession />} />
        </Routes>
        <AIAssistantOrb />
        <AIAssistantDrawer />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="app-main">
        <button
          className="btn btn-ghost mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'none',
            position: 'fixed', top: 12, left: 12, zIndex: 200,
            fontSize: '1.5rem'
          }}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:moduleId" element={<LearningModule />} />
          <Route path="/learning/:moduleId/:topicId" element={<LearningModule />} />
          <Route path="/practice" element={<PracticeExam />} />
          <Route path="/simulation" element={<ExamSimulation />} />
          <Route path="/questions" element={<QuestionBankPage />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/results/:examId" element={<ExamResults />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <AIAssistantOrb />
      <AIAssistantDrawer />
    </div>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    questionBank.initialize();
    setInitialized(true);
  }, []);

  const refresh = () => setRefreshKey(k => k + 1);

  if (!initialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Initializing dMAT Question Bank…</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ db, questionBank, refresh, refreshKey }}>
      <BrowserRouter>
        <AIProvider>
          <AppContent />
        </AIProvider>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
