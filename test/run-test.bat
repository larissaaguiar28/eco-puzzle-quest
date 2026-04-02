@echo off
npm install @testing-library/user-event
npx vitest run teste/Login.test.tsx > test-output-3.txt 2>&1
