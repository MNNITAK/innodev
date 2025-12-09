import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, UserCheck, Venus, Mars } from "lucide-react";
import { usePdfUploadContext } from "../../components/dashboard/PdfUploadCard.jsx";



const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
      
      const currentVal = Math.floor(ease(percentage) * end);
      setCount(currentVal);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};

export default function PopulationPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  const { result } = usePdfUploadContext();

  // Extract data from orchestration result or use defaults
  const dashboardData = result?.orchestrationResult;
  
  // Always use 10,000 as base population
  const baseTotal = 10000;
  const scaleFactor = 1;
  

  // Calculate gender split based on India's ACTUAL ratio (54.4% male, 45.6% female - India's real sex ratio)
  const totalPopulation = baseTotal;
  const malePopulation = Math.round(totalPopulation * 0.544); // 54.4% male = 5,440
  const femalePopulation = totalPopulation - malePopulation; // Ensure exact total = 4,560
  
  const populationData = {
    total: totalPopulation,
    active: Math.round(totalPopulation * 0.85), // 85% active
    inactive: Math.round(totalPopulation * 0.15), // 15% inactive
    growth: 12.5,
    male: malePopulation,
    female: femalePopulation,
    demographics: [
      { category: "Urban", count: Math.round(totalPopulation * 0.35), percentage: 35 },
      { category: "Semi-Urban", count: Math.round(totalPopulation * 0.32), percentage: 32 },
      { category: "Rural", count: Math.round(totalPopulation * 0.33), percentage: 33 },
    ],
    ageGroups: [
      { group: "18-30", count: Math.round(totalPopulation * 0.35), percentage: 35 },
      { group: "31-45", count: Math.round(totalPopulation * 0.30), percentage: 30 },
      { group: "46-60", count: Math.round(totalPopulation * 0.22), percentage: 22 },
      { group: "61+", count: Math.round(totalPopulation * 0.13), percentage: 13 },
    ],
    incomeGroups: [
      { group: "Below Poverty (< ₹12,000)", count: Math.round(totalPopulation * 0.28), percentage: 28 },
      { group: "Lower Middle (₹12,000-25,000)", count: Math.round(totalPopulation * 0.42), percentage: 42 },
      { group: "Middle & Upper (₹25,000+)", count: Math.round(totalPopulation * 0.30), percentage: 30 },
    ],
    occupations: [
      { group: "Agriculture & Allied", count: Math.round(totalPopulation * 0.42), percentage: 42 },
      { group: "Services", count: Math.round(totalPopulation * 0.28), percentage: 28 },
      { group: "Manufacturing & Industry", count: Math.round(totalPopulation * 0.22), percentage: 22 },
      { group: "Others & Informal", count: Math.round(totalPopulation * 0.08), percentage: 8 },
    ],
    stateDistribution: [
      { state: "Uttar Pradesh", count: Math.round(totalPopulation * 0.165), percentage: 16.5 },
      { state: "Maharashtra", count: Math.round(totalPopulation * 0.112), percentage: 11.2 },
      { state: "Bihar", count: Math.round(totalPopulation * 0.104), percentage: 10.4 },
      { state: "West Bengal", count: Math.round(totalPopulation * 0.091), percentage: 9.1 },
      { state: "Madhya Pradesh", count: Math.round(totalPopulation * 0.072), percentage: 7.2 },
      { state: "Tamil Nadu", count: Math.round(totalPopulation * 0.067), percentage: 6.7 },
      { state: "Other States", count: Math.round(totalPopulation * 0.389), percentage: 38.9 },
    ],
    literacyRate: 77.7, // Real India literacy rate (2021 census)
    avgAge: 28.7, // Real median age of India
    avgIncome: 18500, // More realistic monthly income for average Indian
    trustLevel: 58, // More realistic trust level
    adaptability: 65 // Realistic adaptability score
  };


  // If we have real data from orchestration, only update state distribution
  if (dashboardData) {
    // Update state distribution from geographic data if available
    if (dashboardData.geographicDistribution) {
      populationData.stateDistribution = dashboardData.geographicDistribution.slice(0, 6).map(state => ({
        state: state.state.replace(/([A-Z])/g, ' $1').trim(),
        count: Math.round(10000 * (state.totalOpinions / dashboardData.metadata.totalPopulation)),
        percentage: parseFloat(((state.totalOpinions / dashboardData.metadata.totalPopulation) * 100).toFixed(1))
      }));
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Population Analytics(INDIA)</h1>
        <p className="text-muted-foreground">
          Synthetic citizen distribution and demographics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Population
                </p>
                <p className="text-2xl font-bold">
                  <CountUp end={populationData.total} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Citizens</p>
                <p className="text-2xl font-bold">
                  <CountUp end={populationData.active} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-500/10 p-3">
                <Mars className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Males
                </p>
                <p className="text-2xl font-bold">
                  <CountUp end={populationData.male} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Venus className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Female</p>
                <p className="text-2xl font-bold">
                  <CountUp end={populationData.female} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Helper function to render progress bars with animation */}
        {[
          { title: "Urbanization", data: populationData.demographics },
          { title: "Age Distribution", data: populationData.ageGroups },
          { title: "Income Groups", data: populationData.incomeGroups },
          { title: "Occupations", data: populationData.occupations },
          { title: "State Distribution", data: populationData.stateDistribution },
          { 
            title: "Key Metrics", 
            data: [
              { group: "Literacy Rate", count: populationData.literacyRate, percentage: populationData.literacyRate },
              { group: "Avg Age", count: populationData.avgAge, percentage: (populationData.avgAge / 100) * 100 },
              { group: "Trust Level", count: populationData.trustLevel, percentage: populationData.trustLevel },
              { group: "Adaptability", count: populationData.adaptability, percentage: populationData.adaptability }
            ]
          },
        ].map((section, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.data.map((item, i) => (
                <div key={item.category || item.group || item.state}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{item.category || item.group || item.state}</span>
                    <span className="text-muted-foreground">
                      {section.title === "Key Metrics" ? 
                        `${item.count}${item.group.includes('Rate') ? '%' : ''}` :
                        `${item.count.toLocaleString()} (${item.percentage}%)`
                      }
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-1000 ease-out"
                      style={{ 
                        width: showAnimation ? `${Math.min(item.percentage, 100)}%` : "0%",
                        transitionDelay: `${i * 100}ms` // Stagger effect
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}