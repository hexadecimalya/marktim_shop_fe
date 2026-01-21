#!/bin/bash
set -e

#URL="https://staging.marktim.shop/api/health"
URL="$1"
MAX_RETRIES=3
SLEEP=3

if [ -z "$URL" ]; then
    echo "❌ No URL provided" 
    exit 1 
fi

echo "Running smoke tests against $URL"
sleep 15

for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf "$URL" > /dev/null; then
    echo "✅ App is ready"
    exit 0
  fi

  echo "⏳ Not ready yet ($i/$MAX_RETRIES)..."
  sleep $SLEEP
done

echo "❌ Smoke tests FAILED"
exit 1
