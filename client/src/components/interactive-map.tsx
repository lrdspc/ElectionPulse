import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";

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
}

// Mock coordinates for demonstration - in a real app, these would come from the region data
const mockCoordinates = [
  { lat: -23.5505, lng: -46.6333, id: 1 }, // São Paulo Centro
  { lat: -23.5475, lng: -46.6361, id: 2 }, // Liberdade
  { lat: -23.5558, lng: -46.6396, id: 3 }, // Bela Vista
  { lat: -23.5329, lng: -46.6395, id: 4 }, // Vila Madalena
  { lat: -23.5615, lng: -46.6565, id: 5 }, // Vila Olímpia
];

export default function InteractiveMap({ assignments, onAssignmentClick }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    // Initialize Leaflet map
    const initMap = async () => {
      // Dynamic import to avoid SSR issues
      const L = await import('leaflet');

      if (mapRef.current && !map) {
        const mapInstance = L.map(mapRef.current).setView([-23.5505, -46.6333], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    const addMarkers = async () => {
      if (map && assignments.length > 0) {
        // Clear existing markers
        map.eachLayer((layer: any) => {
          if (layer.options && layer.options.assignment) {
            map.removeLayer(layer);
          }
        });

        // Add markers for assignments
        const L = await import('leaflet');

        assignments.forEach((assignment, index) => {
          const coord = mockCoordinates[index % mockCoordinates.length];

          // Determine marker color based on status
          let color = '#2B5CE6'; // election-blue
          switch (assignment.status) {
            case 'completed':
              color = '#34D399'; // success-green
              break;
            case 'in_progress':
              color = '#F59E0B'; // warning-amber
              break;
            case 'overdue':
              color = '#EF4444'; // red
              break;
            default:
              color = '#2B5CE6'; // election-blue
          }

          // Filter assignments based on selected filter
          if (selectedFilter !== 'all' && assignment.status !== selectedFilter) {
            return;
          }

          const marker = L.circleMarker([coord.lat, coord.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.8,
            radius: 8,
            assignment: assignment
          }).addTo(map);

          // Add popup with assignment details
          const popupContent = `
            <div class="p-2 min-w-[200px]">
              <h4 class="font-semibold text-sm mb-2">${assignment.survey?.title || 'Pesquisa'}</h4>
              <p class="text-xs text-gray-600 mb-2">${assignment.region?.name || 'Região'}</p>
              <div class="flex items-center justify-between text-xs mb-2">
                <span>Progresso:</span>
                <span class="font-medium">${assignment.completedResponses}/${assignment.targetResponses}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${(assignment.completedResponses / assignment.targetResponses) * 100}%"></div>
              </div>
              <button 
                onclick="window.handleAssignmentClick && window.handleAssignmentClick(${assignment.id})"
                class="w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700"
              >
                Iniciar Pesquisa
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
        });
      }
    };
    addMarkers();
  }, [map, assignments, selectedFilter]);

  // Global function to handle assignment clicks from popup
  useEffect(() => {
    (window as any).handleAssignmentClick = (assignmentId: number) => {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        onAssignmentClick(assignment);
      }
    };

    return () => {
      delete (window as any).handleAssignmentClick;
    };
  }, [assignments, onAssignmentClick]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success-green';
      case 'in_progress':
        return 'text-warning-amber';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-election-blue';
    }
  };

  const getStatusLabel = (status: string) => {
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

  const filteredAssignments = selectedFilter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === selectedFilter);

  return (
    <>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gray-100 relative"
        style={{ minHeight: '400px' }}
      />

      {/* Map Controls */}
      <Card className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-semibold text-dark-slate">
            <MapPin className="w-4 h-4 inline mr-2" />
            Controles do Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success-green rounded-full"></div>
              <span className="text-sm text-dark-slate">Concluído</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning-amber rounded-full"></div>
              <span className="text-sm text-dark-slate">Em Progresso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-election-blue rounded-full"></div>
              <span className="text-sm text-dark-slate">Pendente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-dark-slate">Atrasado</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-dark-slate">Filtrar por status:</p>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className={selectedFilter === 'all' ? 'bg-election-blue text-white' : ''}
              >
                Todos
              </Button>
              <Button
                variant={selectedFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('completed')}
                className={selectedFilter === 'completed' ? 'bg-success-green text-white' : ''}
              >
                Concluído
              </Button>
              <Button
                variant={selectedFilter === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('in_progress')}
                className={selectedFilter === 'in_progress' ? 'bg-warning-amber text-white' : ''}
              >
                Progresso
              </Button>
              <Button
                variant={selectedFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('pending')}
                className={selectedFilter === 'pending' ? 'bg-election-blue text-white' : ''}
              >
                Pendente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment List - Mobile View */}
      <Card className="lg:hidden absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs max-h-80 overflow-y-auto">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm font-semibold text-dark-slate">
            Atribuições ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {filteredAssignments.length === 0 ? (
              <p className="text-xs text-slate-grey text-center py-4">
                Nenhuma atribuição encontrada
              </p>
            ) : (
              filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => onAssignmentClick(assignment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dark-slate truncate">
                        {assignment.survey?.title || 'Pesquisa'}
                      </p>
                      <p className="text-xs text-slate-grey truncate">
                        {assignment.region?.name || 'Região'}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-grey">Progresso</span>
                      <span className="text-dark-slate">
                        {assignment.completedResponses}/{assignment.targetResponses}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-election-blue h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (assignment.completedResponses / assignment.targetResponses) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      />
    </>
  );
}