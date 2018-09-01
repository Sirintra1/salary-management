'use strict';

describe('Masterlists E2E Tests:', function () {
  describe('Test Masterlists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/masterlists');
      expect(element.all(by.repeater('masterlist in masterlists')).count()).toEqual(0);
    });
  });
});
