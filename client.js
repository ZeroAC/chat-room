const net = require('net');
const readLine = require('readline');//读取命令行数据
const rl = readLine.createInterface(process.stdin, process.stdout);
let usr = {nickName : 'admin', status:'',chatContext:''};//客户端的用户信息(昵称,状态,聊天内容)
function signIn(usr){//客户端登录
    rl.question('please enter your nickname:', (nickname)=>{
        usr.nickName = nickname, usr.status = 'signIn';
        console.log(`Welcome to ${nickname}!!`);
        rl.setPrompt(nickname + '>> ');//设置用户专属提示符
        rl.prompt();//显示提示符
        client.write(JSON.stringify(usr));//把用户信息发送给服务器 对象转为json格式
    });
}
let client = net.connect({port:3006,host:'127.0.0.1'},()=>{//创建客户端到服务器的连接 监听服务器所在的端口号 
    console.log('Successfully connected to the server!');
    signIn(usr);//用户登录
    rl.on('line',(input)=>{//用户聊天完毕时  //用户输入并压回车后执行该函数
        usr.status = 'chatting';//状态改为聊天中
        usr.chatContext = input.toString();
        client.write(JSON.stringify(usr));
    });

    client.on('data',(data)=>{//处理服务器传来的数据
        console.log(data.toString());
        rl.prompt();//显示提示符
    });
});
