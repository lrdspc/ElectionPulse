import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertSurveySchema, insertQuestionSchema, insertRegionSchema, 
  insertSurveyAssignmentSchema, insertResponseSchema 
} from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Survey routes
  app.get("/api/surveys", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const surveys = req.user?.role === 'admin' 
        ? await storage.getSurveys()
        : await storage.getSurveysByCreator(req.user!.id);
      
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar pesquisas" });
    }
  });

  app.post("/api/surveys", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      const surveyData = insertSurveySchema.parse({
        ...req.body,
        createdBy: req.user.id
      });
      
      const survey = await storage.createSurvey(surveyData);
      res.status(201).json(survey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de pesquisa inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar pesquisa" });
    }
  });

  app.get("/api/surveys/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const survey = await storage.getSurvey(parseInt(req.params.id));
      if (!survey) return res.sendStatus(404);
      
      res.json(survey);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar pesquisa" });
    }
  });

  app.put("/api/surveys/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      const updates = insertSurveySchema.partial().parse(req.body);
      const survey = await storage.updateSurvey(parseInt(req.params.id), updates);
      
      if (!survey) return res.sendStatus(404);
      res.json(survey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de pesquisa inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao atualizar pesquisa" });
    }
  });

  // Question routes
  app.get("/api/surveys/:id/questions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const questions = await storage.getQuestionsBySurvey(parseInt(req.params.id));
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar questões" });
    }
  });

  app.post("/api/surveys/:id/questions", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      const questionData = insertQuestionSchema.parse({
        ...req.body,
        surveyId: parseInt(req.params.id)
      });
      
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de questão inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar questão" });
    }
  });

  // Region routes
  app.get("/api/regions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar regiões" });
    }
  });

  app.post("/api/regions", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      const regionData = insertRegionSchema.parse(req.body);
      const region = await storage.createRegion(regionData);
      res.status(201).json(region);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de região inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar região" });
    }
  });

  // Survey assignment routes
  app.get("/api/assignments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const assignments = req.user?.role === 'admin'
        ? await storage.getSurveyAssignments()
        : await storage.getSurveyAssignmentsByResearcher(req.user!.id);
      
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      const assignmentData = insertSurveyAssignmentSchema.parse(req.body);
      const assignment = await storage.createSurveyAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  // Response routes
  app.get("/api/responses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { assignmentId } = req.query;
      
      if (assignmentId) {
        const responses = await storage.getResponsesByAssignment(parseInt(assignmentId as string));
        return res.json(responses);
      }
      
      if (req.user?.role === 'researcher') {
        const responses = await storage.getResponsesByResearcher(req.user.id);
        return res.json(responses);
      }
      
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  app.post("/api/responses", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'researcher') {
        return res.sendStatus(401);
      }
      
      const responseData = insertResponseSchema.parse({
        ...req.body,
        researcherId: req.user.id
      });
      
      const response = await storage.createResponse(responseData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de resposta inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar resposta" });
    }
  });

  // Researcher routes
  app.get("/api/researchers", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      const researchers = await storage.getResearchers();
      const researchersWithoutPasswords = researchers.map(({ password, ...researcher }) => researcher);
      res.json(researchersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch researchers" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      if (req.user?.role === 'admin') {
        const stats = await storage.getAdminStats();
        res.json(stats);
      } else {
        const stats = await storage.getResearcherStats(req.user!.id);
        res.json(stats);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Reports routes
  app.get("/api/reports/:type", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }

      const reportType = req.params.type;
      
      switch (reportType) {
        case 'responses':
          const responseReport = await storage.getResponsesReport();
          res.json(responseReport);
          break;
        case 'performance':
          const performanceReport = await storage.getPerformanceReport();
          res.json(performanceReport);
          break;
        case 'demographics':
          const demographicsReport = await storage.getDemographicsReport();
          res.json(demographicsReport);
          break;
        default:
          res.status(400).json({ message: "Invalid report type" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  app.get("/api/reports/:type/download", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }

      const reportType = req.params.type;
      const format = req.query.format || 'csv';
      
      let reportData;
      let filename;
      
      switch (reportType) {
        case 'responses':
          reportData = await storage.getResponsesReport();
          filename = `relatorio-respostas-${new Date().toISOString().split('T')[0]}.${format}`;
          break;
        case 'performance':
          reportData = await storage.getPerformanceReport();
          filename = `relatorio-performance-${new Date().toISOString().split('T')[0]}.${format}`;
          break;
        case 'demographics':
          reportData = await storage.getDemographicsReport();
          filename = `relatorio-demografico-${new Date().toISOString().split('T')[0]}.${format}`;
          break;
        default:
          return res.status(400).json({ message: "Invalid report type" });
      }

      if (format === 'csv') {
        const csvContent = generateCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
      } else {
        res.json(reportData);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to download report" });
    }
  });

  app.delete("/api/surveys/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      await storage.deleteSurvey(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete survey" });
    }
  });

  app.delete("/api/regions/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      
      await storage.deleteRegion(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete region" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;

function generateCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}
}
