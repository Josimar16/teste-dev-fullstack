import request from 'supertest';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Authenticate User Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin_test', 8);
    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at)
      VALUES('${id}', 'admin', 'admin@certimoveis.com.br', '${password}', 'now()') 
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@certimoveis.com.br',
        password: 'admin_test'
      })

    expect(response.status).toBe(200);
  });

  it('should not be able to authenticate an nonexistent user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@com.br',
        password: 'admin_test'
      })

    expect(response.status).toBe(400);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@certimoveis.com.br',
        password: 'admin_test1'
      })

    expect(response.status).toBe(400);
  });
});