import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers"; // ✅ Correct import
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// ==========================================
// ZOD SCHEMA FOR STRUCTURED OUTPUT
// ==========================================

const PolicySchema = z.object({
  id: z.string().optional(),
  title: z.string().describe("Short descriptive title (max 100 chars)"),
  description: z.string().describe("Full policy description"),
  domain: z.enum([
    "transport", "health", "tax", "education", "agriculture", 
    "infrastructure", "social", "environment", "housing", 
    "employment", "technology", "security", "general"
  ]).describe("Policy domain/category"),
  
  impacts: z.object({
    economicCost: z.number().describe("Annual ₹ cost per person (negative if citizen pays)"),
    economicBenefit: z.number().describe("Annual ₹ benefit per person"),
    timeChange: z.number().describe("Minutes per day change (negative = more time)"),
    healthImpact: z.number().min(-100).max(100).describe("Health impact scale -100 to +100"),
    environmentImpact: z.number().min(-100).max(100).describe("Environmental impact -100 to +100"),
    socialStatus: z.number().min(-100).max(100).describe("Social status change -100 to +100")
  }),
  
  targetGroups: z.array(z.string()).describe("Affected demographic groups"),
  
  promises: z.object({
    futureEconomicBenefit: z.number().describe("Future economic benefit in ₹"),
    timeSaved: z.number().describe("Future time saved in minutes/day"),
    implementationDelay: z.number().describe("Months until implementation")
  }),
  
  confidence: z.number().min(0). max(1).describe("Parsing confidence 0-1"),
  assumptions: z.array(z.string()). describe("Assumptions made during parsing"),
  dataQuality: z.enum(["high", "medium", "low"]). describe("Quality of extracted data")
});

// ==========================================
// LANGCHAIN GROQ MODEL INITIALIZATION
// ==========================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn('⚠️ GROQ_API_KEY not found in environment variables');
}

const llm = new ChatGroq({
  apiKey: GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", 
});

// ==========================================
// JSON OUTPUT PARSER (CORRECT WAY)
// ==========================================

const parser = new JsonOutputParser(); // ✅ Simple JSON parser

// ==========================================
// JSON SANITIZATION HELPER
// ==========================================

function extractAndSanitizeJSON(rawResponse) {
  let jsonStr = rawResponse;
  
  // If it's an object with content property (LangChain response format)
  if (typeof rawResponse === 'object' && rawResponse !== null) {
    if (rawResponse.content) {
      jsonStr = rawResponse.content;
    } else {
      // Already parsed object - return as is
      return rawResponse;
    }
  }
  
  // Remove markdown code blocks if present
  jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  // Trim whitespace
  jsonStr = jsonStr.trim();
  
  // Try to extract JSON object from the string
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }
  
  // Parse the JSON
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Ensure targetGroups is properly formatted as array
    if (parsed.targetGroups && !Array.isArray(parsed.targetGroups)) {
      // If it's a string, try to split it
      if (typeof parsed.targetGroups === 'string') {
        parsed.targetGroups = parsed.targetGroups.split(',').map(s => s.trim()).filter(s => s);
      } else {
        parsed.targetGroups = [];
      }
    }
    
    // Ensure impacts is properly structured
    if (parsed.impacts && typeof parsed.impacts === 'object') {
      // Clean up any stray string values that might have leaked into impacts
      const validImpactKeys = ['economicCost', 'economicBenefit', 'timeChange', 'healthImpact', 'environmentImpact', 'socialStatus'];
      const cleanedImpacts = {};
      
      for (const key of validImpactKeys) {
        if (key in parsed.impacts) {
          // Ensure numeric value
          const val = parsed.impacts[key];
          cleanedImpacts[key] = typeof val === 'number' ? val : parseFloat(val) || 0;
        } else {
          cleanedImpacts[key] = 0;
        }
      }
      
      parsed.impacts = cleanedImpacts;
    }
    
    // Ensure promises is properly structured
    if (parsed.promises && typeof parsed.promises === 'object') {
      const validPromiseKeys = ['futureEconomicBenefit', 'timeSaved', 'implementationDelay'];
      const cleanedPromises = {};
      
      for (const key of validPromiseKeys) {
        if (key in parsed.promises) {
          const val = parsed.promises[key];
          cleanedPromises[key] = typeof val === 'number' ? val : parseFloat(val) || 0;
        } else {
          cleanedPromises[key] = 0;
        }
      }
      
      parsed.promises = cleanedPromises;
    }
    
    // Ensure assumptions is an array
    if (parsed.assumptions && !Array.isArray(parsed.assumptions)) {
      if (typeof parsed.assumptions === 'string') {
        parsed.assumptions = [parsed.assumptions];
      } else {
        parsed.assumptions = [];
      }
    }
    
    return parsed;
  } catch (parseError) {
    console.error('JSON parse error:', parseError.message);
    throw new Error(`Failed to parse JSON: ${parseError.message}`);
  }
}

