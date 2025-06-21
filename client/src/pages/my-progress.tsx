
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import ResearcherSidebar from "@/components/researcher-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Calendar, TrendingUp, Target, Award } from "lucide-react";

export default function MyProgress() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/assignments"],
  });

  // Calculate progress metrics
  const totalAssignments = assignments?.length || 0;
  const completedAssignments = assignments?.filter((a: any) => a.status === 'completed').length || 0;
  const inProgressAssignments = assignments?.filter((a: any) => a.status === 'in_progress').length || 0;
  const overallProgress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  const progressMetrics = [
    {
      title: "Pesquisas Concluídas",
      value: stats?.completedSurveys || 0,
      icon: <CheckCircle className="w-6 h-6 text-success-green" />,
      color: "text-success-green",
      bgColor: "bg-success-green bg-opacity-10"
    },
    {
      title: "Em Progresso",
      value: stats?.inProgressSurveys || 0,
      icon: <Clock className="w-6 h-6 text-warning-amber" />,
      color: "text-warning-amber",
      bgColor: "bg-warning-amber bg-opacity-10"
    },
    {
      title: "Hoje",
      value: stats?.todaySurveys || 0,
      icon: <Calendar className="w-6 h-6 text-election-blue" />,
      color: "text-election-blue",
      bgColor: "bg-election-blue bg-opacity-10"
    },
    {
      title: "Taxa de Sucesso",
      value: `${stats?.successRate || 0}%`,
      icon: <Award className="w-6 h-6 text-purple-600" />,
      color: "text-purple-600",
      bgColor: "bg-purple-600 bg-opacity-10"
    }
  ];

  return (
    <div className="min-h-screen bg-light-grey flex">
      <ResearcherSidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Meu Progresso</h2>
              <p className="text-slate-grey">Acompanhe seu desempenho e estatísticas</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-success-green" />
              <span className="text-lg font-bold text-dark-slate">{overallProgress}%</span>
              <span className="text-slate-grey">concluído</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {progressMetrics.map((metric, index) => (
              <Card key={index} className={`${metric.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${metric.color} text-sm font-medium mb-1`}>
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-dark-slate">
                        {statsLoading ? "..." : metric.value}
                      </p>
                    </div>
                    {metric.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-election-blue" />
                  <span>Progresso Geral</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-grey">Atribuições Concluídas</span>
                      <span className="font-medium text-dark-slate">
                        {completedAssignments}/{totalAssignments}
                      </span>
                    </div>
                    <Progress value={overallProgress} className="h-3" />
                    <div className="text-right text-xs text-slate-grey mt-1">
                      {overallProgress}% concluído
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success-green">{completedAssignments}</p>
                      <p className="text-xs text-slate-grey">Concluídas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning-amber">{inProgressAssignments}</p>
                      <p className="text-xs text-slate-grey">Em Progresso</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-election-blue">{totalAssignments}</p>
                      <p className="text-xs text-slate-grey">Total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success-green" />
                  <span>Atividade Recente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-election-blue mx-auto"></div>
                    <p className="text-slate-grey mt-2 text-sm">Carregando...</p>
                  </div>
                ) : assignments?.length === 0 ? (
                  <div className="text-center py-8 text-slate-grey">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma atividade recente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments?.slice(0, 5).map((assignment: any) => (
                      <div key={assignment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className={`w-4 h-4 ${
                          assignment.status === 'completed' ? 'text-success-green' :
                          assignment.status === 'in_progress' ? 'text-warning-amber' :
                          'text-election-blue'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-slate truncate">
                            {assignment.survey?.title || 'Pesquisa'}
                          </p>
                          <p className="text-xs text-slate-grey">
                            {assignment.region?.name} • {assignment.completedResponses}/{assignment.targetResponses} respostas
                          </p>
                        </div>
                        <div className="text-xs text-slate-grey">
                          {new Date(assignment.assignedAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
