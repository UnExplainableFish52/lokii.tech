# Incident Response Report: Unauthorized Access and Data Exfiltration via Compromised Vendor VPN Account

## 1. Incident Summary

A simulated security incident was identified involving unauthorized access to internal infrastructure through a compromised third-party IT vendor VPN account. The attacker used stolen credentials obtained through a spear-phishing campaign to access the corporate VPN, move laterally through the environment, and reach sensitive assets.

The affected assets included API gateway servers, the primary customer database containing sensitive personally identifiable information and transaction records, and an executive laptop used as an internal pivot point. The attacker successfully accessed the database environment and exfiltrated encrypted transaction data before containment actions were completed.

The incident response team revoked unauthorized access, disabled the compromised vendor account, isolated affected systems, patched the vulnerable application component, and initiated forensic review and customer notification procedures.

## 2. Executive Summary

A simulated breach occurred after an attacker gained access to the organization’s network using stolen VPN credentials from a third-party IT vendor. After entering the environment, the attacker moved through internal systems and accessed sensitive database infrastructure.

The most serious business risk was unauthorized access to customer information and encrypted transaction records. Although the transaction data was encrypted, the exposure still created potential legal, regulatory, reputational, and customer trust risks.

The incident response team contained the attack by removing unauthorized access, isolating impacted systems, applying security patches, and starting forensic analysis. Customer notification and further legal review were initiated due to the possibility of sensitive data exposure.

## 3. Affected System

| Asset                     |              Hostname |    IP Address | Operating System                     | Role                                        | Timezone |
| ------------------------- | --------------------: | ------------: | ------------------------------------ | ------------------------------------------- | -------- |
| API Gateway Server 1      |           `api-gw-01` | `10.10.20.15` | Ubuntu Server 22.04 LTS              | Public-facing API gateway                   | UTC      |
| API Gateway Server 2      |           `api-gw-02` | `10.10.20.16` | Ubuntu Server 22.04 LTS              | Public-facing API gateway                   | UTC      |
| Primary Customer Database |     `cust-db-prod-01` | `10.10.30.25` | Ubuntu Server 22.04 LTS / PostgreSQL | Stores customer PII and transaction records | UTC      |
| Executive Laptop          |      `exec-laptop-07` | `10.10.40.82` | Windows 11 Pro                       | Executive workstation used as pivot point   | UTC      |
| Vendor VPN Account        | `vendor.it.support01` |           N/A | N/A                                  | Third-party IT vendor remote access account | UTC      |

## 4. Investigation Methodology

1. **Alert Review**

   The investigation began after the SOC received alerts related to unusual VPN activity from the third-party vendor account `vendor.it.support01`. The login originated from an unfamiliar external IP address and occurred outside the vendor’s normal access pattern.

2. **VPN Log Analysis**

   VPN authentication logs were reviewed to identify login timestamps, source IP addresses, session duration, and accessed internal resources. The logs showed successful authentication using valid credentials, indicating that the attacker likely possessed the vendor’s username and password.

3. **Account Activity Review**

   The vendor account activity was reviewed across authentication logs, endpoint logs, and access control records. The account was observed connecting to systems that were not normally accessed by that vendor, including API gateway servers and internal database-related network segments.

4. **Endpoint Investigation**

   The executive laptop `exec-laptop-07` was reviewed because internal traffic showed connections from this device to sensitive systems after the suspicious VPN session began. This suggested the laptop may have been used as a jumping-off point for lateral movement.

5. **Server and Database Log Review**

   Logs from the API gateway servers and primary customer database were reviewed. The database logs showed abnormal query activity and access to tables containing customer PII and transaction records.

6. **Network Traffic Review**

   Firewall, proxy, and network flow logs were analyzed to identify outbound traffic patterns. A large encrypted outbound data transfer was observed from the database environment to an external destination not normally associated with business operations.

7. **Containment Validation**

   After containment actions were performed, the SOC reviewed authentication logs, network flows, and endpoint telemetry to confirm that the compromised account was no longer active and that no further unauthorized access was observed.

8. **Forensic Preservation**

   Relevant logs, endpoint snapshots, VPN records, firewall logs, and database audit logs were preserved for deeper forensic analysis and possible legal or regulatory review.

## 5. Indicators of Compromise

| Type          | Indicator                               | Description                                                             |
| ------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| Username      | `vendor.it.support01`                   | Compromised third-party IT vendor VPN account                           |
| External IP   | `SIMULATED: 185.203.116.44`             | Suspicious VPN login source                                             |
| Internal Host | `exec-laptop-07`                        | Executive laptop used as a pivot point                                  |
| Internal IP   | `10.10.40.82`                           | IP address of executive laptop                                          |
| Internal Host | `cust-db-prod-01`                       | Primary customer database accessed during incident                      |
| Internal IP   | `10.10.30.25`                           | IP address of customer database                                         |
| Behavior      | Unusual VPN login                       | Login from unfamiliar external IP and abnormal time window              |
| Behavior      | Lateral movement                        | Access from VPN account to internal systems outside normal vendor scope |
| Behavior      | Database access anomaly                 | Abnormal queries against sensitive customer and transaction tables      |
| Behavior      | Data exfiltration                       | Large encrypted outbound transfer from database environment             |
| Domain / URL  | `SIMULATED: vendor-support-login[.]com` | Suspected phishing domain used to capture vendor credentials            |
| File Hash     | `Not available`                         | No malware sample or file artifact confirmed in the provided scenario   |

