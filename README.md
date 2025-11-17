# K6 本地負載測試環境

使用 K6 + InfluxDB + Grafana 建立本地負載測試環境，針對線上訂位系統進行壓力測試。

## 功能特色

- 自動生成 K6 測試腳本
- InfluxDB 儲存測試結果
- Grafana 視覺化監控面板
- 支援多店鋪、多端點、多時間範圍測試

## 系統需求

- Docker Desktop
- Node.js (用於生成測試腳本)
- K6 (負載測試工具)

## 快速開始

### 1. 啟動監控環境

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

啟動後可訪問:
- Grafana: http://localhost:3000 (帳號/密碼: admin/admin)
- InfluxDB: http://localhost:8086

### 2. 生成測試腳本

```bash
node generate-k6.js
```

這會生成 `load-test.js` 檔案，包含以下測試組合:
- **店鋪**: CA01, CA02, CA03, CA04 (4個)
- **日期範圍**: 3組不同的日期區間
- **端點**: inventory, status, reserve (3個)
- **總組合**: 4 × 3 × 3 = 36 種測試場景

### 3. 執行負載測試

```bash
k6 run --out influxdb=http://localhost:8086/k6 load-test.js
```

## 測試配置

當前配置 (`generate-k6.js`):
- **執行器**: constant-arrival-rate (固定到達率)
- **速率**: 200 requests/秒
- **持續時間**: 30 秒
- **預分配 VU**: 50
- **最大 VU**: 500

## 測試端點

測試以下 API 端點:
- `/online-reservation/inventory/{store}` - 查詢庫存
- `/online-reservation/status/{store}` - 查詢狀態
- `/online-reservation/reserve/{store}` - 預訂

## 自訂監控指標

- `custom_errors` - 錯誤計數
- `custom_success` - 成功計數
- `custom_response_time` - 回應時間趨勢

## 停止環境

**Windows:**
```bash
stop.bat
```

**Linux/Mac:**
```bash
docker-compose down
```

## 目錄結構

```
.
├── docker-compose.yml      # Docker 服務配置
├── generate-k6.js          # 測試腳本生成器
├── load-test.js           # 生成的 K6 測試腳本 (自動生成)
├── start.bat              # Windows 啟動腳本
├── start.sh               # Linux/Mac 啟動腳本
├── stop.bat               # Windows 停止腳本
├── grafana/               # Grafana 資料目錄 (自動生成)
└── influxdb/              # InfluxDB 資料目錄 (自動生成)
```

## Grafana 面板設定

1. 登入 Grafana (admin/admin)
2. 新增資料來源:
   - Type: InfluxDB
   - URL: http://influxdb:8086
   - Database: k6
3. 匯入 K6 Dashboard 或自訂查詢

## 注意事項

- 首次執行會下載 Docker 映像，需要一些時間
- 確保 3000 和 8086 埠未被占用
- 測試前請確認目標 API 的負載承受能力
- 生產環境測試請事先取得授權

## 故障排除

**Docker 容器無法啟動:**
```bash
docker-compose down
docker-compose up -d
```

**埠被占用:**
修改 `docker-compose.yml` 中的埠映射

**K6 無法連接 InfluxDB:**
檢查 InfluxDB 是否正常運行:
```bash
docker ps
docker logs k6-influxdb
```
