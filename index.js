/**
 * index.js
 * @李老六(1030809514@qq.com )
 * @date    2016-07-17 11:19:02
 * @version 1.0.9
 */
//模块引入
var zhihu = require('./zhihu_getQuestrion_downloadImg_moudle.js'); //知乎单个问题模块
var coll = require('./CollectionQuestion.js');//收藏夹的模块

//#region 获取某个收藏夹下所有问题的答案
var collList = ['19686512'];
var collObj = {
    dianzanshu: 1000,//点赞数
    isDownloadImg: true//是否存储进数据库
};

for (var collindex = 0; collindex < collList.length; collindex++)
{
    //循环执行
    (function (collindex)
    {
        collObj.collid = collList[collindex];//收藏夹URL中的ID
        coll.start(collObj);//引入模块的方法
    })(collindex);
};
//#endregion

//#region 获取单个问题的优秀答案

// var urlList = [
// 'https://www.zhihu.com/question/21757507'
// ];
// for (var i = 0; i < urlList.length; i++)
// {
//     (function (io)
//     {
//         var url = urlList[io];
//         var queobj = {
//             question_url: url,
//             dianzanshu: 100
//         };
//         zhihu.start(queobj);//进行数据抓取
//     })(i);
// };
//#endregion