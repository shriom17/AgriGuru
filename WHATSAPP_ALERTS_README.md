# KisanMitra WhatsApp Alerts System

This system enables automated WhatsApp alerts for farmers about weather conditions, crop health, and market prices using Twilio's WhatsApp API.

## Components

1. **WhatsApp API Integration** - Twilio WhatsApp API service integration for sending messages
2. **Alert Scheduler** - Python scheduler that triggers alerts at specified intervals 
3. **Alert Types**:
   - Weather alerts (daily forecasts and severe weather warnings)
   - Crop health/disease alerts (based on weather conditions and crop types)
   - Market price alerts (price changes for crops)
4. **User Preferences** - Frontend settings panel for users to customize their alert preferences

## Setup Instructions

### 1. Twilio WhatsApp API Setup

1. Create a Twilio account at [twilio.com](https://www.twilio.com/)
2. Configure the WhatsApp Sandbox
3. Add the Twilio credentials to your `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
   ```

### 2. Running the Alert Scheduler

**Automatic Method (Windows)**:
1. Navigate to the `back` folder
2. Run `run_scheduler.bat` to start the scheduler in a virtual environment

**Manual Method**:
1. Install dependencies: `pip install -r requirements.txt`
2. Run the scheduler: `python alert_scheduler.py`

### 3. User Setup

For users to receive WhatsApp messages from the KisanMitra system:

1. They must join the Twilio WhatsApp sandbox by sending a message to your Twilio WhatsApp number with the join code
2. Example: Send `join adventure-owner` to +14155238886
3. They should verify their phone number in the KisanMitra WhatsApp settings
4. Select their preferred alert types and frequency

## Alert Types and Frequencies

### Weather Alerts
- Daily weather forecasts
- Severe weather warnings (extreme temperatures, heavy rainfall, etc.)
- Scheduled twice daily (morning and evening)

### Crop Health Alerts
- Disease risk assessments based on weather conditions
- Pest outbreak warnings
- Scheduled daily with additional checks during high-risk periods

### Market Price Alerts
- Price changes for selected crops
- New market opportunities
- Scheduled weekly or when significant price changes occur

## Development and Testing

To test the WhatsApp alerts system:

1. Enable the sandbox testing mode in the Twilio dashboard
2. Add test users to the sandbox by having them send the join code
3. Use the "Send Test Alert" button in the WhatsApp settings panel to verify the connection
4. Check the logs at `logs/scheduler.log` for any issues with the automated alerts

## Troubleshooting

Common issues and solutions:

1. **Messages not being sent**:
   - Ensure the user has joined the Twilio sandbox
   - Verify Twilio credentials in the `.env` file
   - Check the scheduler logs for any API errors

2. **Scheduler not running**:
   - Ensure all required packages are installed
   - Check the permissions for writing to the logs directory
   - Verify the Python version (3.8+ required)

3. **Alerts not triggering**:
   - Check if the alert preferences are enabled in the user profile
   - Verify the API URLs in the scheduler configuration
   - Test the alert endpoints manually using Postman or similar tools

