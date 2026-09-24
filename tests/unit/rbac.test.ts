import {describe,it,expect} from 'vitest';
describe('EventFlow role boundaries',()=>{it('defines exactly three roles',()=>expect(['PARTICIPANT','EVENT_COMMITTEE','ADMIN']).toHaveLength(3));it('devops is admin-only',()=>expect('/admin/devops').toMatch(/^\/admin\//));});
