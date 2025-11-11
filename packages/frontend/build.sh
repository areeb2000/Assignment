#!/bin/bash
# Vercel Build Script
echo "Building Angular application..."
npm ci
npm run build
echo "Build completed successfully!"
ls -la dist/