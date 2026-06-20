import json

def build_analysis_prompt(business_data) -> str:
    schema = {
        "digitalMaturityScore": 0,
        "maturityLevel": "Inicial|Básico|Intermedio|Avanzado",
        "summary": "...",
        "recommendations": [
            {
                "priority": 1,
                "title": "...",
                "description": "...",
                "cost": "bajo|medio|alto",
                "timeToImplement": "...",
                "tools": [],
                "freeApis": [],
                "expectedImpact": "..."
            }
        ],
        "quickWins": [],
        "priorityActions": []
    }
    
    prompt = f"""
Actúa como un consultor experto en transformación digital para MYPES. Analiza los siguientes datos de una empresa y genera un plan de digitalización.
Datos de la empresa:
{json.dumps(business_data, indent=2)}

Debes responder ÚNICAMENTE con un JSON válido que siga exactamente este esquema, no incluyas texto adicional ni markdown:
{json.dumps(schema, indent=2)}

Instrucciones:
1. Evalúa el nivel de madurez digital (0-100) basándote en su presencia digital y herramientas actuales.
2. Define el maturityLevel (Inicial, Básico, Intermedio, Avanzado).
3. Escribe un summary del estado actual.
4. Genera el top 5 de recommendations priorizadas por impacto/costo. Para cada una: title, description, cost (bajo/medio/alto), timeToImplement, herramientas sugeridas (tools), APIs gratuitas disponibles (freeApis) y expectedImpact.
5. Identifica quickWins (acciones inmediatas para los primeros 30 días).
6. Lista priorityActions como los siguientes pasos críticos.
"""
    return prompt