// ==========================================
// PROMPT TEMPLATE WITH JSON SCHEMA
// ==========================================

const policyParserTemplate = `You are an expert policy analyst specializing in Indian government policies. 

TASK: Convert the following natural language policy description into structured JSON format. 

POLICY DESCRIPTION:
{policyText}

CONTEXT:
- Country: {country}
- State: {state}
- Year: {year}

ESTIMATION GUIDELINES:

1. **economicCost/economicBenefit**: Annual ₹ per person
   - Example: Daily bus fare ↑₹1. 25 → ₹1. 25 × 365 days × 2 trips = ₹912/year
   - Example: Tax rebate ₹10,000 → economicBenefit: 10000
   - Use negative for costs, positive for benefits

2. **timeChange**: Minutes per day
   - Negative = more time spent (e.g., longer commute = -15)
   - Positive = time saved (e.g., faster service = +20)

3. **healthImpact/environmentImpact/socialStatus**: Scale -100 to +100
   - +80 to +100: Transformative positive impact
   - +40 to +79: Significant positive impact
   - +1 to +39: Moderate positive impact
   - 0: Neutral/No impact
   - -1 to -39: Moderate negative impact
   - -40 to -79: Significant negative impact
   - -80 to -100: Severe negative impact

4. **targetGroups**: Use these exact keywords (include ALL that apply):
   
   Demographics: youth, elderly, working_age, children, parents, women, men
   Income: poor, middle_class, rich, bpl, apl
   Occupation: farmer, laborer, student, entrepreneur, informal_sector, formal_sector, self_employed, unemployed
   Identity: sc, st, obc, minority
   Geography: urban, rural, semi-urban
   Domain-specific: commuter, bus_users, car_owners, taxpayer, homeowner, patients, disabled

5. **confidence**: Score 0-1 based on:
   - 0. 9-1.0: Explicit numbers in policy (e.g., "increase by ₹50")
   - 0.7-0.9: Reasonable estimates from context
   - 0.5-0.7: Vague policy, multiple assumptions needed
   - 0.3-0.5: Very uncertain, major assumptions
   - Below 0.3: Insufficient information

6. **assumptions**: List ALL assumptions you made during estimation

7. **dataQuality**: 
   - "high": Policy has specific numbers and clear targets
   - "medium": Policy has some specifics but requires estimates
   - "low": Vague policy with many unknowns

REQUIRED JSON OUTPUT STRUCTURE:
{{
  "id": "pol_[domain]_[year]_[random]",
  "title": "string (max 100 chars)",
  "description": "string",
  "domain": "transport|health|tax|education|agriculture|infrastructure|social|environment|housing|employment|technology|security|general",
  "impacts": {{
    "economicCost": number,
    "economicBenefit": number,
    "timeChange": number,
    "healthImpact": number (-100 to 100),
    "environmentImpact": number (-100 to 100),
    "socialStatus": number (-100 to 100)
  }},
  "targetGroups": ["string", "string"],
  "promises": {{
    "futureEconomicBenefit": number,
    "timeSaved": number,
    "implementationDelay": number
  }},
  "confidence": number (0-1),
  "assumptions": ["string", "string"],
  "dataQuality": "high|medium|low"
}}

CRITICAL RULES:
- Respond with ONLY valid JSON
- NO markdown code blocks
- NO explanatory text
- ALL fields are required
- Use realistic Indian context estimates
- targetGroups: List 5-8+ groups ALWAYS (be comprehensive, not narrow)

JSON OUTPUT:`;

