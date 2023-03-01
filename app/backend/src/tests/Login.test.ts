import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import {
  loginMock,
  noEmailLoginMock,
  noPassLoginMock,
  failLoginMessageMock,
} from './mocks/Login.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('02 - Tests for /login route', () => {
  const app = new App();

  afterEach(() => {
    sinon.restore();
  });

  it('-> Returns the correct status with success request', async () => {
    const response = await chai.request(app.app).post('/login').send(loginMock);

    expect(response.status).to.be.equal(200);
  });

  it('-> Returns the correct status and message with incomplete login(missing email)', async () => {
    const response = await chai.request(app.app).post('/login').send(noEmailLoginMock);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal(failLoginMessageMock);
  });

  it('-> Returns the correct status and message with incomplete login(missing password)', async () => {
    const response = await chai.request(app.app).post('/login').send(noPassLoginMock);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal(failLoginMessageMock);
  });
});
