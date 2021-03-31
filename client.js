const net = require('net');
const readLine = require('readline');//读取命令行数据
const rl = readLine.createInterface(process.stdin, process.stdout);
let usr = {nickName : 'admin', status:'',chatContext:''};//客户端向服务器发送的内容(昵称,状态,聊天内容)
function signIn(usr){//客户端登录
    rl.question('please enter your nickname:', (nickName)=>{//询问 然后获取输入的昵称
        usr.nickName = nickName, usr.status = 'signIn';
        client.write(JSON.stringify(usr));//把用户信息发送给服务器 对象转为json格式
        rl.setPrompt(usr.nickName + ' > ');//提示符 让用户输入 
        rl.prompt();
    });
}
let client = net.connect({port:3006,host:'127.0.0.1'},()=>{//创建客户端到服务器的连接 监听服务器所在的端口号 
    console.log('Successfully connected to the server!');
    signIn(usr);//用户登录
    rl.on('line',(input)=>{//用户聊天完毕时  //用户输入并压回车后执行该函数
        usr.status = 'chatting';//状态改为聊天中
        usr.chatContext = input.toString();
        client.write(JSON.stringify(usr));
        rl.setPrompt(usr.nickName + ' > ');//提示符 让用户输入 
        rl.prompt();
    });

    client.on('data',(serverData)=>{//处理服务器传来的数据
        let {nickName,data,status} = JSON.parse(serverData);
        if(status=='systemNotice'){//显示系统公告
            process.stdout.clearLine();//清除提示符
            console.log('\n      | '+nickName + ' : '+ data + ' |\n');
        }
        else if(status=='chatting'){//显示发来的聊天内容
            process.stdout.clearLine();//清除提示符
            console.log(nickName + ' : ' + data);
        }
        rl.setPrompt(usr.nickName + ' > ');//提示符 让用户输入 
        rl.prompt();
    });
    client.on('end',()=>{//服务器关闭时
        process.stdout.clearLine();//清除提示符
        console.log('\n****************************');
        console.log('*System already close, Bye!*');
        console.log('****************************\n');
    });
});
