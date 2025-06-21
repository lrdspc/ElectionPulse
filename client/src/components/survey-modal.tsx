import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const responseSchema = z.object({
  surveyId: z.number(),
  assignmentId: z.number(),
  demographics: z.object({
    age: z.string(),
    gender: z.string(),
    education: z.string(),
    income: z.string(),
  }),
  answers: z.record(z.string()),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  status: z.enum(["draft", "completed"]).default("draft"),
});

type ResponseForm = z.infer<typeof responseSchema>;

interface SurveyModalProps {
  assignment: any;
  onClose: () => void;
}

export default function SurveyModal({ assignment, onClose }: SurveyModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock survey data - in a real app, this would come from the assignment
  const mockSurvey = {
    id: 1,
    title: "Pesquisa Eleitoral Municipal",
    description: "Avaliação de intenção de voto para prefeito",
    region: "Centro - Zona 1",
  };

  const mockQuestions = [
    {
      id: 1,
      question: "Se as eleições fossem hoje, em quem você votaria para prefeito?",
      type: "radio",
      options: [
        "Candidato A - João Silva (PT)",
        "Candidato B - Maria Santos (PSDB)",
        "Candidato C - Pedro Oliveira (PDT)",
        "Nulo/Branco",
        "Não sei/Não opinei"
      ],
      required: true,
      order: 1,
    },
    {
      id: 2,
      question: "Como você avalia a gestão atual do prefeito?",
      type: "radio",
      options: [
        "Ótima",
        "Boa",
        "Regular",
        "Ruim",
        "Péssima"
      ],
      required: true,
      order: 2,
    },
  ];

  const form = useForm<ResponseForm>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      surveyId: mockSurvey.id,
      assignmentId: assignment?.id || 1,
      demographics: {
        age: "",
        gender: "",
        education: "",
        income: "",
      },
      answers: {},
      status: "draft",
    },
  });

  const createResponseMutation = useMutation({
    mutationFn: async (data: ResponseForm) => {
      const res = await apiRequest("POST", "/api/responses", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/responses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      toast({
        title: "Resposta salva com sucesso!",
        description: "A resposta foi registrada no sistema.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar resposta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResponseForm) => {
    // Get current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const responseData = {
            ...data,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            status: "completed" as const,
          };
          createResponseMutation.mutate(responseData);
        },
        () => {
          // Location not available, submit without it
          createResponseMutation.mutate({ ...data, status: "completed" });
        }
      );
    } else {
      createResponseMutation.mutate({ ...data, status: "completed" });
    }
  };

  const onSaveDraft = () => {
    const data = form.getValues();
    createResponseMutation.mutate({ ...data, status: "draft" });
  };

  const progress = ((currentQuestion + 1) / (mockQuestions.length + 1)) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-dark-slate">{mockSurvey.title}</h3>
              <p className="text-slate-grey text-sm mt-1">
                Região: <span className="font-medium">{mockSurvey.region}</span>
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-grey">Progresso da Pesquisa</span>
              <span className="text-dark-slate font-medium">
                {currentQuestion + 1} de {mockQuestions.length + 1}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            {currentQuestion === 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Entrevistado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="demographics.age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="18-25">18-25</SelectItem>
                              <SelectItem value="26-35">26-35</SelectItem>
                              <SelectItem value="36-45">36-45</SelectItem>
                              <SelectItem value="46-55">46-55</SelectItem>
                              <SelectItem value="56-65">56-65</SelectItem>
                              <SelectItem value="65+">65+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="demographics.gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gênero</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                              <SelectItem value="nao-binario">Não binário</SelectItem>
                              <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="demographics.education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escolaridade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                              <SelectItem value="medio">Ensino Médio</SelectItem>
                              <SelectItem value="superior">Ensino Superior</SelectItem>
                              <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="demographics.income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Renda Familiar</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ate-2">Até 2 salários mínimos</SelectItem>
                              <SelectItem value="2-5">2-5 salários mínimos</SelectItem>
                              <SelectItem value="5-10">5-10 salários mínimos</SelectItem>
                              <SelectItem value="mais-10">Mais de 10 salários mínimos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentQuestion > 0 && currentQuestion <= mockQuestions.length && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-dark-slate mb-4">
                      <span className="text-election-blue mr-2">{currentQuestion}.</span>
                      {mockQuestions[currentQuestion - 1].question}
                    </h4>uestion}
                    </h4>

                    <FormField
                      control={form.control}
                      name={`answers.${mockQuestions[currentQuestion - 1].id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              {mockQuestions[currentQuestion - 1].options?.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value={option} id={`option-${index}`} />
                                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={createResponseMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </Button>

                {currentQuestion < mockQuestions.length ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="bg-election-blue hover:bg-blue-700"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createResponseMutation.isPending}
                    className="bg-success-green hover:bg-green-600"
                  >
                    {createResponseMutation.isPending ? "Finalizando..." : "Finalizar Pesquisa"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
