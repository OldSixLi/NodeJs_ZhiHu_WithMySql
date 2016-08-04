/**
 * 最新遍历某个收藏夹下所有答案
 * @李老六  (1030809514@qqcom)
 * @date    2016-07-11 21:25:13
 * @version 1.0.5
 */

//#region   模块引入 
var nodegrass = require( './node_modules/nodegrass');
var cheerio = require( './node_modules/cheerio');
var zhihu = require('./zhihu_getQuestrion_downloadImg_moudle.js'); //需要传入当前的参数：问题URL
var mysql = require('./mysql.js');

//#endregion

function collstart(collectionObj)
{
    var collid = "", //收藏夹的ID
    dianzanshu = 0,
    isDownloadImg = false,
    pages = 0;
    if (collectionObj.collid)
    {
        dianzanshu = collectionObj.dianzanshu;
        collid = collectionObj.collid;
        isDownloadImg = collectionObj.isDownloadImg;

    };
    //获取总页数
    nodegrass.get("https://www.zhihu.com/collection/" + collid, function (data, status, headers)
    {
        var $ = cheerio.load(data);
        //获取当前收藏夹下的总页数（页数列表中倒数第二个span中的内容）
        pages = parseInt($('.zm-invite-pager span').eq(-2).text());
        console.log('当前收藏夹的总页数' + pages);

        for (var pageIndex = 1; pageIndex <= pages; pageIndex++)
        {
            //闭包传入数据
            (function (pageindex)
            {
                nodegrass.get("https://www.zhihu.com/collection/" + collid + "?page=" + pageindex, function (data, status, headers)
                {
                    var $ = cheerio.load(data);
                    var arrUrl = [];

                    $(data).find('.zm-item-title a').each(function ()
                    {
                        var href = $(this).attr('href');
                        arrUrl.push("https://www.zhihu.com" + href);
                    });

                    console.log(arrUrl.join('索引：' + pageindex + '\r\n') + '索引：' + pageindex + '\r\n');

                    for (var urlindex = 0; urlindex < arrUrl.length; urlindex++)
                    {
                        (function (urlindex)
                        {
                            var url = arrUrl[urlindex];
                            var queobj = {
                                question_url: url,
                                dianzanshu: dianzanshu
                            };

                            if (isDownloadImg)
                            {
                                zhihu.start(queobj);
                            }
                            //进行图片下载
                        })(urlindex);
                    }
                });
            })(pageIndex);
        }

    });


}

exports.start = collstart;
