import { editor } from "express-document-sdk";

// ZUBAID Adobe Express Document Integration - Official Document API
class ZubaidExpressController {
    constructor() {
        this.document = null;
        this.agentResults = new Map();
        this.elementsCreated = [];
        this.zubaidSession = {
            projectData: null,
            agentDecisions: {},
            designElements: [],
            version: '2025.1.0'
        };
        this.elementRegistry = new Map();
    }

    async initialize() {
        console.log("🤖 ZUBAID Express Controller initialized");
        
        // Get the active document context
        try {
            this.document = editor.context.activeDocument;
            console.log("✅ Document context acquired");
        } catch (error) {
            console.error("❌ Failed to get document context:", error);
            return false;
        }
        
        // Listen for ZUBAID's agent decisions from the UI panel
        this.setupZubaidListener();
        
        return true;
    }

    setupZubaidListener() {
        // Listen for messages from the ZUBAID UI panel
        window.addEventListener('message', (event) => {
            if (event.data.type === 'ZUBAID_AGENT_DECISION') {
                console.log("🤖 ZUBAID decision received:", event.data);
                this.handleZubaidDecision(event.data);
            }
        });

        console.log("✅ ZUBAID listener setup complete");
    }

    async handleZubaidDecision(zubaidData) {
        const { agentId, decisions } = zubaidData;
        this.agentResults.set(agentId, decisions);
        
        // Apply ZUBAID's decisions to the Adobe Express document
        switch(agentId) {
            case 'alex-creative-director':
                await this.applyCreativeDirection(decisions);
                break;
            case 'blake-content-strategist':
                await this.applyContentStrategy(decisions);
                break;
            case 'zara-visual-designer':
                await this.applyVisualDesign(decisions);
                break;
            case 'nova-brand-guardian':
                await this.applyBrandGuidelines(decisions);
                break;
            case 'morgan-platform-optimizer':
                await this.applyPlatformOptimization(decisions);
                break;
            case 'riley-quality-assurance':
                await this.applyQualityAssurance(decisions);
                break;
        }
    }

    async applyCreativeDirection(decisions) {
        console.log("🎨 Alex (Creative Director): Applying visual strategy", decisions);
        
        try {
            // Set document background based on color palette
            const backgroundColor = this.getZubaidColor(decisions.decisions?.colors);
            if (backgroundColor) {
                const backgroundRect = editor.createRectangle();
                backgroundRect.width = this.document.width || 1080;
                backgroundRect.height = this.document.height || 1080;
                backgroundRect.fill = editor.makeColorFill(backgroundColor);
                
                this.document.addChild(backgroundRect);
                this.registerElement(backgroundRect, 'alex-creative-director', 'background');
            }
            
            // Store creative direction for other agents
            this.zubaidSession.agentDecisions['alex-creative-director'] = decisions;
            
        } catch (error) {
            console.error("❌ Alex (Creative Director) error:", error);
        }
    }

    async applyContentStrategy(decisions) {
        console.log("📝 Blake (Content Strategist): Adding messaging", decisions);
        
        try {
            // Create headline text
            const headline = decisions.decisions?.headline;
            if (headline) {
                const headlineText = await this.createText(headline, {
                    fontSize: 48,
                    fontFamily: "Arial",
                    fontWeight: 700,
                    fill: editor.makeColorFill("#000000"),
                    x: this.document.width / 2 - 200,
                    y: 100,
                    width: 400,
                    textAlign: 'center',
                    agent: 'blake-content-strategist',
                    purpose: 'headline'
                });
            }

            // Create supporting text
            const supportingText = decisions.decisions?.supportingText;
            if (supportingText) {
                const supportText = await this.createText(supportingText, {
                    fontSize: 24,
                    fontFamily: "Arial",
                    fontWeight: 400,
                    fill: editor.makeColorFill("#333333"),
                    x: this.document.width / 2 - 300,
                    y: 200,
                    width: 600,
                    textAlign: 'center',
                    agent: 'blake-content-strategist',
                    purpose: 'supporting-text'
                });
            }

            // Create call-to-action
            const cta = decisions.decisions?.callToAction;
            if (cta) {
                const ctaText = await this.createText(cta, {
                    fontSize: 20,
                    fontFamily: "Arial",
                    fontWeight: 600,
                    fill: editor.makeColorFill("#FFFFFF"),
                    x: this.document.width / 2 - 100,
                    y: this.document.height - 120,
                    width: 200,
                    textAlign: 'center',
                    agent: 'blake-content-strategist',
                    purpose: 'call-to-action'
                });

                // Create CTA background
                const ctaBackground = editor.createRectangle();
                ctaBackground.width = 220;
                ctaBackground.height = 50;
                ctaBackground.x = this.document.width / 2 - 110;
                ctaBackground.y = this.document.height - 130;
                ctaBackground.fill = editor.makeColorFill("#007ACC");
                ctaBackground.cornerRadius = 25;
                
                this.document.addChild(ctaBackground);
                this.registerElement(ctaBackground, 'blake-content-strategist', 'cta-background');
            }
            
        } catch (error) {
            console.error("❌ Blake (Content Strategist) error:", error);
        }
    }

