//js中对象的遍历添加删除

let s = {'hi':21,'nt':66};//js 对象 键值对
s['hello'] = 1;//添加元素
s['world'] = 2;
console.log(Object.keys(s).length);//对象的长度
function objForEach(obj){//遍历对象obj
    Object.keys(obj).forEach((key)=>{
        console.log(key+':'+obj[key] );
    });
}
objForEach(s);
delete s.hello;//删除某个键
console.log();
objForEach(s);