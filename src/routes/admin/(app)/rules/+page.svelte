<script lang="ts">
	import { goto } from '$app/navigation';
	import { AdminService } from '$lib/service/admin.service';
	import { Button, Toggle } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let ruleGroups: any[] = [];
	let role: any;

	async function toggleRule(index: number) {
		console.log(ruleGroups[index]);
		await AdminService.toggleRuleGroup(ruleGroups[index]);

		ruleGroups = ruleGroups.map((group, i) =>
			i === index ? { ...group, status: toggleStatus(group.status) } : group
		);

		await getRuleGroups();
	}

	function toggleStatus(status: string): string {
		if (status === 'OFF') return 'ON';
		if (status === 'ON') return 'OFF';
		return 'PARTIALLY ON';
	}

	const ruleDescriptions: { [key: string]: string } = {
		// (Existing rule descriptions)
		'CUSTOM-RULES.conf':
			'Handles user-defined rules that can be tailored to specific needs and scenarios. This group allows for the creation of fully custom rules, addressing unique security requirements. It includes options for IP Ban, Country Ban, and Block URL, providing flexibility to enforce security measures based on specific criteria. By accommodating a variety of custom rules, it ensures comprehensive and adaptable ',
		'REQUEST-901-INITIALIZATION.conf':
			'Initializes the core rule set and prepares the environment for processing incoming requests. Ensures all other rules can function correctly and consistently. By establishing a baseline, it helps maintain stability and predictability across the rule set. Proper initialization is crucial for effective security management.',
		'REQUEST-905-COMMON-EXCEPTIONS.conf':
			'Handles common exceptions to prevent false positives from legitimate requests. Provides a baseline for other rules to ensure accuracy. It ensures that valid traffic is not unnecessarily blocked. Managing exceptions helps in reducing the burden of unnecessary alerts.',
		'REQUEST-911-METHOD-ENFORCEMENT.conf':
			'Enforces acceptable HTTP methods by allowing only those deemed valid and safe. This prevents the use of non-standard methods that could be exploited in attacks. Ensuring method compliance is a fundamental step in securing HTTP traffic. This file is vital for maintaining the integrity of web interactions.',
		'REQUEST-913-SCANNER-DETECTION.conf':
			'Detects and blocks automated scanners and crawlers that attempt to probe the application. These tools often look for vulnerabilities to exploit. By identifying and stopping them early, this rule file helps protect against reconnaissance efforts. It ensures that only legitimate traffic can interact with the server.',
		'REQUEST-920-PROTOCOL-ENFORCEMENT.conf':
			'Ensures requests conform to established HTTP protocol standards by enforcing compliance. By adhering to protocol standards, it helps maintain a predictable and secure environment. Ensuring protocol compliance reduces the risk of exploits that rely on unusual or malformed requests. This file is key to maintaining the integrity of web communications.',
		'REQUEST-921-PROTOCOL-ATTACK.conf':
			'Protects against attacks that exploit weaknesses in HTTP protocol handling, such as request smuggling and splitting. This rule file identifies and blocks such malicious activities. By safeguarding protocol integrity, it prevents attackers from manipulating request flows. Ensuring robust protocol security is essential for a resilient web application.',
		'REQUEST-922-MULTIPART-ATTACK.conf':
			'Detects and blocks attacks that use multipart/form-data encoding, often used in file uploads. This rule file ensures that multipart requests are safe and conform to expected formats. By scrutinizing multipart data, it prevents harmful content from reaching the server. Managing multipart requests is critical for secure file handling.',
		'REQUEST-930-APPLICATION-ATTACK-LFI.conf':
			'Prevents Local File Inclusion (LFI) attacks by blocking attempts to include files from the local server. LFI can expose sensitive files and lead to further exploitation. By mitigating LFI risks, it protects the server’s internal file structure. Ensuring file access security is crucial for maintaining application integrity.',
		'REQUEST-931-APPLICATION-ATTACK-RFI.conf':
			'Prevents Remote File Inclusion (RFI) attacks by blocking attempts to include files from remote servers. RFI can lead to remote code execution and other severe vulnerabilities. By mitigating RFI risks, it prevents attackers from executing unauthorized code. Securing file inclusion processes is vital for application security.',
		'REQUEST-932-APPLICATION-ATTACK-RCE.conf':
			'Blocks Remote Code Execution (RCE) attacks that attempt to run arbitrary code on the server. RCE vulnerabilities are among the most dangerous, as they can give attackers full control. By preventing RCE, it protects the integrity and confidentiality of server operations. Robust RCE defenses are critical for any application.',
		'REQUEST-933-APPLICATION-ATTACK-PHP.conf':
			'Protects against various PHP-specific attacks targeting vulnerabilities in PHP-based applications. This rule file identifies and blocks common PHP attack vectors. By focusing on PHP-specific threats, it enhances the security of applications written in this language. Ensuring PHP security is essential for any PHP-based web application.',
		'REQUEST-934-APPLICATION-ATTACK-GENERIC.conf':
			'Covers a wide range of generic application attacks that are not specific to any particular type of application. By addressing generic vulnerabilities, it strengthens the overall security posture. It acts as a catch-all for threats that might not fall under more specific rules. Ensuring comprehensive coverage is key to robust security.',
		'REQUEST-941-APPLICATION-ATTACK-XSS.conf':
			'Prevents Cross-Site Scripting (XSS) attacks by blocking malicious scripts injected into web pages. XSS can steal user data, deface websites, and more. By stopping XSS, it protects users and maintains the integrity of web content. Robust XSS defenses are crucial for user trust and application security.',
		'REQUEST-942-APPLICATION-ATTACK-SQLI.conf':
			'Blocks SQL Injection (SQLi) attacks that attempt to manipulate backend databases through malicious queries. This rule file ensures that queries are properly sanitized and safe. By preventing SQLi, it protects the database’s integrity and confidentiality. Effective SQLi defenses are essential for database security.',
		'REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION.conf':
			'Protects against session fixation attacks that hijack user sessions by setting session IDs. Session fixation can lead to unauthorized access and data theft. By preventing session fixation, it maintains the integrity and security of user sessions. Robust session management is critical for user authentication.',
		'REQUEST-944-APPLICATION-ATTACK-JAVA.conf':
			'Prevents attacks targeting Java-based applications by blocking Java-specific vulnerabilities. This rule file identifies and mitigates common Java attack vectors. By securing Java applications, it ensures their reliability and safety. Protecting Java environments is essential for many business-critical applications.',
		'REQUEST-949-BLOCKING-EVALUATION.conf':
			'Evaluates and blocks requests based on the cumulative score of previous checks. By considering multiple factors, it improves the accuracy of threat detection. Ensuring that malicious requests are blocked helps maintain security. Effective blocking evaluation is critical for proactive threat management.',
		'RESPONSE-950-DATA-LEAKAGES.conf':
			'Detects and prevents data leakages in HTTP responses to protect sensitive information. Data leakage can expose confidential data and lead to breaches. By preventing data leakage, it protects both user and server data. Securing response content is essential for maintaining privacy and compliance.',
		'RESPONSE-951-DATA-LEAKAGES-SQL.conf':
			'Prevents data leakages specifically related to SQL databases by ensuring query responses are safe. This rule file ensures that SQL responses do not expose sensitive data. By securing SQL data, it protects against unintended information disclosure. Effective SQL data management is vital for database security.',
		'RESPONSE-952-DATA-LEAKAGES-JAVA.conf':
			'Prevents data leakages in Java-based applications by ensuring that responses are properly sanitized. Java applications can inadvertently expose sensitive data. By preventing data leakage, it protects sensitive information in Java applications. Securing Java data is critical for enterprise application security.',
		'RESPONSE-953-DATA-LEAKAGES-PHP.conf':
			'Prevents data leakages in PHP-based applications by securing responses against inadvertent exposure. PHP applications can leak sensitive data if not properly managed. By preventing data leakage, it protects sensitive PHP data. Ensuring PHP data security is essential for maintaining application integrity.',
		'RESPONSE-954-DATA-LEAKAGES-IIS.conf':
			'Prevents data leakages in applications running on Microsoft IIS servers. IIS-specific vulnerabilities can expose sensitive information. By preventing data leakage, it protects against unintended data exposure. Securing IIS server data is vital for applications hosted on Microsoft platforms.',
		'RESPONSE-959-BLOCKING-EVALUATION.conf':
			'Re-evaluates blocking decisions based on response data and detected anomalies. By continuously assessing response behavior, it improves security effectiveness. Ensuring that blocking actions are valid prevents unnecessary disruptions. Effective response evaluation is crucial for adaptive security measures.',
		'RESPONSE-980-CORRELATION.conf':
			'Correlates events and responses to detect complex multi-step attacks and anomalies. By correlating data, it provides a broader context for security analysis. Ensuring comprehensive event correlation enhances threat detection. Effective correlation is key to identifying sophisticated attack strategies.'
	};

	onMount(async () => {
		role = localStorage.getItem('role');
		await getRuleGroups();
	});

	async function getRuleGroups() {
		let res = await AdminService.getRuleGroups();
		ruleGroups = res.ruleGroups.sort((a: { file_name: string }, b: { file_name: any }) =>
			a.file_name.localeCompare(b.file_name)
		);
	}
