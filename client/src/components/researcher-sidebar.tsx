import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  ClipboardList, 
  TrendingUp, 
  History, 
  LogOut,
  Vote 
} from "lucide-react";
import { useLocation } from "wouter";

export default function ResearcherSidebar() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigationItems = [
    {
      path: "/researcher",
      label: "Mapa de Pesquisas",
      icon: MapPin,
      active: location === "/researcher"
    },
    {
      path: "/researcher/assignments",
      label: "Minhas Atribuições",
      icon: ClipboardList,
      active: location === "/researcher/assignments"
    },
    {
      path: "/researcher/progress",
      label: "Meu Progresso",
      icon: TrendingUp,
      active: location === "/researcher/progress"
    },
    {
      path: "/researcher/history",
      label: "Histórico",
      icon: History,
      active: location === "/researcher/history"
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-election-blue rounded-lg flex items-center justify-center">
            <Vote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dark-slate">ElectionSurvey</h1>
            <p className="text-xs text-slate-grey">Pesquisador</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Button
                  variant="ghost"
                  onClick={() => setLocation(item.path)}
                  className={`w-full justify-start ${
                    item.active 
                      ? "bg-success-green text-white hover:bg-green-600" 
                      : "text-slate-grey hover:bg-gray-100"
                  }`}
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
              <AvatarFallback className="bg-success-green text-white">
                {user?.name?.[0]?.toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-slate truncate">
                {user?.name || "Pesquisador"}
              </p>
              <p className="text-xs text-slate-grey">Pesquisador</p>
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
