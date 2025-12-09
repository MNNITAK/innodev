# Analytics API Documentation

## Overview

The Analytics API provides state-wise impact analytics data for all Indian states and union territories across 5 key sectors: Socio-Economic, Health & Nutrition, Digital Inclusion, Environment, and Mobility.

## Base URL

```
http://localhost:8000/api/analytics
```

## Endpoints

### 1. Get Summary Statistics

Returns high-level statistics about the analytics data.

**Endpoint:** `GET /api/analytics/summary`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRegions": 36,
    "totalStates": 28,
    "totalUnionTerritories": 8,
    "lastUpdated": "2025-12-08T15:02:42.700Z"
  }
}
```

---

### 2. Get All States List

Returns a list of all Indian states and union territories.

**Endpoint:** `GET /api/analytics/states`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "code": "MH",
      "name": "Maharashtra",
      "type": "State",
      "capital": "Mumbai"
    },
    {
      "code": "DL",
      "name": "Delhi",
      "type": "UT",
      "capital": "New Delhi"
    }
    // ... 34 more states/UTs
  ],
  "count": 36
}
```

---

### 3. Get State Analytics

Returns detailed analytics data for a specific state or union territory.

**Endpoint:** `GET /api/analytics/states/:stateCode`

**Parameters:**

- `stateCode` (string, required): Two-letter state code (e.g., "MH", "DL", "KA")

**Example Request:**

```bash
GET /api/analytics/states/MH
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stateInfo": {
      "code": "MH",
      "name": "Maharashtra",
      "type": "State",
      "capital": "Mumbai"
    },
    "analytics": {
      "state": "Maharashtra",
      "stateCode": "MH",
      "lastUpdated": "2025-12-08T15:02:42.700Z",

      "socioEconomic": {
        "title": "Socio-Economic",
        "metrics": [
          {
            "id": "income",
            "label": "Avg. Annual Income",
            "type": "continuous",
            "unit": "₹",
            "oldValue": 120000,
            "newValue": 135000,
            "max": 250000
          },
          {
            "id": "poverty",
            "label": "Poverty Line Rate",
            "type": "continuous",
            "unit": "%",
            "oldValue": 22.5,
            "newValue": 19.8,
            "max": 100,
            "inverse": true
          },
          {
            "id": "employment",
            "label": "Employment Distribution",
            "type": "categorical",
            "data": [
              { "label": "Formal", "old": 25, "new": 28 },
              { "label": "Informal", "old": 45, "new": 42 },
              { "label": "Agriculture", "old": 22, "new": 20 },
              { "label": "Unemployed", "old": 8, "new": 6 }
            ]
          }
        ]
      },

      "health": {
        "title": "Health & Nutrition",
        "metrics": [
          {
            "id": "access",
            "label": "Healthcare Access Index",
            "type": "ordinal",
            "unit": "/100",
            "oldValue": 65,
            "newValue": 72,
            "max": 100
          },
          {
            "id": "stunting",
            "label": "Child Stunting Rate",
            "type": "continuous",
            "unit": "%",
            "oldValue": 32.5,
            "newValue": 28.3,
            "max": 50,
            "inverse": true
          },
          {
            "id": "disease",
            "label": "Disease Risk Score",
            "type": "continuous",
            "unit": "/100",
            "oldValue": 45,
            "newValue": 38,
            "max": 100,
            "inverse": true
          }
        ]
      },

      "digital": {
        "title": "Digital Inclusion",
        "metrics": [
          {
            "id": "internet",
            "label": "Internet Penetration",
            "type": "continuous",
            "unit": "%",
            "oldValue": 55,
            "newValue": 68,
            "max": 100
          },
          {
            "id": "literacy",
            "label": "Digital Literacy Level",
            "type": "ordinal",
            "unit": "Scale (1-5)",
            "oldValue": 3.2,
            "newValue": 3.8,
            "max": 5
          },
          {
            "id": "services",
            "label": "Digital Service Access",
            "type": "categorical",
            "data": [
              { "label": "High", "old": 18, "new": 26 },
              { "label": "Medium", "old": 32, "new": 38 },
              { "label": "Low", "old": 50, "new": 36 }
            ]
          }
        ]
      },

      "environment": {
        "title": "Environment",
        "metrics": [
          {
            "id": "aqi",
            "label": "Avg. AQI Exposure",
            "type": "continuous",
            "unit": "AQI",
            "oldValue": 145,
            "newValue": 132,
            "max": 300,
            "inverse": true
          },
          {
            "id": "green_space",
            "label": "Green Space Access",
            "type": "continuous",
            "unit": "%",
            "oldValue": 12.5,
            "newValue": 14.8,
            "max": 100
          }
        ]
      },

      "mobility": {
        "title": "Mobility",
        "metrics": [
          {
            "id": "commute",
            "label": "Avg. Commute Time",
            "type": "continuous",
            "unit": "min",
            "oldValue": 45,
            "newValue": 38,
            "max": 120,
            "inverse": true
          },
          {
            "id": "public_transport",
            "label": "Public Transport Usage",
            "type": "continuous",
            "unit": "%",
            "oldValue": 35,
            "newValue": 48,
            "max": 100
          }
        ]
      }
    }
  }
}
```

