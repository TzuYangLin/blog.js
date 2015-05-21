var fs = require("fs");
var settings = require('./settings');


function get_category_count(category_name)
{
    var count=0;

    fs.readdirSync(settings.markdown_dir).forEach(function (file) {
        var file_struct = file.split('.');
        if (file_struct[1] == category_name)
            count+=1;
    });

    return count;
}

function sortFn(a, b) {
    if (a < b) return 1;
    if (a > b) return -1;
    if (a == b) return 0;
}

exports.get_category_count = get_category_count;
exports.sortFn = sortFn;