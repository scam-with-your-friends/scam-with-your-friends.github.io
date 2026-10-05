# Adsterra 接入验证记录

日期：2026-10-05。修改代码并验证本地生产静态导出；尚未部署。

## 修改文件

- `config/adsterra.ts`：本次 GET CODE 唯一来源，四份官方代码逐字核对一致，不使用历史环境变量覆盖。
- `components/integrations/ad-frame.ts`：用独立广告文档执行原样 GET CODE，兼容 Banner 的 parser/document.write，隔离供应商全局变量；没有 eval，没有新增依赖。
- `components/integrations/responsive-banner.tsx`：统一响应式 Banner，只选择首次挂载时对应设备的一份脚本；缩放窗口只适配当前广告尺寸，不执行另一份广告。
- `components/integrations/native-ad-client.tsx`、`native-ad-slot.tsx`：统一 Native，每页单个容器，卸载时移除 iframe 并断开尺寸观察器。
- `components/integrations/social-bar.tsx`：Social Bar 全局脚本，通过唯一 DOM id 防止重复初始化，不随路由卸载。
- `components/integrations/ad-document.tsx`：在服务端已有广告容器中挂载可复用组件；页面 slug 作为生命周期 key。
- `lib/ad-placements.ts`：只插入广告容器，不改写 SEO 内容。
- `components/templates/fixed-template-home.tsx`、`fixed-template-inner.tsx`：将广告接入当前站实际启用的页面结构。
- `app/layout.tsx`：唯一 Social Bar 初始化入口。
- `app/globals.css`：广告居中、标识、间距、预留高度及窄屏兼容样式。

## 页面结构与位置

实际技术栈是 Next.js App Router、React、静态导出，当前启用 glass fixed-template 模式。

- 首页 Hero：`.hero`，包含原有 H1、介绍、更新时间、CTA 和封面图。
- 子页 Hero：`.wrap.inner-hero`，包含原有面包屑、H1、介绍、更新时间和 CTA。
- Banner：上述 Hero 完整结束后的直接相邻广告容器，不切断主题区域。
- 首页短内容块：原有 `#quick-status` 内完整状态表；Native 紧跟表格，位于原有站内链接卡片之前，不等待整个摘要章节结束。
- Playtest、Price、Platforms：利用第一个正文模块里的完整状态表；Native 紧跟状态表，不拆表，不移动前面的原有正文。
- Release Date、How to Play、Discord 及法律页：没有独立短摘要组件时，在第一个现有完整段落结束后插入 Native，不等待长章节结束。
- 每页只生成一个 Banner 和一个 Native 挂载位置；Banner 与 Native 之间存在真实站内内容。
- `<768px` 仅执行 320×50；`>=768px` 仅执行 728×90，预留至少 50/90px。两份脚本不会同时执行。
- 页面卸载清除 Banner/Native，延迟初始化可在生命周期清理时取消；Social Bar 保留于全局文档，返回页面不产生第二份。
- 项目没有发现 CSP 配置；没有添加或放宽 CSP。

## 已完成验证

- `npm ci --ignore-scripts --no-audit --no-fund --prefer-offline` 成功；安装有当前 Node 版本与一个 ESLint 依赖的 engine 提示，没有修改依赖或 lockfile。
- `npm run build`、`npm run typecheck`、`npm run lint`、`npm run audit:seo`、`git diff --check` 通过。
- 没有配置 `test` 命令。
- 工作区 `npm run validate` 修改前即因已有、被 Git 忽略的 `.idea` 目录失败。保留该目录；复制完整受检源码到干净临时目录后，原 validate 脚本通过。
- 浏览器覆盖 11 个已启用页面 × 375px/1440px，共 22 次页面检查。
- 每次只有当前尺寸的 Banner 脚本请求、一次 Native 请求、一次 Social Bar 请求；另一尺寸 Banner 请求为零。
- Banner 紧跟 Hero，水平居中；Native 单实例并位于真实内容之后；全部页面没有横向滚动。
- 两个尺寸均验证了通过 Footer 的 Next/Link：首页 → Release Date → 历史返回首页；文档和 Social Bar 节点保持一致，Social Bar 新增请求为零。
- 跨尺寸 resize 不请求第二份广告，无横向溢出。
- 主动阻断官方广告请求后，页面布局和导航仍正常；JavaScript pageerror 为零。浏览器按预期记录 ERR_BLOCKED_BY_CLIENT 网络错误。
- 正常请求中，Desktop Banner、Native、Social Bar 官方入口均返回 200；移动 Banner 请求也已核验。
- 所有已导出页面的 title、meta、canonical、H1/H2/H3、正文、导航、Footer、链接锚文本及链接地址、JSON-LD 与修改前逐项一致。sitemap、robots 和 llms 文件逐字节一致，统计代码没有修改。
- 320px 窄屏、767px/768px 切换边界补充验证通过，正常加载无控制台错误。
- 保留了首页与 Release Date 在 375px/1440px 的 Banner/Native 截图，共 8 张。

## 实际限制与上线复查

原有 Hero 和状态模块本身较长。在不移动、拆分或改写这些内容的前提下，Native 无法在所有页面压到前 1～1.5 屏。首页在 375px 时 Native 约 y=1892px，已比完整 Quick Status 模块后提前约 710px；Release Date 约 y=1115px；状态表较长的页面也会超过 1.5 屏。广告已位于规范允许的最早完整内容边界。

本地没有填充真实素材，未添加假广告。上线后需在真实域名确认广告填充、Native 实际素材高度与 CLS，以及 Social Bar 浮动 UI 是否遮挡导航、CTA 或交互。

生产浏览器验证已经通过。额外尝试的开发服务器 Strict Mode 浏览器验证因已有开发服务器响应超时未完成；未停止用户已有开发服务器。
