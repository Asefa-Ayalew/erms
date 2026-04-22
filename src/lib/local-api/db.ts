import { promises as fs } from "fs";
import path from "path";
import type { Task } from "@/app/(features)/projects/models/task";

export type ExternalUserDetailResponse = {
  id: string;
  userId: string;
  sub: string;
  username: string;
  email: string;
  phone?: string;
  name: string;
  fullName: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  organizationId: string | null;
  isActive: boolean;
  roles: string[];
};

type LocalUserRecord = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  fatherName?: string;
  lastName?: string;
  organizationId?: string | null;
  isActive?: boolean;
  roles?: string[];
};

type LocalDb = {
  users: LocalUserRecord[];
  tasks: Task[];
};

const DB_PATH = path.join(process.cwd(), "src", "data", "local-db.json");

export async function readDb(): Promise<LocalDb> {
  const content = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(content) as LocalDb;
}

export async function writeDb(db: LocalDb): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function buildExternalUserDetail(user: LocalUserRecord): ExternalUserDetailResponse {
  const firstName = user.firstName ?? "";
  const fatherName = user.fatherName ?? "";
  const lastName = user.lastName ?? "";
  const fullName = [firstName, fatherName || lastName].filter(Boolean).join(" ").trim();

  return {
    id: user.id,
    userId: user.id,
    sub: user.id,
    username: user.username,
    email: user.email,
    name: fullName,
    fullName,
    firstName,
    fatherName,
    lastName,
    organizationId: user.organizationId ?? null,
    isActive: user.isActive ?? true,
    roles: Array.isArray(user.roles) ? user.roles : [],
  };
}
