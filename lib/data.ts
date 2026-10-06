import type { PipelineStage } from '@/types';
export const pipeline: PipelineStage[] = [
  { name: 'Checkout', tool: 'Git / GitHub', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Install Dependencies', tool: 'Jenkins', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Build', tool: 'Next.js / Jenkins', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Unit Tests', tool: 'Node Test Runner', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Selenium Tests', tool: 'Selenium', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Security Validation', tool: 'npm audit', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Docker Build', tool: 'Docker', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Docker Test', tool: 'Docker', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
  { name: 'Deployment', tool: 'Ansible', status: 'pending', description: 'Awaiting the next Jenkins pipeline execution.' },
];
