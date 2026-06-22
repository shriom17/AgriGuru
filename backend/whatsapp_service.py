import requests
import os
from dotenv import load_dotenv
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def send_whatsapp_alert(phone_number, message):
    """
    Send WhatsApp message via Meta WhatsApp Business API
    
    Args:
        phone_number (str): Phone number in international format (e.g., +91XXXXXXXXXX)
        message (str): Message content to send
        
    Returns:
        dict: API response as JSON
    """
    # Get credentials from environment variables
    phone_id = os.getenv('WHATSAPP_PHONE_ID')
    token = os.getenv('WHATSAPP_TOKEN')
    
    if not phone_id or not token:
        logger.error("WhatsApp API credentials not found in environment variables")
        return {"error": "WhatsApp API credentials not configured"}
    
    url = f"https://graph.facebook.com/v17.0/{phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Use template for WhatsApp Business API
    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "template",
        "template": {
            "name": "KisanMitra_alert",
            "language": {
                "code": "en_US"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": message
                        }
                    ]
                }
            ]
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        logger.info(f"WhatsApp alert sent to {phone_number}: {response_data}")
        return response_data
    except Exception as e:
        logger.error(f"Error sending WhatsApp alert: {str(e)}")
        return {"error": str(e)}

# Alternative implementation using Twilio (commented out)
"""
from twilio.rest import Client

def send_whatsapp_alert_twilio(phone_number, message):
    # Get Twilio credentials
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    twilio_number = os.getenv('TWILIO_WHATSAPP_NUMBER')
    
    if not account_sid or not auth_token or not twilio_number:
        logger.error("Twilio credentials not found in environment variables")
        return {"error": "Twilio credentials not configured"}
    
    try:
        client = Client(account_sid, auth_token)
        
        message = client.messages.create(
            body=message,
            from_=f"whatsapp:{twilio_number}",
            to=f"whatsapp:{phone_number}"
        )
        
        logger.info(f"Twilio WhatsApp message sent: {message.sid}")
        return {"sid": message.sid, "status": "sent"}
    except Exception as e:
        logger.error(f"Error sending Twilio WhatsApp message: {str(e)}")
        return {"error": str(e)}
"""
