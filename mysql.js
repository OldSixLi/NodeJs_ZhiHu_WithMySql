/**
 * 知乎抓取数据存储进入数据
 * @李老六(1030809514@qq.com )
 * @date    2016年8月2日13:06:18
 * @version v 0.1.1
 */

var mysql = require( './node_modules/mysql');
var TEST_DATABASE = 'zhihuspiderdata';
var TEST_TABLE = 'Answers';

//创建连接
var client = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    port: '3306'
});
client.connect();
//和哪个数据库建立连接
client.query("use " + TEST_DATABASE);

//数据存储
function start(questrionModel)
{

    //语句
    var userAddSql = 'INSERT INTO Answers(QuestrionId,Question,AnswerUserName,AnswerUserLink,AnswerId,DianzanCount,Detail,CreateTime) VALUES(?,?,?,?,?,?,?,NOW())';
    //参数
    var userAddSqlParams = [
        questrionModel.QuestrionId,
        questrionModel.Question,
        questrionModel.AnswerUserName,
        questrionModel.AnswerUserLink,
        questrionModel.AnswerId,
        questrionModel.DianzanCount,
        questrionModel.Detail
    ];

    //增 add
    client.query(userAddSql, userAddSqlParams, function (err, result)
    {
        if (err)
        {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('~~~~~~~~~~~~~~~~~~~数据插入成功~~~~~~~~~~~~~~~~~~~~~~~');
        console.log('作者：【' + questrionModel.AnswerUserName + '】,用户链接' + questrionModel.AnswerUserLink);
        console.log('INSERT ID:', result.insertId + ',Anserid:' + questrionModel.AnswerId + ' ,点赞数：【' + questrionModel.DianzanCount + '】 ');
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n');

    });

}

//查询当前的问题是否已经遍历过
function finds(questionId, next)
{
    if (questionId)
    {

        var userAddSql = 'select * from  Answers where QuestrionId="' + questionId + '"';
        client.query(userAddSql, function (err, result)
        {
            if (!err)
            {
                next(result.length);
            } else
            {
                next(0);
            }
        });
    };
}
//输出函数
exports.start = start;
exports.finds = finds;