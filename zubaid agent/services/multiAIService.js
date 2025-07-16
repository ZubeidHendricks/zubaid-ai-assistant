// Multi-AI Provider Service
// Integrates Google AI, OpenAI, and Anthropic for specialized tasks

const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Multi-AI Service that routes different tasks to the best AI provider
 */
class MultiAIService {
  constructor() {
    // Store API keys for lazy initialization
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    
    // Initialize clients lazily to avoid startup delays
    this.googleAI = null;
    this.googleModel = null;
    this.openai = null;
    this.anthropic = null;
    
    console.log('🤖 Multi-AI Service Initialized (Lazy Loading):');
    console.log(`   Google AI: ${this.googleApiKey ? '🔑 Key Available' : '❌ No API Key'}`);
    console.log(`   OpenAI: ${this.openaiApiKey ? '🔑 Key Available' : '❌ No API Key'}`);
    console.log(`   Anthropic: ${this.anthropicApiKey ? '🔑 Key Available' : '❌ No API Key'}`);
  }

  // Lazy initialization for Google AI
  getGoogleAI() {
    if (!this.googleAI && this.googleApiKey) {
      try {
        this.googleAI = new GoogleGenerativeAI(this.googleApiKey);
        this.googleModel = this.googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('✅ Google AI client initialized');
      } catch (error) {
        console.error('❌ Google AI initialization failed:', error.message);
      }
    }
    return this.googleModel;
  }

  // Lazy initialization for OpenAI
  getOpenAI() {
    if (!this.openai && this.openaiApiKey) {
      try {
        this.openai = new OpenAI({ apiKey: this.openaiApiKey });
        console.log('✅ OpenAI client initialized');
      } catch (error) {
        console.error('❌ OpenAI initialization failed:', error.message);
      }
    }
    return this.openai;
  }

  // Lazy initialization for Anthropic
  getAnthropic() {
    if (!this.anthropic && this.anthropicApiKey) {
      try {
        this.anthropic = new Anthropic({ apiKey: this.anthropicApiKey });
        console.log('✅ Anthropic client initialized');
      } catch (error) {
        console.error('❌ Anthropic initialization failed:', error.message);
      }
    }
    return this.anthropic;
  }

  /**
   * Route agent function to the best AI provider based on task type
   */
  async callAgentFunction(agentName, functionName, params) {
    const taskType = this.getTaskType(agentName, functionName);
    
    try {
      switch (taskType) {
        case 'creative':
          return await this.callOpenAI(agentName, functionName, params);
        case 'reasoning':
          return await this.callAnthropic(agentName, functionName, params);
        case 'visual':
          return await this.callOpenAIVisual(agentName, functionName, params);
        default:
          return await this.callGoogleAI(agentName, functionName, params);
      }
    } catch (error) {
      console.error(`❌ Multi-AI call failed for ${agentName}.${functionName}:`, error.message);
      // Fallback to Google AI if other providers fail
      return await this.callGoogleAI(agentName, functionName, params);
    }
  }

  /**
   * Determine the best AI provider for a specific task
   */
  getTaskType(agentName, functionName) {
    // Creative tasks -> OpenAI (GPT-4 for creative writing, ideation)
    if (agentName === 'blake' || functionName.includes('generate') || functionName.includes('create_messaging')) {
      return this.openaiApiKey ? 'creative' : 'strategic';
    }

    // Visual/Image tasks -> OpenAI (DALL-E integration potential)
    if (agentName === 'zara' && (functionName.includes('design') || functionName.includes('visual'))) {
      return this.openaiApiKey ? 'visual' : 'strategic';
    }

    // Complex reasoning -> Anthropic Claude (analysis, strategy, quality control)
    if (agentName === 'alex' && functionName === 'analyze_project_brief') {
      return this.anthropicApiKey ? 'reasoning' : 'strategic';
    }

    // Strategic tasks -> Google AI (default, working well)
    return 'strategic';
  }

  /**
   * Call Google AI (current working implementation)
   */
  async callGoogleAI(agentName, functionName, params) {
    const googleModel = this.getGoogleAI();
    if (!googleModel) throw new Error('Google AI not available');
    
    const prompt = this.buildPrompt(agentName, functionName, params);
    const result = await googleModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return this.parseResponse(text, agentName, functionName, 'google');
  }

  /**
   * Call OpenAI GPT-4 for creative tasks
   */
  async callOpenAI(agentName, functionName, params) {
    const openai = this.getOpenAI();
    if (!openai) throw new Error('OpenAI not available');

    const prompt = this.buildPrompt(agentName, functionName, params);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional brand agency AI. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const text = completion.choices[0].message.content;
    return this.parseResponse(text, agentName, functionName, 'openai');
  }

  /**
   * Call Anthropic Claude for advanced reasoning
   */
  async callAnthropic(agentName, functionName, params) {
    const anthropic = this.getAnthropic();
    if (!anthropic) throw new Error('Anthropic not available');

    const prompt = this.buildPrompt(agentName, functionName, params);

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 2000,
      temperature: 0.3,
      system: "You are a professional brand agency AI. Always respond with valid JSON only.",
      messages: [{ role: "user", content: prompt }]
    });

    const text = message.content[0].text;
    return this.parseResponse(text, agentName, functionName, 'anthropic');
  }

  /**
   * Call OpenAI for visual/image generation tasks
   */
  async callOpenAIVisual(agentName, functionName, params) {
    // For now, use GPT-4 for visual descriptions
    // Later can integrate DALL-E for actual image generation
    return await this.callOpenAI(agentName, functionName, params);
  }

  /**
   * Generate image with DALL-E (future enhancement)
   */
  async generateImage(prompt, style = "professional") {
    if (!this.openai) throw new Error('OpenAI not available for image generation');

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: `${prompt}. Style: ${style}, professional brand design, clean, modern`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      return {
        imageUrl: response.data[0].url,
        prompt: prompt,
        style: style,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      return null;
    }
  }

  /**
   * Build prompts (reuse existing logic from GoogleAI service)
   */
  buildPrompt(agentName, functionName, params) {
    // Import the existing prompt building logic
    const GoogleAIService = require('./googleAIService');
    const tempService = new GoogleAIService.GoogleAIPoweredADKClient();
    return tempService.buildAgentPrompt(agentName, functionName, params);
  }

  /**
   * Parse AI responses consistently
   */
  parseResponse(text, agentName, functionName, provider) {
    try {
      // Clean the response
      let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse JSON
      const parsed = JSON.parse(cleanText);
      
      // Add metadata
      parsed._metadata = {
        source: provider.toUpperCase(),
        agentName: agentName,
        functionName: functionName,
        timestamp: new Date().toISOString(),
        provider: provider
      };
      
      return parsed;
      
    } catch (error) {
      console.error(`❌ Failed to parse ${provider} response:`, error);
      throw new Error(`Response parsing failed for ${provider}`);
    }
  }

  /**
   * Get provider status for monitoring
   */
  getProviderStatus() {
    return {
      google: !!this.googleApiKey,
      openai: !!this.openaiApiKey,
      anthropic: !!this.anthropicApiKey,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { MultiAIService };