const promptTemplate = new PromptTemplate({
  template: policyParserTemplate,
  inputVariables: ["policyText", "country", "state", "year"]
});

// ==========================================
// MAIN PARSING FUNCTION
// ==========================================

async function parseNaturalLanguagePolicy(policyText, context = {}) {
  if (! GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY not set.  Using fallback parser.');
    return fallbackPolicyParser(policyText, context);
  }

  try {
    console.log('🔍 Parsing policy with LangChain + GROQ...');
    
    // Format the prompt
    const formattedPrompt = await promptTemplate.format({
      policyText: policyText,
      country: context.country || 'India',
      state: context.state || 'Not specified',
      year: context.year || new Date().getFullYear()
    });

    // Get raw LLM response first
    const rawResponse = await llm.invoke(formattedPrompt);
    
    // Sanitize and extract JSON from response
    const sanitizedPolicy = extractAndSanitizeJSON(rawResponse);
    
    console.log('📋 Sanitized policy structure:', JSON.stringify(sanitizedPolicy, null, 2));
    
    // Validate with Zod
    const validatedPolicy = PolicySchema.parse(sanitizedPolicy);
    
    // Generate ID if not provided
    if (!validatedPolicy.id) {
      validatedPolicy.id = generatePolicyId(validatedPolicy.domain, context.year);
    }
    
    // Add description if missing
    if (!validatedPolicy.description) {
      validatedPolicy.description = policyText;
    }
    
    // Validate and enrich
    const enrichedPolicy = validateAndEnrichPolicy(validatedPolicy);

    console.log("policy parsed........................", enrichedPolicy);
    
    
    console.log('✅ Policy parsed successfully with confidence:', enrichedPolicy.confidence);
    
    return enrichedPolicy;

  } catch (error) {
    console.error('❌ Error parsing policy:', error. message);
    
    // If Zod validation fails, show details
    if (error. name === 'ZodError') {
      console.error('Validation errors:', error.errors);
    }
    
    // Try fallback parser
    console.log('🔄 Attempting fallback parser...');
    return fallbackPolicyParser(policyText, context);
  }
}

// ==========================================
// BATCH PARSING
// ==========================================

