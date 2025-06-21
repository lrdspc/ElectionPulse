import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { 
  Gauge, 
  BarChart3, 
  Map, 
  Users, 
  FileText, 
  LogOut,
  Vote 
} from "lucide-react";

export default function AdminSidebar() {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    { path: "/", icon: Gauge, label: "Dashboard", active: location === "/" },
    { path: "/surveys", icon: BarChart3, label: "Pesquisas", active: location === "/surveys" },
    { path: "/regions", icon: Map, label: "Regiões", active: location === "/regions" },
    { path: "/researchers", icon: Users, label: "Pesquisadores", active: location === "/researchers" },
    { path: "/reports", icon: FileText, label: "Relatórios", active: location === "/reports" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-election-blue rounded-lg flex items-center justify-center">
            <Vote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dark-slate">ElectionSurvey</h1>
            <p className="text-xs text-slate-grey">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    item.active 
                      ? "bg-election-blue text-white hover:bg-blue-700" 
                      : "text-slate-grey hover:bg-gray-100"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-election-blue text-white">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-slate truncate">
                {user?.name || "Administrador"}
              </p>
              <p className="text-xs text-slate-grey">Administrador</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-grey hover:text-dark-slate"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
