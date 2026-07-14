# YoYoScore 依赖升级方案

> 审计日期：2026-07-14。版本号是本次审计时 npm `latest` 稳定标签的快照；实施当天应再次执行 `pnpm outdated`，但不得引入 alpha、beta、RC。刚发布不足 7 天的版本先进入冷却期，使用上一稳定 patch，期满后再更新锁文件。

> 实施状态：已于 2026-07-14 完成。受 7 天冷却策略约束，首轮锁定 pnpm 11.10.0、Vite 8.1.3、`@vitejs/plugin-vue` 6.0.7、ESLint 10.6.0；冷却期后可由常规维护任务升级到新的 patch。

## 1. 目标与原则

- 使用仍在维护、许可证兼容且有稳定版的依赖；在 `pnpm-workspace.yaml` 设置 `minimumReleaseAge: 10080`（7 天），锁文件必须提交。
- 按工具链、框架、UI/PWA、业务库分批升级，每批均可独立回滚。
- 优先删除只承担少量逻辑的依赖，避免用另一个大库替换小段原生代码。
- 不改变 Pinia store id 和已持久化字段含义，保证现有用户的本地数据可继续读取。
- 合并门槛：lint、单元测试、生产构建通过，`pnpm audit --prod` 无 high/critical，核心移动端流程及离线模式通过人工验收。

## 2. 当前基线与主要问题

现有锁文件可完成 ESLint 8 检查和 Vite 7.3.6 构建，但存在以下问题：

