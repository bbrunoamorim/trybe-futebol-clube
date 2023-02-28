import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import { Model } from 'sequelize';
import User from '../database/models/UserModel';
import {
  loginMock,
  noEmailLoginMock,
  noPassLoginMock,
  failLoginMessageMock
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

  it('-> Returns the correct JSON with success request', async () => {
    const hash = await bcrypt.hash(loginMock.password, 10);
    sinon.stub(Model, 'findOne').resolves({ token: hash } as unknown as User);

    const response = await chai.request(app.app).post('/login').send(loginMock);

    expect(response.body).to.be.deep.equal({ token: hash });
  });

  it('-> Returns the correct status and message for login with missing email', async () => {
    sinon.stub(Model, 'findOne').resolves(undefined);

    const response = await chai.request(app.app).post('/login').send(noEmailLoginMock);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal(failLoginMessageMock);
  });

  it('-> Returns the correct status and message for login with missing password', async () => {
    sinon.stub(Model, 'findOne').resolves(undefined);

    const response = await chai.request(app.app).post('/login').send(noPassLoginMock);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal(failLoginMessageMock);
  });
});
