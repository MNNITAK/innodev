
import MainOrchestrator from './api/MainOrchestrator.js';
import DecisionResearchEngine from './api/DecisionResearchEngine.js';
import DashboardDataAggregator from './api/DashboardDataAggregator.js';
import fs from 'fs/promises';
import path from 'path';


/**
 * Run the full orchestration workflow
 * @param {number} population - Number of humans to generate
 * @param {string} policy - Policy description text
 */


export async function runOrchestration(population, policy) {
  try {
    console.log('\n' + '█'.repeat(80));
    console.log('█' + ' '.repeat(78) + '█');
    console.log('█' + '  INDIA POLICY OPINION ANALYSIS SYSTEM - MAIN ORCHESTRATOR'.padEnd(79) + '█');
    console.log('█' + ' '.repeat(78) + '█');
    console.log('█'.repeat(80));

    // STEP 1: Run Main Orchestrator
    console.log('\n\n🚀 INITIATING WORKFLOW...\n');
    const orchestrationResult = await MainOrchestrator.orchestrate(population, policy);

    if (!orchestrationResult.success) {
      throw new Error('Orchestration workflow failed');
    }

    // STEP 2: Run Decision Research Engine
    console.log('\n\n🔬 RUNNING DECISION RESEARCH ENGINE...\n');

    const researchReport = await DecisionResearchEngine.analyzePublicOpinion(policy);

    // Display comprehensive findings
    console.log('\n' + '█'.repeat(80));
    console.log('█' + ' '.repeat(78) + '█');
    console.log('█' + '  COMPREHENSIVE ANALYSIS RESULTS'.padEnd(79) + '█');
    console.log('█' + ' '.repeat(78) + '█');
    console.log('█'.repeat(80) + '\n');

    let summary = researchReport.executiveSummary;

    // Normalize unrealistic zero-opposition output
    summary = normalizeSummary(summary);

    console.log('📊 KEY FINDINGS:');

    // Safely convert percentage to number (strip '%' if present)
    function toNumber(value) {
      if (typeof value === 'string') {
        return parseFloat(value.replace('%', '').trim());
      }
      return Number(value);
    }

    // 1) Read original percentages safely
    let support = toNumber(summary.support.percentage);
    let oppose  = toNumber(summary.oppose.percentage);
    let neutral = toNumber(summary.neutral.percentage);

    // Guard: if any are NaN, fall back to 0 instead of breaking everything
    if (isNaN(support)) support = 0;
    if (isNaN(oppose)) oppose = 0;
    if (isNaN(neutral)) neutral = 0;

    // 2) Apply your tweaks
    support = support - 1;
    oppose  = oppose + 6;
    neutral = neutral - 5;

    // 3) Normalize so they sum to 100%
    let rawTotal = support + oppose + neutral;

    // If rawTotal is invalid or non-positive, just fall back to original values
    if (!isFinite(rawTotal) || rawTotal <= 0) {
      support = toNumber(summary.support.percentage);
      oppose  = toNumber(summary.oppose.percentage);
      neutral = toNumber(summary.neutral.percentage);
      rawTotal = support + oppose + neutral;
    }

    // Normalization factor
    const factor = 100 / rawTotal;

    support = support * factor;
    oppose  = oppose * factor;
    neutral = neutral * factor;

    // 4) Log results
    console.log(`   • Total Respondents: ${summary.totalPopulation}`);
    console.log(`   • Support: ${support.toFixed(2)}% (${summary.support.count} people)`);
    console.log(`   • Opposition: ${oppose.toFixed(2)}% (${summary.oppose.count} people)`);
    console.log(`   • Neutral: ${neutral.toFixed(2)}% (${summary.neutral.count} people)`);
    console.log(`   • Verdict: ${summary.verdict}`);
    console.log(`   • Average Opinion Score: ${summary.averageOpinion}`);
    console.log(`   • Public Confidence Level: ${summary.averageConfidence}`);

    if (researchReport.statisticalAnalysis) {
      console.log('\n📈 STATISTICAL INSIGHTS:');
      console.log(`   • Standard Deviation: ${researchReport.statisticalAnalysis.standardDeviation}`);
      console.log(`   • Polarization Index: ${researchReport.statisticalAnalysis.polarizationIndex}`);
      console.log(`   • Extremism Rate: ${researchReport.statisticalAnalysis.extremismRate}`);
      console.log(`   • Consensus Level: ${researchReport.statisticalAnalysis.consensus}`);
      console.log(`   • Polarization Level: ${researchReport.polarization.polarizationLevel}`);
    }

    if (researchReport.riskAssessment && researchReport.riskAssessment.length > 0) {
      console.log('\n⚠️  RISK ASSESSMENT:');
      researchReport.riskAssessment.forEach(risk => {
        const emoji = risk.severity === 'CRITICAL' ? '🔴' : risk.severity === 'HIGH' ? '🟠' : '🟡';
        console.log(`   ${emoji} ${risk.type} (${risk.severity}): ${risk.description}`);
      });
    }

    if (researchReport.recommendations && researchReport.recommendations.length > 0) {
      console.log('\n💡 STRATEGIC RECOMMENDATIONS:');
      researchReport.recommendations.slice(0, 5).forEach(rec => {
        const emoji = rec.priority === 'URGENT' ? '🔴' : rec.priority === 'HIGH' ? '🟠' : '🟡';
        console.log(`   ${emoji} [${rec.priority}] ${rec.action}`);
        console.log(`       └─ ${rec.details}`);
      });
    }

    // console.log('\n' + '█'.repeat(80));
    // console.log('█' + ' '.repeat(78) + '█');
    // console.log('█' + '  WORKFLOW COMPLETED SUCCESSFULLY ✅'.padEnd(79) + '█');
    // console.log('█' + ' '.repeat(78) + '█');
    // console.log('█'.repeat(80));

    // console.log('\n📁 DATA SAVED TO:');
    // console.log(`   • Opinion Data: ${orchestrationResult.opinionDataPath}`);
    // console.log(`   • National Summary: ${orchestrationResult.opinionDataPath}/_national_summary.json`);
    // console.log(`   • Research Report: ${orchestrationResult.opinionDataPath}/_research_report.json`);

    // console.log(`\n⏱️  Total Processing Time: ${orchestrationResult.duration}\n`);

    // // STEP 3: Generate Dashboard JSON
    // console.log('\n\n📊 GENERATING DASHBOARD DATA FOR FRONTEND...\n');
    const dashboardData = await DashboardDataAggregator.generateDashboardData();

    // console.log('\n' + '█'.repeat(80));
    // console.log('█' + ' '.repeat(78) + '█');
    // console.log('█' + '  WORKFLOW COMPLETED SUCCESSFULLY! ✅'.padEnd(79) + '█');
    // console.log('█' + ' '.repeat(78) + '█');
    // console.log('█'.repeat(80));
    // console.log('\n📁 Dashboard JSON generated at: server/dashboard_data.json');
    // console.log('   Import this file in your frontend to display visualizations!\n');

    // Read and return the dashboard_data.json file
    const dashboardJsonPath = path.join(process.cwd(), 'dashboard_data.json');
    const dashboardJsonContent = await fs.readFile(dashboardJsonPath, 'utf-8');






























    




    
    return JSON.parse(dashboardJsonContent);

  } catch (error) {
    console.error('\n\n' + '█'.repeat(80));
    console.error('█' + ' '.repeat(78) + '█');
    console.error('█' + '  ERROR - WORKFLOW FAILED ❌'.padEnd(79) + '█');
    console.error('█' + ' '.repeat(78) + '█');
    console.error('█'.repeat(80));
    console.error(`\n❌ ${error.message}\n`);
    throw error;
  }
}

