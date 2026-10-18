# 灵感盒

周末能做完的 vibe coding 灵感盒。首页放着十六个小项目点子，可以按心情筛选、随机抽一个、收藏。其中六个已经做成能打开玩的 demo。

仓库 / npm 包名：`spark-box`

## 开始

```bash
npm install
npm run dev
```

浏览器打开 [http://127.0.0.1:4317](http://127.0.0.1:4317)。

生产构建：

```bash
npm run build
npm start
```

不需要数据库、登录或外部付费 API。收藏和日记都写在浏览器本地。

## 可玩 demo

| 路径 | 点子 |
| --- | --- |
| `/play/rain-mixer` | 雨声混音器：雨滴、雨声、雨量和风向 |
| `/play/typewriter-journal` | 今日一张纸：当天日记，退格留下擦痕 |
| `/play/cafe-pomodoro` | 咖啡馆番茄钟：25/5，灯光跟着进度走 |
| `/play/mood-palette` | 情绪色板：一个词生成五枚 oklch 颜色 |
| `/play/film-clock` | 电影时钟：字幕风格的实时时钟 |
| `/play/desk-pet` | 桌面小动物：戳它会醒，闲下来会打瞌睡 |

另外十个点子只在首页展示，点进去会看到还停在纸面上的说明。

## 技术栈

- Next.js（App Router）+ TypeScript
- Tailwind CSS
- shadcn/ui（Button、Slider）
- 字体：Fraunces、Outfit、ZCOOL XiaoWei、Noto Sans SC

开发端口是 `4317`。`next.config` 里设置了 `allowedDevOrigins: ['127.0.0.1', 'localhost']`。

## 仓库

https://github.com/lhf2018/spark-box.git
