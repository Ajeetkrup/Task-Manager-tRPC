import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { z } from "zod";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

type Task = {
  id: string;
  name: string;
  description: string;
  status: string;
  timeStamp: string;
};

const tasks: Task[] = [
  {
    id: "1",
    name: "Complete project documentation",
    description: "Write comprehensive API documentation for the new GraphQL endpoints",
    status: "Done",
    timeStamp: "2025-08-23",
  },
  {
    id: "2",
    name: "Fix authentication bug",
    description: "Resolve JWT token expiration issue in the login module",
    status: "In Progress",
    timeStamp: "2025-08-24",
  },
  {
    id: "3",
    name: "Design database schema",
    description: "Create normalized database structure for user management system",
    status: "Todo",
    timeStamp: "2025-08-24",
  },
  {
    id: "4",
    name: "Implement payment gateway",
    description: "Integrate Stripe API for subscription billing functionality",
    status: "In Progress",
    timeStamp: "2025-08-22",
  },
  {
    id: "5",
    name: "Code review team PRs",
    description: "Review and approve pending pull requests from development team",
    status: "Todo",
    timeStamp: "2025-08-24",
  },
];

export const t = initTRPC.create();

export const appRouter = t.router({
  getAllTasks: t.procedure.query(() => {
    return tasks;
  }),

  getTaskById: t.procedure
    .input(z.string())
    .query((opts) => {
      const task = tasks.find((task) => task.id === opts.input);
      if (!task) {
        throw new Error(`Task with ID ${opts.input} not found`);
      }
      return task;
    }),

  addTask: t.procedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        status: z.string(),
      })
    )
    .mutation(async (opts) => {
      const newTask: Task = {
        ...opts.input,
        id: String(Date.now()),
        timeStamp: new Date().toISOString().split("T")[0],
      };
      tasks.push(newTask);
      return newTask;
    }),

  deleteTask: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation((opts) => {
      const id = opts.input.id;
      const index = tasks.findIndex((task) => task.id === id);
      
      if (index === -1) {
        throw new Error(`Task with ID ${id} not found`);
      }

      const deletedTask = tasks.splice(index, 1)[0];
      return {
        success: true,
        message: `Task "${deletedTask.name}" deleted successfully`,
        deletedTask,
      };
    }),

  updateTask: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.string(),
      })
    )
    .mutation(async (opts) => {
      const id = opts.input.id;
      const index = tasks.findIndex((task) => task.id === id);
      
      if (index === -1) {
        throw new Error(`Task with ID ${id} not found`);
      }

      if (opts.input.name !== undefined) {
        tasks[index].name = opts.input.name;
      }
      if (opts.input.description !== undefined) {
        tasks[index].description = opts.input.description;
      }
      if (opts.input.status !== undefined) {
        tasks[index].status = opts.input.status;
      }
      
      tasks[index].timeStamp = new Date().toISOString().split("T")[0];
      
      return tasks[index];
    }),
});

export type AppRouter = typeof appRouter;

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 tRPC endpoint: http://localhost:${PORT}/trpc`);
});