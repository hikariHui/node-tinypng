# node命令行压缩图片

批量压缩图片，支持jpg、png格式

## 使用方法

1. 配置`config.json`文件

复制`config.json.example`为`config.json`，修改其中的配置项

```json
{
    "key": "{TinyPNG API KEY}"
}
```

2. 安装依赖

```sh
pnpm install
```

3. 运行

```sh
pnpm start "文件路径（可以是图片文件也可以是文件夹）"
```
