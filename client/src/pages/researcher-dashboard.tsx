import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ResearcherSidebar from "@/components/researcher-sidebar";
import InteractiveMap from "@/components/interactive-map";
import SurveyModal from "@/components/survey-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar, Percent, Play } from "lucide-react";
import { useState, useEffect } from "react";

export default function ResearcherDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Redirect non-researcher users using useEffect to avoid state update during render
  useEffect(() => {
    if (user && user.role !== "researcher") {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/assignments"],
  });

  const handleStartSurvey = (assignment?: any) => {
    setSelectedAssignment(assignment);
    setShowSurveyModal(true);
  };

  return (
    <div className="min-h-screen bg-light-grey mobile-safe-area">
      {/* Mobile Header */}
      <header className="mobile-header bg-white shadow-sm border-b border-gray-200 mobile-padding lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-election-blue rounded-lg flex items-center justify-center touch-target">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="responsive-text-xl font-bold text-dark-slate">ElectionSurvey</h1>
              <p className="text-sm text-slate-grey">Pesquisador</p>
            </div>
          </div>
          <Button
            onClick={() => handleStartSurvey()}
            className="mobile-button bg-election-blue hover:bg-blue-700 touch-feedback touch-target"
          >
            <Play className="w-4 h-4 mr-2" />
            <span className="hidden xs:inline">Iniciar</span>
            <span className="xs:hidden">+</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        <ResearcherSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6 hidden lg:block">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark-slate">Mapa de Pesquisas</h2>
                <p className="text-slate-grey">Visualize suas atribuições por região</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-success-green text-white px-4 py-2 text-sm">
                  {assignmentsLoading ? "..." : assignments?.length || 0} pesquisas hoje
                </Badge>
                <Button 
                  onClick={() => handleStartSurvey()}
                  className="bg-election-blue hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Pesquisa
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Map Container */}
            <div className="flex-1 relative">
              <InteractiveMap 
                assignments={assignments || []} 
                onAssignmentClick={handleStartSurvey}
              />
              
              {/* Mobile Stats Panel */}
              <div className="lg:hidden absolute bottom-4 left-4 right-4 bg-white mobile-card mobile-padding z-10 mobile-safe-area">
                <div className="mobile-grid-3 text-center">
                  <div className="touch-target flex flex-col justify-center">
                    <p className="responsive-text-2xl font-bold text-success-green">
                      {statsLoading ? "..." : stats?.completedSurveys || 0}
                    </p>
                    <p className="text-xs text-slate-grey mt-1">Concluídas</p>
                  </div>
                  <div className="touch-target flex flex-col justify-center">
                    <p className="responsive-text-2xl font-bold text-warning-amber">
                      {statsLoading ? "..." : stats?.inProgressSurveys || 0}
                    </p>
                    <p className="text-xs text-slate-grey mt-1">Em Progresso</p>
                  </div>
                  <div className="touch-target flex flex-col justify-center">
                    <p className="responsive-text-2xl font-bold text-election-blue">
                      {assignmentsLoading ? "..." : assignments?.length || 0}
                    </p>
                    <p className="text-xs text-slate-grey mt-1">Atribuídas</p>
                  </div>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 mobile-button touch-feedback"
                      onClick={() => window.location.href = '/my-assignments'}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Tarefas
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 mobile-button touch-feedback"
                      onClick={() => window.location.href = '/my-progress'}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Progresso
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Assignments Panel */}
            <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-slate mb-4">Suas Atribuições</h3>
                <InteractiveMap 
                  assignments={assignments || []} 
                  onAssignmentClick={handleStartSurvey}
                  showAssignmentCards={true}
                />
              </div>
            </div>
          </div>

          {/* Desktop Stats Panel */}
          <div className="hidden lg:block bg-white border-t border-gray-200 p-6">
            <div className="grid grid-cols-4 gap-6">
              <Card className="p-4 bg-success-green bg-opacity-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-green text-sm font-medium">Pesquisas Concluídas</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : stats?.completedSurveys || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success-green" />
                </div>
              </Card>

              <Card className="p-4 bg-warning-amber bg-opacity-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-amber text-sm font-medium">Em Progresso</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : stats?.inProgressSurveys || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-warning-amber" />
                </div>
              </Card>

              <Card className="p-4 bg-election-blue bg-opacity-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-election-blue text-sm font-medium">Hoje</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : stats?.todaySurveys || 0}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-election-blue" />
                </div>
              </Card>

              <Card className="p-4 bg-slate-grey bg-opacity-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-grey text-sm font-medium">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : `${stats?.successRate || 0}%`}
                    </p>
                  </div>
                  <Percent className="w-8 h-8 text-slate-grey" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Modal */}
      {showSurveyModal && (
        <SurveyModal 
          assignment={selectedAssignment}
          onClose={() => {
            setShowSurveyModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </div>
  );
}
