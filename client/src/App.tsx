import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import ResearcherDashboard from "@/pages/researcher-dashboard";
import SurveysPage from "@/pages/surveys-page";
import RegionsPage from "@/pages/regions-page";
import ResearchersPage from "@/pages/researchers-page";
import ReportsPage from "@/pages/reports-page";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Switch>
            <Route path="/" component={AuthPage} />
            <Route path="/admin">
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/admin/surveys">
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSurveys />
              </ProtectedRoute>
            </Route>
            <Route path="/admin/regions">
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminRegions />
              </ProtectedRoute>
            </Route>
            <Route path="/admin/researchers">
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminResearchers />
              </ProtectedRoute>
            </Route>
            <Route path="/admin/reports">
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            </Route>
            <Route path="/researcher">
              <ProtectedRoute allowedRoles={["researcher"]}>
                <ResearcherDashboard />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}