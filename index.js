var months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];
var days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

var tokre = RegExp(
    '\\s+|(\\d+(?:th|nd|rd|th))'
    + '|(\\d+(?:[:h]\\d+(?:[:m]\\d+s?)?)?)([A-Za-z]+)'
    + '|([A-Za-z]+)(\\d+(?:[:h]\\d+(?:[:m]\\d+s?)?)?)'
);

module.exports = function (str, opts) {
    if (!opts) opts = {};
    var now = opts.now || new Date;
    var tokens = str.split(tokre).filter(Boolean).map(lc);
    var res = {};
    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        var next = tokens[i+1];
        var prev = tokens[i-1];
        var m;
        
        if (m = /(\d+)(st|nd|rd|th)/i.exec(t)) {
            if (next === 'of') {
                next = tokens[i+2];
                i++;
            }
            res.date = Number(m[1]);
            if (monthish(next)) {
                res.month = next;
            }
        }
        else if (/\d+[:h]\d+/.test(t) || /^(am|pm)/.test(next)) {
            m = /(\d+)(?:[:h](\d+)(?:[:m](\d+s?\.?\d*))?)?/.exec(t);
            res.hours = Number(m[1]);
            if (/^pm/.test(next)) res.hours += 12;
            if (m[2]) res.minutes = Number(m[2]);
            if (m[3]) res.seconds = Number(m[3]);
            // time
        }
        else if (/^\d+/.test(t) && monthish(next)) {
            var x = Number(t);
            if (res.year === undefined && x > 31) res.year = x;
            else if (res.date === undefined) res.date = x;
            if (res.month === undefined) res.month = next;
            i++;
        }
        else if (monthish(t) && /^\d+/.test(next)) {
            var x = Number(next);
            if (res.year === undefined && x > 31) res.year = x;
            else if (res.date === undefined) res.date = x;
            if (res.month === undefined) res.month = t;
            i++;
        }
        else if ((m = /^(\d+)/.exec(t)) && monthish(prev)) {
            var x = Number(m[1]);
            if (res.year === undefined) res.year = x;
            else if (res.hours === undefined) res.hours = x;
        }
        else if (m = /^[`'\u00b4\u2019](\d+)/.exec(t)) {
            res.year = Number(m[1]);
        }
        else if (m = /^(\d+)/.exec(t)) {
            var x = Number(m[1]);
            if (res.hours === undefined && x < 24) res.hours = x;
            else if (res.date === undefined && x <= 31) res.date = x;
            else if (res.year === undefined && x > 31) res.year = x;
            else if (res.year == undefined
            && res.hours !== undefined && res.date !== undefined) {
                res.year = x;
            }
            else if (res.hours === undefined
            && res.date !== undefined && res.year !== undefined) {
                res.hours = x;
            }
            else if (res.date === undefined
            && res.hours !== undefined && res.year !== undefined) {
                res.date = x;
            }
        }
        else if (/^to?m+o?r+o?w?/.test(t) && res.date === undefined) {
            var tomorrow = new Date(now.valueOf() + 24*60*60*1000);
            res.date = tomorrow.getDate();
            if (res.month === undefined) {
                res.month = months[tomorrow.getMonth()];
            }
        }
        else if (t === 'this' && dayish(next)) {
        }
        else if (t === 'next' && dayish(next)) {
        }
        else if (t === 'last' && dayish(next)) {
        }
        else if (dayish(t) && res.date === undefined
        && res.month === undefined) {
            var dayi = days.indexOf(nday(t));
            var xdays = (7 + dayi - now.getDay()) % 7;
            var d = new Date(now.valueOf() + xdays*24*60*60*1000);
            res.date = d.getDate();
            if (res.month === undefined) {
                res.month = months[d.getMonth()];
            }
        }
    }
    
    if (res.year < 100) {
        var y = now.getFullYear();
        var py = y % 100;
        if (py + 10 < res.year) {
            res.year += y - py - 100;
        }
        else res.year += y - py;
    }
    if (res.month) res.month = nmonth(res.month);
    return res;
};

function lc (s) { return String(s).toLowerCase() }

function monthish (s) {
    return /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(s);
}

function dayish (s) {
    return /^(mon|tue|wed|thu|fri|sat|sun)/i.test(s);
}

function nmonth (s) {
    if (/^jan/i.test(s)) return 'January';
    if (/^feb/i.test(s)) return 'February';
    if (/^mar/i.test(s)) return 'March';
    if (/^apr/i.test(s)) return 'April';
    if (/^may/i.test(s)) return 'May';
    if (/^jun/i.test(s)) return 'June';
    if (/^jul/i.test(s)) return 'July';
    if (/^aug/i.test(s)) return 'August';
    if (/^sep/i.test(s)) return 'September';
    if (/^oct/i.test(s)) return 'October';
    if (/^nov/i.test(s)) return 'November';
    if (/^dec/i.test(s)) return 'December';
}

function nday (s) {
    if (/^mon/i.test(s)) return 'Monday';
    if (/^tue/i.test(s)) return 'Tuesday';
    if (/^wed/i.test(s)) return 'Wednesday';
    if (/^thu/i.test(s)) return 'Thursday';
    if (/^fri/i.test(s)) return 'Friday';
    if (/^sat/i.test(s)) return 'Saturday';
    if (/^sun/i.test(s)) return 'Sunday';
}
