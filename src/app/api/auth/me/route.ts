import { NextRequest } from "next/server";
import { AuthController } from "@/server/modules/auth/controllers/auth.controller";

export const dynamic = 'force-dynamic';

const controller = new AuthController();

export async function GET(req: NextRequest) {
  return controller.handleGetCurrentUser(req);
}
