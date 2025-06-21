import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Vote, Users, MapPin, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "researcher"], { required_error: "Please select a role" }),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      role: "researcher",
    },
  });

  // Redirect if already logged in
  if (user) {
    if (user.role === "admin") {
      setLocation("/");
    } else {
      setLocation("/researcher");
    }
    return null;
  }

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: (user) => {
        if (user.role === "admin") {
          setLocation("/");
        } else {
          setLocation("/researcher");
        }
      },
    });
  };

  const onRegister = (data: RegisterForm) => {
    registerMutation.mutate(data, {
      onSuccess: (user) => {
        if (user.role === "admin") {
          setLocation("/");
        } else {
          setLocation("/researcher");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-light-grey">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Forms */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-election-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-dark-slate mb-2">ElectionSurvey</h1>
              <p className="text-slate-grey">Plataforma de Pesquisas Eleitorais</p>
            </div>

            <Card className="max-w-md mx-auto w-full">
              <Tabs defaultValue="login" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="register">Registrar</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuário</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite seu usuário" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Digite sua senha" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-election-blue hover:bg-blue-700"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Entrando..." : "Entrar"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Digite seu email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuário</FormLabel>
                              <FormControl>
                                <Input placeholder="Escolha um nome de usuário" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Crie uma senha" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Usuário</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de usuário" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="researcher">Pesquisador</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-election-blue hover:bg-blue-700"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Registrando..." : "Registrar"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Right side - Hero section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-dark-slate mb-4">
                Conduza Pesquisas Eleitorais Profissionais
              </h2>
              <p className="text-lg text-slate-grey mb-8">
                Plataforma completa para criação, distribuição e coleta de pesquisas eleitorais
                com interface intuitiva e mapeamento geográfico.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-election-blue bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-election-blue" />
                </div>
                <h3 className="font-semibold text-dark-slate mb-2">Painel Administrativo</h3>
                <p className="text-sm text-slate-grey">
                  Crie e configure pesquisas com critérios demográficos e regionais
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-success-green" />
                </div>
                <h3 className="font-semibold text-dark-slate mb-2">Mapa Interativo</h3>
                <p className="text-sm text-slate-grey">
                  Visualize locais de pesquisa e acompanhe quotas por região
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-warning-amber bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-warning-amber" />
                </div>
                <h3 className="font-semibold text-dark-slate mb-2">Análise em Tempo Real</h3>
                <p className="text-sm text-slate-grey">
                  Acompanhe o progresso e resultados das pesquisas
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-grey bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-6 h-6 text-slate-grey" />
                </div>
                <h3 className="font-semibold text-dark-slate mb-2">Coleta Eficiente</h3>
                <p className="text-sm text-slate-grey">
                  Interface otimizada para pesquisadores de campo
                </p>
              </Card>
            </div>

            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Gestão de Usuários
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Geolocalização
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
