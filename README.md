# 星天气 · 今日星座翻卡

选择星座，翻开每天的幸运色与心情寄语，并结合当地天气查看穿搭建议。

现有网站：[星天气](https://star-mood-daily-lxlx.luoxianjun622.chatgpt.site)

## 本地运行

这是纯 HTML、CSS 和 JavaScript 网站，无需安装前端依赖或配置 API 密钥。在仓库根目录使用 Python 3：

```sh
python3 -m http.server 8000
```

打开 `http://localhost:8000`。

## 文件说明

- `index.html`：页面结构与入口。
- `style.css`：基础样式与翻卡效果。
- `layout.css`：三段横向布局与响应式适配。
- `app.js`：星座选择、每日寄语、天气获取和穿搭建议。

## 使用说明

天气数据通过浏览器请求 Open-Meteo，需要联网。可手动选择城市；使用定位需要用户授权，并在 HTTPS 或 localhost 环境下运行。浏览器本地存储只保存所选星座与城市偏好，不包含线上用户数据。星座内容仅供娱乐。

本仓库保存当前网站源码快照，不会自动更新现有网站，未启用 GitHub Pages 或自动部署。
