/**
 * index.js
 * @authors Your Name (you@example.org)
 * @date    2016-07-17 11:19:02
 * @version $Id$
 */
var zhihu = require('./zhihu_getQuestrion_downloadImg_moudle.js'); //知乎单个问题模块

var coll=require('./CollectionQuestion.js');//收藏夹的模块

//#region coll模块使用方法

// var collObj={
//     collid: '108201352',//收藏夹URL中的ID
//     dianzanshu: 1000,//点赞数
//     isDownloadImg: true,//是否进行图片下载
//     pages: 1//收藏夹页数
// }
// coll.start(collObj);

//#endregion

//#region zhihu模块获取问题下的图片
 var queobj = {
    question_url: 'https://www.zhihu.com/question/37006507',
    dianzanshu: 100
 };
 var urllist=[
'https://www.zhihu.com/question/35667984'
 ];
 for (var i = 0; i < urllist.length; i++) {
    (function(io) {
        var url = urllist[io];
        var queobj = {
            question_url: url,
            dianzanshu: 10
        }; 
        zhihu.start(queobj);//进行图片下载 
    })(i);
 };
//#endregion
//,'https://www.zhihu.com/question/34496321','https://www.zhihu.com/question/31159026','https://www.zhihu.com/question/27936753','https://www.zhihu.com/question/25303181','https://www.zhihu.com/question/19647535','https://www.zhihu.com/question/24199869','https://www.zhihu.com/question/24400664','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/29106324','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/25378124','https://www.zhihu.com/question/25378124','https://www.zhihu.com/question/35846840','https://www.zhihu.com/question/25695922','https://www.zhihu.com/question/25378124','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/31138419','https://www.zhihu.com/question/37709992','https://www.zhihu.com/question/19647535','https://www.zhihu.com/question/30671166','https://www.zhihu.com/question/37006507','https://www.zhihu.com/question/30697837','https://www.zhihu.com/question/35846840','https://www.zhihu.com/question/20843119','https://www.zhihu.com/question/27786143','https://www.zhihu.com/question/36169565','https://www.zhihu.com/question/26085376','https://www.zhihu.com/question/37787176','https://www.zhihu.com/question/30313169','https://www.zhihu.com/question/28594982','https://www.zhihu.com/question/36546814','https://www.zhihu.com/question/30477915','https://www.zhihu.com/question/21005463','https://www.zhihu.com/question/35038311','https://www.zhihu.com/question/24356875','https://www.zhihu.com/question/24400664','https://www.zhihu.com/question/28116784','https://www.zhihu.com/question/21427849','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/31138419','https://www.zhihu.com/question/31804320','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/26663467','https://www.zhihu.com/question/20399991','https://www.zhihu.com/question/30087454','https://www.zhihu.com/question/26449230','https://www.zhihu.com/question/32055345','https://www.zhihu.com/question/27209106','https://www.zhihu.com/question/31159026','https://www.zhihu.com/question/31996563','https://www.zhihu.com/question/31996563','https://www.zhihu.com/question/27224177','https://www.zhihu.com/question/28918006','https://www.zhihu.com/question/33201508','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/21860339','https://www.zhihu.com/question/20937691','https://www.zhihu.com/question/31514428','https://www.zhihu.com/question/28560777','https://www.zhihu.com/question/30891697','https://www.zhihu.com/question/28586345','https://www.zhihu.com/question/30671166','https://www.zhihu.com/question/34496321','https://www.zhihu.com/question/37787176','https://www.zhihu.com/question/29261859','https://www.zhihu.com/question/31625111','https://www.zhihu.com/question/37756869','https://www.zhihu.com/question/26985993','https://www.zhihu.com/question/19647535','https://www.zhihu.com/question/21100397','https://www.zhihu.com/question/31159026','https://www.zhihu.com/question/28656794','https://www.zhihu.com/question/19647535','https://www.zhihu.com/question/31138419','https://www.zhihu.com/question/19647535','https://www.zhihu.com/question/29665193','https://www.zhihu.com/question/31159026','https://www.zhihu.com/question/34231281','https://www.zhihu.com/question/26613082','https://www.zhihu.com/question/35667984','https://www.zhihu.com/question/21005463','https://www.zhihu.com/question/24479195','https://www.zhihu.com/question/31159026','https://www.zhihu.com/question/27374524','https://www.zhihu.com/question/34489632','https://www.zhihu.com/question/30087454','https://www.zhihu.com/question/21648235','https://www.zhihu.com/question/31377684','https://www.zhihu.com/question/31138419','https://www.zhihu.com/question/30671166','https://www.zhihu.com/question/35393908','https://www.zhihu.com/question/28202126','https://www.zhihu.com/question/38285230','https://www.zhihu.com/question/26663467','https://www.zhihu.com/question/35703039','https://www.zhihu.com/question/27682990','https://www.zhihu.com/question/31115807','https://www.zhihu.com/question/32043792','https://www.zhihu.com/question/20047400'