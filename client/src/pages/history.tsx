
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import ResearcherSidebar from "@/components/researcher-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  History as HistoryIcon, 
  Search, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Download
} from "lucide-react";
import { useState } from "react";

export default function History() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["/api/assignments"],
  });

  // Filter and search assignments
  const filteredAssignments = assignments?.filter((assignment: any) => {
    const matchesSearch = !searchTerm || 
      assignment.survey?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.region?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || assignment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-green" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-warning-amber" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-election-blue" />;
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

  const statusFilters = [
    { value: "all", label: "Todos", count: assignments?.length || 0 },
    { value: "completed", label: "Concluídos", count: assignments?.filter((a: any) => a.status === 'completed').length || 0 },
    { value: "in_progress", label: "Em Progresso", count: assignments?.filter((a: any) => a.status === 'in_progress').length || 0 },
    { value: "pending", label: "Pendentes", count: assignments?.filter((a: any) => a.status === 'pending').length || 0 }
  ];

  return (
    <div className="min-h-screen bg-light-grey flex">
      <ResearcherSidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Histórico</h2>
              <p className="text-slate-grey">Visualize todas as suas atividades anteriores</p>
            </div>
            <Button variant="outline" className="border-election-blue text-election-blue hover:bg-election-blue hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-grey" />
              <Input
                placeholder="Buscar por pesquisa ou região..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-grey mr-2" />
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={filterStatus === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(filter.value)}
                  className={filterStatus === filter.value ? "bg-election-blue" : ""}
                >
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-election-blue mx-auto"></div>
              <p className="text-slate-grey mt-4">Carregando histórico...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="w-16 h-16 mx-auto text-slate-grey opacity-50 mb-4" />
              <h3 className="text-lg font-semibold text-dark-slate mb-2">
                {searchTerm || filterStatus !== "all" ? "Nenhum resultado encontrado" : "Nenhum histórico disponível"}
              </h3>
              <p className="text-slate-grey">
                {searchTerm || filterStatus !== "all" 
                  ? "Tente ajustar os filtros ou termos de busca."
                  : "Suas atividades aparecerão aqui conforme você completa as pesquisas."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment: any) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {getStatusIcon(assignment.status)}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-dark-slate mb-1">
                            {assignment.survey?.title || 'Pesquisa'}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-slate-grey">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {assignment.region?.name || 'Região'}
                            </div>
                            
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Atribuído em: {new Date(assignment.assignedAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-sm">
                            <span className="text-dark-slate font-medium">
                              {assignment.completedResponses}/{assignment.targetResponses} respostas
                            </span>
                            <span className="text-slate-grey ml-2">
                              ({assignment.targetResponses > 0 ? 
                                Math.round((assignment.completedResponses / assignment.targetResponses) * 100) : 0}% concluído)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(assignment.status)} text-white`}>
                          {getStatusText(assignment.status)}
                        </Badge>
                        
                        {assignment.dueDate && (
                          <div className="text-sm text-slate-grey text-right">
                            <div>Prazo:</div>
                            <div className="font-medium">
                              {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
