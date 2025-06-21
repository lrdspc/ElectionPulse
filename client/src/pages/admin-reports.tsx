
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminReports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [reportData, setReportData] = useState<any[]>([]);

  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const handleViewReport = async (reportType: string) => {
    try {
      const response = await apiRequest("GET", `/api/reports/${reportType}`);
      const data = await response.json();
      setReportData(data);
      setSelectedReportType(reportType);
      setShowReportModal(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = async (reportType: string) => {
    try {
      const response = await fetch(`/api/reports/${reportType}/download?format=csv`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download concluído",
        description: "Relatório baixado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o relatório",
        variant: "destructive",
      });
    }
  };

  const getReportTitle = (type: string) => {
    switch (type) {
      case 'responses': return 'Relatório de Respostas por Região';
      case 'performance': return 'Relatório de Performance dos Pesquisadores';
      case 'demographics': return 'Relatório Demográfico';
      default: return 'Relatório';
    }
  };

  const reports = [
    {
      id: 1,
      title: "Relatório de Respostas por Região",
      description: "Análise detalhada das respostas coletadas por região geográfica",
      type: "responses",
      icon: BarChart3,
    },
    {
      id: 2,
      title: "Relatório de Performance dos Pesquisadores",
      description: "Desempenho e produtividade dos pesquisadores",
      type: "performance",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Relatório Demográfico",
      description: "Distribuição demográfica dos respondentes",
      type: "demographics",
      icon: PieChart,
    },
  ];

  return (
    <div className="min-h-screen flex bg-light-grey">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-slate">Relatórios</h2>
              <p className="text-slate-grey">Gere e visualize relatórios das pesquisas</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <Card className="mobile-card">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="responsive-text-2xl font-bold text-election-blue">
                    {isLoading ? "..." : stats?.activeSurveys || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-grey mt-1">Pesquisas Ativas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success-green">
                    {isLoading ? "..." : stats?.totalResponses || 0}
                  </p>
                  <p className="text-sm text-slate-grey">Total de Respostas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-amber">
                    {isLoading ? "..." : stats?.activeResearchers || 0}
                  </p>
                  <p className="text-sm text-slate-grey">Pesquisadores Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark-slate">
                    {isLoading ? "..." : `${stats?.completionRate || 0}%`}
                  </p>
                  <p className="text-sm text-slate-grey">Taxa de Conclusão</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-election-blue" />
                  Relatórios Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {reports.map((report) => {
                    const Icon = report.icon;
                    return (
                      <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-election-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-election-blue" />
                          </div>
                          <div>
                            <h4 className="font-medium text-dark-slate">{report.title}</h4>
                            <p className="text-sm text-slate-grey">{report.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewReport(report.type)}
                          >
                            Visualizar
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-election-blue hover:bg-blue-700"
                            onClick={() => handleDownloadReport(report.type)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatórios Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-grey mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-slate mb-2">
                    Crie relatórios personalizados
                  </h3>
                  <p className="text-slate-grey mb-4">
                    Configure filtros específicos e gere relatórios sob medida
                  </p>
                  <Button 
                    className="bg-election-blue hover:bg-blue-700"
                    onClick={() => handleViewReport('performance')}
                  >
                    Criar Relatório Customizado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{getReportTitle(selectedReportType)}</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-auto">
            {reportData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(reportData[0]).map((key) => (
                      <TableHead key={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {typeof value === 'object' ? JSON.stringify(value) : value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-slate-grey">
                Nenhum dado encontrado para este relatório
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
