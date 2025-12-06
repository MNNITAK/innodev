/**
 * Realistic distribution utilities for population generation
 * Supports various statistical distributions with denormalization
 */

class DistributionUtils {
  /**
   * Gaussian/Normal distribution using Box-Muller transform
   * @param {number} mean - Expected mean
   * @param {number} stdev - Standard deviation
   * @returns {number}
   */
  static gaussian(mean = 0, stdev = 1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdev;
  }

  /**
   * Weibull distribution for modeling age/income skews
   * @param {number} shape - Shape parameter (k)
   * @param {number} scale - Scale parameter (λ)
   * @returns {number}
   */
  static weibull(shape = 2, scale = 1) {
    const u = Math.random();
    return scale * Math.pow(-Math.log(u), 1 / shape);
  }

  /**
   * Lognormal distribution (often better for income)
   * @param {number} mu - Log-mean
   * @param {number} sigma - Log-std
   * @returns {number}
   */
  static lognormal(mu = 0, sigma = 1) {
    return Math.exp(this.gaussian(mu, sigma));
  }

  /**
   * Beta distribution (useful for percentages 0-1)
   * @param {number} alpha - Shape parameter
   * @param {number} beta - Shape parameter
   * @returns {number}
   */
  static beta(alpha = 2, beta = 2) {
    let ga = this.gamma(alpha, 1);
    let gb = this.gamma(beta, 1);
    return ga / (ga + gb);
  }

  /**
   * Gamma distribution helper
   * @param {number} shape
   * @param {number} rate
   * @returns {number}
   */
  static gamma(shape, rate) {
    let d = shape - 1 / 3;
    let c = 1 / Math.sqrt(9 * d);
    let z, v, u;
    do {
      do {
        z = this.gaussian();
        v = 1 + c * z;
      } while (v <= 0);
      v = v * v * v;
      u = Math.random();
    } while (u > 1 - 0.0331 * z * z * z * z && Math.log(u) > 0.5 * z * z + d * (1 - v + Math.log(v)));
    return d * v / rate;
  }

  /**
   * Denormalize normalized value to actual range
   * @param {number} normalized - Value in [0, 1]
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number}
   */
  static denormalize(normalized, min, max) {
    return min + (normalized * (max - min));
  }

  /**
   * Normalize value to [0, 1] range
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  static normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  /**
   * Sample categorical based on probabilities
   * @param {string[]} categories
   * @param {number[]} probabilities
   * @returns {string}
   */
  static sampleCategorical(categories, probabilities) {
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < categories.length; i++) {
      sum += probabilities[i] || 0;
      if (rand < sum) return categories[i];
    }
    return categories[categories.length - 1];
  }

  /**
   * Add realistic variation to a base value
   * @param {number} baseValue
   * @param {number} variationPercent - % variation
   * @returns {number}
   */
  static addVariation(baseValue, variationPercent = 10) {
    const variation = (Math.random() - 0.5) * 2 * (variationPercent / 100);
    return baseValue * (1 + variation);
  }

  /**
   * Create age distribution based on demographic data
   * @param {number} ageMeanNormalized - Normalized age mean [0,1]
   * @param {number} count - Number of ages to generate
   * @returns {number[]}
   */
  static generateAgeDistribution(ageMeanNormalized, count) {
    const minAge = 18;
    const maxAge = 85;
    const meanAge = this.denormalize(ageMeanNormalized, minAge, maxAge);
    const stdev = (maxAge - minAge) / 5;
    
    const ages = [];
    for (let i = 0; i < count; i++) {
      let age = Math.round(this.gaussian(meanAge, stdev));
      age = Math.max(minAge, Math.min(maxAge, age));
      ages.push(age);
    }
    return ages;
  }

  /**
   * Create income distribution with realistic skew
   * @param {number} incomeMeanNormalized - Normalized income mean
   * @param {number} count - Number of incomes
   * @returns {number[]}
   */
  static generateIncomeDistribution(incomeMeanNormalized, count) {
    const minIncome = 500;
    const maxIncome = 50000;
    const meanIncome = this.denormalize(incomeMeanNormalized, minIncome, maxIncome);
    
    const incomes = [];
    for (let i = 0; i < count; i++) {
      const income = Math.round(this.lognormal(Math.log(meanIncome), 0.5));
      incomes.push(Math.max(minIncome, Math.min(maxIncome, income)));
    }
    return incomes;
  }
}

export default DistributionUtils;
