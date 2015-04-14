var months = require('months');
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
            res.day = Number(m[1]);
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
            else if (res.day === undefined) res.day = x;
            if (res.month === undefined) res.month = next;
        }
        else if (monthish(t) && /^\d+/.test(next)) {
            var x = Number(next);
            if (res.year === undefined && x > 31) res.year = x;
            else if (res.day === undefined) res.day = x;
            if (res.month === undefined) res.month = t;
        }
        else if ((m = /^(\d+)/.exec(t)) && monthish(prev)) {
            var x = Number(m[1]);
            if (res.year === undefined) res.year = x;
            else if (res.hour === undefined) res.hour = x;
        }
        else if (m = /^[`'\u00b4\u2019](\d+)/.exec(t)) {
            res.year = Number(m[1]);
        }
        else if (m = /^(\d+)/.exec(t)) {
            var x = Number(m[1]);
            if (res.hour === undefined && x < 24) res.hour = x;
            else if (res.day === undefined && x <= 31) res.day = x;
            else if (res.year === undefined && x > 31) res.year = x;
            else if (res.year == undefined
            && res.hour !== undefined && res.day !== undefined) {
                res.year = x;
            }
            else if (res.hour === undefined
            && res.day !== undefined && res.year !== undefined) {
                res.hour = x;
            }
            else if (res.day === undefined
            && res.hour !== undefined && res.year !== undefined) {
                res.day = x;
            }
        }
        else if (/^to?m+o?r+o?w?/.test(t) && res.day === undefined) {
            var tomorrow = new Date(now.valueOf() + 24*60*60*1000);
            res.day = tomorrow.getDate();
            if (res.month === undefined) {
                res.month = months[tomorrow.getMonth()];
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
    return res;
};

function lc (s) { return String(s).toLowerCase() }

function monthish (s) {
    return /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(s);
}
