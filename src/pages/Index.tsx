
import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";
import { Dashboard } from "@/components/Dashboard";
import { ExtractionForm } from "@/components/ExtractionForm";
import { ProgressScreen } from "@/components/ProgressScreen";
import { ResultsViewer } from "@/components/ResultsViewer";
import { SettingsPanel } from "@/components/SettingsPanel";

export type Screen = 'landing' | 'dashboard' | 'extraction' | 'progress' | 'results' | 'settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setCurrentScreen('dashboard');
  };

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentScreen('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateToScreen} />;
      case 'extraction':
        return <ExtractionForm onNavigate={navigateToScreen} />;
      case 'progress':
        return <ProgressScreen onNavigate={navigateToScreen} />;
      case 'results':
        return <ResultsViewer onNavigate={navigateToScreen} />;
      case 'settings':
        return <SettingsPanel onNavigate={navigateToScreen} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentScreen()}
      
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}
    </div>
  );
};

export default Index;
