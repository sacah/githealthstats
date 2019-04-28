const chai = require('chai');
const recman = require('../libs/record-manip.js');
const expect = chai.expect;

describe('record-manip', function () {
  describe('processRecord when passing a single record with', function() {
    it('a timestamp from 2018, older than current, forYear not passed', function () {
      const records = {};
      const record = "--1540602695--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records);
      expect(records).to.eql({ });
    });

    it('a timestamp from today, forYear not passed', function () {
      const records = {};
      const record = "--" + ~~(new Date().getTime() / 1000) + "--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records);
      expect(records).to.eql({ 
        [new Date().getMonth()]: {
          fileList: {
            "lib/template-maker.js": {
              add: 3,
              remove: 3,
              total: 6,
              people: {
                tonybob: {
                  add: 3,
                  remove: 3,
                  total: 6
                }
              }
            }
          }
        }
      });
    });

    it('a timestamp from 2018, forYear passed as 2017', function () {
      const records = {};
      const record = "--1540602695--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records, 2017);
      expect(records).to.eql({ });
    });

    it('a timestamp from 2018, forYear passed as 2018', function () {
      const records = {};
      const record = "--1540602695--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records, 2018);
      expect(records).to.eql({ 
        9: {
          fileList: {
            "lib/template-maker.js": {
              add: 3,
              remove: 3,
              total: 6,
              people: {
                tonybob: {
                  add: 3,
                  remove: 3,
                  total: 6
                }
              }
            }
          }
        }
      });
    });

    it('no files', function () {
      const records = {};
      const record = "--1540602695--Tony Bob\n";
      recman.processRecord(record, records, 2018);
      expect(records).to.eql({ 
        9: {
          fileList: {}
        }
      });
    });

    it('multiple files', function () {
      const records = {};
      const record = "--1540509143--Tony Bob\n\n179\t0\text/lib/jquery.js\n36\t0\tlibs/bobs/dot.js\n1\t0\tgulpfile.js\n12\t3\tlib/legacy/jquery.js\n2\t0\tlib/utils/db.js";
      recman.processRecord(record, records, 2018);
      expect(records).to.eql({ 
        9: {
          fileList: {
            "ext/lib/jquery.js": {
              add: 179,
              remove: 0,
              total: 179,
              people: {
                tonybob: {
                  add: 179,
                  remove: 0,
                  total: 179
                }
              }
            },
            "libs/bobs/dot.js": {
              add: 36,
              remove: 0,
              total: 36,
              people: {
                tonybob: {
                  add: 36,
                  remove: 0,
                  total: 36
                }
              }
            },
            "gulpfile.js": {
              add: 1,
              remove: 0,
              total: 1,
              people: {
                tonybob: {
                  add: 1,
                  remove: 0,
                  total: 1
                }
              }
            },
            "lib/legacy/jquery.js": {
              add: 12,
              remove: 3,
              total: 15,
              people: {
                tonybob: {
                  add: 12,
                  remove: 3,
                  total: 15
                }
              }
            },
            "lib/utils/db.js": {
              add: 2,
              remove: 0,
              total: 2,
              people: {
                tonybob: {
                  add: 2,
                  remove: 0,
                  total: 2
                }
              }
            }
          }
        }
      });
    });
  });

  describe('processRecord when passing multiple records with', function() {
    it('2 authors on a single file', function () {
      const records = {};
      let record = "--" + ~~(new Date().getTime() / 1000) + "--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records);
      record = "--" + ~~(new Date().getTime() / 1000) + "--John Smith\n\n7\t1\tlib/template-maker.js";
      recman.processRecord(record, records);
      expect(records).to.eql({ 
        [new Date().getMonth()]: {
          fileList: {
            "lib/template-maker.js": {
              add: 10,
              remove: 4,
              total: 14,
              people: {
                tonybob: {
                  add: 3,
                  remove: 3,
                  total: 6
                },
                johnsmith: {
                  add: 7,
                  remove: 1,
                  total: 8
                }
              }
            }
          }
        }
      });
    });
  });

  describe('processRecord when passing multiple records with', function() {
    it('1 author and multiple commits on a single file', function () {
      const records = {};
      let record = "--" + ~~(new Date().getTime() / 1000) + "--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records);
      record = "--" + (~~(new Date().getTime() / 1000) + 60) + "--Tony Bob\n\n7\t0\tlib/template-maker.js";
      recman.processRecord(record, records);
      expect(records).to.eql({ 
        [new Date().getMonth()]: {
          fileList: {
            "lib/template-maker.js": {
              add: 10,
              remove: 3,
              total: 13,
              people: {
                tonybob: {
                  add: 10,
                  remove: 3,
                  total: 13
                }
              }
            }
          }
        }
      });
    });
  });

  describe('processRecord when passing multiple records with', function() {
    it('2 authors and multiple commits on a single file', function () {
      const records = {};
      let record = "--" + ~~(new Date().getTime() / 1000) + "--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records);
      record = "--" + ~~(new Date().getTime() / 1000) + "--John Smith\n\n7\t1\tlib/template-maker.js";
      recman.processRecord(record, records);
      record = "--" + ~~(new Date().getTime() / 1000) + "--Tony Bob\n\n3\t3\tlib/template-maker.js";
      recman.processRecord(record, records);
      record = "--" + ~~(new Date().getTime() / 1000) + "--John Smith\n\n7\t1\tlib/template-maker.js";
      recman.processRecord(record, records);
      expect(records).to.eql({ 
        [new Date().getMonth()]: {
          fileList: {
            "lib/template-maker.js": {
              add: 20,
              remove: 8,
              total: 28,
              people: {
                tonybob: {
                  add: 6,
                  remove: 6,
                  total: 12
                },
                johnsmith: {
                  add: 14,
                  remove: 2,
                  total: 16
                }
              }
            }
          }
        }
      });
    });
  });
});