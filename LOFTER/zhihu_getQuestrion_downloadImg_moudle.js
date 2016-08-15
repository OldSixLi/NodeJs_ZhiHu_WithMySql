/**
 * 获取知乎某个问题下的所有答案
 * @authors Your Name (1030809514@qq.com)
 * @date    2016-07-05 10:38:20
 * @version $Id$
 */
//#region   模块引入与变量声明
var getmoudle_path = 'C:/Program Files (x86)/nodejs/node_modules/';
var nodegrass = require('./node_modules/nodegrass');
var cheerio = require('./node_modules/cheerio');
var https = require("https");
var fs = require("fs");
// var request = require('./node_modules/request');
var path = require('path');
//变量声明
var dianzanshu = 100;
var errorMessage = ""; //错误信息
var indexnum = 0; //记录
var downloadindexnum = 0; //下载图片数量
var lianxucount = 0; //连续没数据
var enableDownloadImgUrl = []; //请求超时的数据

//#endregion
//#region创建当天的文件夹
var date_file = './images/' + getNowFormatDate('date');
if (!fs.existsSync(date_file)) {
    fs.mkdirSync(date_file, 0777); //创建目录
    console.log(date_file + '文件夹已成功创建！');
}
//#endregion
// DaAnCount('https://www.zhihu.com/question/34243513');
//#region 获取点赞数
function start(queObj) {
    var filePath = "";
    var questionUrls; //当前问题的链接
    var questionId; //获取问题的ID
    if (queObj.question_url) {
        questionUrls = queObj.question_url;
        dianzanshu = queObj.dianzanshu;
        questionId = questionUrls.substr(questionUrls.lastIndexOf('/') + 1);
    } else {
        return;
    }
    nodegrass.get(questionUrls, function(data, status, headers) {
        var $ = cheerio.load(data);
        var anstitle = $(data).find('title').text().trim().replace(/[^\u4e00-\u9fa5]/gi, ""); //只获取中文字符
                //#region   创建关于问题的文件夹
        filePath = date_file + '/' + questionId + '—' + anstitle.substr(0, anstitle.length - 2) + '？';
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, 0777); //创建目录
            console.log(filePath + '文件夹已成功创建！');
        }
        //#endregion
        //返回答案数
        var answer = $(data).find('#zh-question-answer-num').text();
        var ans = (answer.substr(0, answer.length - 4));
        //记录答案总数
        errorMessage = '**********************总记录：' + ans + '条\r\n';
        fs.appendFile(filePath + '/ErrorLog.txt', errorMessage); //记录测试
        //操作循环
        // if (ans>200) {ans=200};
        CircleGetAnswer(ans, filePath, questionId, anstitle);
    });
}
//#endregion
//#region 循环获取答案
function CircleGetAnswer(answercount, filePath, questionId, anstitle) {
    //因为NodeJs是异步执行的，所以另起函数的话会导致获取不到ans，因为此时异步请求还没有相应
    //所以当前函数必须在上一个函数中被调用
    for (var jsonindex = 0; jsonindex < parseInt(answercount) / 10 + 1; jsonindex++) {
        (function(jsonindex) {
            getAnswer(jsonindex, filePath, questionId, anstitle);
        })(jsonindex);
    };
}
//#endregion
//#region 具体的事物操作
function getAnswer(index, filePath, questionId, anstitle) {
    var posturl = 'https://www.zhihu.com/node/QuestionAnswerListV2' + '?method=next&params={"url_token":' + questionId + ',"pagesize":10,"offset":' + index * 10 + '}';
    //#region 进行JSON数据请求
    try {


        nodegrass.post(posturl, function(data, status, headers) {
            console.log('第' + index + '页：');
            //#region 测试数据是否可以转化为JSON
            try {
                var obj = JSON.parse(data);
            } catch (e) {
                errorMessage = '当前索引：' + index + '，转化JSON错误信息:' + e.message + '\r\n';
                fs.appendFile(filePath + '/ErrorLog.txt', errorMessage); //记录测试
                return;
            }
            //#endregion
            if (JSON.parse(data).msg.length > 0) {
                //遍历JSON操作
                var $ = cheerio.load(data);
                var lengther = JSON.parse(data).msg.length;
                var arr = JSON.parse(data).msg;
                //#region 遍历每个答案的数据，进行对比赞数与下载
for (var i = 0; i < lengther; i++) {
//获取每个答案点赞数
var dianzancount = $(arr[i]).find('.count').text();
//判断点赞数大于条件点赞数
if (dianzancount >= dianzanshu) {
lianxucount = 0;
//#region 日志记录与错误调试
indexnum += 1;
var record = indexnum + '：' + $(arr[i]).find('span.count').text() + '赞同,作者：' + $(arr[i]).find('.author-link').text() + '----链接：' + $(arr[i]).find('.author-link').attr("href") + '\r\n';
fs.appendFile(filePath + '/答案记录.txt', record); //记录测试
console.log(record);
//#endregion 
//#region遍历图片进行下载
$(arr[i]).find('.zm-editable-content').find('img').each(function(imgindex) {
    var answerid = $(this).parents('.zm-item-rich-text').attr('data-entry-url').substr(-8);
    answerid = answerid.substr(answerid.lastIndexOf('/') + 1);
    var url = $(this).attr('src'); //获取答案中的图片地址
    if (url.indexOf('https')) {
        url = "http" + url.substr(5);
    }
    var imgName = path.basename(url);
    //开始下载图片
    startDownloadTask(url, filePath + '/' + answerid + '--' + imgindex + '--' + imgName.substr(-13), anstitle);
});
//#endregion
} else {
//#region 不符合判断
//如果连续50个答案都不符合条件
lianxucount += 1;
if (lianxucount > 100) {
    console.log('Don’t worry about this is because they are so ugly ！ (｡•ˇ‸ˇ•｡)  \r\n');
    lianxucount = 0;
}
//#endregion
}
};
                //#endregion
            };
        });
    } catch (e) {
        console.log('[当前错误信息]：' + e + "ID:" + questionId);
    }
    //#endregion
}
//#endregion
//#region 其他功能函数
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
        var req = https.request(imgSrc, getHttpReqCallback(imgSrc, dirName, anstitle));
        req.on('error', function(e) {});
        req.setTimeout(20 * 1000, function() {
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
    //去除标题中的特殊符号，以用于创建文件夹
    function GetQuestionTitle(s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }
    //#endregion
exports.start = start;