- `pnpm audit --prod` 报告 **15 个漏洞（7 high、5 moderate、3 low）**，主要来自 `exceljs` 的旧版压缩/文件依赖，以及旧 Vue 工具链。
- `ResultView` 产物约 956 kB（gzip 276 kB），ExcelJS 是主要体积来源。
- UnoCSS 构建提示缺少显式配置文件。
- `.eslintrc.cjs` 无法被 ESLint 10 使用；其旧配置格式已移除。
- pnpm 11 默认阻止未审核的依赖安装脚本，当前旧依赖图中的 `esbuild`、`vue-demi` 尚未配置 `allowBuilds`。
- `ua-parser-js` v1 仍是 MIT，但最新 v2 改为 AGPLv3/商业双许可，不应直接升级到 MIT 项目中。[官方迁移说明](https://docs.uaparser.dev/intro/whats-new.html)

## 3. 目标版本与处置

### 核心与工具链

| 依赖 | 当前锁定 | 目标 | 处置 |
| --- | ---: | ---: | --- |
| Node.js | CI 20.19 | 24 LTS | 本地与 CI 统一；满足 pnpm 11、Vite 8、ESLint 10 |
| pnpm | CI 9.15.9 | 11.13.0 | 在 `package.json` 写入精确 `packageManager`；增加 `pnpm-workspace.yaml` 安装脚本白名单；未满冷却期时暂用 11.12.0 |
| `vue` | 3.4.27 | 3.5.39 | 升级并回归响应式、模板 ref 和生命周期 |
| `pinia` | 2.1.7 | 3.0.4 | 当前 `defineStore(id, options)` 可直接迁移；保持 store id 不变。[迁移指南](https://pinia.vuejs.org/cookbook/migration-v2-v3.html) |
| `pinia-plugin-persistedstate` | 3.2.1 | 4.7.1 | 与 Pinia 3 同批升级；验证四个 store 的 hydration |
| `vue-router` | 4.3.2 | 5.1.0 | 项目未用文件路由，官方说明无破坏性改动。[迁移指南](https://router.vuejs.org/guide/migration/v4-to-v5) |
| `vite` | 7.3.6 | 8.1.4 | 将 `build.rollupOptions` 改为 `build.rolldownOptions`；确认最低 Safari 16.4 可接受。[Vite 8 迁移指南](https://vite.dev/guide/migration.html) |
| `@vitejs/plugin-vue` | 6.0.7 | 6.0.8 | 与 Vite/Vue 同批升级；未满冷却期时保持 6.0.7 |
| `eslint` / `eslint-plugin-vue` | 8.57.0 / 9.26.0 | 10.7.0 / 10.9.2 | 新增 `@eslint/js@10.0.1`，迁移到 `eslint.config.js`，删除 `.eslintrc.cjs` 和旧 CLI 参数。[ESLint 迁移指南](https://eslint.org/docs/latest/use/configure/migration-guide) |

### UI、构建与 PWA

| 依赖 | 当前锁定 | 目标 | 处置 |
| --- | ---: | ---: | --- |
| `vant` | 4.9.0 | 4.10.0 | 回归表单、弹层、折叠面板和暗色主题 |
| `@vant/auto-import-resolver` | 1.2.0 | 1.3.0 | 保留组件自动注册 |
| `unplugin-vue-components` | 0.26.0 | 32.1.0 | 与 resolver 同批升级 |
| `unplugin-auto-import` | 0.17.6 | 删除 | 目前 Vant 函数均显式导入；删除 `AutoImport`/`VantImports` 配置 |
| `@iconify/vue` | 4.1.2 | 5.0.1 | 移到 `dependencies`，因为运行时代码直接导入它 |
| `unocss` | 66.7.5 | 66.7.5 | 已是最新；新增 `uno.config.js`，显式使用 `presetWind3()` |
| `vite-plugin-pwa` | 1.3.0 | 1.3.0 | 已是最新；继续使用 `injectManifest` |
| Workbox 6 个包 | 7.4.1 | 7.4.1 | 已是最新；统一移到 `devDependencies`。源码引用的 core/precaching/routing/strategies 仍需保留；build/window 是 PWA 插件 peer 依赖。[injectManifest 文档](https://vite-pwa-org.netlify.app/workbox/inject-manifest.html) |

### 业务依赖

| 依赖 | 当前 | 目标/替代 | 原因 |
| --- | ---: | --- | --- |
| `exceljs` | 4.4.0 | `write-excel-file@4.1.1` | ExcelJS 最新稳定版仍带来多条生产漏洞和大体积；替代库活跃、MIT、支持浏览器、多 sheet、样式、合并单元格和列宽。[官方仓库](https://gitlab.com/catamphetamine/write-excel-file) |
| `ua-parser-js` | 1.0.37 | 删除 | 避免 v2 AGPL。用 `matchMedia('(pointer: coarse)')` 判断触控设备，用 iOS/PWA 能力检测和 `beforeinstallprompt` 决定安装 UI；删除“仅推荐 Chrome”的浏览器嗅探 |
| `normalize.css` | 8.0.1 | 删除 | 长期无新版本；仅把项目确实需要的 `box-sizing`、margin、字体继承规则并入 `src/assets/main.css` |
| `radash` | 12.1.0 | 12.1.1 | 保留现有 `group`、`sort` 实现，按 latest 稳定版规则升级并回归分组与排序 |
| `qrcode` | 1.5.3 | 1.5.4 | 小版本升级并验证二维码保存 |

## 4. 分阶段实施

### 阶段 0：先建立保护网

1. 记录当前构建产物大小、PWA manifest 和 service worker 预缓存数量。
2. 增加 `vitest@4.1.10`、`@vue/test-utils@2.4.11`、`jsdom@29.1.1`。
3. 至少覆盖：计分加减/清零、分组排名升降序、持久化恢复、Excel 数据映射、路由守卫。
4. 增加 `test`、`test:run` 脚本；CI 顺序固定为 install → lint → test → build → audit。

### 阶段 1：运行时与代码质量工具

1. CI 升到 Node 24，pnpm 11.13.0；使用 `pnpm install --frozen-lockfile`。
2. 配置 `pnpm-workspace.yaml` 的 `allowBuilds`，只允许审计后确有需要的包运行脚本，禁止全局放开。pnpm 11 会默认拒绝未列出的安装脚本。[pnpm 配置](https://pnpm.io/settings#allowbuilds)
3. 迁移 ESLint flat config，将 `lint` 拆为只检查的 `eslint .` 和显式 `lint:fix`，避免 CI 修改源码。

### 阶段 2：框架与构建链

1. 先升级 Vue 3.5、Pinia 3、persistedstate 4、Router 5，运行存量测试并用旧版 localStorage 数据做 hydration 回归。
2. 再升级 Vite 8、Vue 插件、UnoCSS 与 unplugin；修改 Rolldown 配置并比较构建产物。
3. 如果产品必须支持 Safari 16.4 以前版本，显式设定 `build.target` 并单独验证；不要默认承诺 Vite 8 的 ES5 支持。

### 阶段 3：UI、PWA 与依赖瘦身

1. 升级 Vant/Iconify，移除无效的自动导入插件。
2. 迁移 Excel 导出后检查中文 sheet 名、单元格样式、排名、备注和多比赛分页；确认 ResultView chunk 明显下降。
3. 用能力检测替换 UAParser，内联必要 reset，并将 Radash 升级到 12.1.1。
4. 更新 PWA 后执行“两次发布”测试：旧 service worker 控制的页面能刷新到新版本，离线重开仍可用。

## 5. 验收与回滚

执行以下门禁：

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test:run
pnpm build
pnpm audit --prod
```

人工覆盖 Android Chrome、iOS Safari/PWA 和桌面 Chrome：开始页、安装提示、键盘开关、计分、记录、排序、删除、主题、全屏、二维码、Excel 导出及离线启动。升级分为至少 4 个独立提交；任一阶段失败，只回滚该阶段的 `package.json`、锁文件、配置和配套代码，不跨阶段混合修复。

完成标准：无 high/critical 生产漏洞、无未解释的 peer dependency/安装脚本警告、无构建大 chunk 警告（或有书面例外）、持久化数据兼容、PWA 更新链路正常。
