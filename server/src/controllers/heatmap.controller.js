export const getHeatmapData = async (req, res) => {
  try {
    console.log("📊 Generating heatmap data...");
    
    // Generate base values for all major states
    const baseData = generateBaseData();
    
    const payload = {
      meta: {
        version: "1.0.0",
        template: "states",
        timestamp: new Date().toISOString(),
        units: "cases_per_100k",
        value_field: "value",
        scale_mode: "quantile",
        color_palette: "YlOrRd",
      },
      data: baseData,
      time_series: generateTimeSeries(),
    };

    console.log("✅ Heatmap data generated successfully");
    res.setHeader("Content-Type", "application/json");
    res.json(payload);
  } catch (err) {
    console.error("❌ Error generating heatmap data:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

function generateBaseData() {
  const states = [
    { region_id: "IN-UP", region_name: "Uttar Pradesh" },
    { region_id: "IN-MH", region_name: "Maharashtra" },
    { region_id: "IN-DL", region_name: "Delhi" },
    { region_id: "IN-KA", region_name: "Karnataka" },
    { region_id: "IN-TN", region_name: "Tamil Nadu" },
    { region_id: "IN-GJ", region_name: "Gujarat" },
    { region_id: "IN-RJ", region_name: "Rajasthan" },
    { region_id: "IN-WB", region_name: "West Bengal" },
    { region_id: "IN-AP", region_name: "Andhra Pradesh" },
    { region_id: "IN-TG", region_name: "Telangana" },
    { region_id: "IN-MP", region_name: "Madhya Pradesh" },
    { region_id: "IN-KL", region_name: "Kerala" },
    { region_id: "IN-OR", region_name: "Odisha" },
    { region_id: "IN-PB", region_name: "Punjab" },
    { region_id: "IN-HR", region_name: "Haryana" },
    { region_id: "IN-CT", region_name: "Chhattisgarh" },
    { region_id: "IN-JH", region_name: "Jharkhand" },
    { region_id: "IN-AS", region_name: "Assam" },
    { region_id: "IN-UT", region_name: "Uttarakhand" },
    { region_id: "IN-HP", region_name: "Himachal Pradesh" },
  ];

  return states.map((state) => ({
    ...state,
    value: Math.random() * 500,
  }));
}

function generateTimeSeries() {
  const frames = [];
  const states = [
    { region_id: "IN-UP", region_name: "Uttar Pradesh" },
    { region_id: "IN-MH", region_name: "Maharashtra" },
    { region_id: "IN-DL", region_name: "Delhi" },
    { region_id: "IN-KA", region_name: "Karnataka" },
    { region_id: "IN-TN", region_name: "Tamil Nadu" },
    { region_id: "IN-GJ", region_name: "Gujarat" },
    { region_id: "IN-RJ", region_name: "Rajasthan" },
    { region_id: "IN-WB", region_name: "West Bengal" },
    { region_id: "IN-AP", region_name: "Andhra Pradesh" },
    { region_id: "IN-TG", region_name: "Telangana" },
  ];

  for (let i = 0; i < 30; i++) {
    frames.push({
      timestamp: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
      data: states.map((state) => ({
        region_id: state.region_id,
        value: Math.random() * 500,
      })),
    });
  }

  return frames;
}
