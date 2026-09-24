import { prisma } from './prisma';
export async function audit(userId:string, action:string, entity:string, entityId?:string, metadata?:unknown){
  await prisma.auditLog.create({data:{userId,action,entity,entityId,metadata:metadata as any}});
}
