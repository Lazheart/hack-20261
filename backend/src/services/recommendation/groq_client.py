import os
import json
import time
import requests
from requests.exceptions import RequestException

class GroqClient:
    def __init__(self):
        self.api_key = os.environ.get('GROQ_API_KEY')
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def chat_completion(self, messages, model="llama3-8b-8192", temperature=0.7):
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "response_format": {"type": "json_object"}
        }
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = requests.post(self.url, headers=self.headers, json=payload, timeout=30)
                if response.status_code == 429:
                    print(f"[WARN] Rate limit hit. Retrying in {2 ** attempt} seconds...")
                    time.sleep(2 ** attempt)
                    continue
                response.raise_for_status()
                return response.json()['choices'][0]['message']['content']
            except RequestException as e:
                print(f"[ERROR] Groq API error: {e}")
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)
