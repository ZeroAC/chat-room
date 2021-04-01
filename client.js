const net = require('net');//获取外部库 类似import
const { port, hostname } = require('./config.js');
const readLine = require('readline');
const { exit } = require('process');//获取退出命令行函数
const rl = readLine.createInterface(process.stdin, process.stdout);//在命令行读写数据

//客户端向服务器发送的内容(昵称,状态,聊天内容)
let clientData = { nickName: 'admin', status: '', chatContext: '' };

//创建客户端到服务器的连接 将触发服务器的connect事件 监听服务器所在的端口号 
let client = net.connect({ port, hostname }, () => {
    console.log('Successfully connected to the server!');
    signIn();//用户登录
});

//客户端输入完毕时 命令行读入内容 发送给服务器
rl.on('line', (input) => {
    input = input.trim();//去除前后多余的空格
    if(input[0]==':'){//用户输入为命令模式 
        input = input.substr(1);//去除符号:
        commandData = input.split(' ');//根据空格拆分
        let opt = commandData[0];//所进行的命令类型
        if(opt == 'all'){
            clientData.status = 'getAllUsr';
            client.write(JSON.stringify(clientData));
        }
        else if(opt == 'clear'){//清屏
            console.clear();
        }
        else if(opt == 'call'){//私聊
            clientData.status = 'p2p';
            clientData.callNickname = commandData[1];//获得私聊的对象名
            let message = '';
            for(let i = 2; i < commandData.length; i++) message += commandData[i]+' ';
            clientData.chatContext = message;
            client.write(JSON.stringify(clientData));
        }
        else{
            console.log('command error! please enter again');
        }

    }
    else{
        clientData.status = 'chatting';//状态改为聊天中
        clientData.chatContext = input.toString();
        client.write(JSON.stringify(clientData));
    }
    rl.setPrompt(clientData.nickName + ' > ');//提示符 让用户输入 
    rl.prompt();
});

//服务器传来数据时 则触发该事件
client.on('data', (serverData) => {
    let { nickName, data, status } = JSON.parse(serverData);//解析Json数据为对象
    if (status == 'systemNotice') {//显示系统公告
        process.stdout.clearLine();//清除提示符
        console.log('\n      | ' + nickName + ' : ' + data + ' |\n');
    }
    else if (status == 'chatting') {//显示群聊内容
        process.stdout.clearLine();//清除提示符
        console.log(nickName + ' : ' + data);
    }
    else if(status == 'call'){//显示私聊内容
        process.stdout.clearLine();//清除提示符
        console.log('|$| '+ nickName + ' : ' + data + ' |$|');
    }
    else if(status == 'callErr'){//私聊失败 即对象不存在
        process.stdout.clearLine();//清除提示符
        console.log('The nickname for private chat does not exist!');
    }
    else if(status =='displayUsr'){//显示所有用户
        process.stdout.clearLine();//清除提示符
        console.log(data);
    }
    else if(status == 'repeated'){//服务器发来用户名重复的问题
        console.log('The username already exists!! please re-enter');
        signIn();
        return;
    }
    rl.setPrompt(clientData.nickName + ' > ');//提示符 让用户输入 
    rl.prompt();
});

//服务器关闭时（连接断开） 则触发该事件
client.on('close', () => {//服务器关闭时
    process.stdout.clearLine();//清除提示符
    console.log('\n******************************************');
    console.log('*       System already close, Bye!       *');
    console.log('******************************************\n');
    exit();
});

//客户端登录
function signIn() {
    rl.question('please enter your nickname:', (nickName) => {//询问 然后获取输入的昵称
        clientData.nickName = nickName, clientData.status = 'signIn';
        client.write(JSON.stringify(clientData));//把用户信息发送给服务器 对象转为json格式
    });
}