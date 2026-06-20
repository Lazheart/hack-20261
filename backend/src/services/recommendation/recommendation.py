import json
from src.services.recommendation.groq_client import call_groq
from src.services.recommendation.prompts import get_business_analysis_prompt

def analyze_business(business: dict) -> dict:
    prompt = get_business_analysis_prompt(business)
    
    try:
        response = call_groq(prompt)
        
        # Limpia las respuestas por si Groq agrega texto extra de mas
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        if response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]
        
        result = json.loads(response.strip())
        return result
        
    except json.JSONDecodeError as e:
        return {
            "error": f"Error parseando respuesta de Groq: {str(e)}",
            "raw_response": response
        }
    except Exception as e:
        raise Exception(f"Error llamando a Groq: {str(e)}")