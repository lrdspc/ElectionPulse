import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start bg-election-blue text-white hover:bg-blue-700"
            >
              <Gauge className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Pesquisas
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <Map className="w-4 h-4 mr-3" />
              Regiões
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <Users className="w-4 h-4 mr-3" />
              Pesquisadores
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <FileText className="w-4 h-4 mr-3" />
              Relatórios
            </Button>
          </li>
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
