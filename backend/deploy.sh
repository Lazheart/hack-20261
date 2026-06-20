#!/usr/bin/env bash

set -euo pipefail
sudo npm install -g serverless@3
echo "========================================"
echo " Verificación previa al despliegue"
echo "========================================"

if [[ ! -f ".env" ]]; then
echo "ERROR: No se encontró el archivo .env"
exit 1
fi

# Cargar variables de entorno

set -a
source .env
set +a

# Validar variables requeridas

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

# Verificar herramientas necesarias

for cmd in aws serverless; do
if ! command -v "$cmd" >/dev/null 2>&1; then
echo "ERROR: '$cmd' no está instalado o no está en el PATH"
exit 1
fi
done

# Verificar credenciales AWS

if [[ ! -f "$HOME/.aws/credentials" ]]; then
echo "ERROR: No se encontraron credenciales AWS en $HOME/.aws/credentials"
exit 1
fi

# Validar acceso AWS

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

# Limpiar frontend si existe

if [[ -d "frontend" ]]; then
echo "Eliminando directorio frontend..."
rm -rf frontend
fi

# Selección de stage

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
