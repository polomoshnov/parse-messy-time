# parse-messy-time

parse messy human date and time strings

# example

```
var parse = require('parse-messy-time');
var q = process.argv.slice(2).join(' ');
console.log(parse(q));
```

output:

```
$ node parse.js last wednesday
{ date: 8, month: 'April' }
$ node parse.js oct 22nd 1987 3pm
{ date: 22, month: 'October', year: 1987, hours: 15 }
```
