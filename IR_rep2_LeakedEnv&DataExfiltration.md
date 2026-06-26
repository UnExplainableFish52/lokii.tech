# Nagarik App Production Environment File Exposure and Database Exfiltration

## Disclaimer

This report is written for cybersecurity learning, SOC analysis practice, and portfolio demonstration. The exposed environment-file vulnerability discussed in this report is based on publicly discussed information, while the exploitation chain, attacker activity, database access, exfiltration scenario, and response actions are simulated for incident report writing practice.

## 1. Incident Summary

A production build of the Nagarik App unintentionally exposed sensitive environment configuration files, including `.env` and `.dev.env`. These files contained database credentials, API keys, and other application secrets.

A threat actor accessed the exposed files, extracted valid credentials, and used them to gain unauthorized access to the application database. The attacker then exfiltrated tens of thousands of user records, including sensitive personal information and citizen document details such as passport-related data.

The incident was caused by a build and deployment misconfiguration that allowed sensitive development and environment files to be included in the production environment.

---

## 2. Executive Summary

Nagarik App suffered a serious security incident due to exposed configuration files in the production application. These files contained sensitive credentials that should never have been publicly accessible.

The attacker used the exposed credentials to access the backend database and steal a large volume of citizen records. The affected data included personally identifiable information and sensitive government document details.

The incident created operational, legal, reputational, and public-trust risks. Immediate response actions included notifying the development team, patching the exposure, rotating compromised credentials, moving service operations to a secured backup server, and preserving the original server for forensic investigation.

The key business lesson is clear: secrets management, secure build pipelines, deployment reviews, and egress monitoring must be treated as mandatory controls for public-facing government applications.

---

## 3. Affected System

| Field             | Details                                                                             |
| ----------------- | ----------------------------------------------------------------------------------- |
| Application       | Nagarik App                                                                         |
| System Type       | Public-facing government digital service platform                                   |
| Hostname          | `nagarik-prod-app-01`                                                               |
| Public IP         | Not provided / pending confirmation                                                 |
| Private IP        | Not provided / pending confirmation                                                 |
| Operating System  | Linux server, exact version pending confirmation                                    |
| Application Role  | Production application server                                                       |
| Database Role     | Backend citizen records database                                                    |
| Timezone          | Nepal Time, UTC+05:45                                                               |
| Environment       | Production                                                                          |
| Impacted Data     | User records, personal information, citizen document details, passport-related data |
| Incident Severity | Critical                                                                            |
| Initial Cause     | Sensitive environment files included in production build                            |

---

## 4. Investigation Methodology

### Step 1: Initial Alert Review

The investigation began after suspicious database activity and abnormal data access patterns were observed. The SOC team reviewed available application logs, database logs, server access logs, and network traffic records.

The first objective was to determine whether the database access was legitimate administrative activity or unauthorized access.

### Step 2: Web Server Log Analysis

The web server logs were reviewed for requests to sensitive files and hidden configuration paths. The investigation focused on requests such as:

* `GET /.env`
* `GET /.dev.env`
* `GET /config/.env`
* `GET /backup/.env`
* `GET /.git/config`

Successful HTTP `200 OK` responses to `.env` and `.dev.env` confirmed that sensitive files were publicly accessible from the production environment.

### Step 3: Secret Exposure Validation

The exposed files were reviewed in a controlled forensic environment. The files contained sensitive values, including:

* Database hostname
* Database username
* Database password
* API keys
* Service tokens
* Environment-specific configuration values

No secrets were reused during the investigation. All credentials were treated as compromised immediately.

### Step 4: Database Access Review

Database authentication logs were analyzed to identify suspicious login activity. The investigation found successful database access using credentials that matched the exposed environment files.

The database activity showed unusual query volume and access patterns inconsistent with normal application behavior.

Observed suspicious behavior included:

* Large SELECT queries
* Repeated access to user profile tables
* Access to document-related tables
* High-volume record retrieval
* Access from an unrecognized source IP or host

### Step 5: Data Exfiltration Analysis

