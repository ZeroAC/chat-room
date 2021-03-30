const net = require('net');
let server = net.createServer((socket)=>{
    socket.on('data',(data)=>{//处理客户端传来的数据
        let {nickName,status,chatContext} = JSON.parse(data);//json格式转为对象 快速赋值时 需要变量名与对象内键值对的名字相同
        if(status === 'signIn'){
            console.log(`Welcome ${nickName} to join the group chat!`);
        }
        else if(status === 'chatting'){
            socket.write(chatContext);
        }
    });
});
server.listen(3006,()=>{
    console.log('server running at http://127.0.0.1:3006');
});