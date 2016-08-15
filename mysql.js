/**
 * 数据存储进数据库
 * @李老六(1030809514@qq.com )
 * @date    2016年8月2日13:06:18
 * @version v 0.1.1
 */

var mysql = require('./node_modules/mysql');
//连接数据库名、表名
var TEST_DATABASE = 'zhihuspiderdata';
var TEST_TABLE = 'Answers';

//创建连接
var client = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    port: '3306'
});

//和数据库建立连接
client.connect();
client.query("use " + TEST_DATABASE);

//存储数据进数据库
function start(questrionModel)
{
    //语句
    var userAddSql = 'INSERT INTO Answers(QuestrionId,Question,AnswerUserName,AnswerUserLink,AnswerId,DianzanCount,Detail,CreateTime) VALUES(?,?,?,?,?,?,?,NOW())';
    //参数
    var userAddSqlParams = [
        questrionModel.QuestrionId,//问题ID
        questrionModel.Question,//问题名称
        questrionModel.AnswerUserName,//当前答案回答者ID
        questrionModel.AnswerUserLink,//答主主页链接  
        questrionModel.AnswerId,//答案ID
        questrionModel.DianzanCount,//点赞数
        questrionModel.Detail//答案详情,纯文字
    ];

    //增 add
    client.query(userAddSql, userAddSqlParams, function (err, result)
    {
        if (!err)
        {
            console.log('~~~~~~~~~~~~~~~~~~~数据插入成功~~~~~~~~~~~~~~~~~~~~~~~');
            console.log('作者：【' + questrionModel.AnswerUserName + '】,用户链接' + questrionModel.AnswerUserLink);
            console.log('INSERT ID:', result.insertId + ',Anserid:' + questrionModel.AnswerId + ' ,点赞数：【' + questrionModel.DianzanCount + '】 ');
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n');
        } else
        {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
    });

}

//根据传入的ID，查询当前的问题是否已经遍历过
function finds(questionId, next)
{
    if (questionId)
    {

        var userAddSql = 'select * from  Answers where QuestrionId="' + questionId + '"';
        client.query(userAddSql, function (err, result)
        {
            if (err)
            {
                next(0);
            } else
            {
                next(result.length);
            }
        });
    };
}
//输出函数
exports.start = start;
exports.finds = finds;