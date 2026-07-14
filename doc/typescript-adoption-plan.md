# TypeScript 渐进式引入方案

> 方案日期：2026-07-14。本文仅定义实施范围与验收标准，不包含代码改动。实施时继续遵守项目的 7 天依赖冷静期，只选择满足 peer dependency 的正式稳定版。

## 目标与原则

为现有 Vue 3 项目建立静态类型检查，在不改变运行行为、持久化数据和部署方式的前提下，优先保护计分、比赛记录、设置、导出和 PWA 等核心契约。

本次采用小批次迁移，而不是一次性重写：每阶段都必须独立通过 lint、类型检查、测试和构建。项目由单人维护，因此不新增 PR 门禁、分支保护或 E2E 基础设施；只把 `typecheck` 加入现有本地命令和部署检查。

## 当前基线与主要风险

- `src/` 目前全部使用 JavaScript，Vue SFC 采用 `<script setup>`，尚无 `tsconfig` 和 `vue-tsc`。
- Pinia state 依赖字面量推断，`Audio | null`、PWA 安装事件和持久化记录数组无法获得可靠类型。
- `headerBar.vue`、`resultTable.vue` 使用无类型的数组式 props/emits，事件载荷错误无法在编译期发现。
- 定时器、`navigator.userAgentData`、`beforeinstallprompt`、Workbox manifest 和自定义 `longpress` 指令涉及浏览器扩展类型。
- 已存在可被类型检查发现的问题，例如 `sessionStorage.setItem('isRegUser', true)` 应传入字符串。
- Excel 导出的 sheet、cell、formatter 结构复杂，是最需要明确输入输出契约的工具模块。

## 依赖与配置方案

实施时增加以下直接开发依赖，避免依赖传递安装的 TypeScript：

```bash
pnpm add -D typescript vue-tsc @vue/tsconfig typescript-eslint @types/qrcode
```

如 Node 侧配置文件进入类型检查，再显式增加 `@types/node`；不提前安装未使用依赖。新增配置建议如下：

- `tsconfig.json`：项目入口及配置引用。
- `tsconfig.app.json`：继承 `@vue/tsconfig`，启用 `strict`、`noEmit`、`moduleResolution: "Bundler"`，包含 `src/**/*.ts`、`src/**/*.vue`。
- `tsconfig.node.json`：仅在迁移 Vite/Vitest/UnoCSS 配置时启用。
- `src/env.d.ts`：加载 `vite/client`、PWA 客户端类型及项目声明。
- `src/types/domain.ts`：集中定义 `GameRecord`、`SettingForm`、`ScoreMode`、排序方向和按钮顺序等领域类型。
- `src/types/pwa.d.ts`：补充 `BeforeInstallPromptEvent` 和 `NavigatorUAData` 的最小声明，不扩大成通用浏览器类型包。

在 `package.json` 增加：

```json
{
  "scripts": {
    "typecheck": "vue-tsc --noEmit -p tsconfig.app.json"
  }
}
```

ESLint 接入 `typescript-eslint` 和 Vue 的 TypeScript parser。迁移期启用 recommended 规则，但不以 `no-explicit-any` 阻塞首轮；核心领域类型不得使用 `any`，边界处优先使用 `unknown` 并做类型收窄。

## 分阶段实施

### 阶段 1：建立类型检查基线

1. 安装依赖并新增 TypeScript、Vue 和 ESLint 配置。
2. 创建领域类型和浏览器扩展声明。
3. 保留现有 JavaScript 运行入口，先确保 `pnpm typecheck` 能稳定执行。
4. 在现有 `.github/workflows/deploy.yaml` 的测试之后增加类型检查，不改变 workflow 触发方式或部署结构。

验收：配置无 peer dependency 问题；一个故意错误的组件 prop 或函数参数能被 `vue-tsc` 拒绝，删除该错误后全量检查通过。

### 阶段 2：迁移纯工具与领域模型

按 `platform.js` → `methodForPress.js` → `exportToXlsx.js` 的顺序迁移为 `.ts`，同步迁移对应测试。

