import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LockScreen from "./components/LockScreen";
import routes from "tempo-routes";
import { getCurrentUser } from "./utils/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {!isAuthenticated ? (
          <LockScreen onAuthenticate={handleAuthentication} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        )}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
