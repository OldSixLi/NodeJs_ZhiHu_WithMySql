/**
 * 抓取
 * @authors Your Name (you@example.org)
 * @date    2016-08-11 17:12:27
 * @version $Id$
 */

var getmoudle_path = 'C:/Program Files (x86)/nodejs/node_modules/';
var nodegrass = require('./node_modules/nodegrass');
var cheerio = require('./node_modules/cheerio');
var https = require("https");
var http = require("http");
var fs = require("fs");
// var request = require('./node_modules/request');
var path = require('path');
//变量声明
var dianzanshu = 100;
var errorMessage = ""; //错误信息
var indexnum = 0; //记录
var downloadindexnum = 0; //下载图片数量
var lianxucount = 0; //连续没数据
var enableDownloadImgUrl = [];



var posturl = 'http://www.lofter.com/dwr/call/plaincall/UserBean.getUserFollowingList.dwr?callCount=1&scriptSessionId=${scriptSessionId}187&httpSessionId=&c0-scriptName=UserBean&c0-methodName=getUserFollowingList&c0-id=0&c0-param0=number:10000&c0-param1=number:0&c0-param2=boolean:false&batchId=940823';
var REQ_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Connection': 'keep-alive',
    'Cookie': '_ga=GA1.2.1150119812.1450240615;_ntes_nnid=72b4b033283b00580ab8580eb965f6cf,1450240616046; __utma=61349937.1150119812.1450240615.1453344034.1470906480.20; NTES_PASSPORT=YsfTVagwCaNmxFdAGo21BFVtDjO5eX1DfpPIKat60PtU115EvthXg7DUsWaHTW_xMG_WGMVp52__dIwA0BsVqv.uPzRnQuGUO; noAdvancedBrowser=0; usertrack=ZUcIileoFZerS5VWA0oaAg==; NTESLOFTSI=CCA10C97DEDB7F5C1DDFAA60559C7F0E.classa-lofter8-8010; firstentry=%2Ffollowing.do%3FX-From-ISP%3D2|; referrer4statistic=; JSESSIONID-WLF-XXD=dddf82a6d4f77fedffdb7f0a556af45fb66b679d6599556172d137aed77484d20bd6f799a05de26bca24e4d5bff5fbe9a9e020f523c45ec7591c0a3887a9348459d1d2d38b3beeb5caedf851125f48ad48d157c6871b9014540dac356cc943f3b7c93b1cc0774f2dd0d8c4bdc4d02353d39811f9760694decd713579a3d17d43686b6026; regtoken=1000; _gat=1; fastestuploadproxydomainkey=uploadgz|1470906473277; __utmb=61349937.5.9.1470906508747; __utmc=61349937; __utmz=61349937.1470906480.20.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); NTES_SESS=7GQuaA7KaIhNysjMZ48szlVtn5.3M9zGxa0HU_843xlkeeybCSNsTdWfUg9GJgt4nDtgDnaqyjttB2fDNG3LK8sC_7RWhZprgSvPoPZILueDrh8FhgpUGfUuKwbkpEFnmKH_BD.kbqMcjVZoyHPSdw3oJlG8HOLiFumSs8b6LXIJN; S_INFO=1470906710|0|##|1030809514@qq.com;P_INFO=1030809514@qq.com|1470906710|1|lofter|00&99|tij&1470906253&lofter#UK&null#10#0#0|&0|yanxuan_web&lofter|1030809514@qq.com',
    'Host': 'www.lofter.com',
    'Referer': 'http://www.lofter.com/inviteelist',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'
};


// nodegrass.post(posturl, function (data, status, headers){
//     console.log(data,'utf8');
//     fs.appendFile('./lofter.txt',data);
// },REQ_HEADERS);
// 
nodegrass.get('http://jkxuan07.lofter.com/view', function(data, status, headers) {
    console.log(data);
    var $ = cheerio.load(data);
    var pagetitle=$('title').text(); 
    console.log(pagetitle);
    fs.appendFile('getlist.txt',data);
  
});

// 开始下载图片

// nodegrass.get('http://jkxuan07.lofter.com/post/4a01b_b26606d', function(data, status, headers) {
//     var $ = cheerio.load(data);
//     var pagetitle=$('title').text();
//     $('.ctc.box').find('.pic').find('a').each(function(imgindex) {
//         //开始执行任务 
//         var url = $(this).attr('bigimgsrc'); //获取答案中的图片地址
//         var imgName = path.basename(url);
//         var imgname= imgindex+'.'+url.substr(url.indexOf('type=')+5) ;  
//         //开始下载图片
//         startDownloadTask(url,'./images/' + imgindex+'.jpg', pagetitle);
//     })
  
// });


function getHttpReqCallback(imgSrc, dirName, anstitle) {
    var callback = function(res) {
        var fileBuff = [];
        res.on('data', function(chunk) {
            var buffer = new Buffer(chunk);
            fileBuff.push(buffer);
        });
        res.on('end', function() {
            var totalBuff = Buffer.concat(fileBuff);
            fs.appendFile(dirName, totalBuff, function(err) {
                if (err) {
                    console.log('路径：' + imgSrc + '获取答案出错' + err);
                } else {
                    downloadindexnum += 1;
                    console.log(downloadindexnum + anstitle + '：' + '[download success ！]\(^o^)/\(^o^)/');
                }
            });
        });
    };
    return callback;
}
var startDownloadTask = function(imgSrc, dirName, anstitle) {
    if (imgSrc.indexOf('http') !== -1) { //判断是否包含完整的地址路径
        var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, anstitle));
        req.on('error', function(e) {});
        req.setTimeout(60 * 1000, function() {
            console.log("请求 " + imgSrc + " 超时, 结束当前请求！/(ㄒoㄒ)/~~");
            fs.appendFile(dirName.substr(0, dirName.lastIndexOf('/')) + '/ErrorLog.txt', '请求超时：' + imgSrc + '\r\n');
            req.abort();
        })
        req.end();
    };
}
//获取当天日期
    function getNowFormatDate(dates) {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate;
        if (dates !== 'date') {
            //返回具体时间
            currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        } else { //只返回日期
            currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        }
        return currentdate;
    }