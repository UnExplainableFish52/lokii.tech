## Question 1: ACL Fundamentals - What is an ACL and what problem does it solve?
Study Note: ACL concepts are core for traffic control, segmentation, and interview scenarios involving policy enforcement on routers and firewalls.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: An Access Control List (ACL) is an ordered set of permit or deny statements used to filter packets based on fields such as source IP, destination IP, protocol, and ports. ACLs are applied to interfaces in inbound or outbound direction, or to management lines such as VTY. They enforce security policy and can reduce unnecessary traffic.

Interview Tip: Define ACL as "ordered filtering logic" and mention first-match processing.
</details>

---

## Question 2: ACL Processing - How does packet matching work inside an ACL?
Study Note: Interviewers frequently test this because policy behavior depends on rule order, not intent alone.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: ACL entries are processed top to bottom, first match wins. If a packet matches a statement, action is taken and evaluation stops. If no statement matches, implicit deny at the end drops the packet. This is why rule ordering and explicit permits are critical.

Interview Tip: Say clearly: "top-down, first match, implicit deny at the end."
</details>

---

## Question 3: Standard ACL - What does a standard ACL filter on, and when is it used?
Study Note: Standard ACL placement and limitations are a common interview checkpoint for entry security policy design.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Standard ACLs filter based only on source IPv4 address. They do not inspect destination address or Layer 4 ports, so they are less granular than extended ACLs. Example command: access-list 10 permit 192.168.10.0 0.0.0.255. Traditional guidance places standard ACLs closer to destination.

Interview Tip: Mention source-only matching first, then placement rule near destination.
</details>

---

## Question 4: Extended ACL - How does an extended ACL differ from standard ACL?
Study Note: Extended ACL detail is essential for real policy implementation in enterprise routing environments.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Extended ACLs can match source and destination IP addresses, protocol types (IP, TCP, UDP, ICMP), and Layer 4 ports. This enables fine-grained control such as permitting HTTPS while denying Telnet. Example: access-list 101 permit tcp 10.1.0.0 0.0.255.255 any eq 443.

Interview Tip: Use an example policy to show practical value, not only definitions.
</details>

---

## Question 5: Wildcard Masks - How do wildcard masks work in ACL entries?
Study Note: Wildcard mask accuracy is critical, one wrong bit can over-permit or over-block traffic.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: In Cisco ACLs, wildcard mask 0 means must match, and 1 means ignore. It is inverse of subnet mask logic. Example: 192.168.1.0 0.0.0.255 matches /24 network. Host-specific match can be done with host 192.168.1.10, equivalent to wildcard 0.0.0.0.

Interview Tip: Explain wildcard as "match bits versus dont-care bits" and give one quick conversion.
</details>

---

## Question 6: ACL Placement - Where should standard and extended ACLs be placed?
Study Note: Proper placement reduces unnecessary transit traffic and avoids unintended service impact.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Standard ACLs are generally placed near destination because they only know source. Extended ACLs are generally placed near source to stop unwanted traffic early and save bandwidth. Real placement also considers operational risk, routing asymmetry, and existing policy architecture.

Interview Tip: Give the textbook rule first, then add that real designs account for topology and change control.
</details>

---

## Question 7: Inbound vs Outbound ACL - What is the practical difference?
Study Note: Direction confusion is a common interview trap and real-world outage cause.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Inbound ACL filters packets as they enter an interface before routing decision. Outbound ACL filters packets as they leave an interface after routing decision. Same ACL can behave very differently depending on direction and interface location.

Interview Tip: Draw traffic arrow on interface and map where filtering occurs.
</details>

---

## Question 8: Numbered vs Named ACLs - Which is better for operations?
Study Note: Maintainability is a major operations concern, and named ACLs usually improve readability.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Numbered ACLs use numeric ranges (for example 1-99 standard, 100-199 extended in legacy style). Named ACLs use descriptive labels and support easier editing with sequence numbers. Named ACLs are generally preferred for operational clarity and change control.

Interview Tip: Recommend named ACLs in modern environments and explain why documentation quality improves.
</details>

---

## Question 9: ACL Sequence Numbers - Why do sequence numbers matter?
Study Note: Sequence-aware editing prevents disruptive delete and reapply cycles in production changes.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Sequence numbers allow insertion, deletion, and reordering of ACL entries without recreating entire ACL. This is useful for controlled changes and minimizes policy disruption. Example in named ACL mode: 15 permit tcp any any eq 443.

Interview Tip: Mention sequence numbers as a safer way to implement incremental policy updates.
</details>

---

## Question 10: Logging ACL Hits - How and why use deny log?
Study Note: Visibility into blocked traffic is key for troubleshooting and security monitoring.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Appending log to ACL deny or permit entries can generate syslog messages when matches occur, for example deny ip any any log. This helps validate policy behavior and detect suspicious traffic. Logging should be used thoughtfully to avoid excessive control-plane overhead on busy links.

Interview Tip: Say "use logging for validation and security insight, but avoid noisy blanket logging in high-volume paths."
</details>

