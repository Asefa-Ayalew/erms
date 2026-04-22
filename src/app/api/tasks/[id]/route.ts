import { NextResponse } from "next/server";
import { getTokenFromRequest, verifySessionToken } from "@/lib/auth/server";
import { readDb, writeDb } from "@/lib/local-api/db";
import type { Task } from "@/app/(features)/projects/models/task";

function canMutateTasks(roles: string[]) {
  return roles.includes("admin") || roles.includes("manager");
}

async function authorize(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  if (!canMutateTasks(payload.roles)) {
    return { error: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }

  return { error: null };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize(request);
  if (auth.error) {
    return auth.error;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<Task> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid task payload." }, { status: 400 });
  }

  const db = await readDb();
  const index = db.tasks.findIndex((task) => task.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const updated = { ...db.tasks[index], ...body, id };
  db.tasks[index] = updated;
  await writeDb(db);
  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize(request);
  if (auth.error) {
    return auth.error;
  }

  const { id } = await params;
  const db = await readDb();
  const existing = db.tasks.some((task) => task.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  db.tasks = db.tasks.filter((task) => task.id !== id);
  await writeDb(db);
  return NextResponse.json({ success: true }, { status: 200 });
}
