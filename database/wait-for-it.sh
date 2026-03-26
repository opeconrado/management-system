#!/bin/bash
# Script para aguardar a disponibilidade do banco de dados
# Usado no docker-compose para garantir que o banco está pronto antes de usar

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Postgres não está disponível em $host:$port - aguardando..."
  sleep 1
done

>&2 echo "Postgres está disponível - iniciando aplicação"
exec $cmd
