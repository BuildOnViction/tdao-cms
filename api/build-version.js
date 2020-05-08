var fs = require('fs');
let json = JSON.stringify({version: new Date()});

function main() {
    fs.writeFile(__dirname + '/server/runtime/build_version.json', json, 'utf8', function (err, data) {
        console.log(err, data)
    });
}

main();
