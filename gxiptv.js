
var LIST_URL = "https://www.stbware.com/iptv/getchannels?username=iptvtest&password=88156088&chipid=0x0000000000000000&check=719561264";
var xml = require('showtime/xml');

(function(plugin) {

    var PLUGIN_PREFIX = "gxiptv:";
    var list;
    var service = plugin.createService("gxiptv", PLUGIN_PREFIX+"start", "video", true, plugin.path + "elephant.png");

    plugin.addURI(PLUGIN_PREFIX+"start", function(page) {
        page.type = "directory";
        var SearchQueryResponse = showtime.httpGet(LIST_URL);
        var doc = xml.parse(SearchQueryResponse.toString());
        var arry = [];
        var i = false;
        var j = 0;

        list = doc.list.filterNodes('item');
        for(var k = 0; k < list.length; k++)
        {
            print(list[k].key);
            print(list[k].type);
            for(var s in arry)
            {
                if(list[k].type == arry[s])
                {
                    i = true;
                    break;
                }
                i = false;
            }
            if(i == false && list[k].type != undefined)
            {
                arry[j] = list[k].type;
                j++;
            }
        }
        page.appendItem(PLUGIN_PREFIX + 'item:'+'all', 'directory',{title: "ALL" });
        for(var s in arry)
        {
            page.appendItem(PLUGIN_PREFIX + 'item:'+ arry[s], 'directory',{title: arry[s] });
        }
        page.loading = false;
    });

    plugin.addURI(PLUGIN_PREFIX+"item:(.*)", function(page, type) {
        for(var k = 0; k < list.length; k++)
        {
            if(type == 'all' || type == list[k].type)
            {
                page.appendItem(PLUGIN_PREFIX + 'channel:' + list[k].value, 'video',{title: list[k].key });
            }
        }   
    });

    plugin.addURI(PLUGIN_PREFIX+"channel:(.*)", function(page, url) {
        var videoParams = {
        sources: [{
                url: url,
          }],
        no_subtitle_scan: true,
        subtitles: []      
        }
        page.source = 'videoparams:' + JSON.stringify(videoParams);
    });

})(this);

