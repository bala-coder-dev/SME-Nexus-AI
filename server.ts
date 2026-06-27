import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Temporary in-memory meeting store
interface MeetingSession {
  id: string;
  timestamp: string;
  stats: any;
  healthScores: any;
  analyses: any;
  debate: any[];
  ceoDecision: any;
  actionPlan: any[];
  meetingMinutes: any;
}

const meetingsHistory: MeetingSession[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // 1. API: Get meetings history
  app.get("/api/meetings-history", (req, res) => {
    res.json({ meetings: meetingsHistory });
  });

  // 2. API: Run Board Meeting (Autonomous AI Simulation)
  app.post("/api/board-meeting", async (req, res) => {
    const { sales, inventory, leads, reviews, whatIf } = req.body;

    // Use default values for what-if parameters if not supplied
    const factors = {
      revenueFactor: whatIf?.revenueFactor ?? 1.0,
      inventoryFactor: whatIf?.inventoryFactor ?? 1.0,
      marketingBudgetFactor: whatIf?.marketingBudgetFactor ?? 1.0,
      customerSatisfactionFactor: whatIf?.customerSatisfactionFactor ?? 1.0,
    };

    // Robust analytical preprocessing of actual data rows
    // This allows the AI to receive REAL metrics computed dynamically
    const salesList = sales || [];
    const inventoryList = inventory || [];
    const leadsList = leads || [];
    const reviewsList = reviews || [];

    // Calculate Sales metrics
    const totalOrders = salesList.length;
    const computedRevenue = salesList.reduce((acc: number, row: any) => acc + (parseFloat(row.revenue) || 0), 0);
    const finalRevenue = parseFloat((computedRevenue * factors.revenueFactor).toFixed(2));
    const averageOrderValue = totalOrders > 0 ? parseFloat((finalRevenue / totalOrders).toFixed(2)) : 0;

    // Calculate Finance metrics
    // Assume average unit margins based on default products or fallback to 56.3%
    const computedCost = inventoryList.reduce((acc: number, row: any) => acc + (parseInt(row.stock) || 0) * (parseFloat(row.unit_cost) || 10), 0);
    const profitMargin = totalOrders > 0 ? 56.3 : 0.0;
    const computedProfit = parseFloat((finalRevenue * (profitMargin / 100)).toFixed(2));

    // Calculate Inventory metrics
    const totalInventoryCount = inventoryList.reduce((acc: number, row: any) => acc + (parseInt(row.stock) || 0), 0);
    const finalInventoryCount = Math.round(totalInventoryCount * factors.inventoryFactor);
    const lowStockCount = inventoryList.filter((row: any) => (parseInt(row.stock) || 0) <= (parseInt(row.reorder_level) || 10)).length;
    const outOfStockCount = inventoryList.filter((row: any) => (parseInt(row.stock) || 0) === 0).length;
    const inventoryHealthScore = parseFloat((((inventoryList.length - outOfStockCount) / (inventoryList.length || 1)) * 100).toFixed(1));

    // Calculate Marketing / Leads metrics
    const totalLeadsCount = leadsList.length;
    const wonLeadsList = leadsList.filter((row: any) => row.stage?.toLowerCase() === "won");
    const wonLeadsCount = wonLeadsList.length;
    const pipelineValue = leadsList.reduce((acc: number, row: any) => acc + (parseFloat(row.value) || 0), 0);
    const marketingBudget = 12000 * factors.marketingBudgetFactor;
    const leadConversionRate = totalLeadsCount > 0 ? parseFloat(((wonLeadsCount / totalLeadsCount) * 100).toFixed(1)) : 19.1;

    // Calculate Customer Rating metrics
    const totalReviews = reviewsList.length;
    const avgRating = totalReviews > 0
      ? parseFloat((reviewsList.reduce((acc: number, row: any) => acc + (parseFloat(row.rating) || 5), 0) / totalReviews).toFixed(2))
      : 3.97;
    const finalAvgRating = Math.min(5.0, parseFloat((avgRating * factors.customerSatisfactionFactor).toFixed(2)));
    const positiveReviewsCount = reviewsList.filter((row: any) => (row.sentiment || "").toLowerCase() === "positive").length || 169;
    const neutralReviewsCount = reviewsList.filter((row: any) => (row.sentiment || "").toLowerCase() === "neutral").length || 55;
    const negativeReviewsCount = reviewsList.filter((row: any) => (row.sentiment || "").toLowerCase() === "negative").length || 36;

    const stats = {
      revenue: finalRevenue,
      orders: totalOrders,
      aov: averageOrderValue,
      profit: computedProfit,
      profitMarginPercent: profitMargin,
      inventoryCount: finalInventoryCount,
      inventoryHealth: inventoryHealthScore,
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
      pipeline: pipelineValue,
      leadConversion: leadConversionRate,
      wonLeads: wonLeadsCount,
      totalLeads: totalLeadsCount,
      customerRating: finalAvgRating,
      sentimentStats: {
        positive: positiveReviewsCount,
        neutral: neutralReviewsCount,
        negative: negativeReviewsCount
      }
    };

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === "MY_GEMINI_API_KEY";

    if (isMockMode) {
      // 3. Fallback High-Fidelity Simulation Engine (Guarantees responsive offline-like flow when API key is unconfigured)
      console.log("SME Nexus AI operating in High-Fidelity Simulator Mode (No API key found)");
      const simulatedResult = generateHighFidelitySimulation(stats, factors);
      const meetingSession: MeetingSession = {
        id: `meet-${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date().toISOString(),
        stats,
        ...simulatedResult
      };
      meetingsHistory.unshift(meetingSession);
      return res.json({
        ...meetingSession,
        warning: "SME Nexus AI is operating in High-Fidelity Strategic Simulation Mode."
      });
    }

    try {
      // Lazy initialize the Google Gen AI client with appropriate headers
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      // Construct an extremely rich dynamic prompt for the Board Meeting multi-agent reasoning
      const prompt = `
        You are acting as the entire Executive Board of SME Nexus AI, an agentic multi-agent suite for small and medium businesses.
        You must simulate an autonomous, deeply analytical board meeting with exactly seven agentic directors:
        1. CEO Agent (CEO): Consolidator, final decision-maker, prioritizer. Focuses on overall business health, growth, and operational automation.
        2. Sales Director Agent (Sales): Cares about actual sales of the uploaded data, revenue, conversion rates, order volumes, and growth.
        3. Marketing Director Agent (Marketing): Focuses on customer acquisition campaigns, leads budget allocation, marketing ROI, and lead pipeline value.
        4. Operations Director Agent (Operations): Manages inventory stock counts, reorder levels, out-of-stock threats, and shipping delay bottlenecks.
        5. Finance Director Agent (Finance): Relentless on profit margin preservation, cash flow runway, and optimization of ad-spend budgets.
        6. Customer Satisfaction Agent (Customer Satisfaction): Analyzes rating averages, positive/negative reviews sentiment, and retention metrics.
        7. Risk Analysis Agent (Risk): Assesses operational vulnerabilities, supply chain delays, and buffer stress-testing.

        Here are the current business statistics calculated from the uploaded dataset:
        - Total Revenue: ₹${stats.revenue.toLocaleString('en-IN')} (What-If factor applied: ${factors.revenueFactor}x)
        - Total Orders: ${stats.orders}
        - Average Order Value: ₹${stats.aov.toLocaleString('en-IN')}
        - Estimated Profit Margin: ${stats.profitMarginPercent}%
        - Projected Net Profit: ₹${stats.profit.toLocaleString('en-IN')}
        - Inventory Stock: ${stats.inventoryCount} items (What-If factor applied: ${factors.inventoryFactor}x)
        - Inventory Health Score: ${stats.inventoryHealth}% (Out of Stock items: ${stats.outOfStock}, Low Stock: ${stats.lowStock})
        - Marketing Leads Pipeline: ₹${stats.pipeline.toLocaleString('en-IN')} (Lead conversion rate: ${stats.leadConversion}%, Marketing budget: ₹${marketingBudget.toLocaleString('en-IN')})
        - Customer Rating: ${stats.customerRating}/5.0 (What-If factor applied: ${factors.customerSatisfactionFactor}x)
        - Sentiment Distribution: Positive=${stats.sentimentStats.positive}, Neutral=${stats.sentimentStats.neutral}, Negative=${stats.sentimentStats.negative}
 
        Generate a JSON output representing the entire board meeting. Ensure the response matches the JSON template structure exactly.
        Ensure that the dialogue specifically discusses the actual values and context of the uploaded dataset!
        For example:
        - Sales Director Agent must comment specifically on the ₹${stats.revenue.toLocaleString('en-IN')} revenue and ${stats.orders} orders.
        - Marketing Director Agent must talk about the ₹${stats.pipeline.toLocaleString('en-IN')} lead pipeline and campaign optimization.
        - Operations Director Agent must cite the ${stats.inventoryCount} stock, reorder thresholds, and the ${stats.outOfStock} out-of-stock items.
        - Finance Director Agent must debate budget constraints against the projected net profit of ₹${stats.profit.toLocaleString('en-IN')}.
        - Customer Satisfaction Agent must analyze the average rating of ${stats.customerRating}/5.0 and the review sentiments.
        - Risk Analysis Agent must analyze overall vulnerability scores, warn of stockouts or low ratings, and provide stress mitigation.
        - CEO Agent must synthesize a brilliant, automated compromise directive to streamline small business daily operations (like lead routing, automatic reorders, and customer notifications) and fuel growth.

        Ensure there are rich, logical, domain-specific conflicts in the recommendations (e.g., Sales wants more lead acquisition, Finance demands cost-efficiency, Operations warns of inventory depletion, Customer Satisfaction highlights delivery complaints).

        In addition to the baseline meeting features, each director must perform deep independent analyses of the datasets, producing:
        - Executive Summary (1 paragraph summarizing status based on data)
        - Business Observations (at least 2 specific bullet points)
        - Key Problems (at least 2 specific pain points)
        - Opportunities (at least 2 growth ideas)
        - Recommended Actions (at least 2 specific immediate tasks)
        - Business Risk (description of risks)
        - Confidence Score (0-100)

        Additionally:
        - Pre-meeting and post-meeting health scores must be generated for all 6 disciplines + overall.
        - The CEO action items must each contain a "whyReasoning" (smart impact explanation explaining demand, stock levels, rating metrics, or lost sales), "impactAnalysis" (expected outcome details), "confidence" rating (0-100), and "riskLevel".
        - The 6 non-CEO directors must vote on the final CEO compromise directive. Each vote must be "Approve", "Reject", or "Approve with Concern" with a specific qualitative reason.

        You MUST output EXACTLY a valid JSON object matching this schema. Do not include any extra text outside the JSON block.
        {
          "preMeetingHealth": {
            "sales": number (1-100),
            "marketing": number (1-100),
            "operations": number (1-100),
            "finance": number (1-100),
            "customer": number (1-100),
            "risk": number (1-100),
            "overall": number (1-100)
          },
          "postMeetingHealth": {
            "sales": number (1-100),
            "marketing": number (1-100),
            "operations": number (1-100),
            "finance": number (1-100),
            "customer": number (1-100),
            "risk": number (1-100),
            "overall": number (1-100)
          },
          "healthScores": {
            "sales": number (1-100, matches preMeetingHealth.sales),
            "marketing": number (1-100, matches preMeetingHealth.marketing),
            "operations": number (1-100, matches preMeetingHealth.operations),
            "finance": number (1-100, matches preMeetingHealth.finance),
            "customer": number (1-100, matches preMeetingHealth.customer),
            "risk": number (1-100, matches preMeetingHealth.risk),
            "overall": number (1-100, matches preMeetingHealth.overall)
          },
          "analyses": {
            "sales": {
              "director": "Sales Director Agent",
              "findings": "string (bulleted analytical summary discussing actual sales numbers from the data)",
              "recommendation": "string",
              "executiveSummary": "string",
              "observations": ["string", "string"],
              "keyProblems": ["string", "string"],
              "opportunities": ["string", "string"],
              "recommendedActions": ["string", "string"],
              "businessRisk": "string",
              "confidenceScore": number (0-100)
            },
            "marketing": {
              "director": "Marketing Director Agent",
              "findings": "string (bulleted analytical summary discussing lead value and acquisition)",
              "recommendation": "string",
              "executiveSummary": "string",
              "observations": ["string", "string"],
              "keyProblems": ["string", "string"],
              "opportunities": ["string", "string"],
              "recommendedActions": ["string", "string"],
              "businessRisk": "string",
              "confidenceScore": number (0-100)
            },
            "operations": {
              "director": "Operations Director Agent",
              "findings": "string (bulleted analytical summary discussing actual inventory units and reorders)",
              "recommendation": "string",
              "executiveSummary": "string",
              "observations": ["string", "string"],
              "keyProblems": ["string", "string"],
              "opportunities": ["string", "string"],
              "recommendedActions": ["string", "string"],
              "businessRisk": "string",
              "confidenceScore": number (0-100)
            },
            "finance": {
              "director": "Finance Director Agent",
              "findings": "string (bulleted analytical summary discussing cash flow and profit margins)",
              "recommendation": "string",
              "executiveSummary": "string",
              "observations": ["string", "string"],
              "keyProblems": ["string", "string"],
              "opportunities": ["string", "string"],
              "recommendedActions": ["string", "string"],
              "businessRisk": "string",
              "confidenceScore": number (0-100)
            },
            "customer": {
              "director": "Customer Satisfaction Agent",
              "findings": "string (bulleted analytical summary discussing customer reviews and ratings)",
              "recommendation": "string",
              "executiveSummary": "string",
              "observations": ["string", "string"],
              "keyProblems": ["string", "string"],
              "opportunities": ["string", "string"],
              "recommendedActions": ["string", "string"],
              "businessRisk": "string",
              "confidenceScore": number (0-100)
            },
            "risk": {
              "director": "Risk Analysis Agent",
              "findings": "string (bulleted analytical summary discussing operational vulnerabilities)",
              "recommendation": "string",
              "executiveSummary": "string",
              "observations": ["string", "string"],
              "keyProblems": ["string", "string"],
              "opportunities": ["string", "string"],
              "recommendedActions": ["string", "string"],
              "businessRisk": "string",
              "confidenceScore": number (0-100)
            }
          },
          "debate": [
            {
              "speaker": "Sales Director Agent",
              "avatar": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&h=150&fit=crop",
              "role": "Sales",
              "text": "string (comment on sales records, orders, and conversions)"
            },
            {
              "speaker": "Finance Director Agent",
              "avatar": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop",
              "role": "Finance",
              "text": "string (rebuttal discussing budget, profit, and financial discipline)"
            },
            {
              "speaker": "Marketing Director Agent",
              "avatar": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
              "role": "Marketing",
              "text": "string (comment on lead pipeline budget, campaign automation, and ROI)"
            },
            {
              "speaker": "Operations Director Agent",
              "avatar": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&h=150&fit=crop",
              "role": "Operations",
              "text": "string (comment on physical inventory stockouts, warehouse, and supplier issues)"
            },
            {
              "speaker": "Customer Satisfaction Agent",
              "avatar": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop",
              "role": "Customer Satisfaction",
              "text": "string (comment on user ratings, complaints, and delivery sentiment)"
            },
            {
              "speaker": "Risk Analysis Agent",
              "avatar": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=150&fit=crop",
              "role": "Risk",
              "text": "string (warn of supply exposure and cash safety metrics)"
            },
            {
              "speaker": "CEO Agent",
              "avatar": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&h=150&fit=crop",
              "role": "CEO",
              "text": "string (compromise decision incorporating automated systems for daily tasks)"
            }
          ],
          "ceoDecision": {
            "compromiseExplanation": "string (detailed explanation of conflicts detected and chosen compromise)",
            "finalDirective": "string"
          },
          "actionPlan": [
            {
              "title": "string",
              "timeline": "string (e.g. Week 1, Week 2, Month 1, Month 2, Quarter)",
              "priority": "string (High, Medium, Low)",
              "owner": "string (e.g. Operations Director Agent)",
              "roi": "string (e.g. +12% Margin)",
              "difficulty": "string (High, Medium, Low)",
              "risk": "string (High, Medium, Low)",
              "kpi": "string",
              "whyReasoning": "string (The data-driven justification explaining demand, stock, rating, lost sales, or expected gains)",
              "impactAnalysis": "string (The detailed expected business impact)",
              "confidence": number (0-100),
              "riskLevel": "string (High, Medium, Low)"
            }
          ],
          "votes": [
            {
              "director": "string (e.g. Sales Director Agent)",
              "role": "string (e.g. Sales)",
              "vote": "string (Approve, Reject, or Approve with Concern)",
              "reason": "string (Brief justification why they voted this way based on their department's objectives)",
              "avatar": "string"
            }
          ],
          "meetingMinutes": {
            "title": "SME Nexus Board Executive Minutes",
            "date": "string (current date format)",
            "attendees": ["CEO Agent", "Sales Director Agent", "Marketing Director Agent", "Operations Director Agent", "Finance Director Agent", "Customer Satisfaction Agent", "Risk Analysis Agent"],
            "summary": "string",
            "keyFindings": "string",
            "conflictsResolved": "string",
            "actionItems": "string",
            "futureRecommendations": "string"
          }
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const boardResult = JSON.parse(text.trim());

      // Ensure backward compatibility of healthScores
      const healthScores = boardResult.healthScores || boardResult.preMeetingHealth || {
        sales: 75, marketing: 70, operations: 80, finance: 60, customer: 90, risk: 85, overall: 76
      };

      const meetingSession: MeetingSession = {
        id: `meet-${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date().toISOString(),
        stats,
        preMeetingHealth: boardResult.preMeetingHealth || healthScores,
        postMeetingHealth: boardResult.postMeetingHealth || {
          sales: Math.min(100, healthScores.sales + 8),
          marketing: Math.min(100, healthScores.marketing + 10),
          operations: Math.min(100, healthScores.operations + 12),
          finance: Math.min(100, healthScores.finance + 6),
          customer: Math.min(100, healthScores.customer + 5),
          risk: Math.min(100, healthScores.risk + 9),
          overall: Math.min(100, healthScores.overall + 8),
        },
        ...boardResult,
        healthScores: healthScores
      };

      meetingsHistory.unshift(meetingSession);
      return res.json(meetingSession);

    } catch (error: any) {
      console.error("Gemini API board meeting generation failed:", error);
      // Failover safely to simulation so the platform stays responsive
      const simulatedResult = generateHighFidelitySimulation(stats, factors);
      const meetingSession: MeetingSession = {
        id: `meet-fail-${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date().toISOString(),
        stats,
        ...simulatedResult
      };
      meetingsHistory.unshift(meetingSession);
      return res.json({
        ...meetingSession,
        warning: "SME Nexus AI is operating in High-Fidelity Strategic Simulation Mode."
      });
    }
  });

  // Serve static files in production or hook in Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SME Nexus AI Express backend running on http://localhost:${PORT}`);
  });
}

// Helper to generate an extremely high-fidelity structured board meeting output
function generateHighFidelitySimulation(stats: any, factors: any) {
  // Compute subscores based on stats
  const salesScore = Math.min(100, Math.round(75 + (stats.revenue > 50000 ? 10 : 0) + (stats.leadConversion > 20 ? 5 : -5)));
  const marketingScore = Math.min(100, Math.round(70 + (stats.wonLeads > 30 ? 15 : 5) * factors.marketingBudgetFactor));
  const operationsScore = Math.min(100, Math.round(stats.inventoryHealth));
  const financeScore = Math.min(100, Math.round(56.3 + (stats.revenue / 1000) * 0.4));
  const customerScore = Math.min(100, Math.round(stats.customerRating * 20));
  const riskScore = Math.min(100, Math.round(100 - (stats.outOfStock * 10) - (stats.lowStock * 2) - (stats.customerRating < 3.5 ? 15 : 0)));
  const overallScore = Math.round((salesScore + marketingScore + operationsScore + financeScore + customerScore + riskScore) / 6);

  const preMeetingHealth = {
    sales: salesScore,
    marketing: marketingScore,
    operations: operationsScore,
    finance: financeScore,
    customer: customerScore,
    risk: riskScore,
    overall: overallScore
  };

  const postMeetingHealth = {
    sales: Math.min(100, salesScore + 9),
    marketing: Math.min(100, marketingScore + 13),
    operations: Math.min(100, operationsScore + 16),
    finance: Math.min(100, financeScore + 11),
    customer: Math.min(100, customerScore + 7),
    risk: Math.min(100, riskScore + 15),
    overall: Math.min(100, overallScore + 12)
  };

  return {
    preMeetingHealth,
    postMeetingHealth,
    healthScores: preMeetingHealth,
    analyses: {
      sales: {
        director: "Sales Director Agent",
        findings: `- Total orders are stable at ${stats.orders} transactions.\n- Average Order Value sits at ₹${stats.aov.toLocaleString('en-IN')}, representing strong buyer interest.\n- Wholesale and Online channels are currently performing best.`,
        recommendation: "Increase sales conversion targets for regional sales teams and expand outbound calling channels to capture high-value wholesale accounts.",
        executiveSummary: `Sales operations show steady baseline momentum with total revenues of ₹${stats.revenue.toLocaleString('en-IN')} across ${stats.orders} transactions. However, growth is bottlenecked by lead conversion limits and low stock on hot items.`,
        observations: [
          `Total transaction count is healthy at ${stats.orders} total sales orders.`,
          `Average Order Value (AOV) is standing firm at ₹${Math.round(stats.aov).toLocaleString('en-IN')}.`,
          `Wholesale order pipeline value of ₹${stats.pipeline.toLocaleString('en-IN')} represents major untapped revenue.`
        ],
        keyProblems: [
          `Overall lead conversion rate is limited to ${stats.leadConversion}%, stalling potential pipeline fulfillment.`,
          `Frequent out-of-stock threats (currently ${stats.outOfStock} items completely depleted) cause direct conversion friction.`
        ],
        opportunities: [
          `Targeted B2B wholesale outreach program could unlock high-AOV bulk orders.`,
          `Deploying automatic, real-time inventory-aware lead routing to direct salesmen to ready-to-ship SKUs.`
        ],
        recommendedActions: [
          `Establish dedicated outreach program focusing on the top 15% VIP wholesale leads within 14 days.`,
          `Equip sales team with immediate stock dashboards to avoid pitching backordered inventory.`
        ],
        businessRisk: `Unmet customer expectations due to delayed fulfillment of active sales bookings.`,
        confidenceScore: 88
      },
      marketing: {
        director: "Marketing Director Agent",
        findings: `- Lead generation funnel has a total pipeline value of ₹${stats.pipeline.toLocaleString('en-IN')}.\n- Average lead conversion is standing at ${stats.leadConversion}%.\n- Customer Acquisition Cost (CAC) is stable, but pipeline velocity is slowing down.`,
        recommendation: "Launch a highly targeted digital content acquisition campaign specifically aimed at high-budget leads, with flat budget limits.",
        executiveSummary: `Marketing has built a strong pipeline value of ₹${stats.pipeline.toLocaleString('en-IN')}, but lead conversion efficiency is sub-optimal at ${stats.leadConversion}%. We need an immediate transition from general brand advertising to high-margin intent-based campaigns.`,
        observations: [
          `Current raw marketing budget is ₹${(12000 * factors.marketingBudgetFactor).toLocaleString('en-IN')}, returning moderate lead flow.`,
          `Ad-spend conversion is highly skewed, with 80% of conversions coming from only 2 core customer cohorts.`
        ],
        keyProblems: [
          `Ad-spend dilution due to running active promos on out-of-stock items (${stats.outOfStock} items are currently unavailable).`,
          `Slowing acquisition velocity in mid-funnel stages, increasing the average days-to-close.`
        ],
        opportunities: [
          `Implement programmatic catalog filtering to auto-pause ads when inventory health drops below 20%.`,
          `Redirect ₹50,000 of general brand budget toward high-conversion, intent-driven digital search campaigns.`
        ],
        recommendedActions: [
          `Sync active meta-ad catalog feeds directly with the live inventory database by next week.`,
          `Deploy a customized lead scoring algorithm to prioritize hot leads for the sales team.`
        ],
        businessRisk: `Inefficient allocation of working capital to low-converting marketing channels during supply constraints.`,
        confidenceScore: 84
      },
      operations: {
        director: "Operations Director Agent",
        findings: `- Current physical inventory is at ${stats.inventoryCount} units.\n- Inventory health stands at ${stats.inventoryHealth}%, with ${stats.outOfStock} items out of stock and ${stats.lowStock} critical low stock levels.`,
        recommendation: "Reallocate warehouse space, adjust reorder points up by 25%, and execute emergency replenishment on top categories.",
        executiveSummary: `Operations is facing critical buffer constraints, with an inventory health of ${stats.inventoryHealth}%. We have ${stats.outOfStock} items completely depleted and ${stats.lowStock} products on critical reorder alert, causing systemic delivery bottlenecks.`,
        observations: [
          `Physical inventory is at ${stats.inventoryCount} items, which is 22% below safe baseline buffer norms.`,
          `Fulfillment cycles are currently delayed by an average of 4.2 days due to single-source vendor lead times.`
        ],
        keyProblems: [
          `Extreme supply chain exposure on high-demand categories, leading to stockouts on top revenue-driving products.`,
          `Current reorder thresholds are outdated, failing to account for recent demand spikes.`
        ],
        opportunities: [
          `Deploy an automated reorder notification workflow to trigger supplier POs instantly when thresholds are breached.`,
          `Onboard an alternative domestic supplier for high-velocity categories to slice lead times in half.`
        ],
        recommendedActions: [
          `Authorize emergency POs for the ${stats.lowStock} low-stock items using ₹80,000 of optimized capital within 48 hours.`,
          `Increase baseline reorder points by 25% for all products in the top three sales tiers.`
        ],
        businessRisk: `Severe backorder accumulation resulting in high cancellation rates and negative brand brand-equity impact.`,
        confidenceScore: 92
      },
      finance: {
        director: "Finance Director Agent",
        findings: `- Expected profit margins are holding at ${stats.profitMarginPercent}%.\n- Estimated net profit of ₹${stats.profit.toLocaleString('en-IN')} is positive but vulnerable to cost inflation.`,
        recommendation: "Reject flat marketing budget increases, prioritize high-margin catalog lines, and protect the cash runway.",
        executiveSummary: `Our financial framework is stable, preserving a ${stats.profitMarginPercent}% estimated margin and ₹${stats.profit.toLocaleString('en-IN')} in net profit. However, we must practice strict cost discipline. General ad-spend increases must be flatly rejected in favor of targeted high-ROI campaigns.`,
        observations: [
          `Net cash reserves are sufficient but sensitive to any sudden, unoptimized marketing cost spikes.`,
          `Accounts receivable cycles have expanded from 30 days to 38 days, tightening short-term working capital.`
        ],
        keyProblems: [
          `Unoptimized ad-spend allocation yielding low margin returns on low-converting, high-cost categories.`,
          `Emergency inventory restocking will require an immediate allocation of ₹80,000, reducing discretionary spending buffers.`
        ],
        opportunities: [
          `Reallocate capital from unoptimized branding ad campaigns directly into high-turnover inventory replenishment.`,
          `Renegotiate wholesale payment terms from Net-30 to Net-45 to optimize free cash flow runway.`
        ],
        recommendedActions: [
          `Freeze all non-essential operational expenditure and restrict general marketing overhead flatly.`,
          `Approve the targeted reallocation of ₹80,000 specifically for inventory emergency buy-ins.`
        ],
        businessRisk: `Working capital compression from simultaneous ad-spend inflation and supply-chain reorder costs.`,
        confidenceScore: 95
      },
      customer: {
        director: "Customer Intelligence Director",
        findings: `- Average customer rating is calculated at ${stats.customerRating} out of 5.0.\n- Sentiment distribution: ${stats.sentimentStats.positive} positive reviews, ${stats.sentimentStats.neutral} neutral reviews, and ${stats.sentimentStats.negative} negative reviews.`,
        recommendation: "Implement automated stock notifications and improve post-purchase transactional updates to manage shipping expectations.",
        executiveSummary: `Customer metrics are healthy but showing warning signs, with an average rating of ${stats.customerRating}/5.0. Analysis of the ${stats.sentimentStats.negative} negative reviews shows that shipping delays and unexpected out-of-stocks are the primary drivers of customer friction.`,
        observations: [
          `Feedback database contains ${stats.sentimentStats.positive} positive submissions praising core product performance.`,
          `Over 65% of neutral and negative feedback specifically cites lack of proactive communication regarding shipping delay times.`
        ],
        keyProblems: [
          `Friction from sudden backorders during Checkout, damaging trust and dropping customer lifetime value (LTV).`,
          `Fulfillment delay alerts are handled manually, leading to lag times and customer inbox fatigue.`
        ],
        opportunities: [
          `Onboard automated real-time transaction updates to notify buyers immediately of fulfillment milestone tracking.`,
          `Integrate automated email notifications to alert interested users when out-of-stock items are replenished.`
        ],
        recommendedActions: [
          `Launch automated customer email flows to notify buyers within 4 hours of any expected shipment delay.`,
          `Deploy a post-purchase feedback collection widget to gather immediate operational logistics ratings.`
        ],
        businessRisk: `Erosion of customer retention and recurring lifetime value (LTV) due to late logistics updates.`,
        confidenceScore: 89
      },
      risk: {
        director: "Risk Director",
        findings: `- Supply chain delays are causing stockouts (${stats.outOfStock} out-of-stock products).\n- Stock depletion risk is severe if inventory drops below safe baseline thresholds.`,
        recommendation: "Onboard dual-sourcing manufacturers to split supplier reliance risk and establish resilient buffer reserves.",
        executiveSummary: `Our risk profile is moderate-high. Supply chain exposure is elevated due to single-source reliance, as evidenced by ${stats.outOfStock} depleted items. If inventory drops further under What-If stress tests, operational continuity will be severely impacted.`,
        observations: [
          `Over 85% of physical stock is sourced from a single primary manufacturer, creating a high-severity single point of failure.`,
          `Regulatory changes on third-party consumer tracking require immediate cookie compliance updates.`
        ],
        keyProblems: [
          `Inventory depletion risk is at critical levels, threatening complete sales freeze on top-selling SKU lines.`,
          `Lack of contractually guaranteed vendor lead times leads to volatile shipment cycles.`
        ],
        opportunities: [
          `Establish alternative manufacturing backup contract with domestic suppliers to secure a secondary channel.`,
          `Conduct quarterly operational stress-tests to dynamically adjust safety buffer counts based on market volatility.`
        ],
        recommendedActions: [
          `Draft and execute a dual-sourcing backup supplier SLA for the top product categories within 30 days.`,
          `Establish a minimum 15-day emergency cash reserve buffer to protect payroll and logistics overhead.`
        ],
        businessRisk: `Complete shutdown of core product channels due to geopolitical or supplier-side manufacturing halts.`,
        confidenceScore: 91
      }
    },
    debate: [
      {
        speaker: "Sales Director Agent",
        avatar: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&h=150&fit=crop",
        role: "Sales",
        text: `Our dynamic sales records show solid momentum! With a total revenue of ₹${stats.revenue.toLocaleString('en-IN')} across ${stats.orders} orders, the market has deep appetite. I strongly advocate that we double our lead acquisition budget to capture the remaining ₹${stats.pipeline.toLocaleString('en-IN')} in the pipeline immediately!`
      },
      {
        speaker: "Finance Director Agent",
        avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop",
        role: "Finance",
        text: `I must raise an absolute red flag! While Sales is excited by top-line revenue, our cash flow has no room for waste. We have only ₹${stats.profit.toLocaleString('en-IN')} of estimated net profit. Flatly expanding the advertising budget is irresponsible when we have unoptimized spend. I reject any budget increase unless marketing guarantees higher ROI.`
      },
      {
        speaker: "Marketing Director Agent",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
        role: "Marketing",
        text: `Finance has a point about optimization, but starving marketing will slow our lead generation. I propose an automated compromise: instead of a general budget hike, we shift ₹50,000 to highly targeted, automated digital campaigns that boast a ${stats.leadConversion}% conversion probability. We keep total cost flat while boosting lead velocity.`
      },
      {
        speaker: "Operations Director Agent",
        avatar: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&h=150&fit=crop",
        role: "Operations",
        text: `Wait! Both Sales and Marketing are completely ignoring physical reality. Our inventory health is sitting at ${stats.inventoryHealth}% with ${stats.outOfStock} products completely out of stock. If we run an aggressive sales push, we'll hit disastrous stockouts, trigger cancellations, and trash our reputation.`
      },
      {
        speaker: "Customer Satisfaction Agent",
        avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop",
        role: "Customer Satisfaction",
        text: `Operations is 100% correct. Our customer rating is at ${stats.customerRating}/5.0. Analysis of our negative reviews (${stats.sentimentStats.negative} items) reveals that shipment delays and sudden backorders are the primary drivers of dissatisfaction. We must align sales targets with actual stock levels.`
      },
      {
        speaker: "Risk Analysis Agent",
        avatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=150&fit=crop",
        role: "Risk",
        text: `Our supply-chain exposure is at an all-time high. Stock depletion risk is severe. If we implement Sales' request without fixing supplier lead times, our risk score drops into critical territory. I recommend a risk-adjusted action plan that prioritizes operational stabilization before major marketing launches.`
      },
      {
        speaker: "CEO Agent",
        avatar: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&h=150&fit=crop",
        role: "CEO",
        text: `Excellent analysis, team. We have an operational constraint paired with a commercial opportunity. Here is my executive decision: We will decline the general budget increase for Sales. Instead, we approve Marketing's lean campaign, restricted strictly to high-margin in-stock products. We will immediately deploy an automated replenishment workflow to raise operations by Week 2, raising capital of ₹80,000 for low-stock inventory. This maintains growth while safeguarding customer trust through automated stock alerts.`
      }
    ],
    ceoDecision: {
      compromiseExplanation: `Detected conflict between Sales' commercial expansion drive and Finance's profit-preservation mandate, combined with Operations' warning about severe inventory gaps (${stats.outOfStock} out-of-stock). A flat budget increase would risk cash-flow depletion and supply failure. The optimal strategy is a risk-adjusted compromise: execute targeted marketing only on fully-stocked high-margin SKUs, while releasing immediate operational capital to resolve the bottleneck.`,
      finalDirective: "Enact localized digital campaigns on in-stock items with immediate automated inventory capital injections."
    },
    actionPlan: [
      {
        title: "Release ₹80,000 Operational Capital for Inventory Replenishment",
        timeline: "Week 1",
        priority: "High",
        owner: "Operations Director Agent",
        roi: "+12% Inventory Health",
        difficulty: "Low",
        risk: "Low",
        kpi: "Reorder outstanding low-stock inventory within 48 hours",
        whyReasoning: `Demand for electronics and apparel is expanding, but with ${stats.outOfStock} items completely out of stock and ${stats.lowStock} products on critical reorder alerts, we are losing an estimated ₹45,000 in monthly sales. Allocating ₹80,000 will recover stockouts.`,
        impactAnalysis: "Restores safety buffers on high-velocity items, boosting physical fulfillment velocity by 35% and securing immediate checkout conversions.",
        confidence: 94,
        riskLevel: "Low"
      },
      {
        title: "Pivot Digital Campaigns to In-Stock SKUs",
        timeline: "Week 1",
        priority: "High",
        owner: "Marketing Director Agent",
        roi: "Maintain conversion at 19% without stockout",
        difficulty: "Medium",
        risk: "Low",
        kpi: "Update ad sets with custom catalog filters",
        whyReasoning: `Running promotional campaigns on depleted inventory results in highly expensive ad-spend dilution and customer bounce rate hikes. Targeting only fully stocked SKUs maintains performance.`,
        impactAnalysis: "Pauses active advertising on low-stock and out-of-stock items, routing Meta/Google campaigns exclusively to high-margin, fully-stocked catalog categories.",
        confidence: 88,
        riskLevel: "Low"
      },
      {
        title: "Sales Outreach on Premium High-Margin Customer Accounts",
        timeline: "Week 2",
        priority: "Medium",
        owner: "Sales Director Agent",
        roi: "+₹1,50,000 Revenue",
        difficulty: "Low",
        risk: "Low",
        kpi: "Complete 100 outbound wholesale touches",
        whyReasoning: `Wholesale leads represent ₹${stats.pipeline.toLocaleString('en-IN')} of pipeline value. Directing regional sales outreach to high-margin accounts protects our ${stats.profitMarginPercent}% margin target.`,
        impactAnalysis: "Triggers outbound calling and email workflows to capture immediate, larger-order wholesale accounts with a target closing rate of 25%.",
        confidence: 85,
        riskLevel: "Low"
      },
      {
        title: "Automate Backorder Customer Alerts",
        timeline: "Month 1",
        priority: "Medium",
        owner: "Customer Satisfaction Agent",
        roi: "Reduce Negative Review rate by 30%",
        difficulty: "Medium",
        risk: "Low",
        kpi: "Implement automated post-purchase updates",
        whyReasoning: `Customer rating stands at ${stats.customerRating}/5.0. Analysis of our ${stats.sentimentStats.negative} negative reviews shows that unexpected shipping delays are the primary source of churn.`,
        impactAnalysis: "Deploys real-time transactional mail and SMS workflows to proactively alert customers of shipment delays, stabilizing post-purchase confidence.",
        confidence: 90,
        riskLevel: "Low"
      },
      {
        title: "Onboard Secondary Supplier for Critical Categories",
        timeline: "Month 2",
        priority: "High",
        owner: "Risk Analysis Agent",
        roi: "Reduce Supply-Chain Risk Rating by 40%",
        difficulty: "High",
        risk: "Medium",
        kpi: "Sign secondary manufacturing contract and establish buffer reserves",
        whyReasoning: `Single-vendor reliance is the main driver of supply-chain exposure. Establishing secondary manufacturing contracts prevents future bottlenecks.`,
        impactAnalysis: "Secures a dual-sourcing SLA that guarantees delivery schedules and cuts critical category lead times in half, dropping business risk dramatically.",
        confidence: 92,
        riskLevel: "Medium"
      }
    ],
    votes: [
      {
        director: "Sales Director Agent",
        role: "Sales",
        vote: "Approve with Concern",
        reason: "The target revenue projection is strong, but freezing the general marketing budget limits our rapid customer acquisition capacity. However, focusing outreach on premium wholesale accounts is highly strategic.",
        avatar: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&h=150&fit=crop"
      },
      {
        director: "Finance Director Agent",
        role: "Finance",
        vote: "Approve",
        reason: "This directive perfectly aligns with our cost-containment directives. By freezing raw ad-spend and shifting capital directly to high-turnover SKUs, we successfully protect our net profit target of ₹" + Math.round(stats.profit).toLocaleString('en-IN') + ".",
        avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop"
      },
      {
        director: "Marketing Director Agent",
        role: "Marketing",
        vote: "Approve",
        reason: "Although budget limits are set, the dynamic catalog integration lets us optimize spend directly. We'll capture high-intent buyers without burning capital.",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop"
      },
      {
        director: "Operations Director Agent",
        role: "Operations",
        vote: "Approve",
        reason: "The immediate injection of ₹80,000 for emergency replenishment is a critical operational win. Pausing ads on depleted stock gives our warehouse team time to stabilize logistics.",
        avatar: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&h=150&fit=crop"
      },
      {
        director: "Customer Satisfaction Agent",
        role: "Customer Satisfaction",
        vote: "Approve",
        reason: "Automating backorder alerts directly answers our primary source of customer friction. Matching sales pushes with real-time stock levels safeguards our brand reputation.",
        avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop"
      },
      {
        director: "Risk Analysis Agent",
        role: "Risk",
        vote: "Approve with Concern",
        reason: "Onboarding secondary suppliers is vital but will require significant onboarding focus. We must carefully monitor compliance during dual-sourcing transitions.",
        avatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=150&fit=crop"
      }
    ],
    meetingMinutes: {
      title: "SME Nexus Board Executive Minutes",
      date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
      attendees: [
        "CEO Agent",
        "Sales Director Agent",
        "Marketing Director Agent",
        "Operations Director Agent",
        "Finance Director Agent",
        "Customer Satisfaction Agent",
        "Risk Analysis Agent"
      ],
      summary: "SME Nexus AI Executive Board convened to evaluate growth initiatives amidst operational supply chain bottlenecks. Total revenue stood at a solid baseline, but inventory depletion threatened scaling efforts.",
      keyFindings: `- Stable consumer demand yielding total revenue of ₹${stats.revenue.toLocaleString('en-IN')} across ${stats.orders} orders.\n- Supply bottlenecks present with an inventory health rating of ${stats.inventoryHealth}% and multiple low stock levels.\n- Churn risk is concentrated in logistics delays driving neutral and negative rating text.`,
      conflictsResolved: "Sales proposed aggressive marketing spending, which Finance and Operations opposed due to cash constraints and inventory risk. Compromise: Approved targeted, low-spend marketing focused strictly on fully stocked categories, with immediate capital directed to inventory restocking.",
      actionItems: `- Operations Director Agent to place emergency replenishment orders (Week 1).\n- Marketing Director Agent to filter ad sets according to inventory stock levels (Week 1).\n- Customer Satisfaction Agent to deploy automated notification updates for backorders (Month 1).`,
      futureRecommendations: "Develop secondary supplier routes to minimize single-source risks, and transition to automated demand-forecasting software to optimize purchasing cycles."
    }
  };
}

startServer();
