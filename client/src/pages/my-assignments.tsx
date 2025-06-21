
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import ResearcherSidebar from "@/components/researcher-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, CheckCircle, Clock, AlertCircle, Calendar, Play } from "lucide-react";
import { useState } from "react";
import SurveyModal from "@/components/survey-modal";

export default function MyAssignments() {
  const { user } = useAuth();
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["/api/assignments"],
  });

  const handleStartSurvey = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowSurveyModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-green" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-warning-amber" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <MapPin className="w-5 h-5 text-election-blue" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-green';
      case 'in_progress':
        return 'bg-warning-amber';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-election-blue';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em Progresso';
      case 'overdue':
        return 'Atrasado';
      default:
        return 'Pendente';
    }
  };

  const getProgressPercentage = (completed: number, target: number) => {
    return target > 0 ? Math.round((completed / target) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-light-grey flex">
      <ResearcherSidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Minhas Atribuições</h2>
              <p className="text-slate-grey">Acompanhe todas as suas pesquisas atribuídas</p>
            </div>
            <Badge className="bg-election-blue text-white px-4 py-2">
              {assignments?.length || 0} atribuições
            </Badge>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-election-blue mx-auto"></div>
              <p className="text-slate-grey mt-4">Carregando atribuições...</p>
            </div>
          ) : assignments?.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-slate-grey opacity-50 mb-4" />
              <h3 className="text-lg font-semibold text-dark-slate mb-2">Nenhuma atribuição encontrada</h3>
              <p className="text-slate-grey">Você não possui pesquisas atribuídas no momento.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {assignments?.map((assignment: any) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(assignment.status)}
                        <CardTitle className="text-lg text-dark-slate">
                          {assignment.survey?.title || 'Pesquisa'}
                        </CardTitle>
                      </div>
                      <Badge className={`${getStatusColor(assignment.status)} text-white`}>
                        {getStatusText(assignment.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-slate-grey">
                      <MapPin className="w-4 h-4 mr-2" />
                      {assignment.region?.name || 'Região'}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-grey">Progresso</span>
                          <span className="font-medium text-dark-slate">
                            {assignment.completedResponses}/{assignment.targetResponses}
                          </span>
                        </div>
                        <Progress 
                          value={getProgressPercentage(assignment.completedResponses, assignment.targetResponses)} 
                          className="h-2"
                        />
                        <div className="text-right text-xs text-slate-grey mt-1">
                          {getProgressPercentage(assignment.completedResponses, assignment.targetResponses)}%
                        </div>
                      </div>

                      {/* Assignment Date */}
                      <div className="flex items-center text-sm text-slate-grey">
                        <Calendar className="w-4 h-4 mr-2" />
                        Atribuído em: {new Date(assignment.assignedAt).toLocaleDateString('pt-BR')}
                      </div>

                      {/* Due Date */}
                      {assignment.dueDate && (
                        <div className="flex items-center text-sm text-slate-grey">
                          <Clock className="w-4 h-4 mr-2" />
                          Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleStartSurvey(assignment)}
                        className="w-full bg-election-blue hover:bg-blue-700"
                        disabled={assignment.status === 'completed'}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {assignment.status === 'completed' ? 'Concluída' : 'Continuar Pesquisa'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
