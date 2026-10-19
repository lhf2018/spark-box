# 灵感盒

周末能做完的 vibe coding 灵感盒。首页放着十六个小项目点子，可以按心情筛选、随机抽一个、收藏。十六个点子都能打开玩。

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
| `/play/pixel-weather` | 像素天气窗：十六色小窗，切换晴、雾、雷 |
| `/play/synth-pad` | 四个键的合成器：按住，音色会变厚 |
| `/play/walk-art` | 散步成画：步数长成细线或雾 |
| `/play/brew-timer` | 手冲计时条：四段水，下一段会提前亮 |
| `/play/sticky-wall` | 便签墙：拖一张，旁边的会让开 |
| `/play/city-generator` | 城市生成器：种子相同，城市就相同 |
| `/play/reading-ring` | 阅读环：读完一章，环上多一段暖色 |
| `/play/idle-aquarium` | 挂机水族箱：鱼靠近时会并排游 |
| `/play/late-radio` | 深夜电台：三个台，换台先沙沙一声 |
| `/play/plant-care` | 植物值日生：到浇水日，叶子更亮 |

## 技术栈

- Next.js（App Router）+ TypeScript
- Tailwind CSS
- shadcn/ui（Button、Slider）
- 字体：Fraunces、Outfit、ZCOOL XiaoWei、Noto Sans SC

开发端口是 `4317`。`next.config` 里设置了 `allowedDevOrigins: ['127.0.0.1', 'localhost']`。

## 仓库

https://github.com/lhf2018/spark-box.git
