export interface LogsResponse {
	logs: Logs;
}

export interface DashboardResponse {
	dashboard: Dashboard;
}

export interface Logs {
	query: string;
	columns: any[];
	timestamp: number;
	dataset: any[][];
	count: number;
}

export interface Dashboard {
	totalRequest: any;
	deniedRequest: any;
	acceptedRequest: any;
}