---

### 4. Get All States Analytics (Heavy Operation)

Returns analytics data for all 36 states and union territories in a single request.

**Endpoint:** `GET /api/analytics/all-states`

**Warning:** This is a heavy operation that returns ~80KB of data. Use with caution.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "stateInfo": {
        /* state info */
      },
      "analytics": {
        /* full analytics data */
      }
    }
    // ... 35 more states
  ],
  "count": 36
}
```

---

## Data Structure

### Metric Types

1. **Continuous**: Numeric values with old/new comparison

   - `oldValue`: Previous value
   - `newValue`: Current value
   - `max`: Maximum possible value
   - `inverse`: If true, lower is better (e.g., poverty rate)

2. **Ordinal**: Ranked scale values (e.g., 1-5)

   - Similar to continuous but represents ordered categories

3. **Categorical**: Distribution across categories
   - `data`: Array of `{ label, old, new }` objects
   - Represents percentage distribution

### Analytics Categories

Each state has analytics across 5 categories:

1. **socioEconomic**: Income, poverty, employment
2. **health**: Healthcare access, nutrition, disease risk
3. **digital**: Internet penetration, digital literacy, service access
4. **environment**: Air quality, green space
5. **mobility**: Commute time, public transport usage

---

## State Codes Reference

### States (28)

| Code | State             | Code | State          |
| ---- | ----------------- | ---- | -------------- |
| AP   | Andhra Pradesh    | KA   | Karnataka      |
| AR   | Arunachal Pradesh | KL   | Kerala         |
| AS   | Assam             | MP   | Madhya Pradesh |
| BR   | Bihar             | MH   | Maharashtra    |
| CT   | Chhattisgarh      | MN   | Manipur        |
| GA   | Goa               | ML   | Meghalaya      |
| GJ   | Gujarat           | MZ   | Mizoram        |
| HR   | Haryana           | NL   | Nagaland       |
| HP   | Himachal Pradesh  | OR   | Odisha         |
| JH   | Jharkhand         | PB   | Punjab         |
| RJ   | Rajasthan         | SK   | Sikkim         |
| TN   | Tamil Nadu        | TG   | Telangana      |
| TR   | Tripura           | UP   | Uttar Pradesh  |
| UT   | Uttarakhand       | WB   | West Bengal    |

### Union Territories (8)

| Code | Territory                                |
| ---- | ---------------------------------------- |
| AN   | Andaman and Nicobar Islands              |
| CH   | Chandigarh                               |
| DN   | Dadra and Nagar Haveli and Daman and Diu |
| DL   | Delhi                                    |
| JK   | Jammu and Kashmir                        |
| LA   | Ladakh                                   |
| LD   | Lakshadweep                              |
| PY   | Puducherry                               |

---

## Error Responses

### State Not Found

```json
{
  "success": false,
  "message": "State with code XY not found"
}
```

**Status Code:** 404

---

## Usage Examples

### cURL

```bash
# Get summary
curl http://localhost:8000/api/analytics/summary

# Get all states
curl http://localhost:8000/api/analytics/states

# Get Maharashtra analytics
curl http://localhost:8000/api/analytics/states/MH

# Get all states analytics
curl http://localhost:8000/api/analytics/all-states
```

### JavaScript (Fetch API)

```javascript
// Get state analytics
const response = await fetch("http://localhost:8000/api/analytics/states/MH");
const data = await response.json();

if (data.success) {
  console.log(data.data.analytics.socioEconomic);
}
```

### React Component

```jsx
useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/analytics/states/${stateCode}`
      );
      const result = await response.json();

      if (result.success) {
        setAnalytics(result.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  fetchAnalytics();
}, [stateCode]);
```

---

## Notes

- All analytics data is currently mock data generated deterministically based on state codes
- The `lastUpdated` timestamp reflects when the data was generated (server time)
- Data values are seeded using state codes to ensure consistency across requests
- The API uses CORS with permissive settings for development
- All endpoints return JSON with `success` boolean and `data` or `message` fields
