## Question 1: DHCP Fundamentals - What is DHCP and why is it critical in enterprise networks?
Study Note: DHCP is foundational for endpoint onboarding, and interviewers expect you to explain both convenience and operational control.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DHCP (Dynamic Host Configuration Protocol) automates IP configuration by providing IP address, subnet mask, default gateway, DNS servers, and other options to clients. Without DHCP, manual addressing does not scale and increases configuration errors. DHCP uses UDP ports 67 (server) and 68 (client) in IPv4.

Interview Tip: Start with business value: rapid onboarding and centralized address control.
</details>

---

## Question 2: DORA Process - What happens during DHCP DORA?
Study Note: DORA sequence is a classic interview checkpoint because it directly maps to packet-level troubleshooting.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DORA stands for Discover, Offer, Request, Acknowledge. A client broadcasts DHCP Discover, server responds with Offer, client broadcasts Request selecting an offer, and server confirms with Acknowledge. If no ACK is received, address assignment is incomplete and client may retry.

Interview Tip: Explain each step with sender and receiver direction, then mention UDP 67/68.
</details>

---

## Question 3: DHCP Relay - Why is ip helper-address needed in routed VLAN designs?
Study Note: Relay behavior is essential for centralized DHCP and appears frequently in campus interview scenarios.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DHCP broadcasts do not cross Layer 3 boundaries by default. DHCP relay on the gateway interface forwards client DHCP messages as unicast to remote DHCP servers. On Cisco, this is typically configured with ip helper-address <server-ip> on SVIs or routed interfaces.

Interview Tip: Use the phrase "broadcast containment requires relay for central DHCP."
</details>

---

## Question 4: DHCP Scope Planning - What must be defined in a reliable DHCP scope?
Study Note: Scope design reflects operational maturity and prevents outages caused by exhaustion or wrong options.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A scope should define network/prefix, default gateway option, DNS servers, lease duration, exclusions, and reservations as needed. You should reserve static ranges for infrastructure devices and size scopes based on user counts and growth. Monitoring utilization is important to avoid lease exhaustion.

Interview Tip: Mention exclusions and reservations explicitly, interviewers look for those practical details.
</details>

---

## Question 5: DHCP Lease Behavior - What happens when a lease renews or expires?
Study Note: Lease timing knowledge is useful in troubleshooting intermittent address assignment issues.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A client attempts renewal at T1 (typically 50 percent of lease time) by unicasting to the original DHCP server. At T2 (typically 87.5 percent), it may broadcast to any available DHCP server. If lease expires with no renewal, client must stop using that address and restart acquisition.

Interview Tip: Mention T1/T2 percentages to demonstrate protocol-level depth.
</details>

---

## Question 6: NAT Basics - What is NAT and why is it widely used?
Study Note: NAT is central to internet access design and appears in almost every entry networking interview.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: NAT (Network Address Translation) modifies IP addressing information, typically translating private inside addresses to public outside addresses at an edge device. It conserves public IPv4 space and hides internal addressing structure. NAT can be static, dynamic, or port-based (PAT).

Interview Tip: Explain NAT as address translation at trust boundary, not encryption or firewalling by itself.
</details>

---

## Question 7: PAT - How does PAT differ from one-to-one NAT?
Study Note: PAT understanding is required because most enterprise outbound internet traffic uses it.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: PAT (Port Address Translation), also called NAT overload, maps many internal hosts to one or a few public IPs by differentiating sessions using Layer 4 source ports. One-to-one static NAT maps a single internal IP to a single external IP. PAT improves public IP utilization but relies on unique port mappings per session.

Interview Tip: Give one practical example: "hundreds of users share one ISP address via PAT."
</details>

---

## Question 8: Static NAT Use Cases - When should you use static NAT?
Study Note: Interviewers test whether you can match translation type to business requirement.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Static NAT is used when an internal service must be consistently reachable from external networks, such as web servers, mail gateways, or remote-access endpoints. It provides fixed mapping between inside local and inside global addresses. This predictability simplifies ACL and DNS records.

Interview Tip: Mention that static NAT is common for published services, not general outbound client traffic.
</details>

---

## Question 9: NAT Terms - What do inside local, inside global, outside local, and outside global mean?
Study Note: Terminology precision is a strong signal of readiness for real Cisco troubleshooting tasks.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Inside local is internal host address as seen inside network, often private. Inside global is translated address representing inside host to outside world, often public. Outside global is real external host address on outside network. Outside local is external host address as represented inside, often same as outside global unless additional translation occurs.

Interview Tip: Anchor explanation around one inside host and one internet server to keep terms clear.
</details>

---

## Question 10: NAT Verification - Which commands validate NAT/PAT operation on Cisco routers?
Study Note: Practical verification commands are heavily valued in implementation-focused interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Common commands include show ip nat translations, show ip nat statistics, and show run | section nat. You should also verify inside/outside interface roles and ACLs used for NAT match rules. End-to-end tests with ping, traceroute, and application traffic confirm live translation behavior.

Interview Tip: Present checks in order: config intent, translation table, traffic test.
</details>

---

