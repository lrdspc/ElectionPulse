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
      setLocation("/admin");
    } else {
      setLocation("/researcher");
    }
    return null;
  }

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: (user) => {
        if (user.role === "admin") {
          setLocation("/admin");
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
          setLocation("/admin");
        } else {
          setLocation("/researcher");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-election-blue/5 to-success-green/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-dark-slate">
              Sistema de Pesquisas Eleitorais
            </h1>
            <p className="text-lg text-slate-grey">
              Plataforma completa para gerenciamento e coleta de dados eleitorais
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-election-blue/10 p-3 rounded-lg">
                <Vote className="h-6 w-6 text-election-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-slate">Criação de Pesquisas</h3>
                <p className="text-sm text-slate-grey">Crie pesquisas personalizadas com diferentes tipos de perguntas</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-success-green/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-success-green" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-slate">Gestão Geográfica</h3>
                <p className="text-sm text-slate-grey">Atribua pesquisas a regiões específicas para coleta direcionada</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-warning-orange/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-warning-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-slate">Equipe de Campo</h3>
                <p className="text-sm text-slate-grey">Coordene pesquisadores e acompanhe o progresso em tempo real</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-election-red/10 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-election-red" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-slate">Análise de Dados</h3>
                <p className="text-sm text-slate-grey">Relatórios detalhados e estatísticas em tempo real</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-dark-slate">Acesse sua conta</CardTitle>
              <CardDescription>
                Entre com suas credenciais ou crie uma nova conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuário</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Digite seu usuário" />
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
                              <Input {...field} type="password" placeholder="Digite sua senha" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {loginMutation.error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                          {String(loginMutation.error)}
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Digite seu nome completo" />
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
                              <Input {...field} placeholder="Escolha um nome de usuário" />
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
                              <Input {...field} type="email" placeholder="Digite seu email" />
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
                              <Input {...field} type="password" placeholder="Crie uma senha segura" />
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
                            <FormLabel>Tipo de conta</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de conta" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">Admin</Badge>
                                    <span>Administrador</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="researcher">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">Pesquisador</Badge>
                                    <span>Pesquisador de campo</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {registerMutation.error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                          {String(registerMutation.error)}
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}