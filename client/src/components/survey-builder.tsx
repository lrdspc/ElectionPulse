import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const surveySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "paused"]).default("draft"),
  demographics: z.object({
    ageRanges: z.array(z.string()).optional(),
    genders: z.array(z.string()).optional(),
    educationLevels: z.array(z.string()).optional(),
    incomeRanges: z.array(z.string()).optional(),
  }).optional(),
  questions: z.array(z.object({
    question: z.string().min(1, "Pergunta é obrigatória"),
    type: z.enum(["radio", "checkbox", "text", "scale"]),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(true),
    order: z.number(),
  })).min(1, "Pelo menos uma pergunta é obrigatória"),
});

type SurveyForm = z.infer<typeof surveySchema>;

interface SurveyBuilderProps {
  onClose: () => void;
}

export default function SurveyBuilder({ onClose }: SurveyBuilderProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SurveyForm>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      demographics: {
        ageRanges: [],
        genders: [],
        educationLevels: [],
        incomeRanges: [],
      },
      questions: [
        {
          question: "",
          type: "radio",
          options: [""],
          required: true,
          order: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const createSurveyMutation = useMutation({
    mutationFn: async (data: SurveyForm) => {
      const surveyData = {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        status: data.status,
        demographics: data.demographics,
      };

      const res = await apiRequest("POST", "/api/surveys", surveyData);
      const survey = await res.json();

      // Create questions
      for (const question of data.questions) {
        await apiRequest("POST", `/api/surveys/${survey.id}/questions`, question);
      }

      return survey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
      toast({
        title: "Pesquisa criada com sucesso!",
        description: "A pesquisa foi criada e está disponível para atribuição.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pesquisa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SurveyForm) => {
    createSurveyMutation.mutate(data);
  };

  const addQuestion = () => {
    append({
      question: "",
      type: "radio",
      options: [""],
      required: true,
      order: fields.length + 1,
    });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, ""]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    const newOptions = currentOptions.filter((_, index) => index !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, newOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-dark-slate">Criar Nova Pesquisa</h3>
              <p className="text-slate-grey text-sm mt-1">
                Passo {step} de 3: {step === 1 ? "Informações Básicas" : step === 2 ? "Critérios Demográficos" : "Perguntas"}
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Pesquisa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pesquisa Eleitoral Municipal 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o objetivo da pesquisa..." 
                          className="h-24 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="paused">Pausada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-dark-slate mb-4">Critérios Demográficos</h4>
                  <p className="text-sm text-slate-grey mb-6">
                    Selecione os critérios demográficos que devem ser considerados na pesquisa.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Faixa Etária</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {["18-25", "26-35", "36-45", "46-55", "56-65", "65+"].map((range) => (
                        <div key={range} className="flex items-center space-x-2">
                          <Checkbox id={`age-${range}`} />
                          <label htmlFor={`age-${range}`} className="text-sm">{range} anos</label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gênero</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {["Masculino", "Feminino", "Não binário", "Prefiro não informar"].map((gender) => (
                        <div key={gender} className="flex items-center space-x-2">
                          <Checkbox id={`gender-${gender}`} />
                          <label htmlFor={`gender-${gender}`} className="text-sm">{gender}</label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Escolaridade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {["Ensino Fundamental", "Ensino Médio", "Ensino Superior", "Pós-graduação"].map((education) => (
                        <div key={education} className="flex items-center space-x-2">
                          <Checkbox id={`education-${education}`} />
                          <label htmlFor={`education-${education}`} className="text-sm">{education}</label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-dark-slate">Perguntas da Pesquisa</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addQuestion}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Pergunta</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">Pergunta {index + 1}</Badge>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`questions.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pergunta</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite sua pergunta..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`questions.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Resposta</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="radio">Múltipla Escolha (uma opção)</SelectItem>
                                  <SelectItem value="checkbox">Múltipla Escolha (várias opções)</SelectItem>
                                  <SelectItem value="text">Texto Livre</SelectItem>
                                  <SelectItem value="scale">Escala (1-5)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {(form.watch(`questions.${index}.type`) === "radio" || 
                          form.watch(`questions.${index}.type`) === "checkbox") && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>Opções de Resposta</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(index)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Adicionar Opção
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(form.watch(`questions.${index}.options`) || []).map((_, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <Input
                                    placeholder={`Opção ${optionIndex + 1}`}
                                    {...form.register(`questions.${index}.options.${optionIndex}`)}
                                  />
                                  {(form.watch(`questions.${index}.options`) || []).length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOption(index, optionIndex)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Anterior
                  </Button>
                )}
              </div>
              <div className="flex space-x-3">
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-election-blue hover:bg-blue-700"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createSurveyMutation.isPending}
                    className="bg-election-blue hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createSurveyMutation.isPending ? "Criando..." : "Criar Pesquisa"}
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
