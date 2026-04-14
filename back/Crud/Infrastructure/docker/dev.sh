#!/bin/bash

# Script para desenvolvimento local com hot-reload

docker compose down

docker compose up \
  --build \
  -d \
  --watch