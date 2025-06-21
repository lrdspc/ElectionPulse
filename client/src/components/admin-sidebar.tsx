import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BarChart3, 
  MapPin, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  CheckCircle
} from "lucide-react";

export default function AdminSidebar() {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: BarChart3, label: "Pesquisas", path: "/admin/surveys" },
    { icon: MapPin, label: "Regiões", path: "/admin/regions" },
    { icon: Users, label: "Pesquisadores", path: "/admin/researchers" },
    { icon: FileText, label: "Relatórios", path: "/admin/reports" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-election-blue rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark-slate">ElectionSurvey</h1>
            <p className="text-sm text-slate-grey">Administrador</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-election-blue text-white"
                    : "text-slate-grey hover:bg-gray-100 hover:text-dark-slate"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-grey hover:text-dark-slate"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}