- 平台检测使用明确的输入和返回联合类型。
- 长按指令使用 `Directive<HTMLElement, LongPressOptions>`，在卸载时完整清理事件类型和计时器。
- Excel 模块为记录、formatter、sheet 和 cell 建模；第三方库缺失信息时只在适配层收窄，不向业务层传播 `any`。

验收：现有 Excel Blob、平台检测测试保持通过；生成文件内容和接口不变。

### 阶段 3：迁移 Pinia 与路由

迁移四个 store、router、routes 和相关测试，优先复用 `domain.ts`。

- 显式定义 `GameRecord`、设置表单、store state 和 action 参数。
- `keyDownAudio` 使用 `HTMLAudioElement | null`；计分动作限制为明确的加减模式。
- `deferredPrompt` 使用项目声明的安装事件联合类型。
- 路由数组使用 Vue Router 提供的类型，route name 保持现有字符串，不改变守卫逻辑。
- 严禁修改 Pinia store ID、持久化字段名、字段取值及默认值；历史 `localStorage` 数据必须继续恢复。

验收：计分、排序、路由和持久化测试全部通过；用现有持久化样本验证兼容性。

### 阶段 4：迁移 Vue 组件

从叶子组件向页面迁移：`headerBar.vue`、`resultTable.vue` → `App.vue` → 各 route view。脚本改为 `<script setup lang="ts">`，不在本阶段拆组件或调整 UI。

- 使用类型式 `defineProps`、`defineEmits`，明确主题、记录、删除和提示事件载荷。
- 使用 `ref<number | null>` 管理浏览器定时器，事件处理器声明为 `KeyboardEvent`、`BeforeInstallPromptEvent` 等具体类型。
- 保持 props down / events up；不通过类型迁移引入新的共享状态或双向绑定。
- 修正类型检查暴露出的真实错误，但行为性修复必须单独说明并补测试，不能用断言掩盖。

验收：所有 SFC 均由 `vue-tsc` 检查；页面模板无类型错误；现有视觉和交互保持不变。

### 阶段 5：收口与长期规则

1. 将剩余 `src/**/*.js` 和 `*.spec.js` 迁移完成后，关闭应用源码的 `allowJs`，防止回退。
2. 配置文件可继续保留 `.js`；只有能带来实际类型收益时才迁移为 `.ts`。
3. 更新 `AGENTS.md`：新源码默认 TypeScript，Vue 组件默认 `<script setup lang="ts">`，提交前必须运行 `pnpm typecheck`。
4. 每个阶段单独提交，建议提交信息为 `build: add typescript toolchain`、`refactor(utils): add type contracts`、`refactor(stores): migrate stores to typescript`、`refactor(ui): type vue components`。

## 明确不做的事项

- 不借机改写 Pinia Options Store 为 Setup Store。
- 不拆分页面、调整命名风格、格式化全仓库或重做 CSS。
- 不修改持久化 schema、计分规则、排序规则和 Excel 展示格式。
- 不使用全局 `@ts-ignore`、降低 `strict` 或批量 `as any` 来制造“零错误”。确需豁免时必须缩小到单行，写明第三方限制和移除条件。
- 不新增分支保护、PR 工作流或浏览器 E2E。

## 风险与回滚

| 风险 | 控制方式 |
| --- | --- |
| 第三方库类型与实际 API 不一致 | 在单独适配层收窄，并用现有运行测试验证 |
| Pinia 推断变化影响持久化数据 | 保持 store ID/schema，继续执行 hydration 测试 |
| DOM 与 Service Worker lib 冲突 | 为 service worker 使用独立类型上下文，不全局混入 WebWorker 类型 |
| 一次改动过大难以 review | 严格按五阶段提交；任一阶段可独立回滚 |
| 类型修复意外改变行为 | 禁止无关重构；每次迁移前后执行同一组测试和构建 |

## 完成标准

每个阶段执行：

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
pnpm audit --prod --audit-level high
```

最终应满足：应用源码和 Vue 模板在 strict 模式下无类型错误；`src/` 不再新增 JavaScript；9 个既有测试全部通过；生产构建和 PWA 产物正常；Pinia 历史数据、Excel 导出及核心计分流程行为不变。完成自动检查后，再按现有人工清单验证开始比赛、计分、记录、结果、设置、导出和 PWA 离线启动。
