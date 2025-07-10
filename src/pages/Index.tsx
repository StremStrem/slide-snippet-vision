import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";

//Frontend Authentication
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/components/AuthContext";

const Index = () => {
  const user = useAuth(); // USER
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authTab, setAuthTab] = useState("signup");

  useEffect(() => {
    console.log(email);
    console.log(password);
    console.log(authTab);
  }, [email, password, authTab]);

  const handleAuth = async () => {
    // Handle user login/signup
    try {
      if (authTab === "signup") {
        console.log(email);
        console.log(password);
        console.log("Creating account...");
        await createUserWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
      } else if (authTab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        console.log(email);
        console.log(password);
        console.log("Logging in...");
        setShowAuthModal(false);
      }
    } catch (err) {
      console.log(email);
      console.log(password);
      console.log("failed to signup or login:", err);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, App.tsx routing will redirect to /dashboard automatically
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingPage/>

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
