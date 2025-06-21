import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface Assignment {
  id: number;
  surveyId: number;
  regionId: number;
  researcherId?: number;
  targetResponses: number;
  completedResponses: number;
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignedAt: string;
  dueDate?: string;
  survey?: {
    title: string;
    description?: string;
  };
  region?: {
    name: string;
    coordinates?: any;
  };
}

interface InteractiveMapProps {
  assignments: Assignment[];
  onAssignmentClick: (assignment: Assignment) => void;
  showAssignmentCards?: boolean;
}

export default function InteractiveMap({ 
  assignments, 
  onAssignmentClick, 
  showAssignmentCards = false 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (mapRef.current && !map) {
          const newMap = L.map(mapRef.current).setView([-22.9068, -43.1729], 11);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(newMap);

          // Add markers for assignments
          assignments.forEach((assignment) => {
            const lat = -22.9068 + (Math.random() - 0.5) * 0.1;
            const lng = -43.1729 + (Math.random() - 0.5) * 0.1;

            const marker = L.marker([lat, lng]).addTo(newMap);

            const popupContent = `
              <div class="p-2">
                <h4 class="font-semibold">${assignment.survey?.title || 'Pesquisa'}</h4>
                <p class="text-sm text-gray-600">${assignment.region?.name || 'Região'}</p>
                <p class="text-sm">${assignment.completedResponses}/${assignment.targetResponses} respostas</p>
                <button onclick="window.startSurvey(${assignment.id})" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  Iniciar
                </button>
              </div>
            `;

            marker.bindPopup(popupContent);
          });

          // Global function for popup buttons
          (window as any).startSurvey = (assignmentId: number) => {
            const assignment = assignments.find(a => a.id === assignmentId);
            if (assignment) {
              onAssignmentClick(assignment);
            }
          };

          setMap(newMap);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [assignments, onAssignmentClick, map]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-green" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-warning-amber" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <MapPin className="w-4 h-4 text-election-blue" />;
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

  if (showAssignmentCards) {
    return (
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-slate-grey">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atribuição encontrada</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(assignment.status)}
                    <CardTitle className="text-sm font-medium">
                      {assignment.survey?.title || 'Pesquisa'}
                    </CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(assignment.status)} text-white text-xs`}>
                    {getStatusText(assignment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-grey">
                    <MapPin className="w-4 h-4 mr-2" />
                    {assignment.region?.name || 'Região'}
                  </div>

                  <div className="text-sm">
                    <span className="text-dark-slate font-medium">
                      {assignment.completedResponses}/{assignment.targetResponses}
                    </span>
                    <span className="text-slate-grey ml-1">respostas</span>
                  </div>

                  {assignment.dueDate && (
                    <div className="flex items-center text-sm text-slate-grey">
                      <Calendar className="w-4 h-4 mr-2" />
                      Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}

                  <Button 
                    onClick={() => onAssignmentClick(assignment)}
                    size="sm"
                    className="w-full bg-election-blue hover:bg-blue-700"
                  >
                    Iniciar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px] rounded-lg"
      style={{ zIndex: 1 }}
    />
  );
}