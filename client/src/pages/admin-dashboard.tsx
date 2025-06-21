import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin-sidebar";
import SurveyBuilder from "@/components/survey-builder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, BarChart3, Percent, Plus } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showSurveyBuilder, setShowSurveyBuilder] = useState(false);

  // Redirect non-admin users
  if (user?.role !== "admin") {
    setLocation("/researcher");
    return null;
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: surveys, isLoading: surveysLoading } = useQuery({
    queryKey: ["/api/surveys"],
  });

  const { data: researchers, isLoading: researchersLoading } = useQuery({
    queryKey: ["/api/researchers"],
  });

  return (
    <div className="min-h-screen flex bg-light-grey">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Dashboard</h2>
              <p className="text-slate-grey">Gerencie suas pesquisas eleitorais</p>
            </div>
            <Button 
              onClick={() => setShowSurveyBuilder(true)}
              className="bg-election-blue hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Pesquisa
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-grey text-sm font-medium">Pesquisas Ativas</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : stats?.activeSurveys || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-election-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-election-blue" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-green text-sm font-medium">+2.5%</span>
                  <span className="text-slate-grey text-sm ml-2">vs último mês</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-grey text-sm font-medium">Respostas Coletadas</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : stats?.totalResponses || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success-green" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-green text-sm font-medium">+12.3%</span>
                  <span className="text-slate-grey text-sm ml-2">vs semana passada</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-grey text-sm font-medium">Pesquisadores</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {researchersLoading ? "..." : researchers?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning-amber bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-warning-amber" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-green text-sm font-medium">
                    {statsLoading ? "..." : stats?.activeResearchers || 0} ativos
                  </span>
                  <span className="text-slate-grey text-sm ml-2">hoje</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-grey text-sm font-medium">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-dark-slate">
                      {statsLoading ? "..." : `${stats?.completionRate || 0}%`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-slate-grey bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Percent className="w-6 h-6 text-slate-grey" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-green text-sm font-medium">+5.2%</span>
                  <span className="text-slate-grey text-sm ml-2">vs média</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Surveys List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-success-green" />
                  Pesquisas Ativas
                  <Badge variant="outline" className="ml-auto">
                    {surveys?.length || 0} pesquisas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {surveysLoading ? (
                    <div className="text-center py-8 text-slate-grey">
                      Carregando pesquisas...
                    </div>
                  ) : surveys?.length === 0 ? (
                    <div className="text-center py-8 text-slate-grey">
                      Nenhuma pesquisa encontrada.
                      <br />
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSurveyBuilder(true)}
                        className="mt-4"
                      >
                        Criar primeira pesquisa
                      </Button>
                    </div>
                  ) : (
                    surveys?.map((survey) => (
                      <div key={survey.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-dark-slate mb-1">{survey.title}</h4>
                            <p className="text-sm text-slate-grey mb-2">{survey.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-slate-grey">
                              <span className="flex items-center">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                {survey.startDate && survey.endDate
                                  ? `${new Date(survey.startDate).toLocaleDateString()} - ${new Date(survey.endDate).toLocaleDateString()}`
                                  : "Datas não definidas"
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge 
                              variant={survey.status === "active" ? "default" : "secondary"}
                              className={
                                survey.status === "active" 
                                  ? "bg-success-green text-white" 
                                  : "bg-warning-amber text-white"
                              }
                            >
                              {survey.status === "active" ? "Ativa" : "Rascunho"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-grey">Progresso</span>
                            <span className="text-dark-slate font-medium">--%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-warning-amber" />
                  Pesquisadores Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchersLoading ? (
                    <div className="text-center py-8 text-slate-grey">
                      Carregando pesquisadores...
                    </div>
                  ) : researchers?.length === 0 ? (
                    <div className="text-center py-8 text-slate-grey">
                      Nenhum pesquisador registrado.
                    </div>
                  ) : (
                    researchers?.map((researcher) => (
                      <div key={researcher.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-success-green rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-dark-slate">{researcher.name}</p>
                          <p className="text-xs text-slate-grey">{researcher.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Pesquisador
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Survey Builder Modal */}
      {showSurveyBuilder && (
        <SurveyBuilder onClose={() => setShowSurveyBuilder(false)} />
      )}
    </div>
  );
}
