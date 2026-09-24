#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo " Ventlore Netlify Packaging Utility"
echo "=========================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "1. Building static export with STATIC_EXPORT=true..."
STATIC_EXPORT=true pnpm --filter @ventlore/web build

OUT_DIR="$ROOT_DIR/apps/web/out"
DIST_DIR="$ROOT_DIR/dist"

if [ ! -d "$OUT_DIR" ]; then
  echo "Error: Static export directory not found at $OUT_DIR"
  exit 1
fi

# Ensure _redirects is present in out dir
if [ ! -f "$OUT_DIR/_redirects" ]; then
  echo "Adding Netlify _redirects to out directory..."
  cat << 'EOF' > "$OUT_DIR/_redirects"
/ /explore 307
/* /index.html 200
EOF
fi

mkdir -p "$DIST_DIR"
ZIP_OUTPUT="$DIST_DIR/ventlore-netlify-drop.zip"
rm -f "$ZIP_OUTPUT"

echo "2. Compressing export artifacts into $ZIP_OUTPUT..."
(
  cd "$OUT_DIR"
  zip -r -q "$ZIP_OUTPUT" .
)

FILE_SIZE=$(ls -lh "$ZIP_OUTPUT" | awk '{print $5}')

echo "=========================================================="
echo " SUCCESS! Netlify Drop package created:"
echo " Archive: $ZIP_OUTPUT"
echo " Size:    $FILE_SIZE"
echo "=========================================================="
echo ""
echo "Hướng dẫn triển khai:"
echo "  Cách 1 (Kéo thả Netlify Drop - Khuyến nghị):"
echo "    - Mở trình duyệt truy cập: https://app.netlify.com/drop"
echo "    - Kéo và thả file '$ZIP_OUTPUT' (hoặc thư mục '$OUT_DIR') vào khung upload."
echo "    - Netlify sẽ cấp ngay một tên miền trực tiếp để xem và đánh giá UI."
echo ""
echo "  Cách 2 (Netlify CLI):"
echo "    - Cài đặt Netlify CLI nếu chưa có: npm i -g netlify-cli"
echo "    - Chạy: netlify deploy --dir=apps/web/out --prod"
echo ""
echo "  Cách 3 (Git CI/CD):"
echo "    - Đã cấu hình sẵn file netlify.toml ở thư mục gốc."
echo "    - Chỉ cần kết nối repo với Netlify và chọn ứng dụng."
echo "=========================================================="
