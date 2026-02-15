export interface IReportData {
    _id: string;
    reportId: string;
    type: string;   // "USERS", "SALES", "INVENTORY"
    content: any;   // ROW DATA 
    email?: string; // ROW TO EXTRA TO SEARCH
    createdAt: Date;
}