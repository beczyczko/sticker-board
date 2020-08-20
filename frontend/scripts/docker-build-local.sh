#!/bin/bash
cd "$(dirname "$0")"
cd ..
docker build -t sb/frontend:local .