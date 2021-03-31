const net = require('net');
const { port, hostname } = require('./config.js');
let clientList = {};//存储所有的用户 键值对形式 用户名:对应的连接

//服务器向客户端发送的数据内容(源名 数据内容 状态)
let serverData = { nickName: '', data: '', status: '' };

let server = net.createServer();//创建一个net服务

//服务开启监听中
server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}`);
});

//当有新连接到服务器时 则触发该事件
server.on('connection', (socket) => {
    //处理客户端传来的数据
    socket.on('data', (data) => {
        let { nickName, status, chatContext } = JSON.parse(data);//json格式转为对象 快速赋值时 需要变量名与对象内键值对的名字相同
        if (status == 'signIn') {//新用户登录时 
            clientList[nickName] = socket;//加入用户列表
            let strPrompt = `Welcome ${nickName} to join chat!! The current number is: ${Object.keys(clientList).length}`;//提示内容
            console.log(strPrompt);//在服务器显示该提示
            serverData = { nickName: 'System', data: strPrompt, status: 'systemNotice' };//设置发往客户端的数据
            broadcast(nickName);//并向除了刚加入的所有用户显示新用户加入的提示
        }
        else if (status == 'chatting') {//客户端发送聊天时
            serverData = { nickName: nickName, data: chatContext, status: 'chatting' };//数据模式为普通消息
            broadcast(nickName);
        }
        else if(status == 'getAllUsr'){//获取所有用户信息
            AllUsrData = '';
            Object.keys(clientList).forEach((key)=>{
                let padLeftLen = (20-key.length)/2;//每个信息输出占20个位置
                let padRightLen = (20-key.length)%2 ? padLeftLen+1:padLeftLen;
                AllUsrData += '\n'+'|' + '.'.repeat(padLeftLen)+'  '+key+'  '+'.'.repeat(padRightLen) +' |';
                
            });
            serverData = { nickName: '', data: AllUsrData, status: 'displayUsr' }
            socket.write(JSON.stringify(serverData));//把数据发回去
        }
        else if(status == 'p2p'){
            let {callNickname} = JSON.parse(data);//获得私聊的对象名
            serverData = {nickName: nickName,data:chatContext,status:'call'};
            clientList[callNickname].write(JSON.stringify(serverData));//把消息发送过去
        }
    });
    //客户端到服务器的连接断开时  
    socket.on('close', () => {
        let DelNickName;
        Object.keys(clientList).forEach((key) => {//从用户列表中删除该链接
            if (clientList[key] == socket) { DelNickName = key, delete clientList[key]; return; }
        });
        let strPrompt = `${DelNickName} already offline!! The current number is: ${Object.keys(clientList).length}`;//提示内容
        console.log(strPrompt);//在服务器显示该提示
        serverData = { nickName: 'System', data: strPrompt, status: 'systemNotice' };//设置发往客户端的数据
        broadcast();//广播
    });
});

//对除了banName的所有用户广播该数据 因为自己发的消息没必要再广播给自己
function broadcast(banName = '') {
    for (let nickname in clientList) {
        if (nickname == banName && serverData.status != 'systemNotice') continue;//系统公告不能被禁止
        clientList[nickname].write(JSON.stringify(serverData));
    }
}