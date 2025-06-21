
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Relatório Geral de Pesquisas",
      description: "Visão geral de todas as pesquisas realizadas",
      type: "general",
      lastGenerated: "2024-01-20",
      format: "PDF",
      size: "2.3 MB"
    },
    {
      id: 2,
      title: "Análise por Região",
      description: "Desempenho das pesquisas por região geográfica",
      type: "regional",
      lastGenerated: "2024-01-19",
      format: "Excel",
      size: "1.8 MB"
    },
    {
      id: 3,
      title: "Produtividade dos Pesquisadores",
      description: "Métricas de desempenho da equipe",
      type: "performance",
      lastGenerated: "2024-01-18",
      format: "PDF",
      size: "1.2 MB"
    }
  ];

  const quickStats = [
    {
      title: "Total de Respostas",
      value: "1,234",
      change: "+12%",
      icon: BarChart3,
      color: "text-election-blue"
    },
    {
      title: "Pesquisas Ativas",
      value: "8",
      change: "+2",
      icon: PieChart,
      color: "text-success-green"
    },
    {
      title: "Taxa de Conclusão",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-warning-orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-slate">Relatórios</h1>
              <p className="text-slate-grey mt-2">Análises e estatísticas das pesquisas</p>
            </div>
            <Button className="bg-election-blue hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-grey">{stat.title}</p>
                        <p className="text-3xl font-bold text-dark-slate mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} vs. mês anterior</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100`}>
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-dark-slate">Relatórios Disponíveis</CardTitle>
              <CardDescription>Baixe ou gere novos relatórios de análise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-election-blue rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark-slate">{report.title}</h3>
                        <p className="text-sm text-slate-grey">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-slate-grey">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}
                          </span>
                          <Badge variant="outline">{report.format}</Badge>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
