#!/bin/sh
set -e

# Aplica as migrations pendentes antes de subir a API. É idempotente:
# em execuções seguintes, se não há migration nova, apenas segue em frente.
echo "Aplicando migrations..."
npx prisma migrate deploy

echo "Iniciando API..."
exec node dist/server.js
