def get_business_analysis_prompt(business: dict) -> str:
    return f"""
Eres un consultor experto en transformacion digital para pequenas y medianas empresas (MYPES) en Peru.

Analiza el siguiente negocio y genera un reporte completo en formato JSON.

DATOS DEL NEGOCIO:
- Nombre: {business.get('nombre', 'No especificado')}
- Rubro: {business.get('rubro', 'No especificado')}
- Direccion: {business.get('direccion', 'No especificado')}
- Tiene redes sociales: {business.get('tiene_redes', 'No')}
- Acepta pagos digitales: {business.get('acepta_pagos_digitales', 'No')}
- Lleva inventario digital: {business.get('inventario_digital', 'No')}
- Descripcion adicional: {business.get('descripcion', 'Ninguna')}

Responde unicamente con un JSON valido con esta estructura exacta, sin texto adicional:

{{
    "diagnostico": {{
        "nivel_digitalizacion": "MUY BAJO | BAJO | MEDIO | ALTO",
        "score": 0,
        "problemas_encontrados": ["problema1", "problema2"]
    }},
    "recomendaciones": {{
        "pagos_digitales": ["herramienta1", "herramienta2"],
        "redes_sociales": ["red1", "red2"],
        "inventario": ["herramienta1"],
        "presencia_online": ["herramienta1"]
    }},
    "roadmap": [
        {{
            "semana": 1,
            "tarea": "nombre de la tarea",
            "pasos": ["paso1", "paso2", "paso3"],
            "costo": "Gratis | S/. XX"
        }}
    ],
    "resumen": "Un parrafo corto explicando la situacion del negocio y el impacto esperado"
}}
"""