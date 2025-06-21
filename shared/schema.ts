import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin' or 'researcher'
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // 'draft', 'active', 'completed', 'paused'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  demographics: jsonb("demographics"), // age ranges, gender, education, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull().references(() => surveys.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  type: text("type").notNull(), // 'radio', 'checkbox', 'text', 'scale'
  options: jsonb("options"), // array of answer options
  required: boolean("required").default(true),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coordinates: jsonb("coordinates"), // polygon/area coordinates
  city: text("city").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveyAssignments = pgTable("survey_assignments", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull().references(() => surveys.id, { onDelete: "cascade" }),
  regionId: integer("region_id").notNull().references(() => regions.id, { onDelete: "cascade" }),
  researcherId: integer("researcher_id").references(() => users.id, { onDelete: "set null" }),
  targetResponses: integer("target_responses").notNull().default(100),
  completedResponses: integer("completed_responses").notNull().default(0),
  status: text("status").notNull().default("pending"), // 'pending', 'in_progress', 'completed', 'overdue'
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull().references(() => surveys.id, { onDelete: "cascade" }),
  assignmentId: integer("assignment_id").notNull().references(() => surveyAssignments.id, { onDelete: "cascade" }),
  researcherId: integer("researcher_id").notNull().references(() => users.id),
  demographics: jsonb("demographics"), // respondent demographics
  answers: jsonb("answers"), // question_id -> answer mapping
  location: jsonb("location"), // lat/lng coordinates
  status: text("status").notNull().default("draft"), // 'draft', 'completed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdSurveys: many(surveys),
  assignments: many(surveyAssignments),
  responses: many(responses),
}));

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  creator: one(users, {
    fields: [surveys.createdBy],
    references: [users.id],
  }),
  questions: many(questions),
  assignments: many(surveyAssignments),
  responses: many(responses),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  survey: one(surveys, {
    fields: [questions.surveyId],
    references: [surveys.id],
  }),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
  assignments: many(surveyAssignments),
}));

export const surveyAssignmentsRelations = relations(surveyAssignments, ({ one, many }) => ({
  survey: one(surveys, {
    fields: [surveyAssignments.surveyId],
    references: [surveys.id],
  }),
  region: one(regions, {
    fields: [surveyAssignments.regionId],
    references: [regions.id],
  }),
  researcher: one(users, {
    fields: [surveyAssignments.researcherId],
    references: [users.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  survey: one(surveys, {
    fields: [responses.surveyId],
    references: [surveys.id],
  }),
  assignment: one(surveyAssignments, {
    fields: [responses.assignmentId],
    references: [surveyAssignments.id],
  }),
  researcher: one(users, {
    fields: [responses.researcherId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSurveySchema = createInsertSchema(surveys).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
  createdAt: true,
});

export const insertSurveyAssignmentSchema = createInsertSchema(surveyAssignments).omit({
  id: true,
  assignedAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type SurveyAssignment = typeof surveyAssignments.$inferSelect;
export type InsertSurveyAssignment = z.infer<typeof insertSurveyAssignmentSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
