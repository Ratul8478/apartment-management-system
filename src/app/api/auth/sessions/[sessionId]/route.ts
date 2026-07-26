import { NextRequest } from "next/server";
import { AuthController } from "@/server/modules/auth/controllers/auth.controller";

const controller = new AuthController();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  return controller.handleTerminateSession(req, params.sessionId);
}
