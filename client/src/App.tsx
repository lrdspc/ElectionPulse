import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib/protected-route";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminSurveys from "@/pages/admin-surveys";
import AdminRegions from "@/pages/admin-regions";
import AdminResearchers from "@/pages/admin-researchers";
import AdminReports from "@/pages/admin-reports";
import ResearcherDashboard from "@/pages/researcher-dashboard";
import MyAssignments from "@/pages/my-assignments";
import MyProgress from "@/pages/my-progress";
import History from "@/pages/history";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
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
            <ProtectedRoute path="/researcher/assignments" component={MyAssignments} requiredRole="researcher" />
            <ProtectedRoute path="/researcher/progress" component={MyProgress} requiredRole="researcher" />
            <ProtectedRoute path="/researcher/history" component={History} requiredRole="researcher" />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}