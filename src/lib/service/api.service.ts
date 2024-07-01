import type { DashboardResponse, LogsResponse } from '$lib/models/log.models';
import { HTTPException, HTTPService } from './http.service';

const PUBLIC_API_URL = 'http://localhost:8080';

export abstract class APIService {
	private static httpService = new HTTPService(PUBLIC_API_URL, 'api');

	public static async sendTestData(email: string, password: string): Promise<string> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					email: email,
					password: password
				})
				.post('/test');
			return res.id;
		} catch (e) {
			throw e;
		}
	}

	public static async sendSampleAppData(item: string): Promise<string> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					item: item
				})
				.post('/sampleApp/item');
			return res.id;
		} catch (e) {
			throw e;
		}
	}

	public static async getItems(): Promise<any> {
		try {
			const res: any = await this.httpService.request.get('/sampleApp/items/');
			return res;
		} catch (e) {
			throw e;
		}
	}
}
