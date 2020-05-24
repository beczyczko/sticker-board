#!/bin/bash
cd "$(dirname "$0")"
cd ..
docker build -t sticker-board/frontend:local .