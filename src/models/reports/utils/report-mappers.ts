import { ReportTypes } from '@reportsEnums';

export const ReportMappers: Record<ReportTypes | 'DEFAULT', (row: any) => any> =
  {
  	[ReportTypes.SALES_ANALYSIS]: (row: any) => ({
  		email: row.customer_email || row.email,
  		content: row,
  	}),

  	[ReportTypes.USER_FEEDBACK]: (row: any) => ({
  		email: row.user_email || row.reviewer_email,
  		content: row,
  	}),

  	[ReportTypes.INVENTORY_AUDIT]: (row: any) => ({
  		email: null,
  		content: row,
  	}),
  	[ReportTypes.MARKETING_LEADS]: (row: any) => ({
  		email: row.lead_email || row.email,
  		content: row,
  	}),

  	DEFAULT: (row: any) => ({
  		content: row,
  	}),
  };
