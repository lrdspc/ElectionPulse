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

export default function ResearcherSidebar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start bg-success-green text-white hover:bg-green-600"
            >
              <MapPin className="w-4 h-4 mr-3" />
              Mapa de Pesquisas
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <ClipboardList className="w-4 h-4 mr-3" />
              Minhas Atribuições
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <TrendingUp className="w-4 h-4 mr-3" />
              Meu Progresso
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-grey hover:bg-gray-100"
            >
              <History className="w-4 h-4 mr-3" />
              Histórico
            </Button>
          </li>
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