---

## Question 11: Common ACL Mistake - Why do engineers accidentally block everything?
Study Note: This question tests operational caution and understanding of implicit deny behavior.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A frequent mistake is forgetting explicit permit entries before the implicit deny, causing intended traffic to be dropped. Another common issue is applying ACL in wrong direction or wrong interface. Safe practice includes staged testing, comments/documentation, and rollback-ready change windows.

Interview Tip: Mention implicit deny and pre-change verification checklist in the same answer.
</details>

---

## Question 12: Management Plane Security - How do you restrict VTY access with ACLs?
Study Note: Securing device management access is expected baseline practice for network engineers.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Create a standard ACL permitting only trusted management subnets, then apply it to VTY lines with access-class. Example: access-list 50 permit 10.10.50.0 0.0.0.255; line vty 0 4; access-class 50 in. This limits who can initiate remote management sessions.

Interview Tip: Explain that data-plane ACL and management-plane ACL serve different control goals.
</details>

---

## Question 13: Telnet vs SSH - What is the security difference and which ports are used?
Study Note: Secure remote access is a fundamental interview topic, especially for compliance-aware environments.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Telnet uses TCP port 23 and transmits credentials and session data in clear text. SSH uses TCP port 22 and provides encrypted, integrity-protected remote shell access with key exchange and authentication. Modern best practice is to disable Telnet and use SSHv2 only.

Interview Tip: State the risk plainly: Telnet is clear text, SSH is encrypted and authenticated.
</details>

---

## Question 14: SSH Enablement - What are key Cisco steps to enable secure SSH access?
Study Note: Command-level configuration is often required in practical interview rounds.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Typical steps include setting hostname and ip domain-name, creating local username/secret, generating RSA keys, enabling SSHv2, and restricting VTY transport. Example commands: crypto key generate rsa modulus 2048, ip ssh version 2, line vty 0 4, transport input ssh, login local.

Interview Tip: Present as ordered build steps from identity to key generation to VTY hardening.
</details>

---

## Question 15: SSH Hardening - What controls improve SSH security beyond basic enablement?
Study Note: Interviewers value security maturity, not just making protocol work.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Harden SSH by limiting source IPs with ACL on VTY, disabling password-only auth where possible, using strong secrets, enforcing timeouts and login retries, and centralizing authentication with AAA (TACACS+ or RADIUS). Also disable unused management services and monitor login events.

Interview Tip: Answer in layers: protocol choice, access restriction, authentication strength, monitoring.
</details>

---

## Question 16: Port Security Basics - What is switch port security and what does it protect against?
Study Note: Port security is a first-hop defense mechanism frequently tested in campus networking interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Port security limits MAC addresses allowed on a switch access port. It helps prevent unauthorized devices, simple MAC flood behavior, and accidental hub expansion at edge ports. It is configured on access interfaces and can use static or sticky learned MAC addresses.

Interview Tip: Explain it as access-layer identity control for endpoint attachment.
</details>

---

## Question 17: Port Security Violation Modes - What are protect, restrict, and shutdown?
Study Note: Correct violation mode selection impacts both security response and operations visibility.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: protect drops violating frames silently. restrict drops violating frames and increments counters, often with notifications. shutdown places interface into err-disabled state on violation, requiring recovery action. Many enterprises prefer shutdown for strict enforcement, or restrict where continuity is prioritized with visibility.

Interview Tip: Compare response severity and logging behavior, not only names.
</details>

---

## Question 18: Sticky MAC - How does sticky learning work and when is it useful?
Study Note: Sticky MAC balances security control with deployment practicality during endpoint churn.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Sticky MAC learns source MAC addresses dynamically on a secured port and converts them into running config secure entries. This simplifies rollout without manually typing each MAC address. Example commands: switchport port-security, switchport port-security maximum 2, switchport port-security mac-address sticky.

Interview Tip: Mention that sticky entries should be saved to startup config if persistence is required.
</details>

---

## Question 19: Port Security Verification - Which commands should you run?
Study Note: Verification fluency is often used to separate theoretical and implementation-ready candidates.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Use show port-security, show port-security interface <int>, and show running-config interface <int> to verify state, learned MACs, violation count, and mode. If interface is err-disabled, check logs and recovery settings, then apply corrective action and recovery command sequence.

Interview Tip: State that validation includes both operational counters and configuration intent.
</details>

---

## Question 20: Integrated Security Scenario - Users can browse web but cannot SSH to network devices. What should you check first?
Study Note: Scenario questions test your ability to combine ACL and management-plane controls in one troubleshooting flow.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: First verify device reachability and TCP 22 path from management subnet. Then check VTY ACL access-class rules, line transport settings (transport input ssh), SSH key/version status, AAA/login configuration, and interface ACLs that may block port 22. Confirm source IP belongs to permitted management subnet and review logs for denied attempts.

Interview Tip: Break the answer into dependency checks: path, policy, service readiness, authentication.
</details>

---
