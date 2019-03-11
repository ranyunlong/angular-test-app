# 项目环境搭建与配置

1. 安装cli

```bash
npm install -g @angular/cli
```

2. 创建项目

```bash
ng new <project-name>
```

3. 反向代理配置

项目根目录添加 proxy.config.json文件

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": "false",
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```
