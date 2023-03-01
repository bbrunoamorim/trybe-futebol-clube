import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';

import { Model } from 'sequelize';

import allMatchesMock from './mocks/Matches.mock';
import IMatch from '../api/interfaces/IMatch';

chai.use(chaiHttp);

const { expect } = chai;

describe('03 - Tests for /matches route', () => {
  const app = new App();

  afterEach(() => {
    sinon.restore();
  });

  it('-> Returns the correct status and JSON while requesting all matches', async () => {
    // sinon.stub(Model, 'findAll').resolves(allMatchesMock);

    // const response = await chai.request(app.app).get('/matches');
  });
});
