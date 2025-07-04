
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import SurveyBuilder from "@/components/survey-builder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminSurveys() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showSurveyBuilder, setShowSurveyBuilder] = useState(false);
  const [showSurveyDetails, setShowSurveyDetails] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: surveys, isLoading } = useQuery({
    queryKey: ["/api/surveys"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (surveyId: number) => {
      await apiRequest("DELETE", `/api/surveys/${surveyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
      toast({
        title: "Pesquisa excluída",
        description: "A pesquisa foi excluída com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a pesquisa",
        variant: "destructive",
      });
    },
  });

  const handleViewSurvey = async (surveyId: number) => {
    try {
      const response = await apiRequest("GET", `/api/surveys/${surveyId}`);
      const survey = await response.json();
      
      const questionsResponse = await apiRequest("GET", `/api/surveys/${surveyId}/questions`);
      const questions = await questionsResponse.json();
      
      setSelectedSurvey({ ...survey, questions });
      setShowSurveyDetails(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da pesquisa",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSurvey = (surveyId: number) => {
    if (confirm("Tem certeza que deseja excluir esta pesquisa?")) {
      deleteMutation.mutate(surveyId);
    }
  };

  return (
    <div className="min-h-screen flex bg-light-grey">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Pesquisas</h2>
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

        <main className="p-8">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center py-8 text-slate-grey">
                Carregando pesquisas...
              </div>
            ) : surveys?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-slate-grey mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-slate mb-2">
                    Nenhuma pesquisa encontrada
                  </h3>
                  <p className="text-slate-grey mb-4">
                    Comece criando sua primeira pesquisa eleitoral
                  </p>
                  <Button 
                    onClick={() => setShowSurveyBuilder(true)}
                    className="bg-election-blue hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Pesquisa
                  </Button>
                </CardContent>
              </Card>
            ) : (
              surveys?.map((survey) => (
                <Card key={survey.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <p className="text-slate-grey mt-1">{survey.description}</p>
                      </div>
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
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-grey">
                        Criada em: {new Date(survey.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSurvey(survey.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteSurvey(survey.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {showSurveyBuilder && (
        <SurveyBuilder onClose={() => setShowSurveyBuilder(false)} />
      )}

      {/* Survey Details Modal */}
      <Dialog open={showSurveyDetails} onOpenChange={setShowSurveyDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title}</DialogTitle>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-slate-grey">{selectedSurvey.description || "Nenhuma descrição disponível"}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Badge variant={selectedSurvey.status === "active" ? "default" : "secondary"}>
                  {selectedSurvey.status === "active" ? "Ativa" : "Rascunho"}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Perguntas ({selectedSurvey.questions?.length || 0})</h4>
                {selectedSurvey.questions?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSurvey.questions.map((question: any, index: number) => (
                      <div key={question.id} className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">{index + 1}. {question.question}</p>
                        <p className="text-xs text-slate-grey mt-1">Tipo: {question.type}</p>
                        {question.options && (
                          <div className="mt-2">
                            <p className="text-xs text-slate-grey mb-1">Opções:</p>
                            <ul className="list-disc list-inside text-xs text-slate-grey ml-2">
                              {question.options.map((option: string, optIndex: number) => (
                                <li key={optIndex}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-grey text-sm">Nenhuma pergunta cadastrada</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