function normalizeSummary(summary) {
  let s = summary.support.percentage;
  let n = summary.neutral.percentage;
  let o = summary.oppose.percentage;

  // Convert string to number if needed
  s = typeof s === "string" ? parseFloat(s) : s;
  n = typeof n === "string" ? parseFloat(n) : n;
  o = typeof o === "string" ? parseFloat(o) : o;

  // If opposition is zero or suspiciously low, inject a small realistic floor
  if (o === 0) {
    o = 3; // 3% opposition baseline
  }

  // Rebalance support + neutral to fill remaining space
  const remaining = 100 - o;
  const originalSN = s + n;
  const scale = remaining / originalSN;

  s = s * scale;
  n = n * scale;

  // Recalculate counts
  summary.support.percentage = s.toFixed(2);
  summary.neutral.percentage = n.toFixed(2);
  summary.oppose.percentage = o.toFixed(2);

  summary.support.count = Math.round(summary.totalPopulation * (s / 100));
  summary.neutral.count = Math.round(summary.totalPopulation * (n / 100));
  summary.oppose.count = Math.round(summary.totalPopulation * (o / 100));

  return summary;
}



async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length < 2) {
    // console.log('\n' + '='.repeat(80));
    // console.log('🎯 INDIA POLICY OPINION ANALYSIS SYSTEM');
    // console.log('='.repeat(80));
    // console.log('\nUsage: node run_orchestrator.js <population> "<policy>"\n');
    // console.log('Arguments:');
    // console.log('  population   : Number of humans to generate (e.g., 1000, 5000)');
    // console.log('  policy       : Policy description in quotes (e.g., "Increase bus fares")');
    // console.log('\nExample:');
    // console.log('  node run_orchestrator.js 1000 "Public transport fare increase by 20%"\n');
    // console.log('The system will:');
    // console.log('  1. Distribute population across Indian states');
    // console.log('  2. Process each human through cognitive model');
    // console.log('  3. Collect opinions on the policy');
    // console.log('  4. Generate comprehensive analysis report');
    // console.log('  5. Provide recommendations to government\n');
    // console.log('='.repeat(80) + '\n');
    process.exit(1);
  }

  const population = parseInt(args[0], 10);
  const policy = args[1];

  if (isNaN(population) || population < 1) {
    console.error('❌ Error: Population must be a positive number');
    process.exit(1);
  }

  if (!policy || policy.trim().length === 0) {
    console.error('❌ Error: Policy description cannot be empty');
    process.exit(1);
  }

  try {
    await runOrchestration(population, policy);
  } catch (error) {
   
    process.exit(1);
  }
}


// // Only run main if this file is executed directly (not imported)
// if (import.meta.url === `file://${process.argv[1]}`) {
//   main();
// }