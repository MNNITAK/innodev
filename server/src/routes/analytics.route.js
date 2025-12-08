import express from "express";

const router = express.Router();

// List of Indian States and Union Territories
const INDIAN_STATES = [
  {
    code: "AN",
    name: "Andaman and Nicobar Islands",
    type: "UT",
    capital: "Port Blair",
  },
  { code: "AP", name: "Andhra Pradesh", type: "State", capital: "Amaravati" },
  { code: "AR", name: "Arunachal Pradesh", type: "State", capital: "Itanagar" },
  { code: "AS", name: "Assam", type: "State", capital: "Dispur" },
  { code: "BR", name: "Bihar", type: "State", capital: "Patna" },
  { code: "CH", name: "Chandigarh", type: "UT", capital: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh", type: "State", capital: "Raipur" },
  {
    code: "DN",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    type: "UT",
    capital: "Daman",
  },
  { code: "DL", name: "Delhi", type: "UT", capital: "New Delhi" },
  { code: "GA", name: "Goa", type: "State", capital: "Panaji" },
  { code: "GJ", name: "Gujarat", type: "State", capital: "Gandhinagar" },
  { code: "HR", name: "Haryana", type: "State", capital: "Chandigarh" },
  { code: "HP", name: "Himachal Pradesh", type: "State", capital: "Shimla" },
  {
    code: "JK",
    name: "Jammu and Kashmir",
    type: "UT",
    capital: "Srinagar (Summer), Jammu (Winter)",
  },
  { code: "JH", name: "Jharkhand", type: "State", capital: "Ranchi" },
  { code: "KA", name: "Karnataka", type: "State", capital: "Bengaluru" },
  { code: "KL", name: "Kerala", type: "State", capital: "Thiruvananthapuram" },
  { code: "LA", name: "Ladakh", type: "UT", capital: "Leh" },
  { code: "LD", name: "Lakshadweep", type: "UT", capital: "Kavaratti" },
  { code: "MP", name: "Madhya Pradesh", type: "State", capital: "Bhopal" },
  { code: "MH", name: "Maharashtra", type: "State", capital: "Mumbai" },
  { code: "MN", name: "Manipur", type: "State", capital: "Imphal" },
  { code: "ML", name: "Meghalaya", type: "State", capital: "Shillong" },
  { code: "MZ", name: "Mizoram", type: "State", capital: "Aizawl" },
  { code: "NL", name: "Nagaland", type: "State", capital: "Kohima" },
  { code: "OR", name: "Odisha", type: "State", capital: "Bhubaneswar" },
  { code: "PY", name: "Puducherry", type: "UT", capital: "Puducherry" },
  { code: "PB", name: "Punjab", type: "State", capital: "Chandigarh" },
  { code: "RJ", name: "Rajasthan", type: "State", capital: "Jaipur" },
  { code: "SK", name: "Sikkim", type: "State", capital: "Gangtok" },
  { code: "TN", name: "Tamil Nadu", type: "State", capital: "Chennai" },
  { code: "TG", name: "Telangana", type: "State", capital: "Hyderabad" },
  { code: "TR", name: "Tripura", type: "State", capital: "Agartala" },
  { code: "UP", name: "Uttar Pradesh", type: "State", capital: "Lucknow" },
  {
    code: "UT",
    name: "Uttarakhand",
    type: "State",
    capital: "Dehradun (Winter), Gairsain (Summer)",
  },
  { code: "WB", name: "West Bengal", type: "State", capital: "Kolkata" },
];

// Generate mock analytics data for a state
const generateStateAnalytics = (stateCode, stateName) => {
  const seed = stateCode.charCodeAt(0) + stateCode.charCodeAt(1);
  const random = (min, max) => {
    const x = Math.sin(seed) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const baseIncome = random(80000, 180000);
  const basePoverty = random(10, 35);
  const baseHealthcare = random(45, 80);
  const baseInternet = random(30, 75);
  const baseAQI = random(80, 200);

  return {
    state: stateName,
    stateCode: stateCode,
    lastUpdated: new Date().toISOString(),

    socioEconomic: {
      title: "Socio-Economic",
      metrics: [
        {
          id: "income",
          label: "Avg. Annual Income",
          type: "continuous",
          unit: "₹",
          oldValue: Math.round(baseIncome),
          newValue: Math.round(baseIncome * random(1.02, 1.12)),
          max: 250000,
        },
        {
          id: "poverty",
          label: "Poverty Line Rate",
          type: "continuous",
          unit: "%",
          oldValue: Number(basePoverty.toFixed(1)),
          newValue: Number((basePoverty * random(0.85, 0.98)).toFixed(1)),
          max: 100,
          inverse: true,
        },
        {
          id: "employment",
          label: "Employment Distribution",
          type: "categorical",
          data: [
            {
              label: "Formal",
              old: Math.round(random(15, 25)),
              new: Math.round(random(20, 30)),
            },
            {
              label: "Informal",
              old: Math.round(random(40, 50)),
              new: Math.round(random(38, 46)),
            },
            {
              label: "Agriculture",
              old: Math.round(random(20, 35)),
              new: Math.round(random(18, 32)),
            },
            {
              label: "Unemployed",
              old: Math.round(random(5, 12)),
              new: Math.round(random(4, 10)),
            },
          ],
        },
      ],
    },

    health: {
      title: "Health & Nutrition",
      metrics: [
        {
          id: "access",
          label: "Healthcare Access Index",
          type: "ordinal",
          unit: "/100",
          oldValue: Math.round(baseHealthcare),
          newValue: Math.round(baseHealthcare * random(1.05, 1.15)),
          max: 100,
        },
        {
          id: "stunting",
          label: "Child Stunting Rate",
          type: "continuous",
          unit: "%",
          oldValue: Number(random(25, 40).toFixed(1)),
          newValue: Number(random(23, 38).toFixed(1)),
          max: 50,
          inverse: true,
        },
        {
          id: "disease",
          label: "Disease Risk Score",
          type: "continuous",
          unit: "/100",
          oldValue: Math.round(random(35, 55)),
          newValue: Math.round(random(30, 50)),
          max: 100,
          inverse: true,
        },
      ],
    },

    digital: {
      title: "Digital Inclusion",
      metrics: [
        {
          id: "internet",
          label: "Internet Penetration",
          type: "continuous",
          unit: "%",
          oldValue: Math.round(baseInternet),
          newValue: Math.round(baseInternet * random(1.15, 1.35)),
          max: 100,
        },
        {
          id: "literacy",
          label: "Digital Literacy Level",
          type: "ordinal",
          unit: "Scale (1-5)",
          oldValue: Number(random(2.2, 3.5).toFixed(1)),
          newValue: Number(random(2.8, 4.2).toFixed(1)),
          max: 5,
        },
        {
          id: "services",
          label: "Digital Service Access",
          type: "categorical",
          data: [
            {
              label: "High",
              old: Math.round(random(10, 20)),
              new: Math.round(random(18, 30)),
            },
            {
              label: "Medium",
              old: Math.round(random(25, 35)),
              new: Math.round(random(30, 40)),
            },
            {
              label: "Low",
              old: Math.round(random(45, 60)),
              new: Math.round(random(30, 45)),
            },
          ],
        },
      ],
    },

    environment: {
      title: "Environment",
      metrics: [
        {
          id: "aqi",
          label: "Avg. AQI Exposure",
          type: "continuous",
          unit: "AQI",
          oldValue: Math.round(baseAQI),
          newValue: Math.round(baseAQI * random(0.88, 0.98)),
          max: 300,
          inverse: true,
        },
        {
          id: "green_space",
          label: "Green Space Access",
          type: "continuous",
          unit: "%",
          oldValue: Number(random(8, 18).toFixed(1)),
          newValue: Number(random(9, 20).toFixed(1)),
          max: 100,
        },
      ],
    },

    mobility: {
      title: "Mobility",
      metrics: [
        {
          id: "commute",
          label: "Avg. Commute Time",
          type: "continuous",
          unit: "min",
          oldValue: Math.round(random(30, 60)),
          newValue: Math.round(random(25, 50)),
          max: 120,
          inverse: true,
        },
        {
          id: "public_transport",
          label: "Public Transport Usage",
          type: "continuous",
          unit: "%",
          oldValue: Math.round(random(25, 45)),
          newValue: Math.round(random(35, 60)),
          max: 100,
        },
      ],
    },
  };
};

// GET /api/analytics/states - Get all states list
router.get("/states", (req, res) => {
  console.log("📊 Fetching all states list");
  res.json({
    success: true,
    data: INDIAN_STATES,
    count: INDIAN_STATES.length,
  });
});

// GET /api/analytics/summary - Get summary statistics
router.get("/summary", (req, res) => {
  console.log("📊 Fetching analytics summary");

  const states = INDIAN_STATES.filter((s) => s.type === "State");
  const unionTerritories = INDIAN_STATES.filter((s) => s.type === "UT");

  res.json({
    success: true,
    data: {
      totalRegions: INDIAN_STATES.length,
      totalStates: states.length,
      totalUnionTerritories: unionTerritories.length,
      lastUpdated: new Date().toISOString(),
    },
  });
});

// GET /api/analytics/states/:stateCode - Get specific state analytics
router.get("/states/:stateCode", (req, res) => {
  const { stateCode } = req.params;
  const upperCode = stateCode.toUpperCase();

  console.log(`📊 Fetching analytics for state: ${upperCode}`);

  const state = INDIAN_STATES.find((s) => s.code === upperCode);

  if (!state) {
    return res.status(404).json({
      success: false,
      message: `State with code ${upperCode} not found`,
    });
  }

  const analytics = generateStateAnalytics(state.code, state.name);

  res.json({
    success: true,
    data: {
      stateInfo: state,
      analytics: analytics,
    },
  });
});

// GET /api/analytics/all-states - Get analytics for all states (heavy operation)
router.get("/all-states", (req, res) => {
  console.log("📊 Generating analytics for all states");

  const allAnalytics = INDIAN_STATES.map((state) => ({
    stateInfo: state,
    analytics: generateStateAnalytics(state.code, state.name),
  }));

  res.json({
    success: true,
    data: allAnalytics,
    count: allAnalytics.length,
  });
});

export default router;
