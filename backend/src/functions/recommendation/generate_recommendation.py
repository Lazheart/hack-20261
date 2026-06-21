import json
from src.services.recommendation.groq_client import GroqClient
from src.services.recommendation.prompts import build_analysis_prompt
 
def generate(business_data) -> dict:
    client = GroqClient()
    prompt = build_analysis_prompt(business_data)
    
    messages = [
        {"role": "system", "content": "You are a highly capable digital transformation consultant. You strictly output JSON."},
        {"role": "user", "content": prompt}
    ]
    
    response_content = client.chat_completion(messages)
    
    try:
        data = json.loads(response_content)
        required = ['digitalMaturityScore', 'recommendations', 'priorityActions']
        for req in required:
            if req not in data:
                raise ValueError(f"Missing {req} in LLM response")
        return data
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON decode error from Groq response: {e}")
        raise
        
        report_data = {
            'reportId': report_id,
            'businessId': detail['businessId'],
            'userId': detail['userId'],
            'recommendations': recommendation['recommendations'],
            'digitalMaturityScore': recommendation['digitalMaturityScore'],
            'priorityActions': recommendation['priorityActions'],
            'generatedAt': now,
            'version': 1,
            'full_analysis': recommendation
        }
        
        db.put_item(table, report_data)
        publish_recommendation_generated(report_data)
        
        print(f"[INFO] Recommendation generated for business {detail['businessId']}")
        
    except Exception as e:
        print(f"[ERROR] generate_recommendation: {e}")
        raise
