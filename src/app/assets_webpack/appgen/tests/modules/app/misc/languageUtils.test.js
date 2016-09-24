import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import { Set, fromJS } from 'immutable'
import { extractLanguages } from '../../../../javascripts/modules/app/misc/languageUtils'

chai.use(chaiImmutable);

describe('extractLanguages', () => {
  const label1 = {
    variants: {
      en: 'Hello',
      cs: 'Ahoj'
    }
  };

  const label2 = {
    variants: {
      en: 'Hello',
      de: 'Hallo'
    }
  };

  const label3 = {
    variants: {
      xyz: 'Hello',
      fr: '???'
    }
  };

  it('should extract nothing from undefined', () => {
    expect(extractLanguages(undefined)).to.equal(new Set());
  });

  it('should extract nothing from null', () => {
    expect(extractLanguages(undefined)).to.equal(new Set());
  });

  it('should extract something from Immutable localized value', () => {
    const value = fromJS(label1);
    expect(extractLanguages(value)).to.equal(new Set(['en', 'cs']));
  });

  it('should extract something from nested Immutable map', () => {
    const value = fromJS({ label: label1 });
    expect(extractLanguages(value)).to.equal(new Set(['en', 'cs']));
  });

  it('should extract something from Immutable collection of localized values', () => {
    const value = fromJS([label1]);
    expect(extractLanguages(value)).to.equal(new Set(['en', 'cs']));
  });

  it('should extract something from localized value object', () => {
    const value = label1;
    expect(extractLanguages(value)).to.equal(new Set(['en', 'cs']));
  });

  it('should extract something from nested object', () => {
    const value = { label: label1 };
    expect(extractLanguages(value)).to.equal(new Set(['en', 'cs']));
  });

  it('should extract something from array of localized values', () => {
    const value = [ label1 ];
    expect(extractLanguages(value)).to.equal(new Set(['en', 'cs']));
  });

  it('should extract nothing from integer', () => {
    expect(extractLanguages(2)).to.equal(new Set());
  });

  it('should merge languages from multiple sources', () => {
    const value = { greetings: [ label1, label2 ] };
    expect(extractLanguages(value)).to.equal(new Set(['de', 'en', 'cs']));
  });

  it('should ignore invalid language codes', () => {
    const value = label3;
    expect(extractLanguages(value)).to.equal(new Set(['fr']));
  });

  it('should deal with deeply nested structures', () => {
    const value = {
      greetings: [ label1 ],
      another: {
        greeting1: label2,
        greeting2: [ [ label3 ]]
      }
    };
    expect(extractLanguages(value)).to.equal(new Set(['de', 'en', 'cs', 'fr']));
  });
});
