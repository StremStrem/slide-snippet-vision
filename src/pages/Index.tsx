
import { useEffect, useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";
import { Dashboard } from "@/components/Dashboard";
import { ExtractionForm } from "@/components/ExtractionForm";
import { ProgressScreen } from "@/components/ProgressScreen";
import { ResultsViewer } from "@/components/ResultsViewer";
import { SettingsPanel } from "@/components/SettingsPanel";

//Frontend Authentication
import {auth} from "../lib/firebase";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { useAuth } from "@/components/AuthContext";

export type Screen = 'landing' | 'dashboard' | 'extraction' | 'progress' | 'results' | 'settings';


const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useAuth(); //USER
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authTab, setAuthTab] = useState("signup");

  //Redirect user if unauthorized. [AUTH]
  useEffect(() => {
    if (!user) {
      setCurrentScreen("landing");
    }
  }, [user]);


  useEffect(() => {
  console.log(email);
  console.log(password);
  console.log(authTab);
},[email,password,authTab]);

  const handleAuth = async () => {
    //Handle user login/signup
    try {
      if (authTab==="signup"){
        console.log(email);
        console.log(password);
        console.log("Creating account...");
        await createUserWithEmailAndPassword(auth, email, password);
        // setIsAuthenticated(true);
        setShowAuthModal(false);
        setCurrentScreen('dashboard');
      } else if (authTab==="login"){
        await signInWithEmailAndPassword(auth, email, password);
        console.log(email);
        console.log(password);
        console.log("Logging in...");
        // setIsAuthenticated(true);
        setShowAuthModal(false);
        setCurrentScreen('dashboard');
      }
    } catch (err) {
      console.log(email);
      console.log(password);
      console.log("failed to signup or login:", err);
    }
  };

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleGetStarted = () => {
    if (user) {
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
        return <Dashboard onNavigate={navigateToScreen} />; //Is a Protected Route
      case 'extraction':
        return <ExtractionForm onNavigate={navigateToScreen} />; //Is a Protected Route
      case 'progress':
        return <ProgressScreen onNavigate={navigateToScreen} />; //Is a Protected Route
      case 'results':
        return <ResultsViewer onNavigate={navigateToScreen} />; //Is a Protected Route
      case 'settings':
        return <SettingsPanel onNavigate={navigateToScreen} />; //Is a Protected Route
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
          onTabChange={setAuthTab}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />
      )}
    </div>
  );
};

export default Index;
