var parse = require('../');
var months = require('months');
var test = require('tape');
var strftime = require('strftime');

test('parse dates', function (t) {
    var tomorrow = new Date((new Date).valueOf() + 24*60*60*1000);
    
    // Tue Apr 14 2015 09:46:01 GMT-0700 (PDT)
    var optsd = { now: new Date(1429029961000) };
    
    t.deepEqual(strftime('%T', parse('11am')), '11:00:00');
    t.deepEqual(strftime('%T', parse('11pm')), '23:00:00');
    t.deepEqual(strftime('%T', parse('12:30pm')), '12:30:00');
    t.deepEqual(
        strftime('%F %T', parse('tomorrow at 7')),
        strftime('%F 07:00:00', tomorrow)
    );
    t.deepEqual(
        strftime('%F %T', parse('aug 25 2015 5pm')),
        '2015-08-25 17:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('this friday', {
            now: new Date(1429029961000)
        })),
        '2015-04-17 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('friday', {
            now: new Date(1429029961000)
        })),
        '2015-04-17 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('this friday', {
            now: new Date(1429721563259)
        })),
        '2015-04-24 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('monday', {
            now: new Date(1429032952407)
        })),
        '2015-04-20 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('next friday', {
            now: new Date(1429721563259)
        })),
        '2015-05-01 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('next monday', {
            now: new Date(1429033187172)
        })),
        '2015-04-27 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('last monday', {
            now: new Date(1429033187172)
        })),
        '2015-04-13 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('last tuesday', {
            now: new Date(1429033187172)
        })),
        '2015-04-07 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('oct 22nd 1987')),
        '1987-10-22 00:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('3pm oct 22nd 1987')),
        '1987-10-22 15:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('oct 22nd 1987 6am')),
        '1987-10-22 06:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('the 22nd of october, 1987 at 7pm')),
        '1987-10-22 19:00:00'
    );
    t.deepEqual(
        strftime('%F', parse('4th of july', optsd)),
        '2015-07-04'
    );
    t.deepEqual(
        strftime('%F %T', parse('9pm on the 4th of july', optsd)),
        '2015-07-04 21:00:00'
    );
    t.deepEqual(
        strftime('%F %T', parse('in 12 minutes', optsd)),
        '2015-04-14 09:58:01',
        'in 12 minutes'
    );
    t.deepEqual(
        strftime('%F %T', parse('in 2 hours', optsd)),
        '2015-04-14 11:46:01',
        'in 2 hours'
    );
    t.deepEqual(
        strftime('%F %T', parse('in 31 hours', optsd)),
        '2015-04-15 16:46:01',
        'in 31 hours'
    );
    t.deepEqual(
        strftime('%F %T', parse('in 20 hours 40 minutes', optsd)),
        '2015-04-15 06:26:01',
        'in 20 hours 40 minutes'
    );
    t.deepEqual(
        strftime('%F %T', parse('in 20 hours and 40 minutes', optsd)),
        '2015-04-15 06:26:01',
        'in 20 hours and 40 minutes'
    );
    t.deepEqual(
        strftime('%F %T', parse('in 20.2h', optsd)),
        '2015-04-15 05:58:01',
        'in 20.2h'
    );
    t.end();
});
