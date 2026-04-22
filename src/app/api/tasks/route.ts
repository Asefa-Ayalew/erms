import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getTokenFromRequest, verifySessionToken } from "@/lib/auth/server";
import { readDb, writeDb } from "@/lib/local-api/db";
import type { Task } from "@/app/(features)/projects/models/task";

function canMutateTasks(roles: string[]) {
  return roles.includes("admin") || roles.includes("manager");
}

function toTask(input: Partial<Task>): Task {
  return {
    id: randomUUID(),
    title: input.title ?? "Untitled task",
    description: input.description ?? "",
    status: input.status ?? "not-started",
    priority: input.priority ?? "Medium",
    tags: Array.isArray(input.tags) ? input.tags : [],
    startDate: input.startDate ?? new Date().toISOString().slice(0, 10),
    dueDate: input.dueDate ?? new Date().toISOString().slice(0, 10),
    assignee: input.assignee ?? "",
    badges: Array.isArray(input.badges) ? input.badges : [],
  };
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.tasks, { status: 200 });
}

export async function POST(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!canMutateTasks(payload.roles)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Partial<Task> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid task payload." }, { status: 400 });
  }

  const db = await readDb();
  const created = toTask(body);
  db.tasks.push(created);
  await writeDb(db);
  return NextResponse.json(created, { status: 201 });
}
