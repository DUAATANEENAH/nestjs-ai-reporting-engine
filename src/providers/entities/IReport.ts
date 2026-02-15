export interface IReport {
    id: string;
    fileName: string;
    filePath: string;
    status: string; // "PENDING", "PROCESSING", "COMPLETED", "FAILED"
    aiAnalysis?: any; // AI GENERATED ANALYSIS
    createdAt?: Date;
    updatedAt?: Date;
}