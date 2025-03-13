import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = Router();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const prisma = new PrismaClient({});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const categoryCache = new Map<string, string>();

async function categorizeEvent(
  title: string,
  description: string
): Promise<string> {
  const cacheKey = `${title}-${description}`;

  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey)!;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Categorize this event into one of these categories: "CONFERENCE", "WORKSHOP", "SOCIAL", "MEETING", "TRAINING", "OTHER". Only respond with the category name. Event title: ${title}. Description: ${description}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const category = response.choices[0].message.content?.trim() || "OTHER";
    categoryCache.set(cacheKey, category);
    return category;
  } catch (error) {
    console.error("Error in categorization:", error);
    return "OTHER";
  }
}

router.post("/events", async (req: Request, res: Response) => {
  const { title, description, date } = req.body;

  try {
    const category = await categorizeEvent(title, description);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        // @ts-ignore
        category,
      },
    });
    res.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({
      error: "Failed to create event",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/events", async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: "desc",
      },
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.put("/events/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date } = req.body;

  try {
    const category = await categorizeEvent(title, description);
    const event = await prisma.event.update({
      where: { id: id },
      data: {
        title,
        description,
        date: new Date(date),
        // @ts-ignore
        category,
      },
    });
    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ error: "Failed to update event" });
  }
});

router.delete("/events/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({
      where: { id: id },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(400).json({ error: "Failed to delete event" });
  }
});

export default router;
