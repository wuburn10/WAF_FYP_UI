import type { LogsResponse } from '$lib/models/log.models';
import { HTTPService } from './http.service';

const PUBLIC_API_URL = 'http://localhost:8080';

export abstract class AdminService {
	private static httpService = new HTTPService(PUBLIC_API_URL, '/api');

	public static async getLogs(): Promise<LogsResponse> {
		try {
			const res: any = await this.httpService.request.get('/admin/logs');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async getLog(lid: string): Promise<LogsResponse> {
		try {
			let res: any = await this.httpService.request.get('/admin/log/' + lid);
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async getDashboardData(): Promise<any> {
		try {
			const res: any = await this.httpService.request.get('/admin/dashboard');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async createUser(
		username: string,
		password: string,
		role: string,
		fullName: string,
		email: string
	): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					username: username,
					password: password,
					role: role,
					full_name: fullName,
					email: email
				})
				.post('/admin/user/create');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async editUser(
		id: number,
		username: string,
		oldPassword: string,
		newPassword: string,
		role: string,
		fullName: string,
		email: string
	): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					id: id,
					username: username,
					old_password: oldPassword,
					new_password: newPassword,
					role: role,
					full_name: fullName,
					email: email
				})
				.post('/admin/user/edit');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async deleteUser(username: string): Promise<any> {
		try {
			const res: any = await this.httpService.request.get(`/admin/user/delete/${username}`);
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async getUsers(): Promise<any> {
		try {
			const res: any = await this.httpService.request.get('/admin/users');
			return res.users;
		} catch (e) {
			throw e;
		}
	}

	public static async addIncidentResponse(
		title: string,
		logID: string,
		actionsTaken: string,
		dateOfAction: string,
		severity: string,
		status: string,
		resolvedAt: string,
		createdBy: string
	): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					title: title,
					logID: logID,
					actionsTaken: actionsTaken,
					dateOfAction: dateOfAction,
					severity: severity,
					status: status,
					resolved_at: resolvedAt,
					created_by: createdBy
				})
				.post('/admin/log/' + logID + '/response');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async editIncidentResponse(
		id: string,
		title: string,
		logID: string,
		actionsTaken: string,
		dateOfAction: string,
		severity: string,
		status: string,
		resolvedAt: string,
		createdBy: string
	): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					id: id,
					title: title,
					logID: logID,
					actionsTaken: actionsTaken,
					dateOfAction: dateOfAction,
					severity: severity,
					status: status,
					resolved_at: resolvedAt,
					created_by: createdBy
				})
				.post('/admin/response/update');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async getRuleGroups(): Promise<any> {
		try {
			const res: any = await this.httpService.request.get('/admin/rules');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async getRules(ruleGroup: string): Promise<any> {
		try {
			const res: any = await this.httpService.request.get('/admin/rules/' + ruleGroup);
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async getRuleInfo(ruleGroup: string): Promise<any> {
		console.log('in getRuleInfo');
		try {
			console.log('httpService');
			let res: any = await this.httpService.request.get('/admin/rule/' + ruleGroup);
			console.log(res);
			return res;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	public static async getSettings(): Promise<any> {
		try {
			const res: any = await this.httpService.request.get('/admin/settings');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async editSettings(settings: any): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					WebsiteName: settings.settings.WebsiteName,
					Port: settings.settings.Port,
					WebsiteDescription: settings.settings.WebsiteDescription,
					WafOn: settings.settings.WafOn,
					NoLogPaths: settings.settings.NoLogPaths,
					ReverseProxies: settings.settings.ReverseProxies
				})
				.post('/admin/settings');
			return res.success;
		} catch (e) {
			throw e;
		}
	}

	public static async toggleRuleGroup(ruleGroup: any): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					fileName: ruleGroup.file_name,
					status: ruleGroup.status
				})
				.post('/admin/rules/group/toggle');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async toggleRule(rule: any): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					fileName: rule.FileName,
					ruleID: rule.RuleID,
					isEnabled: !rule.On
				})
				.post('/admin/rule/toggle');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async addRule(rule: any): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					file_name: rule.file_name,
					rule_id: rule.rule_id,
					phase: rule.phase,
					action: rule.action,
					msg: rule.msg,
					raw_rule: rule.raw_rule,
					isEnabled: rule.isEnabled
				})
				.post('/admin/rules/add');
			return res;
		} catch (e) {
			throw e;
		}
	}

	public static async login(username: string, password: string): Promise<any> {
		try {
			const res: any = await this.httpService.request
				.withJSON({
					username: username,
					password: password
				})
				.post('/admin/login');
			return res;
		} catch (e) {
			throw e;
		}
	}
}
