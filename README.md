## 第一个node.js命令行版聊天室
**使用方法：**
1. `node server.js` 运行服务器
2. `node client.js` 运行数次 打开多个客户端聊天室
3. 然后就可以愉快的群聊啦
4. 用户具有命令行模式 只需要先输入`:`然后输入命令即可。
   具体命令有
   `:getAllUsr` 表示获取当前在线的所有用户的名字
   `:clear` 清空当前的聊天窗口
   `:call nickname message` 向指定的用户nickname私聊 内容为message
  