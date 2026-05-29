#!/usr/bin/env python3
"""Generate 2.2.6 CLI Trinity Wrapup page."""

import html as h

scenarios = [
    {
        "num": 1, "icon": "🚨", "title": "Web Server Breach Investigation",
        "situation": "At 3 AM, the SIEM alerts fire. Your Apache web server is under attack. Access logs show suspicious activity — potential data exfiltration via encoded URLs. You need to identify the attacker's IP, their attack vector, and what data they targeted — all from the terminal in minutes.",
        "steps": [
            ("grep", 'grep -E "(\\.\\.%2[fF]|union.*select|<script>|/etc/passwd)" /var/log/apache2/access.log', "Filter the massive log for attack signatures: path traversal (%2f), SQL injection (union select), XSS (<script>), and LFI (/etc/passwd). This immediately narrows millions of lines to just the malicious requests."),
            ("awk", "awk '{print $1}' suspicious_hits.log | sort | uniq -c | sort -rn | head -20", "Extract source IPs from each attack line, count occurrences, sort descending. The top IPs are your prime suspects — the attacker's infrastructure. Normal users don't trigger attack signatures dozens of times."),
            ("grep", 'grep "203.0.113.42" /var/log/apache2/access.log | awk \'{print $7}\'', "Zero in on the attacker IP and extract every URL they requested. This reveals their complete attack chain — recon, exploitation, data access — reconstructing the breach timeline."),
            ("awk", "awk '/203.0.113.42/ {print $4, $7, $9}' /var/log/apache2/access.log", "Extract timestamps ($4), URLs ($7), and status codes ($9) for the attacker. Status 200 on sensitive paths = successful data access. This defines your breach scope for the incident report."),
            ("sed", "sed -n '/203.0.113.42/s/.*\\[\\(.*\\)\\].*/\\1/p' /var/log/apache2/access.log | head -1", "Extract the exact timestamp of the first malicious request — the breach start time. Critical for legal proceedings, insurance claims, and GDPR's 72-hour notification requirement."),
        ],
        "full_pipeline": 'grep -E "(union.*select|<script>|/etc/passwd)" /var/log/apache2/access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -5',
        "best_practices": ["Preserve original logs before analysis — forensic integrity matters", "Use grep -c for quick counts before deep-diving", "Document every command during IR for the post-incident report", "Correlate timestamps across multiple log sources for full timeline"],
    },
    {
        "num": 2, "icon": "🔐", "title": "Credential Leak Sweep Across Codebase",
        "situation": "A developer accidentally pushed AWS credentials to a public GitHub repo. It was public for 6 hours before anyone noticed. You need to scan the entire codebase for hardcoded secrets — API keys, passwords, tokens, private keys — across thousands of files, immediately.",
        "steps": [
            ("grep", 'grep -rn --include="*.{py,js,yml,yaml,json,env,conf,tf}" -iE "(api[_-]?key|secret[_-]?key|password|token|private[_-]?key|aws_access)\\s*[=:]" ./', "Recursively search config and source files for secret patterns. The -i catches case variations. The regex matches both = and : assignment styles across all common languages."),
            ("grep", 'grep -rnE "AKIA[0-9A-Z]{16}" ./', "AWS Access Key IDs always start with AKIA followed by 16 alphanumeric chars. This precise regex is zero false-positives — if it matches, you've found an AWS key. Period."),
            ("awk", 'grep -rn "password" --include="*.py" ./ | awk -F: \'{print $1}\' | sort -u', "Extract unique filenames from matches using awk's field separator. This creates your remediation checklist — the exact files that need secrets removed or rotated."),
            ("sed", "sed -i 's/AKIA[0-9A-Z]\\{16\\}/REDACTED_AWS_KEY/g' config.py", "In-place redaction of exposed keys. The -i flag edits files directly — instant remediation. Run this across all flagged files to clean the codebase in seconds."),
            ("grep", 'grep -rn --include="*.py" -v "#" ./ | grep -iE "(password|secret)\\s*=\\s*[\'\\"](?!\\$|\\{|os\\.environ)"', "Find hardcoded secrets while excluding comments and env-var references. The negative lookahead skips legitimate patterns like os.environ — dramatically reducing false positives."),
        ],
        "full_pipeline": 'grep -rnE "AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}" ./ | awk -F: \'{printf "File: %s Line: %s\\n", $1, $2}\' | tee /tmp/aws_key_audit.log',
        "best_practices": ["Rotate ALL exposed credentials immediately — scanning is step 1, not the fix", "Add pre-commit hooks with git-secrets or detect-secrets", "Check git history: git log -p | grep -E 'AKIA[0-9A-Z]{16}'", "Use AWS IAM Access Analyzer to find unused or exposed keys"],
    },
    {
        "num": 3, "icon": "📊", "title": "DDoS Attack Traffic Analysis",
        "situation": "Your e-commerce platform is crawling during Black Friday. The NOC suspects a DDoS attack mixed with legitimate traffic. You need to analyze nginx access logs to separate bots from real customers, identify attack patterns, and generate a blocklist — without taking the server offline.",
        "steps": [
            ("awk", "awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -30", "Count requests per IP, sort descending. Normal users: 10-50 requests/session. IPs with 10,000+ requests/hour are almost certainly bots. This is your first triage — instant attacker identification."),
            ("awk", "awk '{ips[$1]++} END {for (ip in ips) if (ips[ip] > 1000) print ips[ip], ip}' /var/log/nginx/access.log | sort -rn", "Pure awk single-pass solution — faster on massive files. Builds an associative array counting hits per IP, then filters for 1000+ threshold. Your DDoS source list, generated in seconds."),
            ("grep+awk", 'grep "203.0.113." /var/log/nginx/access.log | awk -F\'"\' \'{print $6}\' | sort | uniq -c | sort -rn', "Analyze User-Agent strings from suspects. DDoS bots use identical or empty User-Agents. Legitimate users show diverse browser strings. This confirms bot vs human traffic."),
            ("awk", 'awk \'{split($4,t,":"); hours[t[2]]++} END {for (h in hours) printf "%s:00 — %d requests\\n", h, hours[h]}\' /var/log/nginx/access.log | sort', "Build hourly traffic histogram. DDoS attacks show dramatic spikes in specific hours. This identifies exact attack windows for your incident timeline and ISP abuse reports."),
            ("awk+sed", "awk '{ips[$1]++} END {for (ip in ips) if (ips[ip] > 1000) print ip}' /var/log/nginx/access.log | sed 's/^/deny /;s/$/;/' > /etc/nginx/blocklist.conf", "Generate nginx blocklist directly from analysis. Each offending IP formatted as deny IP; — ready to include in your config. This is analysis-to-mitigation in one pipeline."),
        ],
        "full_pipeline": "awk '{ips[$1]++} END {for (ip in ips) if (ips[ip]>500) print ip}' access.log | sed 's/^/deny /;s/$/;/' > blocklist.conf",
        "best_practices": ["Set up rate limiting in nginx (limit_req_zone) proactively", "Use fail2ban jails to auto-block repeat offenders", "Keep 30+ days of access logs for forensic depth", "Prefer awk over grep for large files — single-pass processing is faster"],
    },
    {
        "num": 4, "icon": "🛡️", "title": "SSH Brute-Force Forensics & Auto-Defense",
        "situation": "Your dashboard shows 50,000+ failed SSH logins in 24 hours across your fleet. Management wants a full forensic report: attacker IPs, targeted usernames, timing patterns, and an automated defense mechanism — all built with the CLI trinity.",
        "steps": [
            ("grep", 'grep "Failed password" /var/log/auth.log | grep -oP "from \\K[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" | sort | uniq -c | sort -rn | head -20', "Extract source IPs from failed attempts. PCRE's \\K resets the match start, extracting only the IP after 'from'. Top attackers identified instantly — your threat actor list."),
            ("awk", "awk '/Failed password/ {for(i=1;i<=NF;i++) if($i==\"for\") print $(i+1)}' /var/log/auth.log | sort | uniq -c | sort -rn | head -20", "Extract targeted usernames. Awk iterates fields to find the word after 'for'. Common targets: root, admin, ubuntu, test. If they're trying YOUR specific usernames — this is targeted, not opportunistic."),
            ("awk", "awk '/Failed password/ {split($0,a,\":\"); hour=substr(a[1],length(a[1])-4); hours[hour]++} END {for(h in hours) print h, hours[h]}' /var/log/auth.log | sort", "Hourly attack profile. Botnets attack in waves — identifying peak hours helps you decide on stricter controls during high-risk windows or detect coordinated campaigns."),
            ("sed+awk", "grep \"Failed password\" /var/log/auth.log | awk '{print $1, $2}' | uniq -c | sort -rn | sed 's/^ *//' | head -10", "Attack intensity by date. Clean formatting with sed for reporting. Spikes on specific dates correlate with new botnet campaigns or your IP appearing on attacker target lists."),
            ("awk", "awk '/Failed password/ {for(i=1;i<=NF;i++) if($i==\"from\") ips[$(i+1)]++} END {for(ip in ips) if(ips[ip]>50) printf \"iptables -A INPUT -s %s -j DROP\\n\", ip}' /var/log/auth.log", "The ultimate one-liner: parse logs, count per IP, generate iptables block rules for anyone with 50+ failures. Pipe to sh to execute. Forensics + defense in one command."),
        ],
        "full_pipeline": 'grep "Failed password" /var/log/auth.log | awk \'{for(i=1;i<=NF;i++) if($i=="from") ips[$(i+1)]++} END {for(ip in ips) if(ips[ip]>100) print ip}\' | while read ip; do iptables -A INPUT -s $ip -j DROP; echo "Blocked: $ip"; done',
        "best_practices": ["Disable password auth entirely — use SSH keys only", "Deploy fail2ban for automatic brute-force mitigation", "Move SSH to a non-standard port to reduce noise", "Use AllowUsers/AllowGroups in sshd_config to limit access"],
    },
    {
        "num": 5, "icon": "📋", "title": "Compliance Audit: PII Detection in Logs",
        "situation": "GDPR/CCPA audit incoming. The compliance team suspects application logs contain PII — emails, phone numbers, credit cards, SSNs — violating data protection regulations. You need to scan 200GB+ of log archives across hundreds of files.",
        "steps": [
            ("grep", 'grep -rnoP "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" /var/log/app/', "Scan for email addresses. The -o prints only matched emails, -n gives line numbers, -P enables Perl regex for accuracy. Every match is a potential GDPR violation that needs redaction."),
            ("grep", 'grep -rnoE "\\b[0-9]{3}[-.]?[0-9]{2}[-.]?[0-9]{4}\\b" /var/log/app/', "Detect SSN patterns (123-45-6789, 123.45.6789, 123456789). Word boundaries \\b prevent matching random number strings. Every hit requires immediate redaction and breach assessment."),
            ("grep", 'grep -rnE "\\b[0-9]{13,16}\\b" /var/log/app/ | grep -vE "(timestamp|request_id|session)"', "Find potential credit card numbers (13-16 digits) while filtering out timestamps and session IDs. This dramatically reduces false positives while catching PCI-DSS violations."),
            ("sed", "sed -i 's/[a-zA-Z0-9._%+-]\\+@[a-zA-Z0-9.-]\\+\\.[a-zA-Z]\\{2,\\}/[EMAIL_REDACTED]/g' /var/log/app/app.log", "In-place PII redaction. Replaces all emails with [EMAIL_REDACTED], bringing logs into compliance without losing the surrounding context. Audit-safe remediation."),
            ("awk", 'grep -rnoP "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" /var/log/app/ | awk -F: \'{files[$1]++} END {for(f in files) printf "%-50s %d PII instances\\n", f, files[f]}\' | sort -t" " -k2 -rn', "Compliance report: PII count per file, sorted by severity. This gives the audit team a prioritized remediation list — fix worst offenders first."),
        ],
        "full_pipeline": 'grep -rlE "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|[0-9]{3}-[0-9]{2}-[0-9]{4}" /var/log/app/ | tee /tmp/pii_audit.log',
        "best_practices": ["Sanitize PII at the application level — never log it in the first place", "Implement log masking middleware in your stack", "Schedule regular automated PII scans as part of CI/CD", "Maintain audit trail of when PII was discovered and redacted"],
    },
    {
        "num": 6, "icon": "🌐", "title": "WAF Log Analysis: Zero-Day Pattern Detection",
        "situation": "Your WAF logs show suspicious requests that don't match known signatures. The security team suspects a zero-day exploit targeting your custom API. You need to identify the new attack pattern, decode the payload, and create custom detection rules — fast.",
        "steps": [
            ("grep+awk", 'grep -E "(4[0-9]{2}|5[0-9]{2})" /var/log/waf/requests.log | grep -v "404\\|499" | awk \'{print $7, $9}\' | sort | uniq -c | sort -rn | head -20', "Filter for error responses (4xx/5xx excluding noise) and extract URL + status code. Unusual error concentrations on specific endpoints reveal exploitation targets."),
            ("awk", "awk -F' ' 'length($7) > 200 {print length($7), $1, $7}' /var/log/waf/requests.log | sort -rn | head -20", "Find abnormally long URIs. Zero-day exploits stuff encoded payloads into URLs. Normal: <200 chars. Anything significantly longer is suspicious and needs inspection."),
            ("grep+sed", "grep \"/api/v2/upload\" /var/log/waf/requests.log | sed 's/%/\\n%/g' | grep -oP '(%[0-9a-fA-F]{2})+' | sort | uniq -c | sort -rn", "Isolate URL-encoded payloads on the targeted endpoint. Sed breaks URLs at each % encoding for analysis. Repeated encoded sequences reveal the exploit structure."),
            ("awk", "awk '/api\\/v2\\/upload/ {split($4,t,\":\"); mins[t[2]\":\"t[3]]++} END {for(m in mins) if(mins[m]>10) print mins[m], m}' /var/log/waf/requests.log | sort -rn", "Minute-by-minute timeline on the target endpoint. Exploit tools produce bursts in tight windows — this confirms automated exploitation vs manual probing."),
            ("sed+awk", "grep \"/api/v2/upload\" /var/log/waf/requests.log | awk '{print $1}' | sort -u | sed 's/^/SecRule REMOTE_ADDR \"@ipMatch /;s/$/\" \"id:100001,phase:1,deny\"/' > custom_rules.conf", "Generate ModSecurity WAF rules directly from analysis. Each attacker IP gets a deny rule. Real-time threat intelligence to WAF pipeline — security automation at its best."),
        ],
        "full_pipeline": "awk 'length($7)>200 {print $1}' /var/log/waf/requests.log | sort | uniq -c | sort -rn | awk '$1>50 {print $2}' | sed 's/^/deny /;s/$/;/' > blocklist.conf",
        "best_practices": ["Start WAF in detection mode, switch to blocking after tuning", "Correlate WAF logs with app logs for full attack context", "Use OWASP ModSecurity CRS as your baseline ruleset", "Share IOCs with your ISAC community to help the industry"],
    },
    {
        "num": 7, "icon": "🔧", "title": "Mass Server Config Hardening",
        "situation": "A pentest report reveals 150 servers have insecure SSH configs: root login enabled, password auth on, weak ciphers. You need to audit and fix every sshd_config simultaneously — without breaking access for your team.",
        "steps": [
            ("grep", 'grep -n "PermitRootLogin\\|PasswordAuthentication\\|ChallengeResponseAuthentication" /etc/ssh/sshd_config', "Audit current state. Grep shows which lines contain security directives and their values. The -n flag gives line numbers for precise manual review before making changes."),
            ("sed", "sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config", "Disable root login. The ^#* regex handles both commented and active lines, replacing with the secure value. One command handles every possible state of the directive."),
            ("sed", "sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config", "Force key-based auth by disabling passwords. Same bulletproof pattern. This single change eliminates brute-force attacks entirely — the most impactful SSH hardening step."),
            ("awk", "awk '/^Ciphers/ {print \"BEFORE:\", $0} /^MACs/ {print \"BEFORE:\", $0}' /etc/ssh/sshd_config", "Audit cipher configs before modifying. The BEFORE: prefix creates clear audit trail documentation. Essential for change management compliance and rollback planning."),
            ("sed", "sed -i '/^Ciphers/d; /^MACs/d' /etc/ssh/sshd_config && echo -e 'Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com\\nMACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com' >> /etc/ssh/sshd_config", "Remove old ciphers, append modern suites. ChaCha20-Poly1305 and AES-GCM are the 2025 gold standard. ETM-mode MACs prevent padding oracle attacks. This meets CIS Benchmark Level 2."),
        ],
        "full_pipeline": "grep -l 'PermitRootLogin yes' /etc/ssh/sshd_config && sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/; s/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config && sshd -t && systemctl reload sshd",
        "best_practices": ["Always sshd -t to validate config before reloading", "Keep an active SSH session open while making changes — your safety net", "Use Ansible/Puppet for fleet-wide config management", "Follow CIS Benchmark for SSH — it covers everything systematically"],
    },
    {
        "num": 8, "icon": "📈", "title": "Kubernetes Pod Failure Triage",
        "situation": "Your K8s cluster is experiencing cascading pod failures during a rolling deployment. As the on-call SRE, you need to identify failing pods, parse their JSON logs, determine if it's a code bug or infrastructure issue — all from kubectl output piped through the trinity.",
        "steps": [
            ("awk", "kubectl get pods -A | awk '$4 != \"Running\" && $4 != \"Completed\" && NR>1 {print $1, $2, $4, $5}'", "Filter non-healthy pods across all namespaces. Awk skips healthy states to show only problems. High restart counts (field $5) = crash loops. This is your instant cluster health overview."),
            ("grep", 'kubectl logs deploy/api-server --since=30m | grep -iE "(error|fatal|panic|exception|OOMKilled)" | tail -50', "Pull recent logs and filter for error-level messages. OOMKilled = memory exhaustion (infrastructure); NullPointerException = code bug. This immediately categorizes the failure type."),
            ("awk", "kubectl logs deploy/api-server --since=30m | awk -F'\"' '/\"level\":\"error\"/ {for(i=1;i<=NF;i++) if($i==\"message\") print $(i+2)}'", "Parse JSON logs with awk. Using \" as field separator navigates JSON structure to extract error messages. This is the forensic detail behind each failure."),
            ("awk", "kubectl top pods -A | awk 'NR>1 {split($3,cpu,\"m\"); split($4,mem,\"Mi\"); if(cpu[1]>500 || mem[1]>1024) printf \"%-20s %-30s CPU:%s MEM:%s\\n\", $1, $2, $3, $4}'", "Find resource-hungry pods causing cluster pressure. Parsing metrics with awk filters for pods consuming >500m CPU or >1Gi memory — these are your optimization targets or OOM culprits."),
            ("sed+grep", "kubectl describe pod api-server-7d9f | sed -n '/Events:/,$ p' | grep -v 'Normal' | awk '{$1=$2=\"\"; print}'", "Extract Warning events from pod description. Sed captures the Events section, grep removes Normal noise. What remains are actual problems — ImagePullBackOff, CrashLoopBackOff, OOMKilled."),
        ],
        "full_pipeline": "kubectl get pods -A | awk '$4==\"CrashLoopBackOff\" {print $1, $2}' | while read ns pod; do echo \"=== $ns/$pod ===\"; kubectl logs -n $ns $pod --tail=5 2>&1 | grep -iE 'error|fatal'; done",
        "best_practices": ["Use structured JSON logging in all containerized apps", "Set CPU/memory requests AND limits on every pod", "Use kubectl logs --previous for crashed container logs", "Implement liveness + readiness probes for early failure detection"],
    },
    {
        "num": 9, "icon": "🕵️", "title": "Malware Persistence Mechanism Hunt",
        "situation": "An EDR tool flagged a server for suspicious outbound connections. The IR team suspects malware has established persistence — hidden cron jobs, modified binaries, rogue services, unauthorized SSH keys. You need to systematically hunt every persistence vector.",
        "steps": [
            ("grep", 'grep -rn --include="*.service" -E "(ExecStart|ExecStartPre)=" /etc/systemd/ /run/systemd/ ~/.config/systemd/ 2>/dev/null | grep -v "usr/"', "Search systemd units for execution directives. Filtering out /usr/ removes legitimate system services. What remains are custom or recently added units — potential malware persistence."),
            ("awk+grep", "for user in $(awk -F: '$7 !~ /(nologin|false)/ {print $1}' /etc/passwd); do echo \"=== $user ===\"; crontab -u $user -l 2>/dev/null | grep -v '^#'; done", "Check cron jobs for all users with login shells. Awk extracts usernames from /etc/passwd, then we display each user's crontab minus comments. Attackers love low-privilege cron persistence."),
            ("grep", 'grep -rn "curl\\|wget\\|python.*http\\|nc -e\\|bash -i\\|/dev/tcp" /etc/cron* /var/spool/cron/ 2>/dev/null', "Search all cron locations for suspicious commands: downloaders (curl/wget), reverse shells (nc -e, bash -i, /dev/tcp), remote execution. These are classic attack persistence patterns."),
            ("awk", "find /usr/bin /usr/sbin -mtime -7 -type f | while read f; do rpm -qf \"$f\" 2>/dev/null || dpkg -S \"$f\" 2>/dev/null || echo \"UNPACKAGED: $f\"; done | awk '/UNPACKAGED/'", "Find recently modified system binaries not belonging to any package. Unpackaged binaries in system paths are strong indicators of trojanized tools replacing legitimate ones."),
            ("sed+grep", "find /home -name 'authorized_keys' -exec sh -c 'echo \"=== {} ===\"; cat {}' \\; | sed '/^$/d' | grep -v '^===' | awk '{print $NF}' | sort -u", "Extract SSH key identities from all authorized_keys files. The last field is the key comment (usually email). Unknown identities = unauthorized backdoor access. Immediate revocation required."),
        ],
        "full_pipeline": 'grep -rn "curl\\|wget\\|python.*-c\\|nc -e\\|/dev/tcp" /etc/cron* /var/spool/cron/ 2>/dev/null | awk -F: \'{print "SUSPICIOUS:", $1, "Line:", $2}\'',
        "best_practices": ["Deploy AIDE or OSSEC for file integrity monitoring", "Compare against a known-good baseline image", "Check /tmp, /dev/shm, /var/tmp for malware staging areas", "Every finding needs timestamps for the forensic chain of evidence"],
    },
    {
        "num": 10, "icon": "🚀", "title": "CI/CD Pipeline Log Debugging & Optimization",
        "situation": "Your CI/CD pipeline fails intermittently — sometimes green, sometimes red. Each run produces 50,000+ lines of output. You need to find failure patterns, identify flaky tests, extract timing data, and optimize the slowest build stages.",
        "steps": [
            ("grep", 'grep -n -i "error\\|failed\\|fatal\\|exit code [1-9]" build_output.log | grep -v "0 errors\\|0 failed\\|error_handler"', "Find real errors in 50K lines. The second grep excludes false positives (\"0 errors\", error handling code). This cuts noise to just the 5-10 lines that matter."),
            ("awk", "awk '/FAIL/ {test=$NF; fails[test]++} END {for(t in fails) printf \"%3d failures: %s\\n\", fails[t], t}' test_results_*.log | sort -rn", "Aggregate failures across builds to find flaky tests. Awk counts each test's fail frequency. Tests failing intermittently are your pipeline stability killers."),
            ("awk", "awk '/^Stage.*started/ {name=$2; start=systime()} /^Stage.*completed/ {printf \"%4ds %s\\n\", systime()-start, name}' build.log | sort -rn | head", "Calculate step durations. Sorting by time reveals your slowest stages — the biggest optimization wins. Often one slow step dominates total build time."),
            ("sed+grep", "sed -n '/npm install/,/npm install.*done/p' build_output.log | grep -E '(WARN|deprecated|vulnerability|added [0-9])'", "Extract the dependency install section and filter for issues. Deprecation warnings and vulnerability alerts reveal supply chain risks causing intermittent builds."),
            ("awk", "grep -c 'FAIL' build_run_*.log | awk -F: '$2>0 {printf \"%-40s %d failures\\n\", $1, $2}' | sort -t' ' -k2 -rn", "Build failure rate report. Shows which runs had failures and how many. Correlating failure counts with code changes reveals which commits introduced instability."),
        ],
        "full_pipeline": "grep -c 'FAIL' build_run_*.log | awk -F: '$2>0 {printf \"%s: %d failures\\n\", $1, $2}' | sort -t: -k2 -rn",
        "best_practices": ["Implement structured build logging with timestamps", "Quarantine flaky tests rather than retrying until green", "Cache dependencies to speed up install stages", "Set up pipeline analytics dashboards to track failure trends"],
    },
]