Network and database logs were reviewed to determine whether data had been extracted. The investigation identified bulk data access consistent with exfiltration.

Potential signs of data theft included:

* Large outbound data transfers
* High-volume database reads
* Compressed or serialized response patterns
* Repeated queries against sensitive tables
* Access outside normal business operation patterns

### Step 6: Scope Assessment

The SOC team attempted to identify:

* When the `.env` files first became exposed
* When the attacker first accessed the files
* Which credentials were used
* Which database tables were accessed
* How many records were affected
* Whether persistence was created
* Whether other systems reused the same credentials

At the time of this report, the confirmed root cause is production exposure of sensitive environment files. Full record-level impact requires forensic validation.

### Step 7: Containment and Preservation

The development team was notified immediately. The vulnerable production build was patched to remove exposed files. Credentials and API keys were rotated.

A secured backup server with rotated keys was brought online to reduce downtime. The original affected server was isolated and handed over to the forensic team for evidence preservation and deeper analysis.

---

## 5. Indicators of Compromise

### Network Indicators

| Indicator Type  | Value                         | Notes                                          |
| --------------- | ----------------------------- | ---------------------------------------------- |
| Source IP       | Pending confirmation          | Suspected attacker IP from web/database logs   |
| Destination     | Production application server | Targeted public-facing service                 |
| Destination     | Backend database server       | Accessed using exposed credentials             |
| User-Agent      | Pending confirmation          | Review web logs for scanner or scripted access |
| Traffic Pattern | Large outbound transfer       | Possible database export or bulk extraction    |

### File Indicators

| Indicator            | Description                            |
| -------------------- | -------------------------------------- |
| `/.env`              | Exposed production environment file    |
| `/.dev.env`          | Exposed development environment file   |
| Database credentials | Found inside exposed environment files |
| API keys             | Found inside exposed environment files |
| Service tokens       | Found inside exposed environment files |

### Account and Credential Indicators

| Indicator                     | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| Exposed database username     | Credential found in exposed `.env` file         |
| Exposed database password     | Credential found in exposed `.env` file         |
| Exposed API keys              | Application or third-party service keys exposed |
| Unauthorized database session | Login using exposed credential set              |

### Behavioral Indicators

* Public HTTP requests to `.env` and `.dev.env`
* Successful access to sensitive configuration files
* Database login using exposed credentials
* High-volume database reads
* Queries targeting user records and document tables
* Unusual access time or access source
* Possible bulk export of sensitive citizen data

---

## 6. MITRE ATT&CK Mapping

| Tactic            | Technique                                       | ID            | Evidence                                                                                            |
| ----------------- | ----------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| Initial Access    | Exploit Public-Facing Application               | T1190         | Attacker accessed exposed `.env` and `.dev.env` files from the public-facing production application |
| Credential Access | Credentials in Files                            | T1552.001     | Database credentials and API keys were present inside exposed environment files                     |
| Defense Evasion   | Valid Accounts                                  | T1078         | Attacker used valid database credentials instead of brute-force or exploit-based database access    |
| Discovery         | Data from Information Repositories              | T1213         | Attacker identified sensitive database tables containing citizen records and document details       |
| Collection        | Data from Local System                          | T1005         | Large volumes of database records were queried and collected                                        |
| Exfiltration      | Exfiltration Over Web Service / Network Channel | T1567 / T1041 | Bulk data access and abnormal outbound transfer patterns suggest data exfiltration                  |

---

## 7. SOC Analyst Findings

1. Sensitive environment files were included in the production build.

2. The files were accessible from the public-facing application server.

3. The exposed files contained database credentials, API keys, and other secrets.

4. A threat actor accessed the exposed files and obtained valid credentials.

5. The attacker used the exposed credentials to authenticate to the backend database.

6. Database logs showed abnormal access patterns consistent with unauthorized data extraction.

7. Tens of thousands of user records were reportedly affected, including sensitive personal and citizen document information.

8. The root cause was a deployment and configuration management failure, not a traditional password brute-force attack.

