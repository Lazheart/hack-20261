# Manual de Despliegue: Backend Serverless de EasyCommerce

Este documento detalla los pasos necesarios para desplegar la infraestructura backend de EasyCommerce en Amazon Web Services (AWS) utilizando Serverless Framework.

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- **Node.js y npm:** Necesarios para ejecutar Serverless Framework.
- **Python 3.9+:** El lenguaje base de nuestras funciones Lambda.
- **AWS CLI:** Configurado con credenciales que tengan permisos de Administrador (`AdministratorAccess` recomendado para el despliegue inicial).
- **Cuenta en Groq Cloud:** Para obtener la clave de la API del LLM (`API_KEY_LLM`).

### 1.1 Configuración de Credenciales AWS

Asegúrate de que tu terminal tenga acceso a AWS. Ejecuta:

```bash
aws configure
```

> Ingresa tu Access Key, Secret Key, y define la región (por ejemplo: `us-east-1`).

---

## 2. Preparación del Entorno

### 2.1 Instalar Serverless Framework

Instala la herramienta de manera global en tu sistema:

```bash
npm install -g serverless
```

### 2.2 Instalar Plugins de Serverless

El proyecto utiliza dependencias de Python (como `bcrypt`, `PyJWT` y `requests`). Necesitamos un plugin para empaquetarlas automáticamente durante el despliegue. En la raíz del proyecto, ejecuta:

```bash
npm init -y
npm install --save-dev serverless-python-requirements
```

### 2.3 Definir Dependencias de Python

Asegúrate de tener un archivo `requirements.txt` en la raíz del proyecto con el siguiente contenido:

```
boto3==1.34.0
bcrypt==4.1.2
PyJWT==2.8.0
requests==2.31.0
```

---

## 3. Configuración de Variables de Entorno

El sistema requiere variables de entorno para funcionar correctamente. Crea un archivo `.env` en la raíz del proyecto (Serverless Framework lo leerá si usas el plugin `serverless-dotenv-plugin`, o puedes definirlas en tu sistema antes de desplegar).

**Ejemplo de configuración:**

```bash
# Seguridad
JWT_SECRET=tu_super_secreto_aleatorio_aqui

# Integración con IA
API_KEY_LLM=gsk_tu_clave_de_groq_aqui

# Nombres de Recursos AWS (Sugeridos)
USERS_TABLE=EasyCommerce-Users-dev
BUSINESSES_TABLE=EasyCommerce-Businesses-dev
REPORTS_TABLE=EasyCommerce-Reports-dev
REPORTS_BUCKET=easycommerce-reports-bucket-unico-dev
EVENT_BUS_NAME=easycommerce-event-bus-dev
```

> **Nota:** El nombre del bucket S3 (`REPORTS_BUCKET`) debe ser globalmente único en todo AWS.

---

## 4. Estructura Requerida de AWS SES (Correos)

Para que el registro y recuperación de contraseñas funcionen, Amazon SES requiere que el correo remitente esté verificado.

1. Ve a la consola de AWS > **Amazon SES**.
2. En **Identities**, haz clic en **"Create identity"**.
3. Verifica el correo que usarás como origen (ej. `noreply@easycommerce.app` o tu correo personal de prueba).

> **Importante:** Si tu cuenta de AWS está en el "Sandbox" de SES, también deberás verificar los correos de los destinatarios a los que planeas enviarles pruebas.

---

## 5. Ejecución del Despliegue

Con las dependencias listas y las variables configuradas, sitúate en la raíz del proyecto (donde se encuentra tu `serverless.yml`) y ejecuta:

```bash
serverless deploy --verbose
```

**¿Qué hace este comando?**

- Empaqueta el código Python y resuelve las librerías del `requirements.txt`.
- Crea un stack en AWS CloudFormation.
- Despliega las tablas de DynamoDB, el bus de EventBridge, el bucket de S3 y los roles IAM necesarios.
- Sube las funciones Lambda y configura las rutas en API Gateway.

---

## 6. Pruebas Post-Despliegue

Al finalizar, la terminal te devolverá una lista de endpoints (URLs).

### Paso 1: Probar el Registro

Haz un `POST` al endpoint de `/register` usando `curl` o Postman:

```bash
curl -X POST https://tu-api-id.execute-api.us-east-1.amazonaws.com/dev/register \
-H "Content-Type: application/json" \
-d '{"email": "prueba@test.com", "password": "mipassword123", "name": "Usuario Tester"}'
```

### Paso 2: Obtener el Token (Login)

```bash
curl -X POST https://tu-api-id.execute-api.us-east-1.amazonaws.com/dev/login \
-H "Content-Type: application/json" \
-d '{"email": "prueba@test.com", "password": "mipassword123"}'
```

> Guarda el token devuelto. Lo usarás en la cabecera `Authorization: Bearer <token>` para probar las rutas de `/business` y generar el flujo de EventBridge.

---

## 7. Limpieza de Recursos (Destruir entorno)

Si terminaste de probar la aplicación y quieres evitar cobros adicionales en AWS, puedes eliminar toda la infraestructura de manera segura ejecutando:

```bash
serverless remove
```

> **Advertencia:** Esto borrará de forma irreversible las tablas de DynamoDB y las Lambdas. Si tu bucket de S3 tiene archivos adentro, Serverless fallará al borrarlo; debes vaciar el bucket manualmente desde la consola de AWS antes de ejecutar el comando de remoción.