async function parsePoliciesInBatch(policyTexts, context = {}) {
  console.log(`📦 Batch parsing ${policyTexts.length} policies...`);
  
  const results = [];
  
  for (let i = 0; i < policyTexts. length; i++) {
    try {
      console.log(`\n[${i + 1}/${policyTexts.length}] Parsing... `);
      const policy = await parseNaturalLanguagePolicy(policyTexts[i], context);
      results. push({
        success: true,
        policy: policy,
        originalText: policyTexts[i]
      });
      
      // Rate limiting (Groq: 30 req/min)
      if (i < policyTexts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec delay
      }
      
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        originalText: policyTexts[i]
      });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Batch complete: ${successCount}/${policyTexts.length} successful`);
  
  return results;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generatePolicyId(domain = 'general', year = new Date().getFullYear()) {
  const domainCode = domain.substring(0, 3). toLowerCase();
  const randomCode = uuidv4().substring(0, 8);
  return `pol_${domainCode}_${year}_${randomCode}`;
}

function validateAndEnrichPolicy(policy) {
  // Clamp numeric values
  const clamp = (val, min, max) => Math. max(min, Math.min(max, val || 0));
  
  return {
    id: policy.id || generatePolicyId(policy.domain),
    title: policy.title || 'Untitled Policy',
    description: policy.description || '',
    domain: policy.domain || 'general',
    
    impacts: {
      economicCost: clamp(policy.impacts?. economicCost || 0, -1000000, 1000000),
      economicBenefit: clamp(policy.impacts?.economicBenefit || 0, 0, 1000000),
      timeChange: clamp(policy.impacts?.timeChange || 0, -300, 300),
      healthImpact: clamp(policy.impacts?.healthImpact || 0, -100, 100),
      environmentImpact: clamp(policy.impacts?.environmentImpact || 0, -100, 100),
      socialStatus: clamp(policy.impacts?.socialStatus || 0, -100, 100)
    },
    
    targetGroups: Array.isArray(policy.targetGroups) ? policy.targetGroups : [],
    
    promises: {
      futureEconomicBenefit: clamp(policy.promises?.futureEconomicBenefit || 0, 0, 10000000),
      timeSaved: clamp(policy.promises?.timeSaved || 0, 0, 300),
      implementationDelay: clamp(policy.promises?.implementationDelay || 12, 0, 120)
    },
    
    confidence: clamp(policy.confidence ),
    assumptions: Array. isArray(policy.assumptions) ?  policy.assumptions : [],
    dataQuality: policy.dataQuality || 'medium',
    
    metadata: {
      parsedAt: new Date().toISOString(),
      parserVersion: '2.0-langchain',
      model: 'llama-3. 3-70b-versatile'
    }
  };
}

// ==========================================
// FALLBACK PARSER (RULE-BASED)
// ==========================================

function fallbackPolicyParser(policyText, context = {}) {
  console.log('⚙️ Using fallback rule-based parser...');
  
  const textLower = policyText.toLowerCase();
  let domain = 'general';
  let confidence = 0.4;
  const targetGroups = [];
  const assumptions = ['Parsed using fallback rule-based system'];

  // Domain detection
  const domainKeywords = {
    transport: ['bus', 'train', 'road', 'metro', 'fare', 'commute'],
    health: ['hospital', 'health', 'doctor', 'medicine', 'vaccine'],
    tax: ['tax', 'gst', 'income', 'rebate', 'deduction'],
    education: ['school', 'college', 'student', 'education'],
    agriculture: ['farmer', 'crop', 'agriculture', 'subsidy'],
    housing: ['house', 'rent', 'housing', 'property'],
    environment: ['pollution', 'environment', 'green', 'waste'],
    employment: ['job', 'employment', 'wage', 'work']
  };

  for (const [key, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some(kw => textLower. includes(kw))) {
      domain = key;
      confidence = 0.5;
      break;
    }
  }

  // Target group detection
  const groupKeywords = {
    youth: ['youth', 'young'], elderly: ['elderly', 'senior'],
    women: ['women', 'female'], children: ['children', 'child'],
    farmer: ['farmer'], poor: ['poor', 'bpl'],
    middle_class: ['middle class'], urban: ['city', 'urban'],
    rural: ['village', 'rural']
  };

  for (const [group, keywords] of Object.entries(groupKeywords)) {
    if (keywords.some(kw => textLower.includes(kw))) {
      targetGroups. push(group);
    }
  }

  // Basic impact estimation
  let economicCost = 0;
  let economicBenefit = 0;

  if (textLower.includes('increase') && textLower.includes('fare')) {
    economicCost = 500;
    assumptions.push('Estimated ₹500/year fare increase');
  }
  if (textLower.includes('free') || textLower.includes('subsidy')) {
    economicBenefit = 1000;
    assumptions.push('Estimated ₹1000/year benefit');
  }

  return {
    id: generatePolicyId(domain, context. year),
    title: policyText. substring(0, 100) || 'Policy Description',
    description: policyText,
    domain: domain,
    impacts: {
      economicCost, economicBenefit,
      timeChange: 0, healthImpact: 0,
      environmentImpact: 0, socialStatus: 0
    },
    targetGroups: targetGroups. length > 0 ? targetGroups : ['general_public'],
    promises: { futureEconomicBenefit: 0, timeSaved: 0, implementationDelay: 12 },
    confidence, assumptions,
    dataQuality: 'low',
    metadata: {
      parsedAt: new Date().toISOString(),
      parserVersion: '2.0-fallback',
      model: 'rule-based'
    }
  };
}

// ==========================================
// EXPORTS
// ==========================================

export {
  parseNaturalLanguagePolicy,
  parsePoliciesInBatch,
  generatePolicyId,
  validateAndEnrichPolicy
};