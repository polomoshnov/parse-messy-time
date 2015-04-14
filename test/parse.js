var parse = require('../');
var months = require('months');
var test = require('tape');

test('whatever', function (t) {
    var tomorrow = new Date((new Date).valueOf() + 24*60*60*1000);
    
    t.deepEqual(parse('11am'), {
        hours: 11
    });
    t.deepEqual(parse('11pm'), {
        hours: 23
    });
    t.deepEqual(parse('tomorrow at 7'), {
        hours: 7,
        date: tomorrow.getDate(),
        month: months[tomorrow.getMonth()]
    });
    t.deepEqual(parse('aug 25 2015 5pm'), {
        hours: 17,
        date: 25,
        month: 'August',
        year: 2015
    });
    t.end();
});
