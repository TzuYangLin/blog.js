var fs = require("fs");
var marked = require('marked');
var hl = require("highlight").Highlight;
var fun = require('./funclib');
var settings = require('./settings');


function route(req, res) 
{
    var array_info = new Array();
    var array_category = new Array();
    var post_count=0;

    //fs.readdirSync(markdown_dir).forEach(function (file) { #can't break 
    fs.readdirSync(settings.markdown_dir).some(function (file) {
        //console.log(file);
        var file_struct = file.split('.');
        if (file_struct[3] == "md")
        {
            var title = file_struct[2];
            var content = hl(marked(fs.readFileSync(settings.markdown_dir+file, "utf8").substring(0,200)), false, true);
            var file_stats = fs.statSync(settings.markdown_dir+file);
            //console.log(file_stats.ctime);
            var info = { "title": title , "content": content, "file": file,  "created": file_stats.ctime };
            array_info.push(info);
            if ((++post_count) >= settings.max_show_post) return false;
        }
    });

    array_info.sort()

    var category_count;
    for (offset=0; offset<settings.category.length; offset++)
    {
        category_count = fun.get_category_count(settings.category[offset]);
        //console.log(category[offset]+"="+category_count);
        var info_category = { "name": settings.category[offset], "count": category_count};
        array_category.push(info_category);
    }

    res.render('index', { "post_info": array_info, "post": 0, "categories": array_category });
}

function post(req, res) 
{
    var array_info = new Array();
    var array_category = new Array();
    var post_count=0;

    var file = req.param('id');
    //console.log(file);

    var file_struct = file.split('.');
    if (file_struct[3] == "md")
    {
        var title = file_struct[2];
        var content = hl(marked(fs.readFileSync(settings.markdown_dir+file, "utf8")), false, true);
        var file_stats = fs.statSync(settings.markdown_dir+file);
        //console.log(file_stats.ctime);
        var info = { "title": title , "content": content, "file": file,  "created": file_stats.ctime };
        array_info.push(info);
    }

    var category_count;
    for (offset=0; offset<settings.category.length; offset++)
    {
        category_count = fun.get_category_count(settings.category[offset]);
        //console.log(category[offset]+"="+category_count);
        var info_category = { "name": settings.category[offset], "count": category_count};
        array_category.push(info_category);
    }

    res.render('index', { "post_info": info, "post": 1, "categories": array_category });
}

function list(req, res) 
{
    var array_info = new Array();
    var array_category = new Array();
    var post_count=0;

    var category = req.param('category');

    //fs.readdirSync(markdown_dir).forEach(function (file) { #can't break 
    fs.readdirSync(settings.markdown_dir).some(function (file) {
        var file_struct = file.split('.');
        console.log(category+","+file_struct[0]);
        if (file_struct[1] != category) return false;

        if (file_struct[3] == "md")
        {
            var title = file_struct[2];
            var content = hl(marked(fs.readFileSync(settings.markdown_dir+file, "utf8").substring(0,200)), false, true);
            var file_stats = fs.statSync(settings.markdown_dir+file);
            //console.log(file_stats.ctime);
            var info = { "title": title , "content": content, "file": file,  "created": file_stats.ctime };
            array_info.push(info);
            if ((++post_count) >= settings.max_show_post) return false;
        }
    });

    var category_count;
    for (offset=0; offset<settings.category.length; offset++)
    {
        category_count = fun.get_category_count(settings.category[offset]);
        //console.log(category[offset]+"="+category_count);
        var info_category = { "name": settings.category[offset], "count": category_count};
        array_category.push(info_category);
    }

    res.render('index', { "post_info": array_info, "post": 0, "categories": array_category });
}

exports.route = route;
exports.post = post;
exports.list = list;