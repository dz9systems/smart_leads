import { useState, useEffect } from "react";
import Welcome from "./pages/welcome";
import Landing from "./pages/landing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"api" | "premium" | null>(null);

  const handleApiKeyProvided = (apiKey: string) => {
    // Store API key in localStorage
    localStorage.setItem("serpApiKey", apiKey);
    setUserType("api");
    setIsAuthenticated(true);
  };

  const handleSignup = (email: string, password: string) => {
    // Handle premium signup
    console.log("Premium signup:", { email, password });
    setUserType("premium");
    setIsAuthenticated(true);
  };

  // Check if user is already authenticated on app start
  useEffect(() => {
    const savedApiKey = localStorage.getItem("serpApiKey");
    if (savedApiKey) {
      setUserType("api");
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Welcome 
        onApiKeyProvided={handleApiKeyProvided}
        onSignup={handleSignup}
      />
    );
  }

  return <Landing />;
}

export default App;