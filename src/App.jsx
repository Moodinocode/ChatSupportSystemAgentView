import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import TicketsViewPage from "./Pages/TicketsViewPage";
import { AuthProvider } from "./Context/AuthContext";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route  path="login" element={<LoginPage/>} />
        <Route path="register" element={<RegistrationPage/>} />
        
        
        <Route element={<ProtectedRoute />}>
          <Route index element={<TicketsViewPage/>} />
        </Route>

        
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;
