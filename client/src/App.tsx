import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import ResearcherDashboard from "@/pages/researcher-dashboard";
import SurveysPage from "@/pages/surveys-page";
import RegionsPage from "@/pages/regions-page";
import ResearchersPage from "@/pages/researchers-page";
import ReportsPage from "@/pages/reports-page";
import NotFound from "@/pages/not-found";
import AdminSurveys from "@/pages/admin-surveys";
import AdminRegions from "@/pages/admin-regions";
import AdminResearchers from "@/pages/admin-researchers";
import AdminReports from "@/pages/admin-reports";
import { queryClient } from "@/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Switch>
            <Route path="/" component={AuthPage} />
            <ProtectedRoute path="/admin" component={AdminDashboard} requiredRole="admin" />
            <ProtectedRoute path="/admin/surveys" component={AdminSurveys} requiredRole="admin" />
            <ProtectedRoute path="/admin/regions" component={AdminRegions} requiredRole="admin" />
            <ProtectedRoute path="/admin/researchers" component={AdminResearchers} requiredRole="admin" />
            <ProtectedRoute path="/admin/reports" component={AdminReports} requiredRole="admin" />
            <ProtectedRoute path="/researcher" component={ResearcherDashboard} requiredRole="researcher" />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}