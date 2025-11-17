#!/bin/bash
echo "Starting k6 local dashboard (Grafana + InfluxDB)..."

docker-compose up -d

echo ""
echo "========================================="
echo "Grafana  → http://localhost:3000 (admin/admin)"
echo "InfluxDB → http://localhost:8086"
echo "========================================="
echo ""
