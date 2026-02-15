import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IAIService {
	analyzeDataWithAI(data: any): Promise<any>;
}

@Injectable()
export class AIService implements IAIService {
	private logger;
	private genAI: GoogleGenerativeAI;
	private model: GenerativeModel;
	private readonly apiKey: string = process.env.GOOGLE_API_KEY || 'your-google-api-key';

	constructor(private configService: ConfigService) {
		this.logger = new Logger('AIService');
		this.apiKey = this.configService.get<string>('global.GOOGLE_API_KEY') || this.apiKey;
		this.genAI = new GoogleGenerativeAI(this.apiKey);
		this.model = this.genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
	}

	public async analyzeDataWithAI(data: any): Promise<any> {
		try {
			const prompt = this.generatePromptForReport(data);
			const response = await this.model.generateContent(prompt);
			return JSON.parse(response.response?.text() || '{}');
		} catch (error) {
			this.logger.error('Error analyzing data with AI:', error);
			throw new Error('Failed to analyze data with AI');
		}
	}

	private generatePromptForReport(summaryData: { dataType: string; sample: any[] }): string {
		const prompt = `
            Context:
            You are a Senior Data Scientist and Business Intelligence Expert.
            I am providing you with a raw data sample in JSON format, which is a subset of a massive dataset containing 100,000 records.
            Data Category: "${summaryData.dataType}"
            Raw Data Sample:
            ${JSON.stringify(summaryData.sample)}

            Your Task:
            Perform a deep-dive analysis on this sample to project insights for the entire 100,000-record dataset.

            Required Analysis Points:
            1. Data Identification: What exactly does this dataset represent? (e.g., E-commerce transactions, User activity logs, Inventory management).
            2. Pattern Discovery: Identify 3 sophisticated patterns or correlations that are not immediately obvious (e.g., "Users from Region X tend to churn after 3 months").
            3. Performance Metrics: Suggest 3 specific KPIs that should be tracked based on these headers.
            4. Anomalies & Quality: Detect any data inconsistencies, missing patterns, or outliers in the sample.
            5. Executive Recommendation: Provide one high-level strategic business advice based on the data trends.

            Output Constraints:
            - The response must be a STRICT, VALID JSON object.
            - Do not include any conversational text before or after the JSON.
            - All content must be in English.
            JSON Structure:
            {
            "detected_domain": "string",
            "executive_summary": "string",
            "key_findings": [
            { "finding": "string", "impact": "High/Medium/Low" }
            ],
            "suggested_kpis": ["string"],
            "data_integrity_report": "string",
            "strategic_advice": "string"}`;
		return prompt;
	}

}
