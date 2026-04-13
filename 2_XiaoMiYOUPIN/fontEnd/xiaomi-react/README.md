一个由static演变而来的有品商城React SPA版本

> 重构前后指标对比：
>
> - 代码总行数减少70% by scc
> - 代码重复率4.82% -> 3.33% by jscpd

React + TypeScript + Vite

基础设施：Pnpm + Eslint + Prettier

路由：React Router v6

数据请求：TanStack Query + fetch

全局状态管理：Zustand

样式：
组件 Ant Design
隔离 CSS Module + ClassName + Ant Design Token

鉴权：Cookie Token
流程：客户端post login - 服务端验证，通过后设置Header Cookie并返回 - 客户端收到Cookie(Cookies.set('token') -> Header)，后续需要鉴权的接口，请求头Header携带Cookie(Cookies.get('token') -> header Authorization)
Token策略：服务端设置过期时间，过期返回401，客户端重新登录

亮点：

- 自封装Hook useQueryStatus，对Tanstack Query useQuery返回结果进行loading/error/empty状态的封装。减少不必要的模板代码，UI逻辑更集中、清晰。
- 服务端请求数据分层清晰，由基础设施到应用层：fetchInstance-api/index-service-UI。请求业务分离，提高接口复用度。
- 自封装路由守卫，统一处理登录鉴权逻辑；HOC包裹<Login />，许可协议与登录逻辑关注点分离，增强代码健壮性。
- 自封装ErrorBoudnary，UI & 路由共同复用，最大程度避免意外UI，保障用户体验。
- 商品列表懒加载 react-infinite-scroll-component。

```javascript
// start cmd (at least: chrome 87 / edge 87)
// backEnd:
node index.js

// frontEnd:
pnpm i
pnpm run dev
// format
npx prettier --write 'src/**/*.{ts,tsx}'
```

TODO:

1. feature: 登录密码密文
2. feature: 刷新维持登录
3. feature: Typescript类型优化
