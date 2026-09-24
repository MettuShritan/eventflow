import { PrismaClient, Role, UserStatus, EventStatus, RegistrationStatus, PipelineStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma=new PrismaClient();

async function main(){
const password=await bcrypt.hash('EventFlow@123',12);
const users:any={};
for(const u of [
 {key:'participant',name:'Aarav Participant',email:'participant@eventflow.demo',role:Role.PARTICIPANT,college:'CBIT',department:'Computer Engineering',year:3},
 {key:'committee',name:'Event Committee',email:'committee@eventflow.demo',role:Role.EVENT_COMMITTEE,college:'CBIT',department:'Student Affairs',year:3},
 {key:'admin',name:'EventFlow Admin',email:'admin@eventflow.demo',role:Role.ADMIN}
]) users[u.key]=await prisma.user.upsert({where:{email:u.email},update:{passwordHash:password,role:u.role,status:UserStatus.ACTIVE},create:{name:u.name,email:u.email,role:u.role,college:u.college,department:u.department,year:u.year,passwordHash:password,status:UserStatus.ACTIVE}});
const committee=users.committee;
const specs=[
 ['NEX-SYNAPSE 2026','Hackathon','A 24-hour innovation hackathon for building practical technology solutions.','Innovation Block, CBIT','2026-10-10T09:00:00+05:30','2026-10-11T17:00:00+05:30',150],
 ['AI & Machine Learning Workshop','AI & Machine Learning','Hands-on model building, evaluation and responsible AI workflows.','AI Lab, CBIT','2026-10-18T10:00:00+05:30','2026-10-18T16:00:00+05:30',80],
 ['Cybersecurity Summit','Cybersecurity','Security talks, CTF challenges and incident-response sessions.','Seminar Hall, CBIT','2026-10-25T09:30:00+05:30','2026-10-25T17:30:00+05:30',120],
 ['Web Development Bootcamp','Web Development','Build and deploy a modern full-stack web application.','CSE Lab 2, CBIT','2026-11-02T10:00:00+05:30','2026-11-03T17:00:00+05:30',70],
 ['Blockchain Conference','Blockchain','Decentralized systems, smart contracts and Web3 engineering.','Main Auditorium, CBIT','2026-11-12T10:00:00+05:30','2026-11-12T18:00:00+05:30',200],
 ['IoT Innovation Challenge','IoT','Prototype connected-device solutions for campus problems.','IoT Lab, CBIT','2026-11-20T09:00:00+05:30','2026-11-20T18:00:00+05:30',100],
 ['Photography Workshop','Photography','Composition, lighting and visual storytelling workshop.','Media Studio, CBIT','2026-12-05T10:00:00+05:30','2026-12-05T15:00:00+05:30',50]
];
const events=[];
for(let i=0;i<specs.length;i++){
 const [title,category,description,venue,start,end,capacity]=specs[i] as any;
 const e=await prisma.event.upsert({where:{id:`demo-${i+1}`},update:{title,category,description,venue,startDate:new Date(start),endDate:new Date(end),registrationDeadline:new Date(new Date(start).getTime()-2*86400000),capacity,status:EventStatus.PUBLISHED,createdBy:committee.id},create:{id:`demo-${i+1}`,title,category,description,venue,startDate:new Date(start),endDate:new Date(end),registrationDeadline:new Date(new Date(start).getTime()-2*86400000),capacity,registrationFee:i===0?199:0,eligibility:'Open to eligible college students',status:EventStatus.PUBLISHED,createdBy:committee.id}});
 events.push(e); await prisma.eventCommittee.upsert({where:{eventId_userId:{eventId:e.id,userId:committee.id}},update:{},create:{eventId:e.id,userId:committee.id}});
}
for(let i=0;i<3;i++){
 const existing=await prisma.registration.findUnique({where:{eventId_participantId:{eventId:events[i].id,participantId:users.participant.id}}});
 if(!existing){ await prisma.registration.create({data:{registrationNumber:`EVT-DEMO-${1001+i}`,eventId:events[i].id,participantId:users.participant.id,status:RegistrationStatus.APPROVED,fullName:users.participant.name,email:users.participant.email,college:'CBIT',department:'Computer Engineering',year:3}}); }
}
await prisma.notification.deleteMany({where:{userId:users.participant.id}});
await prisma.notification.createMany({data:[{userId:users.participant.id,title:'Registration confirmed',message:'Your NEX-SYNAPSE 2026 registration is confirmed.',type:NotificationType.REGISTRATION},{userId:users.participant.id,title:'Event reminder',message:'Your next registered event is coming up.',type:NotificationType.REMINDER}]});
const run=await prisma.pipelineRun.upsert({where:{id:'demo-pipeline-1'},update:{},create:{id:'demo-pipeline-1',buildNumber:142,branch:'main',commitHash:'8f31c2a',status:PipelineStatus.SUCCESS,startedAt:new Date(Date.now()-28*60000),completedAt:new Date(Date.now()-2*60000)}});
const stages=['Checkout','Install Dependencies','Build','Unit Tests','Selenium Tests','Security Validation','Docker Build','Docker Test','Ansible Deployment'];
for(const [idx,name] of stages.entries()) await prisma.pipelineStage.upsert({where:{id:`demo-stage-${idx}`},update:{},create:{id:`demo-stage-${idx}`,pipelineRunId:run.id,name,status:PipelineStatus.SUCCESS,duration:idx===4?38:idx===8?52:15,startedAt:new Date(Date.now()-(idx+1)*60000),completedAt:new Date(Date.now()-idx*60000)}});
console.log('Seeded EventFlow demo data.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
