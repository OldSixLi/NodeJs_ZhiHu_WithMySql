/**
 * 获取知乎某个问题下的答案
 * @马少博(1030809514@qq.com)
 * @date    2016-07-05 10:38:20
 * @version 1.1.5
 */


//#region   模块引入与变量声明
var getmoudle_path = 'C:/Program Files/nodejs/node_modules/';
var nodegrass = require(getmoudle_path + 'nodegrass');
var cheerio = require(getmoudle_path + 'cheerio');
var https = require("https");
var fs = require("fs");
var mysql = require('./mysql');

//变量声明
var dianzanshu = 0;
var errorMessage = ""; //错误信息记录
var downloadindexnum = 0; //下载图片数量
var lianxucount = 0; //连续没数据

//#endregion

//#region创建当天的文件夹
var imageFile = './images';
if (!fs.existsSync(imageFile))
{
    fs.mkdirSync(imageFile, 0777); //创建目录
    console.log(imageFile + '文件夹已成功创建！');
}
var date_file = imageFile + getNowFormatDate('date');
if (!fs.existsSync(date_file))
{
    fs.mkdirSync(date_file, 0777); //创建目录
    console.log(date_file + '文件夹已成功创建！');
}
//#endregion

//#region 获取点赞数
function start(queObj)
{
    var questionIdName = "";//每个问题创建一个唯一的标识显示在输出窗口里
    var questionUrls; //当前问题的链接
    var questionId; //获取问题的ID
    if (!queObj.question_url)
    {
        return;
    } else
    {
        questionUrls = queObj.question_url;
        dianzanshu = queObj.dianzanshu;
        questionId = questionUrls.substr(questionUrls.lastIndexOf('/') + 1);
    }

    //验证当前问题是否已经遍历过的回调函数
    mysql.finds(questionId, function (data)
    {
        switch (data)
        {
            case 0:
                nodegrass.get(questionUrls, function (data, status, headers)
                {
                    var $ = cheerio.load(data);
                    //只获取中文字符
                    var anstitle = $(data).find('title').text().trim().replace(/[^\u4e00-\u9fa5]/gi, "");

                    console.log('【问题】：' + questionId + '—' + anstitle.substr(0, anstitle.length - 2) + '？' + '已开始加入获取答案队列中！');

                    //返回答案数
                    var answer = $(data).find('#zh-question-answer-num').text();
                    var ansCount = parseInt((answer.substr(0, answer.length - 4)));
                    //在遍历问题下的答案时，优质答案一般不会超过20页，后期答案不再进行遍历
                    if (ansCount > 200)
                    {
                        ansCount = 200;
                    }
                    CircleGetAnswer(ansCount, questionId, anstitle);

                });
                break;
            default:
                console.log('当前问题已遍历过，不再遍历当前问题：' + questionId);
                break;
        }
    }
    );
}
//#endregion


//#region 根据答案总数，循环获取答案
function CircleGetAnswer(answercount, questionId, anstitle)
{
    //因为NodeJs是异步执行的，所以另起函数的话会导致获取不到ans，因为此时异步请求还没有相应
    //所以当前函数必须在上一个函数中被调用
    for (var jsonindex = 0; jsonindex < answercount / 10 + 1; jsonindex++)
    {
        (function (jsonindex)
        {
            getAnswer(jsonindex, questionId, anstitle);
        })(jsonindex);
    };
}

//#endregion


//#region 具体的事物操作
/**
 * 获取问题，答案JSON 函数，每次获取十条答案
 * @param {页面Index} index
 * @param {问题ID} questionId
 * @param {问题答案} anstitle
 * @returns {}
 */
function getAnswer(index, questionId, anstitle)
{
    //声明需要请求的URL地址路径
    var posturl = 'https://www.zhihu.com/node/QuestionAnswerListV2' + '?method=next&params={"url_token":' + questionId + ',"pagesize":10,"offset":' + index * 10 + '}';

    //#region 进行JSON数据请求
    try
    {
        nodegrass.post(posturl, function (data, status, headers)
        {
            console.log('第' + index + '页：');
            //#region 测试数据是否可以转化为JSON
            try
            {
                var obj = JSON.parse(data);


                if (obj.msg.length > 0)
                {
                    //遍历JSON操作
                    var $ = cheerio.load(data);
                    var arr = obj.msg;
                    //#region 遍历每个答案的数据，进行对比赞数与下载
                    for (var i = 0; i < 10; i++)
                    {
                        //获取每个答案点赞数
                        var dianzancount = $(arr[i]).find('.count').text();
                        //判断点赞数大于条件点赞数
                        if (dianzancount >= dianzanshu)
                        {
                            lianxucount = 0;
                            var answerid = $(arr[i]).find('.zm-item-rich-text').attr('data-entry-url');
                            answerid = answerid.substr(answerid.lastIndexOf('/') + 1);
                            var questrionModel = {
                                AnswerId: answerid,//答案ID
                                QuestrionId: questionId,//问题ID
                                Question: anstitle,//问题具体内容
                                AnswerUserName: $(arr[i]).find('.author-link').text(),//回答者名称
                                AnswerUserLink: "https://www.zhihu.com" + $(arr[i]).find('.author-link').attr("href"),//回答者主页链接
                                DianzanCount: parseInt(dianzancount),//点赞数
                                Detail: $(arr[i]).find('.zm-editable-content').text()//内容详情，只包含文字
                            };
                            mysql.start(questrionModel);
                            //#endregion
                        } else
                        {
                            //如果连续100个答案都不符合条件
                            lianxucount += 1;
                            if (lianxucount > 100)
                            {
                                console.log('连续读取100条记录不符合点赞数！ (｡•ˇ‸ˇ•｡)  \r\n');
                                lianxucount = 0;
                            }

                        }
                    };

                };
            } catch (e)
            {
                console.log(e + '转化JSON 失败');
                return;
            }
            //#endregion
        });
    } catch (e)
    {
        console.log('[当前错误信息]：' + e + "ID:" + questionId);
    }
    //#endregion


}
//#endregion


/**
 * 获取当天日期
 * @param {规定只返回日期还是返回日期时间} dates
 * @returns {}
 */
function getNowFormatDate(dates)
{
    var date = new Date(),
    seperator1 = "-",
    seperator2 = ":",
    month = date.getMonth() + 1,
    strDate = date.getDate();

    if (month >= 1 && month <= 9)
        month = "0" + month;

    if (strDate >= 0 && strDate <= 9)
        strDate = "0" + strDate;
    //返回当前的日期（时间）
    var currentdate = dates !== 'date' ? date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds() : date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

exports.start = start;