9. The incident indicates weaknesses in secrets management, production build validation, access control, monitoring, and data exfiltration detection.

10. The original affected server should be treated as compromised until forensic analysis confirms otherwise.

---

## 8. SOC Analyst Response

### Immediate Actions Taken

* Notified the development and infrastructure teams.
* Removed `.env`, `.dev.env`, and other sensitive files from the production build.
* Blocked public access to hidden configuration files.
* Rotated exposed database credentials.
* Rotated exposed API keys and service tokens.
* Brought a secured backup server online with rotated keys.
* Isolated the original production server.
* Preserved the original server for forensic investigation.
* Started review of database access logs and outbound traffic logs.

### Recommended Containment Actions

* Disable all credentials found in exposed files.
* Invalidate active sessions and tokens linked to exposed secrets.
* Restrict database access to approved application hosts only.
* Apply firewall rules to prevent direct public database access.
* Enforce least-privilege permissions for application database users.
* Block access to dotfiles and sensitive paths at the web server level.
* Review whether secrets were reused across staging, development, and production.

### Recommended Eradication Actions

* Remove sensitive files from all production artifacts.
* Update CI/CD pipelines to prevent `.env` files from being packaged.
* Add automated secret scanning before deployment.
* Add repository-level secret scanning.
* Add build artifact scanning.
* Remove hardcoded credentials from source code and configuration files.
* Store secrets in a dedicated secrets manager.
* Rebuild production from a clean and verified source.

### Recommended Recovery Actions

* Restore service using a clean backup server.
* Validate that rotated credentials are active.
* Confirm that old credentials no longer work.
* Monitor logs for repeated access attempts.
* Confirm database integrity.
* Notify appropriate legal, regulatory, and organizational authorities.
* Prepare user communication if legally or operationally required.
* Continue enhanced monitoring for follow-up attacks.

### Recommended Long-Term Improvements

* Implement a formal secure SDLC process.
* Add mandatory deployment checklists.
* Train developers on secrets management.
* Enforce production build reviews.
* Use DLP and egress monitoring to detect large data movement.
* Deploy SIEM correlation rules for suspicious file access and database behavior.
* Implement anomaly detection for large database queries.
* Apply defense-in-depth across application, network, database, and monitoring layers.

---

## 9. Analyst Insight

This incident shows how a simple configuration mistake can become a critical breach when sensitive files are exposed in production.

The attacker did not need an advanced exploit. The exposed `.env` files acted like a key left outside the front door. Once the credentials were discovered, the attacker could use legitimate access paths to reach sensitive data.

The most important pattern is that secret exposure often turns into credential-based compromise. This makes detection harder because the attacker may appear to be using valid credentials. For that reason, organizations should not rely only on authentication success or failure logs. They must also monitor behavior after login.

Key lessons from the pattern:

* Secrets must never be shipped with frontend or public production builds.
* Production deployments must be scanned before release.
* Database accounts should have minimum required permissions only.
* Direct database access should be restricted by network controls.
* Large data access patterns should trigger alerts.
* Credential rotation must be fast and practiced.
* Public trust damage can be greater than the technical damage.

The incident also highlights the importance of layered defense. Even if a secret is accidentally exposed, strong database restrictions, least privilege, network segmentation, and egress monitoring can reduce the impact.

---

## 10. Conclusion

The Nagarik App incident was caused by exposed environment files in the production build. These files contained sensitive credentials that enabled unauthorized database access and large-scale data exfiltration.

The incident had critical impact because the affected data included sensitive personal and citizen document information. Immediate response actions focused on removing the exposure, rotating credentials, restoring service through a secured backup server, and preserving the original server for forensic analysis.

The primary root cause was weak production configuration control and insufficient secrets management. To prevent similar incidents, the organization should strengthen secure build pipelines, implement automated secret scanning, enforce least privilege, improve database access monitoring, and deploy stronger egress detection.

This incident should be treated as a high-severity data breach and used as a clear reminder that configuration security is not a minor operational task. In public-sector systems, a small deployment mistake can become a national-scale trust issue.
