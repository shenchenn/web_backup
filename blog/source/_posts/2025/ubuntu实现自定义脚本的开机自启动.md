---
title: ubuntu实现自定义脚本的开机自启动
date: 2025-06-20 00:34:18categories:
tags:
  - 小技巧
---

## 操作步骤

1. 参照/lib/systemd/system/rc-local.service模板，在其后面添加语句

   ```c
   [Install]
   WantedBy=multi-user.target
   ```
   
   并放在/etc/systemd/system/rc-local.service

2. 创建/etc/rc.local文件，加入自己的脚本命令，并加权限

   ```c
   #!/bin/bash
   #自己的脚本命令
   ```

3. 加权限

   ```c
   sudo chmod a+x /etc/rc.local
   ```

4. 使能并启用

   ```c
   sudo systemctl enable rc-local
   sudo systemctl start rc-local.service
   sudo systemctl status rc-local.service
   ```

   

