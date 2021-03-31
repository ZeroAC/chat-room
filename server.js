const net = require('net');
let clientList={};//存储所有的用户 键值对形式 用户名:对应的连接
let serverData = {nickName:'',data:'',status:''};//服务器向客户端发送的数据内容(源名 数据内容 状态)
let server = net.createServer((socket)=>{
    socket.on('data',(data)=>{//处理客户端传来的数据
        let {nickName,status,chatContext} = JSON.parse(data);//json格式转为对象 快速赋值时 需要变量名与对象内键值对的名字相同
        if(status === 'signIn'){//新用户登录时 
            clientList[nickName] = socket;//加入用户列表
            let strPrompt = `Welcome ${nickName} to join chat!! The current number is: ${Object.keys(clientList).length}`;//提示内容
            console.log(strPrompt);//在服务器显示该提示
            serverData = {nickName:'System',data:strPrompt,status:'systemNotice'};//设置发往客户端的数据
            broadcast(nickName);//并向除了刚加入的所有用户显示新用户加入的提示
        }
        else if(status === 'chatting'){
            serverData = {nickName:nickName,data:chatContext,status:'chatting'};//数据模式为普通消息
            broadcast(nickName);
        }
    });
});
server.listen(3006,()=>{
    console.log('server running at http://127.0.0.1:3006');
});

function broadcast(banName=''){//对除了banName的所有用户广播该数据
    for(let nickname in clientList){
        if(nickname==banName&&serverData.status!='systemNotice') continue;//系统公告不能被禁止
        clientList[nickname].write(JSON.stringify(serverData));
    }
}