## Question 11: DNS Fundamentals - What is DNS and which ports does it use?
Study Note: DNS is a critical dependency for almost every application, and outages often present as "network down" symptoms.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DNS (Domain Name System) resolves hostnames to IP addresses and supports records like A, AAAA, CNAME, MX, and PTR. DNS primarily uses UDP port 53 for queries and responses, and TCP port 53 for zone transfers and larger responses when needed.

Interview Tip: Mention both UDP and TCP usage on port 53, interviewers check that detail.
</details>

---

## Question 12: Recursive vs Iterative DNS - What is the difference?
Study Note: This concept tests whether you understand end-to-end name resolution path, not only definitions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: In recursive resolution, the DNS resolver returns a final answer to the client after performing all lookups. In iterative resolution, a DNS server returns the best referral it has, and the requester follows referrals to continue lookup. Enterprise clients typically use recursive resolvers, while authoritative infrastructure participates in iterative chain behavior.

Interview Tip: Explain from client perspective first, then server referral behavior.
</details>

---

## Question 13: DNS Records - Which record types should you know for interviews?
Study Note: Record-level familiarity is required for troubleshooting mail delivery, service discovery, and reverse lookups.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Important records include A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail exchange), NS (name server), TXT (policy/verification), PTR (reverse mapping), and SRV (service location). Knowing record purpose helps isolate resolution and application issues quickly.

Interview Tip: Group records by function: host resolution, mail, delegation, reverse lookup.
</details>

---

## Question 14: DNS Caching and TTL - Why does TTL matter during migrations?
Study Note: TTL behavior frequently appears in interview scenarios involving cutovers and incident recovery.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: TTL (Time To Live) defines how long resolvers cache DNS records before re-querying authoritative sources. High TTL reduces query load but slows change propagation; low TTL improves agility during migrations but increases query volume. Pre-change TTL planning is important before DNS cutovers.

Interview Tip: Mention lowering TTL ahead of planned migration windows as a practical best practice.
</details>

---

## Question 15: NTP Purpose - Why is NTP mandatory for network operations?
Study Note: Time synchronization underpins logging, security validation, and troubleshooting timelines.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: NTP synchronizes system clocks across network devices and servers using UDP port 123. Accurate time is essential for log correlation, certificate validation, SIEM analysis, and forensic investigations. Unsynchronized clocks can make root cause analysis significantly harder.

Interview Tip: Tie NTP directly to incident response quality and compliance requirements.
</details>

---

## Question 16: NTP Design - What are stratum levels and good deployment practices?
Study Note: Interviewers often test whether you can design NTP hierarchy instead of pointing all devices to one source.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Stratum indicates distance from authoritative reference clock, where lower stratum is closer to source. Good practice uses redundant internal NTP servers synchronized to trusted upstream sources. Network devices should use internal servers where possible, with authentication and access controls for integrity.

Interview Tip: Mention redundancy and controlled hierarchy, not direct internet NTP on every device.
</details>

---

## Question 17: SNMP Basics - What is SNMP and which versions matter?
Study Note: Monitoring fundamentals are expected for operations roles, and SNMP remains widely used.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: SNMP (Simple Network Management Protocol) enables monitoring and management data exchange between network devices and management systems. SNMP uses UDP port 161 for queries and 162 for traps/informs. Versions include v1, v2c, and v3, with SNMPv3 preferred for authentication and encryption.

Interview Tip: Always recommend SNMPv3 in modern environments due to security improvements.
</details>

---

## Question 18: SNMP Components - What are OIDs, MIBs, and traps?
Study Note: Understanding data model terms helps when troubleshooting monitoring gaps and alert quality issues.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: OIDs (Object Identifiers) uniquely identify managed variables. MIBs (Management Information Bases) define structure and meaning of those objects. Traps/informs are unsolicited notifications sent by devices to management systems on events like link down. Polling and traps are usually combined for visibility.

Interview Tip: Explain SNMP as "poll for state, trap for events" for a concise, practical answer.
</details>

---

## Question 19: SNMP Security - What are risks of SNMPv2c and how does v3 improve them?
Study Note: Security-aware protocol selection is a common interview expectation for modern network engineers.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: SNMPv1/v2c use community strings and lack strong encryption/authentication, making them vulnerable to interception and misuse. SNMPv3 supports authentication (auth) and privacy encryption (priv), providing integrity and confidentiality. Access should also be restricted by ACLs and management-plane segmentation.

Interview Tip: Use layered answer: secure protocol version plus access control around it.
</details>

---

## Question 20: Integrated Troubleshooting Scenario - Clients have IPs but cannot browse websites. How do you triage DHCP, NAT, and DNS?
Study Note: Multi-service troubleshooting demonstrates professional-level thinking beyond isolated protocol definitions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: First verify client IP, mask, gateway, and DNS assignment from DHCP scope/options. Next test reachability to gateway and internet IP (for example ping 8.8.8.8) to separate routing/NAT from DNS issues. Check NAT translations and outside interface state on edge router. If IP reachability works but names fail, test DNS queries directly to resolver and validate resolver reachability and records.

Interview Tip: Present triage sequence as dependency chain: addressing, path/NAT, then name resolution.
</details>

---
