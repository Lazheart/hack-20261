#!/usr/bin/env bash

set -euo pipefail

echo "========================================"
echo " Verificación previa al despliegue"
echo "========================================"

# instalar serverless SOLO si no existe
if ! command -v serverless >/dev/null 2>&1; then
  echo "Serverless no encontrado, instalando..."
  sudo npm install -g serverless@3
fi

# instalar dependencias npm SOLO si no existe node_modules
if [[ ! -d "node_modules" ]]; then
  echo "node_modules no existe, instalando dependencias npm..."
  npm install
fi

# verificar .env
if [[ ! -f ".env" ]]; then
  echo "ERROR: No se encontró el archivo .env"
  exit 1
fi

# cargar variables de entorno
set -a
source .env
set +a

# validar variables requeridas
required_vars=(
  ID_AWS
  ORG_NAME
  API_KEY_LLM
)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: Falta la variable $var en .env"
    exit 1
  fi
done

# verificar AWS CLI
if ! command -v aws >/dev/null 2>&1; then
  echo "ERROR: aws no está instalado"
  exit 1
fi

# verificar credenciales AWS
if [[ ! -f "$HOME/.aws/credentials" ]]; then
  echo "ERROR: No se encontraron credenciales AWS en $HOME/.aws/credentials"
  exit 1
fi

# validar acceso AWS
if ! aws sts get-caller-identity >/dev/null 2>&1; then
  echo "ERROR: Las credenciales AWS no son válidas o expiraron"
  exit 1
fi

echo
echo "Configuración detectada:"
echo "  ID_AWS   : $ID_AWS"
echo "  ORG_NAME : $ORG_NAME"
echo "  AWS      : OK"
echo

read -r -p "¿Deseas continuar? (y/n): " confirm

case "$confirm" in
  y|Y|yes|YES)
    ;;
  *)
    echo "Despliegue cancelado."
    exit 0
    ;;
esac

# limpiar frontend si existe
if [[ -d "frontend" ]]; then
  echo "Eliminando directorio frontend..."
  rm -rf frontend
fi

# seleccionar stage
read -r -p "Seleccione la fase de despliegue (dev/prod): " stage

case "$stage" in
  dev|prod)
    ;;
  *)
    echo "ERROR: Stage inválido. Debe ser 'dev' o 'prod'."
    exit 1
    ;;
esac

echo "Iniciando despliegue en stage: $stage"
echo

serverless deploy --stage "$stage"

echo
echo "Despliegue completado correctamente."