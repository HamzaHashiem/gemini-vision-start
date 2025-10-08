# Google Maps API Setup Instructions

## Overview
The UAE Car Diagnostics app now uses Google Maps Places API to find real garages instead of hardcoded data. This provides accurate, up-to-date information about automotive service centers across the UAE.

## Google Maps API Key Setup

### Step 1: Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API
   - Places API (New)
   - Maps JavaScript API
   - Geocoding API

### Step 2: Create API Key
1. Go to Credentials in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key

### Step 3: Configure API Key Restrictions (Recommended)
1. Click on your API key to edit it
2. Under "API restrictions", select "Restrict key"
3. Choose the APIs you enabled above
4. Under "Application restrictions", you can:
   - For development: Leave unrestricted
   - For production: Add your domain(s)

### Step 4: Add API Key to Environment
1. Open the `.env` file in your project root
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY="your_actual_api_key_here"
   ```

## How It Works

### Intelligent Search Algorithm
The app generates smart search queries combining:
- **Location**: Specific UAE emirate boundaries
- **Car Make**: User's car brand (BMW, Toyota, etc.)
- **Issue Type**: Specific problem (engine, brake, electrical, etc.)

Example search queries:
- "BMW service center Dubai brake repair"
- "Toyota maintenance Sharjah engine problems"
- "Mercedes specialist Abu Dhabi electrical issues"

### AI-Powered Review Analysis
The system analyzes Google Reviews to:
- **Extract Car Brand Mentions**: Find reviews mentioning the user's car make
- **Identify Service Types**: Detect mentions of specific services and issues
- **Assess Quality**: Analyze sentiment and service quality indicators
- **Recent Focus**: Prioritize reviews from the last 12 months

### Relevance Scoring
Each garage gets a relevance score based on:
- **Google Rating (30%)**: Base rating from Google
- **Review Relevance (25%)**: How well reviews match the user's car and issue
- **Proximity (20%)**: Distance within the selected emirate
- **Business Verification (15%)**: Google-verified business status
- **Recent Activity (10%)**: Recent reviews and updates

## Features

### Real-Time Data
- ✅ Live garage information from Google Maps
- ✅ Current contact details and working hours
- ✅ Real customer reviews and ratings
- ✅ Automatic discovery of new garages

### Smart Filtering
- ✅ Minimum 3.5-star rating requirement
- ✅ Active business status verification
- ✅ Automotive-specific business filtering
- ✅ Geographic relevance to selected emirate

### Enhanced UI
- ✅ Loading states during search
- ✅ Error handling with retry options
- ✅ Review highlights for relevant mentions
- ✅ Direct Google Maps integration
- ✅ WhatsApp integration with pre-filled messages

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing the Integration

1. Make sure you have a valid Google Maps API key in `.env`
2. Start the development server: `npm run dev`
3. Complete the car diagnostic form
4. Select different emirates and car makes to test search variety
5. Check the browser console for search queries and API responses

## Troubleshooting

### "Google Maps API key is not configured"
- Check that your `.env` file has the correct API key
- Restart the development server after changing the `.env` file

### "API quota exceeded"
- Check your Google Cloud Console for API usage
- Enable billing if you're hitting free tier limits

### "No garages found"
- Try different emirates (Dubai and Abu Dhabi have more results)
- Check browser console for API errors
- Verify the Google Places API is enabled in your project

## Cost Optimization

The app is designed to minimize API costs:
- **Efficient Queries**: Smart search terms reduce irrelevant results
- **Caching**: Results are cached to avoid duplicate requests
- **Batch Processing**: Multiple search queries are optimized
- **Result Limits**: Only top 15 results are processed in detail

## Production Considerations

1. **API Key Security**: Use domain restrictions in production
2. **Rate Limiting**: Implement client-side rate limiting if needed
3. **Caching**: Consider server-side caching for popular searches
4. **Monitoring**: Set up Google Cloud monitoring for API usage