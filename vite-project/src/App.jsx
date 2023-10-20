import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "styled-components";
import "./App.css";

import Home from "./routes/home";
import Profile from "./routes/profile";
import Layout from "./components/layout";
import Login from "./routes/login";
import Signup from "./routes/signup";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    // wait for firebase to check token and cookies
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // user가 있으면 Layout을 보여주고 없으면 Login을 보여준다.
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      // outlet 
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile", element: <Profile /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
  ]);

  return <Wrapper>{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}</Wrapper>;
}

export default App;