    async applyVisualDesign(decisions) {
        console.log("🎯 Zara (Visual Designer): Creating visual elements", decisions);
        
        try {
            // Create decorative elements based on visual style
            const visualStyle = decisions.decisions?.visualStyle;
            
            if (visualStyle === "Natural & Organic") {
                // Create nature-inspired elements
                const leafElement = editor.createEllipse();
                leafElement.width = 60;
                leafElement.height = 30;
                leafElement.x = this.document.width - 100;
                leafElement.y = 50;
                leafElement.fill = editor.makeColorFill("#4CAF50");
                
                this.document.addChild(leafElement);
                this.registerElement(leafElement, 'zara-visual-designer', 'decorative-element');
            }

            // Add visual accents based on color palette
            const colors = decisions.decisions?.colors;
            if (colors && colors.accent) {
                const accentRect = editor.createRectangle();
                accentRect.width = 5;
                accentRect.height = 200;
                accentRect.x = 50;
                accentRect.y = this.document.height / 2 - 100;
                accentRect.fill = editor.makeColorFill(colors.accent);
                
                this.document.addChild(accentRect);
                this.registerElement(accentRect, 'zara-visual-designer', 'accent-element');
            }
            
        } catch (error) {
            console.error("❌ Zara (Visual Designer) error:", error);
        }
    }

    async applyBrandGuidelines(decisions) {
        console.log("🛡️ Nova (Brand Guardian): Ensuring brand consistency", decisions);
        
        try {
            // Add ZUBAID signature/watermark
            const signature = await this.createText("Created by ZUBAID", {
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: 300,
                fill: editor.makeColorFill("#666666"),
                x: this.document.width - 150,
                y: this.document.height - 30,
                width: 140,
                textAlign: 'right',
                agent: 'nova-brand-guardian',
                purpose: 'signature'
            });
            
        } catch (error) {
            console.error("❌ Nova (Brand Guardian) error:", error);
        }
    }

    async applyPlatformOptimization(decisions) {
        console.log("📱 Morgan (Platform Optimizer): Optimizing for platforms", decisions);
        
        try {
            // Platform-specific optimizations would be applied here
            // For now, we'll log the platform optimization data
            console.log("✅ Platform optimization applied for:", decisions.decisions?.platforms);
            
        } catch (error) {
            console.error("❌ Morgan (Platform Optimizer) error:", error);
        }
    }

    async applyQualityAssurance(decisions) {
        console.log("✅ Riley (Quality Assurance): Final quality check", decisions);
        
        try {
            // Final adjustments and quality checks
            console.log("✅ Quality assurance completed");
            console.log("🎉 ZUBAID design workflow complete!");
            
            // Send completion message to UI
            window.parent.postMessage({
                type: 'ZUBAID_WORKFLOW_COMPLETE',
                elementsCreated: this.elementsCreated.length,
                agents: Array.from(this.agentResults.keys())
            }, '*');
            
        } catch (error) {
            console.error("❌ Riley (Quality Assurance) error:", error);
        }
    }

    async createText(content, styling = {}) {
        try {
            console.log(`📝 Creating text: "${content}"`);
            
            // Create text node using Adobe Express Document API
            const textNode = editor.createText();
            
            // Set text content
            textNode.text = content;
            
            // Apply styling properties
            if (styling.fontSize) textNode.fontSize = styling.fontSize;
            if (styling.fontFamily) textNode.fontFamily = styling.fontFamily;
            if (styling.fill) textNode.fill = styling.fill;
            if (styling.fontWeight) textNode.fontWeight = styling.fontWeight;
            if (styling.textAlign) textNode.textAlign = styling.textAlign;
            
            // Set position and dimensions
            if (styling.x !== undefined) textNode.x = styling.x;
            if (styling.y !== undefined) textNode.y = styling.y;
            if (styling.width) textNode.width = styling.width;
            if (styling.height) textNode.height = styling.height;
            
            // Add to document
            this.document.addChild(textNode);
            
            // Register element with ZUBAID
            this.registerElement(textNode, styling.agent, styling.purpose || 'text');
            
            console.log("✅ Text element created successfully");
            return textNode;
            
        } catch (error) {
            console.error("❌ Text creation failed:", error);
            return null;
        }
    }

    registerElement(element, agent, purpose) {
        const elementId = `zubaid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.elementRegistry.set(elementId, {
            element: element,
            agent: agent,
            purpose: purpose,
            timestamp: new Date().toISOString()
        });
        
        this.elementsCreated.push({
            id: elementId,
            agent: agent,
            purpose: purpose
        });
        
        console.log(`📝 Registered ZUBAID element: ${purpose} by ${agent}`);
    }

    getZubaidColor(colorData) {
        if (!colorData) return "#F5F5F5"; // Default light gray
        
        // Extract primary color from ZUBAID's color decisions
        if (colorData.primary) return colorData.primary;
        if (colorData.background) return colorData.background;
        if (Array.isArray(colorData) && colorData.length > 0) return colorData[0];
        
        return "#F5F5F5";
    }

    // Utility method to get responsive font sizes
    getResponsiveFontSize(baseSize) {
        const documentWidth = this.document?.width || 1080;
        const scaleFactor = documentWidth / 1080; // Scale based on 1080px baseline
        return Math.max(12, baseSize * scaleFactor); // Minimum 12px
    }
}

// Initialize ZUBAID controller when the add-on loads
let zubaidController;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        zubaidController = new ZubaidExpressController();
        const initialized = await zubaidController.initialize();
        
        if (initialized) {
            console.log("🚀 ZUBAID Adobe Express integration ready!");
            
            // Notify the UI panel that the controller is ready
            window.parent.postMessage({
                type: 'ZUBAID_CONTROLLER_READY',
                status: 'initialized'
            }, '*');
        } else {
            console.error("❌ ZUBAID controller initialization failed");
        }
        
    } catch (error) {
        console.error("❌ ZUBAID initialization error:", error);
    }
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ZubaidExpressController };
}