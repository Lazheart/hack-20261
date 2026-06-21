# EasyCommerce — Asistente de Transformación Digital para MYPES

## El Problema

Millones de pequeños comerciantes en el Perú operan mediante procesos manuales: registros en cuadernos, sin presencia online y sin pagos digitales. No saben por dónde empezar a digitalizarse ni qué herramientas usar.

EasyCommerce resuelve esto generando automáticamente un diagnóstico personalizado, recomendaciones de herramientas digitales y un roadmap semana a semana para cada negocio usando Inteligencia Artificial.

## Casos de Uso

- Consultoras que asesoran carteras de MYPES
- Municipalidades que quieren digitalizar comercios locales
- Bancos y fintechs que evalúan clientes para créditos digitales

## Impacto Esperado

- Reducir de días a minutos el tiempo de análisis por negocio
- Democratizar el acceso a consultoría de transformación digital
- Generar planes accionables y personalizados sin costo

## URL del Frontend Desplegado
http://easycommerce-frontend-dev.s3-website-us-east-1.amazonaws.com

## Stack Tecnológico

- **Frontend:** React + Vite + TypeScript + Lucide React
- **Backend:** Python 3.11 + AWS Lambda
- **Base de Datos:** AWS DynamoDB
- **Eventos:** AWS EventBridge
- **IA:** Groq API (LLaMA 3)
- **IaC:** Serverless Framework v3
- **Almacenamiento:** AWS S3

## Arquitectura
Frontend (React/S3)

↓

API Gateway

↓

Lambda: create_business

↓

AWS EventBridge (business.created)

↓

Lambda: generate_recommendation → Groq API (con reintentos automáticos)

↓

AWS DynamoDB

↓

Lambda: generate_report

## Manual de Despliegue

### Requisitos

- Node.js 18+
- Python 3.11+
- AWS CLI configurado
- Serverless Framework v3
- pnpm
- Cuenta en Groq (console.groq.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Lazheart/hack-20261.git
cd hack-20261
```

### 2. Configurar el Backend

```bash
cd backend
cp .env.example .env
```

Editar `.env`:
ID_AWS=tu_account_id

ORG_NAME=tu_org_serverless

API_KEY_LLM=tu_groq_api_key

JWT_SECRET=tu_secret

USERS_TABLE=Users-dev

BUSINESSES_TABLE=Businesses-dev

REPORTS_TABLE=Reports-dev

EVENT_BUS_NAME=EasyCommerceEventBus-dev

REPORTS_BUCKET=easycommerce-reports-dev-TU_ACCOUNT_ID

### 3. Desplegar el Backend

```bash
npm install
serverless deploy --stage dev
```

### 4. Configurar el Frontend

```bash
cd ../frontend
cp .env.example .env
```

Editar `.env`: 
VITE_API_URL=https://TU_API_ID.execute-api.us-east-1.amazonaws.com/dev

### 5. Desplegar el Frontend

```bash
pnpm install
pnpm build
aws s3 mb s3://easycommerce-frontend-dev
aws s3api put-public-access-block --bucket easycommerce-frontend-dev --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
aws s3 website s3://easycommerce-frontend-dev --index-document index.html --error-document index.html
aws s3 sync dist s3://easycommerce-frontend-dev --delete
```

### 6. Abrir en el browser
http://easycommerce-frontend-dev.s3-website-us-east-1.amazonaws.com

## Formato del CSV

```csv
nombre,rubro,direccion,tiene_redes,acepta_pagos_digitales,inventario_digital
Bodega Don Carlos,abarrotes,Av. Universitaria 234 Ate,no,no,no
Pollería El Gordo,restaurante,Jr. Lima 45 Miraflores,facebook,yape,no
Salón Belinda,peluquería,Av. Túpac 89 SJL,instagram,no,no
```

## Equipo

- Lazheart
- LeaDem-27
- C4trey