</script>

<div class="flex justify-between mb-3">
	<h1>Rules</h1>
	<div>
		{#if role != 'Junior Developer'}
			<Button pill color="dark" on:click={() => goto('/admin/rules/add')}>Add Rule</Button>
		{/if}
	</div>
</div>
{#if ruleGroups != undefined}
	{#each ruleGroups as group, index}
		<div
			class="rule-item flex justify-between items-center p-4 mb-4 rounded-lg dark:bg-gray-800 shadow-md"
		>
			<div class="flex-1 pr-5">
				<h2 class="text-xl font-semibold mb-1">{group.file_name.slice(0, -5)}</h2>
				<p class="text-sm text-gray-400">{ruleDescriptions[group.file_name]}</p>
				<a class="underline text-sm" href={'/admin/rules/' + group.file_name.slice(0, -5)}
					>View Full Rules</a
				>
			</div>
			<div class="flex items-center flex-col">
				{#if role == 'Junior Developer'}
					<Toggle disabled checked={group.status != 'OFF'} on:click={() => toggleRule(index)} />
				{:else}
					<Toggle checked={group.status != 'OFF'} on:click={() => toggleRule(index)} />
				{/if}
				{#if group.status === 'PARTIALLY ON'}
					<span class="mt-2 text-xs text-yellow-400">* partially on</span>
				{/if}
			</div>
		</div>
	{/each}
{/if}

<style>
	.rule-item {
		background: #2d3748;
		border: 1px solid #4a5568;
		color: #f7fafc;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.rule-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
	}

	.rule-item h2 {
		color: #edf2f7;
	}

	.rule-item p {
		color: #a0aec0;
	}

	.text-yellow-400 {
		color: #ecc94b;
	}
</style>
