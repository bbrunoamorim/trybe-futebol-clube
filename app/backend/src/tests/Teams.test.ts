import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import { Model } from 'sequelize';
import { teamsMock, teamMock } from './mocks/Teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('01 - Tests for /teams route', () => {
  const app = new App();

  afterEach(() => {
    sinon.restore();
  });

  describe('-> Requesting all teams', () => {
    it('Returns the correct status with success request', async () => {
      sinon.stub(Model, 'findAll').resolves(teamsMock);

      const response = await chai.request(app.app).get('/teams');

      expect(response.status).to.be.equal(200);
    });

    it('Returns the correct JSON with success request', async () => {
      sinon.stub(Model, 'findAll').resolves(teamsMock);

      const response = await chai.request(app.app).get('/teams');

      expect(response.body).to.be.deep.equal(teamsMock);
    });
  });

  describe('-> Requesting an especific team by its id', () => {
    it('Returns the correct status with success request', async () => {
      sinon.stub(Model, 'findOne').resolves(teamMock);

      const response = await chai.request(app.app).get('/teams/5');

      expect(response.status).to.be.equal(200);
    });

    it('Returns the correct JSON with success request', async () => {
      sinon.stub(Model, 'findOne').resolves(teamMock);

      const response = await chai.request(app.app).get('/teams/5');

      expect(response.body).to.be.deep.equal(teamMock);
    });
  });
});
