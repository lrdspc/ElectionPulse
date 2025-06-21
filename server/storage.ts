import { 
  users, surveys, questions, regions, surveyAssignments, responses,
  type User, type InsertUser, type Survey, type InsertSurvey,
  type Question, type InsertQuestion, type Region, type InsertRegion,
  type SurveyAssignment, type InsertSurveyAssignment,
  type Response, type InsertResponse
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getResearchers(): Promise<User[]>;
  
  // Survey operations
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  getSurveys(): Promise<Survey[]>;
  getSurveysByCreator(userId: number): Promise<Survey[]>;
  getSurvey(id: number): Promise<Survey | undefined>;
  updateSurvey(id: number, updates: Partial<InsertSurvey>): Promise<Survey | undefined>;
  deleteSurvey(id: number): Promise<void>;
  
  // Question operations
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsBySurvey(surveyId: number): Promise<Question[]>;
  updateQuestion(id: number, updates: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<void>;
  
  // Region operations
  createRegion(region: InsertRegion): Promise<Region>;
  getRegions(): Promise<Region[]>;
  getRegion(id: number): Promise<Region | undefined>;
  updateRegion(id: number, updates: Partial<InsertRegion>): Promise<Region | undefined>;
  deleteRegion(id: number): Promise<void>;
  
  // Survey assignment operations
  createSurveyAssignment(assignment: InsertSurveyAssignment): Promise<SurveyAssignment>;
  getSurveyAssignments(): Promise<SurveyAssignment[]>;
  getSurveyAssignmentsByResearcher(researcherId: number): Promise<SurveyAssignment[]>;
  getSurveyAssignmentsBySurvey(surveyId: number): Promise<SurveyAssignment[]>;
  updateSurveyAssignment(id: number, updates: Partial<InsertSurveyAssignment>): Promise<SurveyAssignment | undefined>;
  
  // Response operations
  createResponse(response: InsertResponse): Promise<Response>;
  getResponsesByAssignment(assignmentId: number): Promise<Response[]>;
  getResponsesByResearcher(researcherId: number): Promise<Response[]>;
  updateResponse(id: number, updates: Partial<InsertResponse>): Promise<Response | undefined>;
  
  // Dashboard statistics
  getAdminStats(): Promise<{
    activeSurveys: number;
    totalResponses: number;
    activeResearchers: number;
    completionRate: number;
  }>;
  
  getResearcherStats(researcherId: number): Promise<{
    completedSurveys: number;
    inProgressSurveys: number;
    todaySurveys: number;
    successRate: number;
  }>;

  // Report operations
  getResponsesReport(): Promise<any[]>;
  getPerformanceReport(): Promise<any[]>;
  getDemographicsReport(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getResearchers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'researcher'));
  }

  // Survey operations
  async createSurvey(survey: InsertSurvey): Promise<Survey> {
    const [newSurvey] = await db
      .insert(surveys)
      .values({ ...survey, updatedAt: new Date() })
      .returning();
    return newSurvey;
  }

  async getSurveys(): Promise<Survey[]> {
    return await db.select().from(surveys).orderBy(desc(surveys.createdAt));
  }

  async getSurveysByCreator(userId: number): Promise<Survey[]> {
    return await db.select().from(surveys)
      .where(eq(surveys.createdBy, userId))
      .orderBy(desc(surveys.createdAt));
  }

  async getSurvey(id: number): Promise<Survey | undefined> {
    const [survey] = await db.select().from(surveys).where(eq(surveys.id, id));
    return survey || undefined;
  }

  async updateSurvey(id: number, updates: Partial<InsertSurvey>): Promise<Survey | undefined> {
    const [updated] = await db
      .update(surveys)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(surveys.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSurvey(id: number): Promise<void> {
    await db.delete(surveys).where(eq(surveys.id, id));
  }

  // Question operations
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async getQuestionsBySurvey(surveyId: number): Promise<Question[]> {
    return await db.select().from(questions)
      .where(eq(questions.surveyId, surveyId))
      .orderBy(asc(questions.order));
  }

  async updateQuestion(id: number, updates: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [updated] = await db
      .update(questions)
      .set(updates)
      .where(eq(questions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteQuestion(id: number): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  // Region operations
  async createRegion(region: InsertRegion): Promise<Region> {
    const [newRegion] = await db
      .insert(regions)
      .values(region)
      .returning();
    return newRegion;
  }

  async getRegions(): Promise<Region[]> {
    return await db.select().from(regions).orderBy(asc(regions.name));
  }

  async getRegion(id: number): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.id, id));
    return region || undefined;
  }

  async updateRegion(id: number, updates: Partial<InsertRegion>): Promise<Region | undefined> {
    const [updated] = await db
      .update(regions)
      .set(updates)
      .where(eq(regions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteRegion(id: number): Promise<void> {
    await db.delete(regions).where(eq(regions.id, id));
  }

  // Survey assignment operations
  async createSurveyAssignment(assignment: InsertSurveyAssignment): Promise<SurveyAssignment> {
    const [newAssignment] = await db
      .insert(surveyAssignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async getSurveyAssignments(): Promise<SurveyAssignment[]> {
    return await db.select().from(surveyAssignments)
      .orderBy(desc(surveyAssignments.assignedAt));
  }

  async getSurveyAssignmentsByResearcher(researcherId: number): Promise<SurveyAssignment[]> {
    return await db.select().from(surveyAssignments)
      .where(eq(surveyAssignments.researcherId, researcherId))
      .orderBy(desc(surveyAssignments.assignedAt));
  }

  async getSurveyAssignmentsBySurvey(surveyId: number): Promise<SurveyAssignment[]> {
    return await db.select().from(surveyAssignments)
      .where(eq(surveyAssignments.surveyId, surveyId))
      .orderBy(desc(surveyAssignments.assignedAt));
  }

  async updateSurveyAssignment(id: number, updates: Partial<InsertSurveyAssignment>): Promise<SurveyAssignment | undefined> {
    const [updated] = await db
      .update(surveyAssignments)
      .set(updates)
      .where(eq(surveyAssignments.id, id))
      .returning();
    return updated || undefined;
  }

  // Response operations
  async createResponse(response: InsertResponse): Promise<Response> {
    const [newResponse] = await db
      .insert(responses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getResponsesByAssignment(assignmentId: number): Promise<Response[]> {
    return await db.select().from(responses)
      .where(eq(responses.assignmentId, assignmentId))
      .orderBy(desc(responses.createdAt));
  }

  async getResponsesByResearcher(researcherId: number): Promise<Response[]> {
    return await db.select().from(responses)
      .where(eq(responses.researcherId, researcherId))
      .orderBy(desc(responses.createdAt));
  }

  async updateResponse(id: number, updates: Partial<InsertResponse>): Promise<Response | undefined> {
    const [updated] = await db
      .update(responses)
      .set(updates)
      .where(eq(responses.id, id))
      .returning();
    return updated || undefined;
  }

  // Dashboard statistics
  async getAdminStats(): Promise<{
    activeSurveys: number;
    totalResponses: number;
    activeResearchers: number;
    completionRate: number;
  }> {
    const activeSurveysResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(surveys)
      .where(eq(surveys.status, 'active'));

    const totalResponsesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(responses)
      .where(eq(responses.status, 'completed'));

    const activeResearchersResult = await db
      .select({ count: sql<number>`count(distinct ${responses.researcherId})` })
      .from(responses)
      .where(
        and(
          eq(responses.status, 'completed'),
          sql`${responses.createdAt} >= current_date`
        )
      );

    const completionStats = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(*) filter (where ${responses.status} = 'completed')`
      })
      .from(responses);

    const completionRate = completionStats[0]?.total > 0 
      ? Math.round((completionStats[0].completed / completionStats[0].total) * 100)
      : 0;

    return {
      activeSurveys: activeSurveysResult[0]?.count || 0,
      totalResponses: totalResponsesResult[0]?.count || 0,
      activeResearchers: activeResearchersResult[0]?.count || 0,
      completionRate,
    };
  }

  async getResearcherStats(researcherId: number): Promise<{
    completedSurveys: number;
    inProgressSurveys: number;
    todaySurveys: number;
    successRate: number;
  }> {
    const completedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(responses)
      .where(
        and(
          eq(responses.researcherId, researcherId),
          eq(responses.status, 'completed')
        )
      );

    const inProgressResult = await db
      .select({ count: sql<number>`count(distinct ${responses.assignmentId})` })
      .from(responses)
      .where(
        and(
          eq(responses.researcherId, researcherId),
          eq(responses.status, 'draft')
        )
      );

    const todayResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(responses)
      .where(
        and(
          eq(responses.researcherId, researcherId),
          eq(responses.status, 'completed'),
          sql`${responses.completedAt} >= current_date`
        )
      );

    const successStats = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(*) filter (where ${responses.status} = 'completed')`
      })
      .from(responses)
      .where(eq(responses.researcherId, researcherId));

    const successRate = successStats[0]?.total > 0 
      ? Math.round((successStats[0].completed / successStats[0].total) * 100)
      : 0;

    return {
      completedSurveys: completedResult[0]?.count || 0,
      inProgressSurveys: inProgressResult[0]?.count || 0,
      todaySurveys: todayResult[0]?.count || 0,
      successRate,
    };
  }

  async getResponsesReport(): Promise<any[]> {
    try {
      // Para dados reais, fazemos consulta simples primeiro
      const result = await db
        .select({
          surveyTitle: surveys.title,
          totalSurveys: sql<number>`count(distinct ${surveys.id})`,
          createdAt: surveys.createdAt
        })
        .from(surveys)
        .groupBy(surveys.id, surveys.title, surveys.createdAt);

      return result.length > 0 ? result : [
        { surveyTitle: "Nenhuma pesquisa encontrada", totalSurveys: 0, createdAt: new Date() }
      ];
    } catch (error) {
      console.error('Error in getResponsesReport:', error);
      return [{ surveyTitle: "Erro ao carregar dados", totalSurveys: 0, createdAt: new Date() }];
    }
  }

  async getPerformanceReport(): Promise<any[]> {
    try {
      const result = await db
        .select({
          researcherName: users.name,
          totalAssignments: sql<number>`0`,
          completedAssignments: sql<number>`0`,
          totalResponses: sql<number>`0`,
          successRate: sql<number>`0`
        })
        .from(users)
        .where(eq(users.role, 'researcher'));

      return result.length > 0 ? result : [
        { researcherName: "Nenhum pesquisador encontrado", totalAssignments: 0, completedAssignments: 0, totalResponses: 0, successRate: 0 }
      ];
    } catch (error) {
      console.error('Error in getPerformanceReport:', error);
      return [{ researcherName: "Erro ao carregar dados", totalAssignments: 0, completedAssignments: 0, totalResponses: 0, successRate: 0 }];
    }
  }

  async getDemographicsReport(): Promise<any[]> {
    try {
      const result = await db
        .select({
          regionName: regions.name,
          totalRegions: sql<number>`count(${regions.id})`,
          city: regions.city,
          state: regions.state
        })
        .from(regions)
        .groupBy(regions.id, regions.name, regions.city, regions.state);

      return result.length > 0 ? result : [
        { regionName: "Nenhuma região encontrada", totalRegions: 0, city: "", state: "" }
      ];
    } catch (error) {
      console.error('Error in getDemographicsReport:', error);
      return [{ regionName: "Erro ao carregar dados", totalRegions: 0, city: "", state: "" }];
    }
  }
}

export const storage = new DatabaseStorage();
