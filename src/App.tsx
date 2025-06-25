import { Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ProjectList from "./pages/ProjectList";
//import ProjectDetails from "./pages/ProjectDetails";
import Dashboard from "./pages/Dashboard";
import TestCaseList from "./pages/TestCaseList";
import TestSuiteList from "./pages/TestSuiteList";
import BugList from "./pages/BugList";
// import TestExecutionList from './pages/TestExecutionList'
import Reports from "./pages/Reports";
import Permissions from "./pages/Permissions";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProjectProvider from "./contexts/ProjectContext";
import SuiteProvider from "./contexts/SuiteContext";
import TestCaseProvider from "./contexts/TestCaseContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <AuthProvider>
        <ProjectProvider>
          <SuiteProvider>
            <TestCaseProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/projetos"
                  element={
                    <PrivateRoute>
                      <ProjectList />
                    </PrivateRoute>
                  }
                />
                {/* <Route
              path="/projetos/:id"
              element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              }
            /> */}
                <Route
                  path="/projetos/:id/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/projetos/:id/suites-de-teste"
                  element={
                    <PrivateRoute>
                      <TestSuiteList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/projetos/:suiteId/casos-de-teste"
                  element={
                    <PrivateRoute>
                      <TestCaseList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/projetos/:id/bugs"
                  element={
                    <PrivateRoute>
                      <BugList />
                    </PrivateRoute>
                  }
                />
                {/* <Route
              path="/projetos/:id/execucoes"
              element={
                <PrivateRoute>
                  <TestExecutionList />
                </PrivateRoute>
              }
            /> */}
                <Route
                  path="/projetos/:id/relatorios"
                  element={
                    <PrivateRoute>
                      <Reports />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/permissoes"
                  element={
                    <PrivateRoute>
                      <Permissions />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/configuracoes"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </TestCaseProvider>
          </SuiteProvider>
        </ProjectProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
