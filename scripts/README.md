# 数据库初始化脚本

## 📋 概述

这个脚本用于初始化 Supabase 数据库，创建必要的表结构并插入模拟数据。

## 🚀 使用方法

### 前提条件

1. **配置环境变量**
   
   在项目根目录的 `.env.local` 文件中配置 Supabase 连接信息：
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **确保 Supabase 项目已创建**
   
   在 [Supabase](https://supabase.com) 创建项目并获取 URL 和 API Key。

### 运行脚本

#### 方法1：使用 npm 命令（推荐）

```bash
npm run setup-db
```

#### 方法2：直接运行 Node.js 脚本

```bash
node scripts/setup-database.js
```

#### 方法3：在 Supabase SQL 编辑器中执行

如果 Node.js 脚本遇到权限问题，可以直接在 Supabase 控制台的 SQL 编辑器中执行：

```bash
# 复制 SQL 文件内容到 Supabase SQL 编辑器
cat scripts/setup-database.sql
```

## 📊 脚本功能

### 1. 创建表结构

- 创建 `emoji_generations` 表
- 设置所有必要的字段和约束
- 创建性能优化索引

### 2. 配置安全策略

- 启用行级安全策略（RLS）
- 允许公开读取公共记录
- 允许插入新记录

### 3. 插入模拟数据

插入 8 条模拟记录，包括：

- **4种风格**：cute, funny, angry, happy
- **不同宠物类型**：cat, dog, rabbit, hamster
- **精选内容**：2条精选记录
- **测试数据**：2条测试记录（tokens_used = 0）

### 4. 数据验证

- 统计总记录数
- 统计精选记录数
- 统计测试记录数
- 按风格分组统计

## 📋 模拟数据详情

| 风格 | 宠物类型 | 精选 | Token消耗 | 说明 |
|------|----------|------|-----------|------|
| cute | cat | ✅ | 16384 | 精选可爱猫咪 |
| funny | dog | ❌ | 16384 | 搞笑狗狗 |
| angry | cat | ❌ | 16384 | 愤怒猫咪 |
| happy | dog | ✅ | 16384 | 精选开心狗狗 |
| cute | rabbit | ❌ | 16384 | 可爱兔子 |
| funny | hamster | ❌ | 16384 | 搞笑仓鼠 |
| cute | test-pet | ❌ | 0 | 测试数据 |
| happy | test-cat | ❌ | 0 | 测试数据 |

## 🔧 故障排除

### 权限错误

如果遇到权限错误，可能需要：

1. 检查 Supabase API Key 是否正确
2. 确认 Supabase 项目状态正常
3. 使用 Supabase 控制台的 SQL 编辑器手动执行

### 表已存在错误

脚本使用 `CREATE TABLE IF NOT EXISTS`，不会覆盖现有表。如需重新创建：

1. 在 Supabase 控制台删除现有表
2. 重新运行脚本

### 网络连接问题

确保网络连接正常，可以访问 Supabase 服务。

## 📝 输出示例

成功运行后的输出：

```
🚀 开始初始化数据库...
📋 创建 emoji_generations 表...
🔍 创建索引...
🔒 配置行级安全策略...
📝 插入模拟数据...
✅ 成功插入 8 条记录
🔍 验证数据...
📊 数据统计:
   总记录数: 8
   精选记录: 2
   测试记录: 2
   风格分布:
     cute: 3
     funny: 2
     angry: 1
     happy: 2
🎉 数据库初始化完成！
```

## 🎯 下一步

数据库初始化完成后：

1. 启动开发服务器：`npm run dev`
2. 访问 http://localhost:3000 查看效果
3. 测试表情包生成功能
4. 查看首页的表情包画廊展示