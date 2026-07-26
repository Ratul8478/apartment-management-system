import { NextRequest } from "next/server";
import { AuthController } from "@/server/modules/auth/controllers/auth.controller";

const controller = new AuthController();

export async function GET(req: NextRequest) {
  return controller.handleGetActiveSessions(req);
}

export async function DELETE(req: NextRequest) {
  return controller.handleTerminateAllSessions(req);
}
