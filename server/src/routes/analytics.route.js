import express from "express";

const router = express.Router();

const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands", type: "UT", capital: "Port Blair" },
  { code: "AP", name: "Andhra Pradesh", type: "State", capital: "Amaravati" },
  { code: "AR", name: "Arunachal Pradesh", type: "State", capital: "Itanagar" },
  { code: "AS", name: "Assam", type: "State", capital: "Dispur" },
  { code: "BR", name: "Bihar", type: "State", capital: "Patna" },
  { code: "CH", name: "Chandigarh", type: "UT", capital: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh", type: "State", capital: "Raipur" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu", type: "UT", capital: "Daman" },
  { code: "DL", name: "Delhi", type: "UT", capital: "New Delhi" },
  { code: "GA", name: "Goa", type: "State", capital: "Panaji" },
  { code: "GJ", name: "Gujarat", type: "State", capital: "Gandhinagar" },
  { code: "HR", name: "Haryana", type: "State", capital: "Chandigarh" },
  { code: "HP", name: "Himachal Pradesh", type: "State", capital: "Shimla" },
  { code: "JK", name: "Jammu and Kashmir", type: "UT", capital: "Srinagar (Summer), Jammu (Winter)" },
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
  { code: "UT", name: "Uttarakhand", type: "State", capital: "Dehradun (Winter), Gairsain (Summer)" },
  { code: "WB", name: "West Bengal", type: "State", capital: "Kolkata" },
];

const getSeededRandom = (seedStr) => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i);
  return (min, max) => {
    const x = Math.sin(seed++) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };
};

const generateAnalyticsData = (seedKey, name) => {
  const random = getSeededRandom(seedKey);
  
  const support = Math.floor(random(55, 75)); // India average slightly different range
  const opposition = Math.floor(random(15, 30));
  const riskLevels = ["Low", "Medium", "High", "Critical"];
  const riskIndex = Math.floor(random(0, 2)); // India mostly Low/Medium

  return {
    state: name,
    lastUpdated: new Date().toISOString(),
    
    summaryMetrics: [
      { label: "Overall Support", value: support + "%" },
      { label: "Opposition", value: opposition + "%" },
      { label: "Population Simulated", value: "1.4B" }, // India specific
      { label: "Risk Level", value: riskLevels[riskIndex] },
    ],

    categories: {
      socioEconomic: {
        title: "Socio-Economic",
        metrics: [
          { id: "2.2", label: "Poverty Below Line", value: 0.18, type: "percent", inverse: true },
          { id: "2.3", label: "Literacy Rate", value: 0.77, type: "percent" },
          { id: "2.6", label: "Formal Employment", value: 0.22, type: "percent" },
          { id: "5.1", label: "Income Stability", value: 0.55, type: "ordinal" },
          { id: "5.2", label: "Debt Vulnerability", value: 0.35, type: "percent", inverse: true },
        ]
      },
      health: {
        title: "Health & Nutrition",
        metrics: [
          { id: "4.1", label: "Healthcare Access", value: 0.65, type: "ordinal" },
          { id: "4.3", label: "Child Stunting", value: 0.32, type: "percent", inverse: true },
          { id: "4.4", label: "Disease Risk", value: 0.45, type: "ordinal", inverse: true },
          { id: "4.2", label: "Health Literacy", value: 0.58, type: "ordinal" },
        ]
      },
      digital: {
        title: "Digital & Tech",
        metrics: [
          { id: "10.1", label: "Internet Connectivity", value: 0.62, type: "percent" },
          { id: "10.2", label: "Digital Literacy", value: 0.48, type: "ordinal" },
          { id: "10.3", label: "Digital Services Access", value: 0.55, type: "ordinal" },
        ]
      },
      environment: {
        title: "Environment & Housing",
        metrics: [
          { id: "11.1", label: "Pollution Exposure", value: 0.72, type: "ordinal", inverse: true },
          { id: "11.2", label: "Climate Vulnerability", value: 0.60, type: "ordinal", inverse: true },
          { id: "6.1", label: "Pucca Housing", value: 0.65, type: "percent" },
          { id: "11.3", label: "Green Space Access", value: 0.25, type: "percent" },
        ]
      },
      governance: {
        title: "Governance & Social",
        metrics: [
          { id: "13.1", label: "Policy Awareness", value: 0.45, type: "ordinal" },
          { id: "3.3", label: "Institutional Trust", value: 0.62, type: "ordinal" },
          { id: "9.2", label: "Civic Participation", value: 0.35, type: "ordinal" },
          { id: "3.4", label: "Change Adaptability", value: 0.55, type: "ordinal" },
        ]
      }
    }
  };
};

// GET /api/analytics/national - Get India aggregated analytics
router.get("/national", (req, res) => {
  const analytics = generateAnalyticsData("INDIA_NATIONAL_KEY", "India");
  res.json({
    success: true,
    data: analytics
  });
});

// GET /api/analytics/states/:stateCode - Get specific state analytics
router.get("/states/:stateCode", (req, res) => {
  const { stateCode } = req.params;
  const upperCode = stateCode.toUpperCase();
  const state = INDIAN_STATES.find((s) => s.code === upperCode);

  if (!state) {
    return res.status(404).json({ success: false, message: "State not found" });
  }

  const analytics = generateAnalyticsData(state.code, state.name);

  res.json({
    success: true,
    data: {
      stateInfo: state,
      analytics: analytics,
    },
  });
});

export default router;
