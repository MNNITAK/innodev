# State Data to Human Generation Pipeline

## Overview

This document explains how state-level demographic and socio-economic factors are used to generate realistic synthetic human populations distributed across Indian districts. The pipeline transforms raw statistical data from `state_data/` JSON files into detailed individual human profiles with interconnected social networks.

---

## Architecture

```
state_data/*.json (Regional Factors)
         ↓
StatePopulationGenerator
         ↓
FamilyClusterer (Create Households)
         ↓
Individual Humans with Profiles
         ↓
FriendNetworkBuilder (Create Connections)
         ↓
Complete Population Graph
         ↓
human_data/{State}/ (Output)
```

---

## 1. State Data Structure

### Location
- **Files**: `state_data/*.json` (e.g., `UP.json`, `Maharashtra.json`)
- **Format**: JSON with divisions and factors
- **Coverage**: 25 Indian states and union territories

### Data Format Example

```json
{
  "divisions": [
    {
      "name": "Agra",
      "factors": [
        {
          "name": "1.1 Age Mean",
          "value": 0.38
        },
        {
          "name": "1.2 Household Size",
          "value": 0.48
        },
        {
          "name": "1.3 Sex Ratio",
          "value": 0.129
        },
        {
          "name": "1.4 Urbanization Category",
          "value": 0.5
        },
        ...
      ]
    }
  ]
}
```

### Key Factors Categories

#### **1. Demographics** (Factors 1.1 - 1.7)
- **1.1 Age Mean**: Average age distribution (normalized 0-1)
- **1.2 Household Size**: Average members per household
- **1.3 Sex Ratio**: Male-to-female distribution
- **1.4 Urbanization Category**: Urban/Semi-Urban/Rural classification (0-1)
- **1.5 Religion**: Religious composition (Hindu %, Muslim %, etc.)
- **1.6 Caste/Tribe**: SC/ST/OBC/General distribution
- **1.7 Tribal Concentration**: Percentage of tribal population

#### **2. Socio-Economic** (Factors 2.x)
- Income per capita levels
- Poverty status indicators
- Literacy rates
- Education level distribution
- Occupational profiles (Agriculture, Services, Business, etc.)
- Employment type (Formal, Informal, Self-employed)
- Wealth quintiles (Q1-Q5)

#### **3. Health** (Factors 3.x)
- Healthcare access scores (0-100)
- Health literacy levels
- Nutritional status (BMI categories)
- Disease risk indicators
- Vaccination coverage

#### **4. Housing & Infrastructure** (Factors 4.x - 6.x)
- Housing type (Owned, Rented, Joint family)
- Housing cost burden
- Water access and sanitation
- Electricity connectivity

#### **5. Economic Stability** (Factors 7.x)
- Income stability index
- Debt vulnerability
- Savings rate capacity

#### **6. Transportation & Mobility** (Factors 8.x)
- Vehicle ownership rates
- Public transportation access
- Average commute time

#### **7. Political Engagement** (Factors 9.x)
- Political participation scores
- Voting behavior history
- Party affinity indicators
- Policy interest levels

#### **8. Digital Inclusion** (Factors 10.x)
- Internet connectivity rates
- Digital literacy scale
- Digital services access

#### **9. Environmental** (Factors 11.x)
- Pollution exposure (AQI)
- Environmental health indicators

#### **10. Social Context** (Factors 12.x)
- Family influence scores
- Peer influence levels
- Community engagement
- Online presence

---

## 2. Human Generation Pipeline

### Step 1: Load State Data
```javascript
const stateDataPath = `state_data/${stateName}.json`;
const stateData = JSON.parse(fs.readFileSync(stateDataPath, 'utf8'));
```

The system loads all divisions (districts/clusters) within a state and their associated factor values.

### Step 2: Population Distribution Across Districts

**Formula**: Population is distributed proportionally based on factor characteristics:
```
divisionPopulation = targetPopulation × (divisionWeight / totalWeight)
```

Each division's weight is calculated from its factors - larger households, higher urbanization, and other characteristics influence population allocation.

