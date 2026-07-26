export interface ClaudeChatOptions {
  question: string;
  context: {
    userRole?: string;
    turnover: number;
    profitLoss: number;
    cost: number;
    totalRecords: number;
    recentRecords?: any[];
    shareValues?: any[];
  };
}

export async function askClaudeFinanceAssistant(options: ClaudeChatOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const systemPrompt = `You are FinTrack Pro AI Assistant, a specialized financial analyst.
You must ground all your answers STRICTLY in the provided company financial dataset context below.
Do NOT hallucinate or guess figures outside this dataset.

Financial Dataset Context:
- Access User Role: ${options.context.userRole || 'ANALYST'}
- Total Turnover: INR ${(options.context.turnover / 100000).toFixed(2)} Lakhs (Raw: ₹${options.context.turnover.toLocaleString()})
- Total Profit / Loss: INR ${(options.context.profitLoss / 100000).toFixed(2)} Lakhs (Raw: ₹${options.context.profitLoss.toLocaleString()})
- Total Operational Cost: INR ${(options.context.cost / 100000).toFixed(2)} Lakhs (Raw: ₹${options.context.cost.toLocaleString()})
- Total Logged Financial Entries: ${options.context.totalRecords}
- Recent Record Sample: ${JSON.stringify(options.context.recentRecords || [])}
- Share Price Data Sample: ${JSON.stringify(options.context.shareValues || [])}

Provide clear, professional financial explanations and insights based on these exact figures. Format using markdown bullet points or concise sections where helpful.`;

  if (!apiKey || apiKey.startsWith('sk-ant-...') || apiKey === '') {
    // Intelligent fallback response grounded in context when Anthropic API key is not configured locally
    return generateLocalFinancialAnalysis(options.question, options.context);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: options.question,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Anthropic API request returned non-OK status:', errorText);
      return generateLocalFinancialAnalysis(options.question, options.context);
    }

    const data = await response.json();
    return data.content[0]?.text || 'No response content returned from Claude.';
  } catch (error) {
    console.error('Claude API call failed:', error);
    return generateLocalFinancialAnalysis(options.question, options.context);
  }
}

function generateLocalFinancialAnalysis(question: string, context: ClaudeChatOptions['context']): string {
  const q = question.toLowerCase();

  const turnoverLakhs = (context.turnover / 100000).toFixed(2);
  const profitLakhs = (context.profitLoss / 100000).toFixed(2);
  const costLakhs = (context.cost / 100000).toFixed(2);
  const marginPct = context.turnover > 0 ? ((context.profitLoss / context.turnover) * 100).toFixed(1) : '0';

  if (q.includes('turnover') || q.includes('revenue') || q.includes('sales')) {
    return `### Turnover Analysis\n\n- **Total Turnover:** ₹${context.turnover.toLocaleString()} (INR ${turnoverLakhs} Lakhs)\n- **Context:** Calculated across ${context.totalRecords} logged financial records.\n- **Insight:** Your turnover forms the core revenue baseline powering dashboard trend charts.`;
  }

  if (q.includes('profit') || q.includes('margin') || q.includes('loss')) {
    return `### Profit & Loss Performance\n\n- **Net Profit:** ₹${context.profitLoss.toLocaleString()} (INR ${profitLakhs} Lakhs)\n- **Profit Margin:** ${marginPct}%\n- **Insight:** Net margin stands at ${marginPct}%, reflecting healthy operating leverage against operational expenses.`;
  }

  if (q.includes('cost') || q.includes('expense') || q.includes('spending')) {
    return `### Operational Cost Breakdown\n\n- **Total Operational Costs:** ₹${context.cost.toLocaleString()} (INR ${costLakhs} Lakhs)\n- **Cost Ratio:** ${context.turnover > 0 ? ((context.cost / context.turnover) * 100).toFixed(1) : 0}% of Turnover\n- **Recommendation:** Maintain monitoring on recurring monthly operational expenses.`;
  }

  return `### Financial Overview & Assistant Summary\n\nBased on your active company dataset:\n\n- **Total Turnover:** ₹${context.turnover.toLocaleString()} (${turnoverLakhs} Lakhs)\n- **Net Profit:** ₹${context.profitLoss.toLocaleString()} (${profitLakhs} Lakhs)\n- **Operational Expenses:** ₹${context.cost.toLocaleString()} (${costLakhs} Lakhs)\n- **Net Margin:** ${marginPct}%\n\n*All figures are strictly grounded in your database records.* How else can I assist with your financial analytics?`;
}
