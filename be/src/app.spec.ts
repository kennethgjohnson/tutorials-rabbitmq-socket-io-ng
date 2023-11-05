import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import { makeTestFileName } from './test/util';
import { app, waitTillReady } from './app';
import { StatusCodes } from 'http-status-codes';


describe(makeTestFileName(__filename),
  () => {
    before(async function () {
      await waitTillReady();
    });

    it('can accept requests /', async function () {
      const res = await request(app)
        .get('/').send();
      expect(res.status).to.equal(StatusCodes.OK);
    });
  }
);