**Example**: If UP state needs 160 humans (16% of 1000):
- Agra district: ~35 humans (23% of UP's population)
- Varanasi district: ~28 humans (17% of UP's population)
- Lucknow district: ~32 humans (20% of UP's population)
- etc.

### Step 3: Household Clustering (FamilyClusterer)

For each district, humans are organized into households using factor data:

**Process**:
1. Calculate target household count from average household size factor
2. Create household groups using the "Household Size" factor
3. Assign IDs to households: `HH_{State}_{District}_{Number}`

**Factor Application**:
```javascript
factorMap = {
  "1.2 Household Size": 0.48,      // Used to determine family sizes
  "1.3 Sex Ratio": 0.129,          // Determines male/female distribution
  "1.4 Urbanization Category": 0.5 // Affects housing structure
}
```

### Step 4: Human Profile Generation

For each human in a household, detailed profiles are created using the district's factors:

#### Demographics Profile
- **Age**: Derived from "1.1 Age Mean" factor
- **Sex/Gender**: From "1.3 Sex Ratio"
- **Household Size**: From "1.2 Household Size"
- **Urbanization**: From "1.4 Urbanization Category"
- **Religion**: From "1.5 Religion Hindu %" (determines which religion)
- **Caste**: From "1.6 Caste SC %" and similar factors
- **Tribal Status**: From "1.7 Tribal Concentration %"

#### Socio-Economic Profile
- **Income**: Determined by wealth quintile implied by socio-economic factors
- **Literacy**: From socio-economic literacy factors
- **Education Level**: From education level factors
- **Occupation**: From occupational distribution factors
- **Employment Type**: From employment type factors

#### Behavioral Profile
- **Caste Consciousness**: Influenced by caste concentration and religion factors
- **Risk Tolerance**: From income stability and economic factors
- **Institutional Trust**: From governance indicators
- **Change Adaptability**: From urbanization level
- **Optimism**: From health and economic factors

#### Health Profile
- **Healthcare Access**: From factor "3.1 Healthcare Access"
- **Health Literacy**: From health education factors
- **BMI/Nutrition**: From nutritional status factors
- **Disease Risk**: From health risk factors

#### Other Profiles
- **Political Engagement**: From political engagement factors
- **Digital Literacy**: From digital inclusion factors (10.x)
- **Housing Type**: From housing factors (4.x)
- **Social Context**: From social engagement factors

**Example Human Profile Generated from Agra Factors**:
```json
{
  "humanId": "HUM_UP_Agra_0001",
  "householdId": "HH_UP_Agra_0",
  "state": "UP",
  "district": "Agra",
  "demographics": {
    "age": 38,              // From "1.1 Age Mean" = 0.38
    "sex": "Male",          // From "1.3 Sex Ratio" = 0.129
    "householdSize": 4,     // From "1.2 Household Size" = 0.48
    "urbanization": "Semi-Urban",  // From "1.4 Urbanization" = 0.5
    "religion": "Hindu",    // From "1.5 Religion Hindu %" = 0.76
    "caste": "SC"           // From "1.6 Caste SC %" = 0.2
  },
  "socioEconomic": {
    "incomePerCapita": 8500,
    "literacy": 1,
    "educationLevel": 3,
    "occupation": "Agriculture",
    "employmentType": "Informal",
    "wealthQuintile": "Q2"
  },
  "behavioral": {
    "casteConsciousness": 4,
    "riskTolerance": 2,
    "institutionalTrust": 55,
    "changeAdaptability": 3,
    "optimism": 3
  },
  "health": {
    "healthcareAccess": 42,         // From factor "3.1"
    "healthLiteracy": 2,
    "nutritionalStatus": { "bmi": 24.5, "category": "Normal" },
    "diseaseRisk": 45
  },
  "politicalProfile": {
    "politicalEngagement": 3,       // From factor "9.x"
    "voteHistory": 1,
    "partyAffinity": "BJP",
    "policyInterest": 2
  },
  "digitalProfile": {
    "internetConnectivity": 0.5,    // From factor "10.1"
    "digitalLiteracy": 2,           // From factor "10.2"
    "digitalServicesAccess": 42     // From factor "10.3"
  }
}
```

---

## 3. District Clustering Strategy

### Multiple District Clusters per State

Each state can have multiple districts (division clusters):

**Example - UP State**:
- Agra (historical/cultural cluster)
- Varanasi (religious/cultural cluster)
- Lucknow (urban/administrative cluster)
- Kanpur (industrial cluster)
- Allahabad (educational/religious cluster)
- Mathura (religious/tourism cluster)
- Ghaziabad (urban/industrial cluster)

### Factor Variations Across Districts

Each district maintains its own factor values, creating natural variations:

| Factor | Agra | Lucknow | Varanasi |
|--------|------|---------|----------|
| Age Mean | 0.38 | 0.42 | 0.39 |
| Household Size | 0.48 | 0.45 | 0.50 |
| Urbanization | 0.50 | 0.75 | 0.45 |
| Religion Hindu % | 0.76 | 0.72 | 0.82 |
| Literacy | 0.68 | 0.75 | 0.62 |
| Income (Wealth Q) | Q2-Q3 | Q3-Q4 | Q2 |

### Impact on Human Profiles

**Lucknow Cluster** (Urban):
- Higher urbanization factor → More urban residents
- Higher literacy → Better educated population
- Higher income factors → Wealthier demographics
- More formal employment

**Varanasi Cluster** (Religious):
- Higher religion factors → Stronger religious orientation
- Higher caste consciousness → More caste-aware population
- Lower urbanization → More rural/semi-rural
- Different occupational mix (tourism, pilgrimage services)

**Agra Cluster** (Mixed):
- Medium urbanization → Semi-urban mix
- Historical heritage factors → Tourism-related occupations
- Mixed wealth quintiles
- Balanced demographics

---

## 4. Data Flow Example: Generating 1000 Humans for UP

### Input
- **Target Population**: 1000 humans
- **State**: UP (16% national population = 160 humans)
- **State Data File**: `state_data/UP.json` with 7 divisions

### Process

```
UP Division List:
├─ Agra (23% of 160 = 37 humans)
├─ Varanasi (18% of 160 = 29 humans)
├─ Lucknow (20% of 160 = 32 humans)
├─ Kanpur (15% of 160 = 24 humans)
├─ Allahabad (12% of 160 = 19 humans)
├─ Mathura (8% of 160 = 13 humans)
└─ Ghaziabad (4% of 160 = 6 humans)
   Total: 160 humans
```

For each district, generate households and humans:
- **Agra**: 37 humans → ~9 households (avg 4.1 per household)
- **Lucknow**: 32 humans → ~8 households (avg 4.0 per household)
- etc.

### Output Structure
```
human_data/UP/
├─ _summary.json (aggregate stats)
├─ Agra/
│  ├─ humans.json (37 human profiles)
│  ├─ households.json (9 household groups)
│  └─ connections.json (social network)
├─ Lucknow/
│  ├─ humans.json (32 human profiles)
│  ├─ households.json (8 household groups)
│  └─ connections.json (social network)
└─ ... other districts
```

---

## 5. Social Network Generation

### Family Connections
- Humans in same household are connected as family
- Connection weight: Strong (0.9+)
- Connection type: "family"

### Friend Networks
- Built using **FriendNetworkBuilder**
- Average 5 friends per person
- Geographic proximity: Friends more likely from same or nearby districts
- Connection type: "friend"

### Weak Ties
- Added for network resilience
- Connect distant clusters
- Enable information flow across districts
- Connection type: "weak_tie"

**Example Network for 1 Human**:
```
HUM_UP_Agra_0001
├─ Family (2 edges): Father, Sister
├─ Friends (5 edges): {Agra: 3, Mathura: 1, Lucknow: 1}
└─ Weak Ties (1 edge): Distant contact in Kanpur
   Total: 8 connections
```

---

## 6. Key Data Transformations

### Factor Normalization
All factors stored as normalized values (0-1) for consistency:
- Age mean 0.38 → actual age calculated with distribution
- Income Q1 0.25 → income range within that quintile
- Urbanization 0.5 → 50% urban characteristics

### Stochastic Generation
While factors provide mean/probability, actual values are stochastically generated:
```javascript
// Factor: Age Mean = 0.38
// Translates to: Age range 18-85, mean ~38 years
actualAge = generateFromDistribution(mean: 38, std: 15);
// Possible result: 42, 35, 51, etc.
```

### Factor Maps
During generation, factors are converted to lookup maps for efficiency:
```javascript
const factorMap = {
  "1.1 Age Mean": 0.38,
  "1.2 Household Size": 0.48,
  "1.3 Sex Ratio": 0.129,
  // ... all factors accessible by name
};
```

---

## 7. State-District Hierarchy

### Three-Level Structure
```
National Level (1000 humans)
├─ State Level (e.g., UP: 160 humans, 16%)
│  ├─ Division/District Level 1 (Agra: 37 humans)
│  │  ├─ Household 1: {Human 1, Human 2}
│  │  ├─ Household 2: {Human 3}
│  │  └─ Household 3: {Human 4, Human 5, Human 6}
│  │
│  ├─ Division/District Level 2 (Lucknow: 32 humans)
│  │  └─ ... household structure
│  │
│  └─ Division/District Level 7 (Ghaziabad: 6 humans)
│     └─ ... household structure
│
├─ State 2 (Maharashtra: 100 humans)
└─ State N
```

### Weighted Distribution
- States: Weighted by real population ratios
- Districts within state: Weighted by factor values (urbanization, literacy, income, etc.)
- Households: Determined by household size factor
- Individuals: Created within household context

---

## 8. Quality Assurance

### Data Consistency Checks
1. **Population**: Total humans match target
2. **Household Integrity**: Every human belongs to exactly one household
3. **Network Validity**: All connections reference valid humans
4. **Factor Boundaries**: All generated values within 0-100 range where applicable

### Validation
```javascript
// Population validation
assert(allHumans.length === targetPopulation);

// Household validation  
assert(allHumans.every(h => h.householdId));

// Network validation
assert(allConnections.every(c => 
  humansById[c.from] && humansById[c.to]
));
```

---

## 9. Usage Examples

### Generate Population for Single State
```bash
node utils/generatePopulation.js 160 UP
```
Creates 160 humans distributed across UP's 7 divisions using factors from `state_data/UP.json`

### Generate National Population
```bash
node utils/generatePopulation.js 1000
```
Creates 1000 humans across all 25 states using their respective state data and population ratios

### Using Generated Data
```javascript
import StatePopulationGenerator from './State_api/StatePopulationGenerator.js';

const result = await StatePopulationGenerator.generateStatePopulation('UP', 160);
// result = { 
//   stateData: [...],
//   graph: populationGraph,
//   stats: { ... }
// }
```

---

## 10. File Organization

```
server/
├─ state_data/
│  ├─ UP.json              ← Raw factors for UP state
│  ├─ Maharashtra.json
│  ├─ Bihar.json
│  └─ ... (25 state files)
│
├─ human_data/             ← Generated human populations
│  ├─ UP/
│  │  ├─ Agra/
│  │  │  ├─ humans.json
│  │  │  ├─ households.json
│  │  │  └─ connections.json
│  │  ├─ Lucknow/
│  │  │  └─ ...
│  │  └─ _summary.json
│  ├─ Maharashtra/
│  │  └─ ... (similar structure)
│  └─ ... (25 state directories)
│
├─ State_api/
│  └─ StatePopulationGenerator.js  ← Main generator
│
├─ utils/
│  ├─ generatePopulation.js        ← CLI entry point
│  ├─ familyClusterer.js           ← Household creation
│  └─ friendNetworkBuilder.js      ← Social networks
│
└─ ... (other components)
```

---

## 11. Factor Reference Guide

### Quick Lookup: What Factor Controls What?

| Human Attribute | Controlling Factor(s) |
|-----------------|----------------------|
| Age | 1.1 Age Mean |
| Gender Distribution | 1.3 Sex Ratio |
| Household Formation | 1.2 Household Size |
| Urban/Rural Split | 1.4 Urbanization Category |
| Religion | 1.5 Religion Hindu % (+ variants) |
| Caste | 1.6 Caste SC %, OBC %, etc. |
| Income Level | 2.x Socio-Economic factors |
| Education | 2.3 Literacy, 2.4 Education Level |
| Occupation | 2.5 Occupation distribution |
| Healthcare Access | 3.1 Healthcare Access |
| Housing Type | 4.1 Housing Type |
| Digital Literacy | 10.2 Digital Literacy Scale |
| Political Engagement | 9.x Political factors |
| Environmental Exposure | 11.x Pollution & Environment |

---

## Summary

The state data to human generation pipeline transforms district-level demographic and socio-economic factors into realistic synthetic populations. Each state is subdivided into districts (clusters), with population distributed across them based on factor-weighted calculations. For each human, comprehensive profiles are generated using normalized factors, with natural variations across districts. The result is a hierarchical population structure with interconnected social networks, grounded in real-world statistical distributions.

