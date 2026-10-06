import { prisma } from "./prisma";

export async function audit(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const safeMetadata =
    metadata === undefined
      ? undefined
      : JSON.parse(JSON.stringify(metadata));

  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata: safeMetadata,
    },
  });
}
