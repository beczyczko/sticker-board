#!/bin/bash
cd "$(dirname "$0")"
cd ..
docker build -f Dockerfile.prod -t sb/api:prod .