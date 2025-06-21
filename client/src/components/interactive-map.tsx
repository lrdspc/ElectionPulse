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
    const initMap = async () => {
      try {
        // Dynamic import to avoid require() error
        const L = await import('leaflet');

        if (mapRef.current && !map) {
          const mapInstance = L.default.map(mapRef.current).setView([-23.5505, -46.6333], 13);

          L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance);

          setMap(mapInstance);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        // Fallback to simplified view without map
      }
    };

    if (!map) {
      initMap();
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []); // Remove map dependency to prevent infinite loop

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

          const marker = L.default.circleMarker([coord.lat, coord.lng], {
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

  return {
    mapComponent: (
      <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden">
        {/* Map Container */}
        <div ref={mapRef} className="absolute inset-0 z-10" style={{ minHeight: '400px', height: '100%', width: '100%' }}>
          {/* Fallback when map fails to load */}
          {!map && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-election-blue mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-slate mb-2">Mapa Interativo</h3>
                <p className="text-slate-grey">Carregando visualização das regiões...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    assignmentCards: (
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-dark-slate text-sm mb-1">
                    {assignment.survey?.title || "Pesquisa"}
                  </h4>
                  <p className="text-xs text-slate-grey flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {assignment.region?.name || "Região"}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(assignment.status)}
                >
                  {getStatusLabel(assignment.status)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-grey">
                  <span className="font-medium text-dark-slate">
                    {assignment.completedResponses}
                  </span>
                  /{assignment.targetResponses} respostas
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onAssignmentClick?.(assignment)}
                  className="bg-election-blue hover:bg-blue-700 text-xs px-3 py-1 h-auto"
                >
                  Iniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  };
}