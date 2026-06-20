import os
from groq import Groq

def get_groq_client():
    api_key = os.environ.get('API_KEY_LLM')
    if not api_key:
        raise ValueError("API_KEY_LLM no está configurada")
    return Groq(api_key=api_key)

def call_groq(prompt: str) -> str:
    client = get_groq_client()
    
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=2000
    )
    
    return response.choices[0].message.content