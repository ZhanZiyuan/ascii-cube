<p align="center">
    <img alt="logo" src="./src/app/icon.svg"
        width="138" />
</p>

# ASCII Cube

<p align="right">
    <a href="./README.md">English</a> | <b>简体中文</b>
</p>

[![GitHub deployments](https://img.shields.io/github/deployments/ZhanZiyuan/ascii-cube/Production)](https://github.com/ZhanZiyuan/ascii-cube/deployments)
[![GitHub last commit](https://img.shields.io/github/last-commit/ZhanZiyuan/ascii-cube)](https://github.com/ZhanZiyuan/ascii-cube/commits/main/)
[![GitHub License](https://img.shields.io/github/license/ZhanZiyuan/ascii-cube)](https://github.com/ZhanZiyuan/ascii-cube/blob/main/LICENSE)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/ZhanZiyuan/ascii-cube/total)](https://github.com/ZhanZiyuan/ascii-cube/releases)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/asciicube)](https://asciicube.vercel.app/)

一个基于 [Next.js](https://nextjs.org/)、[Three.js](https://threejs.org/) 和 [shadcn/ui](https://ui.shadcn.com/) 构建的交互式3D ASCII立方体应用。[GitHub Shop](https://thegithubshop.com/) 上的ASCII立方体的开源实现。

## 功能特性

- **3D ASCII 渲染**：使用Three.js的`AsciiEffect`将3D立方体渲染为ASCII字符。
- **交互控制**：
  - **旋转**：使用鼠标/手指拖动，或使用键盘方向键。
  - **缩放**：使用鼠标滚轮进行缩放。
  - **自动旋转**：通过播放/暂停按钮控制自动旋转。
- **现代 UI**：使用Tailwind CSS和shadcn/ui组件库打造。
- **响应式设计**：适配各种屏幕尺寸。

## 技术栈

- **框架**：[Next.js 15](https://nextjs.org/)
- **样式**：[Tailwind CSS](https://tailwindcss.com/)
- **3D 库**：[Three.js](https://threejs.org/)
- **UI 组件**：[shadcn/ui](https://ui.shadcn.com/)
- **图标**：[Lucide React](https://lucide.dev/)

## 开始使用

- **克隆仓库:**

    ```bash
    git clone https://github.com/ZhanZiyuan/ascii-cube.git
    cd ascii-cube
    ```

- **安装依赖:**

    ```bash
    npm install
    ```

- **启动开发服务器:**

    ```bash
    npm run dev
    ```

- 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 许可证

本项目基于 GPLv3 许可证 - 详情请参阅 [LICENSE](./LICENSE) 文件。
