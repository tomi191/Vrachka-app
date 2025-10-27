#!/bin/bash

# Test Blog Image Generation API
# This script tests the /api/blog/generate-images endpoint

echo "🚀 Testing Blog Image Generation API..."
echo ""

# Check if server is running
echo "📡 Checking if dev server is running on http://localhost:3000..."
curl -s http://localhost:3000 > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Dev server is not running!"
  echo "   Please start it with: npm run dev"
  exit 1
fi

echo "✅ Server is running"
echo ""

# Make API request (Note: Requires authentication token)
echo "🖼️  Generating test image..."
echo ""
echo "⚠️  Note: This endpoint requires admin authentication."
echo "   You need to:"
echo "   1. Log in as admin in the browser"
echo "   2. Open browser DevTools → Network tab"
echo "   3. Copy the 'Authorization' header from any API request"
echo "   4. Set it as AUTH_TOKEN environment variable"
echo ""

if [ -z "$AUTH_TOKEN" ]; then
  echo "❌ AUTH_TOKEN is not set!"
  echo "   Please set it with: export AUTH_TOKEN='Bearer sb-xxx...'"
  exit 1
fi

echo "Sending request..."
curl -X POST http://localhost:3000/api/blog/generate-images \
  -H "Content-Type: application/json" \
  -H "Authorization: $AUTH_TOKEN" \
  -d '{
    "prompts": ["A mystical Bulgarian scene with zodiac symbols in a starry night sky"],
    "aspectRatio": "16:9",
    "style": "mystical, professional, Bulgarian cultural elements"
  }' \
  | json_pp

echo ""
echo "✨ Test complete!"
echo ""
echo "Check:"
echo "  1. Supabase Storage → blog-images bucket for uploaded image"
echo "  2. Database table 'blog_images' for metadata record"
