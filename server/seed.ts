import { db } from "./db";
import { users, surveys, questions, regions, surveyAssignments } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Create admin user
    const [adminUser] = await db
      .insert(users)
      .values({
        username: "admin",
        password: await hashPassword("admin123"),
        name: "Administrator",
        email: "admin@example.com",
        role: "admin",
      })
      .onConflictDoNothing()
      .returning();

    // Create researcher user
    const [researcherUser] = await db
      .insert(users)
      .values({
        username: "researcher",
        password: await hashPassword("researcher123"),
        name: "Maria Silva",
        email: "maria@example.com",
        role: "researcher",
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Users created:");
    console.log("   Admin: admin/admin123");
    console.log("   Researcher: researcher/researcher123");

    // Create regions
    const regionData = [
      {
        name: "Centro",
        description: "Região central da cidade",
        city: "São Paulo",
        state: "SP",
        coordinates: { lat: -23.5505, lng: -46.6333 },
      },
      {
        name: "Liberdade",
        description: "Bairro da Liberdade",
        city: "São Paulo",
        state: "SP",
        coordinates: { lat: -23.5475, lng: -46.6361 },
      },
      {
        name: "Vila Madalena",
        description: "Região da Vila Madalena",
        city: "São Paulo",
        state: "SP",
        coordinates: { lat: -23.5329, lng: -46.6395 },
      },
    ];

    const createdRegions = await db
      .insert(regions)
      .values(regionData)
      .onConflictDoNothing()
      .returning();

    console.log("✅ Regions created");

    if (adminUser && createdRegions.length > 0) {
      // Create sample survey
      const [survey] = await db
        .insert(surveys)
        .values({
          title: "Pesquisa Eleitoral Municipal 2024",
          description: "Pesquisa de intenção de voto para prefeito",
          status: "active",
          createdBy: adminUser.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          demographics: {
            ageRanges: ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"],
            genders: ["Masculino", "Feminino", "Não binário"],
            educationLevels: ["Fundamental", "Médio", "Superior", "Pós-graduação"],
          },
        })
        .onConflictDoNothing()
        .returning();

      if (survey) {
        // Create survey questions
        const questionData = [
          {
            surveyId: survey.id,
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
            surveyId: survey.id,
            question: "Como você avalia a gestão atual do prefeito?",
            type: "radio",
            options: ["Ótima", "Boa", "Regular", "Ruim", "Péssima"],
            required: true,
            order: 2,
          },
          {
            surveyId: survey.id,
            question: "Qual é a principal prioridade para a cidade?",
            type: "radio",
            options: ["Saúde", "Educação", "Segurança", "Transporte", "Habitação"],
            required: true,
            order: 3,
          },
        ];

        await db
          .insert(questions)
          .values(questionData)
          .onConflictDoNothing();

        console.log("✅ Survey and questions created");

        // Create survey assignments
        if (researcherUser) {
          const assignmentData = createdRegions.map((region, index) => ({
            surveyId: survey.id,
            regionId: region.id,
            researcherId: researcherUser.id,
            targetResponses: 50 + (index * 10), // Different targets per region
            completedResponses: Math.floor(Math.random() * 20), // Random progress
            status: ["pending", "in_progress", "completed"][index % 3] as "pending" | "in_progress" | "completed",
            dueDate: new Date(Date.now() + (7 + index) * 24 * 60 * 60 * 1000), // Different due dates
          }));

          await db
            .insert(surveyAssignments)
            .values(assignmentData)
            .onConflictDoNothing();

          console.log("✅ Survey assignments created");
        }
      }
    }

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}