## 6. MITRE ATT&CK Mapping

| Tactic           | Technique                                                    |                       ID | Evidence                                                                                     |
| ---------------- | ------------------------------------------------------------ | -----------------------: | -------------------------------------------------------------------------------------------- |
| Initial Access   | Phishing                                                     |                    T1566 | Attack began with a spear-phishing campaign against a third-party IT vendor.                 |
| Initial Access   | Valid Accounts                                               |                    T1078 | Attacker accessed the VPN using stolen but valid vendor credentials.                         |
| Lateral Movement | Remote Services                                              |                    T1021 | Attacker used authenticated access to move from VPN access into internal systems.            |
| Collection       | Data from Information Repositories / Database Access Pattern | T1213 / Related behavior | Attacker accessed sensitive customer and transaction data stored in the production database. |
| Exfiltration     | Exfiltration Over C2 Channel                                 |                    T1041 | Encrypted transaction data was transferred outbound to an attacker-controlled destination.   |

## 7. SOC Analyst Findings

1. The attacker gained initial access using valid VPN credentials belonging to a third-party IT vendor account.

2. The likely source of credential compromise was a spear-phishing campaign targeting the vendor.

3. The vendor account accessed internal systems outside the expected access scope for that account.

4. The executive laptop `exec-laptop-07` was involved in suspicious internal activity and was likely used as a pivot point.

5. The primary customer database `cust-db-prod-01` was accessed during the incident.

6. Sensitive customer PII and encrypted transaction records were exposed to unauthorized access.

7. Encrypted transaction data was exfiltrated from the environment.

8. No confirmed malware hash was available in the provided evidence.

9. The incident indicates weaknesses in vendor access control, VPN monitoring, least privilege enforcement, and segmentation around sensitive database systems.

## 8. SOC Analyst Response

### Actions Taken

1. Disabled the compromised vendor VPN account `vendor.it.support01`.

2. Revoked active VPN sessions associated with the compromised account.

3. Forced password reset and credential rotation for affected vendor accounts.

4. Isolated the executive laptop `exec-laptop-07` from the network for forensic review.

5. Restricted access to the customer database from non-approved internal systems.

6. Blocked the suspicious external IP address at the firewall.

7. Preserved VPN logs, firewall logs, endpoint telemetry, and database audit logs.

8. Patched the vulnerable application component that may have supported unauthorized database access.

9. Started forensic analysis to determine the full attack timeline and scope of data exposure.

10. Initiated customer notification and legal review due to possible exposure of sensitive information.

### Recommended Actions

1. Enforce multi-factor authentication for all vendor VPN accounts.

2. Apply least privilege access for third-party accounts.

3. Restrict vendor VPN accounts to approved systems only.

4. Implement conditional access policies based on location, device posture, and login behavior.

5. Improve network segmentation between VPN users, executive workstations, API systems, and database servers.

6. Enable database activity monitoring for sensitive tables.

7. Create alerts for abnormal data volume transfers from production systems.

8. Conduct phishing awareness training for vendors and internal staff.

9. Require third-party vendors to follow stronger security controls and incident reporting procedures.

10. Review all privileged and vendor accounts for unnecessary access.

## 9. Analyst Insight

The incident shows how a single compromised third-party account can become a serious enterprise security risk when vendor access is not tightly restricted. The attacker did not need to exploit the VPN directly because valid credentials allowed them to appear like a legitimate user.

The key pattern is credential-based intrusion followed by lateral movement and data access. This type of attack can bypass basic perimeter defenses because the login itself appears successful and authorized. Detection depends on behavior analysis, such as unusual login source, abnormal access time, unexpected internal destinations, and unusual outbound data transfer.

The main lesson is that vendor access must be treated as high-risk access. VPN authentication alone is not enough. Strong MFA, least privilege, segmentation, monitoring, and database access auditing are required to reduce the chance of a stolen account leading to a major breach.

## 10. Conclusion

The simulated incident involved unauthorized access through a compromised third-party vendor VPN account. The attacker used valid credentials obtained through spear-phishing, moved laterally through the internal network, used an executive laptop as a pivot point, accessed the primary customer database, and exfiltrated encrypted transaction data.

The incident was contained by revoking unauthorized access, disabling the compromised account, isolating affected systems, patching the vulnerable application, and preserving evidence for forensic investigation.

This incident highlights the importance of strong vendor access controls, MFA enforcement, least privilege, network segmentation, database monitoring, and rapid incident response procedures.