def esc(s):
    return h.escape(s)


# ── Build HTML ──

head = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2.2.6 CLI Trinity Wrapup | lokii.tech</title>

    <meta name="description" content="10 real-world cybersecurity scenarios solved with grep, sed, and awk. Master the CLI trinity through hands-on incident response, forensics, and DevOps challenges.">
    <meta name="author" content="lokii (UnExplainableFish52)">
    <meta name="theme-color" content="#0d0d0d">

    <meta property="og:type" content="article">
    <meta property="og:url" content="https://lokii.tech/intermediate/tools/cli-trinity-wrapup.html">
    <meta property="og:title" content="CLI Trinity Wrapup | lokii.tech">
    <meta property="og:description" content="10 real-world cybersecurity scenarios mastering grep, sed, and awk.">
    <meta property="og:image" content="https://lokii.tech/preview.jpg">

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="icon" href="/favicon.ico">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/global-ui.css">

    <style>
        body { background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%); color: #fff; font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 17px; line-height: 1.8; padding: 0; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px 40px; }
        h1 { color: #00ffff; font-size: 2.8em; font-weight: 800; text-align: center; margin-bottom: 10px; text-shadow: 0 0 20px rgba(0,255,255,0.5); }
        .subtitle { color: #888; text-align: center; font-size: 1.15em; margin-bottom: 40px; }
        h2 { color: #00ffff; font-size: 1.9em; font-weight: 700; margin-top: 50px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #00ffff; }
        h3 { color: #00d4ff; font-size: 1.4em; font-weight: 600; margin-top: 25px; margin-bottom: 12px; }
        p, li { color: #e0e0e0; font-weight: 400; margin-bottom: 12px; }
        code { background: #1e1e1e; color: #00ff88; padding: 3px 8px; border-radius: 4px; font-family: 'JetBrains Mono', 'Consolas', monospace; font-size: 0.9em; }
        pre { background: #0a0a0a; border: 1px solid #333; border-left: 4px solid #00ff88; border-radius: 8px; padding: 20px; margin: 15px 0; overflow-x: auto; }
        pre code { background: transparent; padding: 0; font-size: 0.88em; line-height: 1.6; }

        .scenario { background: linear-gradient(135deg, #111318, #161b22); border: 2px solid #30363d; border-radius: 14px; padding: 35px; margin: 35px 0; transition: border-color 0.3s; }
        .scenario:hover { border-color: #00ffff; }
        .scenario-badge { display: inline-block; background: linear-gradient(135deg, #00bcd4, #0099aa); color: #000; font-weight: 700; font-size: 0.85rem; padding: 4px 14px; border-radius: 6px; margin-bottom: 12px; }
        .scenario h3.sc-title { font-size: 1.6em; color: #e6edf3; margin-top: 0; margin-bottom: 20px; }

        .label { font-weight: 700; font-size: 1rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .label-situation { color: #ffd700; }
        .label-step { color: #00ff88; }
        .label-pipeline { color: #00bcd4; }
        .label-bp { color: #ff9800; }

        .situation-box { color: #d4d4d8; line-height: 1.8; margin-bottom: 20px; padding: 12px 18px; border-left: 3px solid #ffd700; background: rgba(255,215,0,0.05); border-radius: 0 8px 8px 0; }

        .step-card { background: rgba(0,0,0,0.3); border: 1px solid #30363d; border-radius: 10px; padding: 18px; margin: 12px 0; }
        .step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .step-num { background: #1a1a2e; color: #00ffff; border: 1px solid #00ffff; font-weight: 700; font-size: 0.8rem; padding: 2px 10px; border-radius: 20px; }
        .tool-tag { display: inline-block; padding: 2px 10px; border-radius: 4px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; }
        .tool-grep { background: rgba(0,255,136,0.15); color: #00ff88; border: 1px solid #00ff88; }
        .tool-sed { background: rgba(255,107,107,0.15); color: #ff6b6b; border: 1px solid #ff6b6b; }
        .tool-awk { background: rgba(255,215,0,0.15); color: #ffd700; border: 1px solid #ffd700; }
        .tool-combo { background: rgba(0,188,212,0.15); color: #00bcd4; border: 1px solid #00bcd4; }
        .step-why { color: #b0b0b0; font-size: 0.95rem; margin-top: 6px; line-height: 1.7; }

        .solution-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: linear-gradient(135deg, #238636, #1a7f37); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; transition: all 0.3s; margin: 15px 0; }
        .solution-toggle:hover { background: linear-gradient(135deg, #2ea043, #238636); transform: translateY(-1px); }
        .solution-content { display: none; margin-top: 10px; }
        .solution-content.show { display: block; }

        .bp-list { list-style: none; padding: 0; margin: 10px 0 0; }
        .bp-list li { padding: 8px 14px; border-left: 3px solid #ff9800; margin-bottom: 8px; background: rgba(255,152,0,0.05); border-radius: 0 6px 6px 0; color: #d4d4d8; font-size: 0.95rem; }

        .trinity-box { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
        .trinity-item { background: linear-gradient(135deg, #1a1a2e, #0d0d0d); border: 2px solid; border-radius: 12px; padding: 20px; text-align: center; flex: 1; min-width: 200px; }
        .trinity-item.grep { border-color: #00ff88; }
        .trinity-item.sed { border-color: #ff6b6b; }
        .trinity-item.awk { border-color: #ffd700; }
        .trinity-item h4 { margin: 0 0 10px; font-size: 1.5em; }
        .trinity-item.grep h4 { color: #00ff88; }
        .trinity-item.sed h4 { color: #ff6b6b; }
        .trinity-item.awk h4 { color: #ffd700; }

        .divider { height: 2px; background: linear-gradient(90deg, transparent, #00ffff, transparent); margin: 40px 0; }

        .toc { background: rgba(22,27,34,0.6); border: 1px solid #30363d; border-radius: 12px; padding: 25px; margin-bottom: 40px; }
        .toc h3 { margin-top: 0; }
        .toc ul { list-style: none; padding-left: 0; }
        .toc li { margin-bottom: 8px; }
        .toc a { color: #8b949e; text-decoration: none; transition: color 0.3s; }
        .toc a:hover { color: #00ffff; }
        .toc .sn { color: #ffd700; margin-right: 8px; }

        .success-box { padding: 20px 25px; border-radius: 10px; margin: 30px 0; background: rgba(76,175,80,0.1); border-left: 4px solid #4caf50; }

        .page-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 60px; padding-top: 30px; border-top: 1px solid #30363d; }
        .page-nav a { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(22,27,34,0.6); border: 1px solid #30363d; border-radius: 10px; color: #8b949e; text-decoration: none; transition: all 0.3s; }
        .page-nav a:hover { border-color: #00ffff; color: #00ffff; }

        .footer { text-align: center; margin-top: 60px; padding: 30px; border-top: 1px solid #333; color: #666; }
        .footer a { color: #58a6ff; }

        .site-header { padding: 15px 20px; border-bottom: 1px solid #30363d; background: rgba(13,13,13,0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; }
        .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .branding { text-decoration: none; }
        .branding .logo { color: #00ffff; font-size: 1.5rem; font-weight: 800; }
        .site-nav { display: flex; gap: 25px; align-items: center; }
        .site-nav .nav-link { color: #888; text-decoration: none; font-weight: 500; transition: color 0.3s; }
        .site-nav .nav-link:hover { color: #00ffff; }

        @media (max-width: 768px) {
            .container { padding: 15px; }
            h1 { font-size: 1.8em; }
            .scenario { padding: 20px; }
            .page-nav { flex-direction: column; gap: 15px; }
            .page-nav a { width: 100%; justify-content: center; }
            .trinity-box { flex-direction: column; }
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <a href="../../index.html" class="branding"><span class="logo">lokii.tech</span></a>
            <nav class="site-nav">
                <a href="../../index.html#about" class="nav-link">About</a>
                <a href="../../index.html#resources" class="nav-link">Resources</a>
                <a href="https://github.com/UnExplainableFish52" target="_blank" class="nav-link">GitHub</a>
            </nav>
        </div>
    </header>

    <div class="container">
        <h1>⚔️ 2.2.6 The CLI Trinity — Wrapup</h1>
        <p class="subtitle">10 Real-World CyberSec Scenarios Solved with grep, sed & awk</p>

        <div class="divider"></div>

        <!-- Trinity Reminder -->
        <div class="trinity-box">
            <div class="trinity-item grep"><h4>grep</h4><p><strong>FILTER</strong></p><p>Find & extract patterns</p></div>
            <div class="trinity-item sed"><h4>sed</h4><p><strong>TRANSFORM</strong></p><p>Find, replace & edit</p></div>
            <div class="trinity-item awk"><h4>awk</h4><p><strong>STRUCTURE</strong></p><p>Column-based processing</p></div>
        </div>
        <p style="text-align:center;"><strong style="color:#ffd700;">Together: Unstoppable data manipulation power. Master these and you can solve anything from the terminal.</strong></p>

        <div class="divider"></div>

        <!-- TOC -->
        <div class="toc">
            <h3>📑 Scenarios</h3>
            <ul>
'''

for s in scenarios:
    head += f'                <li><a href="#scenario-{s["num"]}"><span class="sn">{s["num"]}.</span> {esc(s["title"])}</a></li>\n'

head += '''            </ul>
        </div>
'''

# Scenarios
for s in scenarios:
    def tool_class(t):
        t = t.lower()
        if '+' in t: return 'tool-combo'
        if 'grep' in t: return 'tool-grep'
        if 'sed' in t: return 'tool-sed'
        if 'awk' in t: return 'tool-awk'
        return 'tool-combo'

    head += f'''
        <!-- Scenario {s["num"]} -->
        <div class="scenario" id="scenario-{s["num"]}">
            <span class="scenario-badge">{s["icon"]} Scenario {s["num"]}</span>
            <h3 class="sc-title">{esc(s["title"])}</h3>

            <div class="label label-situation">🎯 The Situation</div>
            <div class="situation-box">{s["situation"]}</div>

            <div class="label label-step">🔬 Step-by-Step Breakdown</div>
            <button class="solution-toggle" onclick="toggleSolution(this)">Show Solution ▼</button>
            <div class="solution-content">
'''

    for i, (tool, cmd, why) in enumerate(s["steps"], 1):
        head += f'''                <div class="step-card">
                    <div class="step-header">
                        <span class="step-num">Step {i}</span>
                        <span class="tool-tag {tool_class(tool)}">{esc(tool)}</span>
                    </div>
                    <pre><code>{esc(cmd)}</code></pre>
                    <div class="step-why"><strong>Why this works:</strong> {why}</div>
                </div>
'''

    head += f'''
                <div class="label label-pipeline" style="margin-top:20px;">🔗 Full Pipeline (One-Liner)</div>
                <pre><code>{esc(s["full_pipeline"])}</code></pre>
            </div>

            <div class="label label-bp" style="margin-top:20px;">📌 Best Practices</div>
            <ul class="bp-list">
'''
    for bp in s["best_practices"]:
        head += f'                <li>{bp}</li>\n'

    head += '''            </ul>
        </div>
'''

# Footer content
head += '''
        <div class="divider"></div>

        <div class="success-box">
            <strong>🎉 Congratulations!</strong> You've completed all 10 CLI Trinity scenarios! You now have production-ready skills in grep, sed, and awk — the foundational text processing tools that every cybersecurity professional and DevOps engineer relies on daily. These aren't just exercises — they're real techniques used in SOCs, IR teams, and SRE rotations worldwide.
        </div>

        <!-- Page Navigation -->
        <nav class="page-nav">
            <a href="nmap.html">← Previous: Nmap Scanner</a>
            <a href="../../index.html#resources">Back to Resources →</a>
        </nav>
    </div>

    <footer class="footer">
        <p>&copy; 2026 <a href="../../index.html">lokii.tech</a> | <a href="https://github.com/UnExplainableFish52/lokii.tech" target="_blank">Open Source Project</a></p>
    </footer>

    <script>
        function toggleSolution(btn) {
            const content = btn.nextElementSibling;
            content.classList.toggle('show');
            btn.textContent = content.classList.contains('show') ? 'Hide Solution ▲' : 'Show Solution ▼';
        }
    </script>
    <script src="../../js/main.js"></script>
</body>
</html>
'''

out_path = r'c:\Users\unexp\Documents\codes\web\lokii.tech\intermediate\tools\cli-trinity-wrapup.html'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(head)

print(f"Done! Wrote {len(head)} bytes to {out_path}")
