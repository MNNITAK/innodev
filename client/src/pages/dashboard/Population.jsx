// client/src/pages/dashboard/Population.jsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, UserCheck, Venus, Mars } from "lucide-react";

const populationData = {
  total: 250000,
  active: 198500,
  inactive: 51500,
  growth: 12.5,
  male: 130000,
  female: 120000,
  demographics: [
    { category: "Urban", count: 145000, percentage: 58 },
    { category: "Rural", count: 105000, percentage: 42 },
  ],
  ageGroups: [
    { group: "18-25", count: 52500, percentage: 21 },
    { group: "26-35", count: 70000, percentage: 28 },
    { group: "36-45", count: 57500, percentage: 23 },
    { group: "46-55", count: 42500, percentage: 17 },
    { group: "55+", count: 27500, percentage: 11 },
  ],
  incomeGroups: [
    { group: "Low Income", count: 75000, percentage: 30 },
    { group: "Middle Income", count: 125000, percentage: 50 },
    { group: "High Income", count: 50000, percentage: 20 },
  ],
  householdSize:[
    { group: "1-2", count: 60000, percentage: 24 },
    { group: "3-4", count: 125000, percentage: 50 },
    { group: "5-6", count: 50000, percentage: 20 },
    { group: "7+", count: 20000, percentage: 6 },  
  ],
  caste:[
    { group: "General", count: 100000, percentage: 40 },
    { group: "OBC", count: 80000, percentage: 32 },
    { group: "SC", count: 40000, percentage: 16 },
    { group: "ST", count: 30000, percentage: 12 },  
  ],
  religion:[
    { group: "Hindu", count: 175000, percentage: 70 },
    { group: "Muslim", count: 50000, percentage: 20 },
    { group: "Sikh", count: 15000, percentage: 6 },
    { group: "Buddhist", count: 5000, percentage: 2 },
    { group: "Christian", count: 2500, percentage: 1 },
    { group: "Other", count: 2500, percentage: 1},  
  ]
};

// Animated Number Component
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
      
      // Randomize slightly during animation for "scramble" effect
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

  useEffect(() => {
    // Trigger animation slightly after mount
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
          { title: "Demographics", data: populationData.demographics },
          { title: "Age Distribution", data: populationData.ageGroups },
          { title: "Income Groups", data: populationData.incomeGroups },
          { title: "Household Size", data: populationData.householdSize },
          { title: "Caste", data: populationData.caste },
          { title: "Religion", data: populationData.religion },
        ].map((section, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.data.map((item, i) => (
                <div key={item.category || item.group}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{item.category || item.group}</span>
                    <span className="text-muted-foreground">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-1000 ease-out"
                      style={{ 
                        width: showAnimation ? `${item.percentage}%` : "0%",
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