import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Customer API (e2e)', () => {
  let app: INestApplication<App>;

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
    it('should return 401 for profile without auth', () => {
      return request(app.getHttpServer())
        .get('/customer/profile')
        .expect(401);
    });

    it('should return 401 for addresses without auth', () => {
      return request(app.getHttpServer())
        .get('/customer/addresses')
        .expect(401);
    });

    it('should return 401 for creating address without auth', () => {
      return request(app.getHttpServer())
        .post('/customer/addresses')
        .send({
          label: 'Home',
          type: 'home',
          streetAddress: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'US'
        })
        .expect(401);
    });

    it('should return 401 for searching products without auth', () => {
      return request(app.getHttpServer())
        .post('/customer/products/search')
        .send({ query: 'test' })
        .expect(401);
    });

    it('should return 401 for creating review without auth', () => {
      return request(app.getHttpServer())
        .post('/customer/reviews')
        .send({
          rating: 5,
          comment: 'Great product!',
          productId: 1
        })
        .expect(401);
    });

    it('should return 401 for getting orders without auth', () => {
      return request(app.getHttpServer())
        .get('/customer/orders')
        .expect(401);
    });

    it('should return 401 for getting notifications without auth', () => {
      return request(app.getHttpServer())
        .get('/customer/notifications')
        .expect(401);
    });
  });

  describe('Endpoint Structure Validation', () => {
    it('should have proper response structure for unauthorized access', () => {
      return request(app.getHttpServer())
        .get('/customer/profile')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
        });
    });
  });

  describe('Customer Endpoints Exist', () => {
    it('should have profile endpoint', () => {
      return request(app.getHttpServer())
        .get('/customer/profile')
        .expect(401); // Auth required, not 404
    });

    it('should have addresses endpoint', () => {
      return request(app.getHttpServer())
        .get('/customer/addresses')
        .expect(401); // Auth required, not 404
    });

    it('should have product search endpoint', () => {
      return request(app.getHttpServer())
        .post('/customer/products/search')
        .send({})
        .expect(401); // Auth required, not 404
    });

    it('should have reviews endpoint', () => {
      return request(app.getHttpServer())
        .get('/customer/reviews')
        .expect(401); // Auth required, not 404
    });

    it('should have orders endpoint', () => {
      return request(app.getHttpServer())
        .get('/customer/orders')
        .expect(401); // Auth required, not 404
    });

    it('should have notifications endpoint', () => {
      return request(app.getHttpServer())
        .get('/customer/notifications')
        .expect(401); // Auth required, not 404
    });
  });
});