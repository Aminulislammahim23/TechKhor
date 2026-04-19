import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Seller API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Required Endpoints', () => {
    it('should return 401 for products without auth', () => {
      return request(app.getHttpServer())
        .get('/seller/products')
        .expect(401);
    });

    it('should return 401 for creating product without auth', () => {
      return request(app.getHttpServer())
        .post('/seller/products')
        .send({
          name: 'Test Product',
          price: 99.99,
          stock: 10
        })
        .expect(401);
    });

    it('should return 401 for earnings without auth', () => {
      return request(app.getHttpServer())
        .get('/seller/earnings')
        .expect(401);
    });

    it('should return 401 for sales report without auth', () => {
      return request(app.getHttpServer())
        .get('/seller/reports/sales')
        .expect(401);
    });

    it('should return 401 for inventory alerts without auth', () => {
      return request(app.getHttpServer())
        .get('/seller/inventory/alerts')
        .expect(401);
    });

    it('should return 401 for messages without auth', () => {
      return request(app.getHttpServer())
        .get('/seller/messages')
        .expect(401);
    });

    it('should return 401 for product questions without auth', () => {
      return request(app.getHttpServer())
        .get('/seller/questions')
        .expect(401);
    });

    it('should return 401 for withdrawal requests without auth', () => {
      return request(app.getHttpServer())
        .post('/seller/withdrawals')
        .send({ amount: 100 })
        .expect(401);
    });
  });

  describe('Endpoint Structure Validation', () => {
    it('should have proper response structure for unauthorized access', () => {
      return request(app.getHttpServer())
        .get('/seller/products')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
        });
    });
  });
});