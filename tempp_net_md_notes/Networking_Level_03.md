## Question 1: VLAN Fundamentals - What problem do VLANs solve in switched networks?
Study Note: VLANs are a core enterprise segmentation tool, and interviewers expect you to connect them to security, broadcast control, and operational scale.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: VLANs create separate Layer 2 broadcast domains on the same physical switching infrastructure. Without VLANs, all hosts share one broadcast domain, increasing noise and security risk. By assigning ports to VLANs, traffic is isolated until routed by a Layer 3 device. Common examples include separate VLANs for users, servers, voice, and management.

Interview Tip: Start with "one switch, multiple logical LANs" and then mention broadcast reduction and segmentation.
</details>

---

## Question 2: Access Ports - What is an access port and when should you use it?
Study Note: Correct access port usage is foundational for endpoint onboarding and reducing Layer 2 misconfiguration risk.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: An access port carries traffic for a single VLAN and typically connects end devices such as PCs, printers, or IP phones (with voice VLAN configured separately). Frames on access ports are normally untagged on ingress and egress for data VLAN traffic. Typical Cisco configuration includes switchport mode access and switchport access vlan <id>.

Interview Tip: Mention that access mode prevents unintended trunk negotiation in many designs.
</details>

---

## Question 3: Trunk Ports - What is a trunk port and why is it needed?
Study Note: Trunking is central to scaling VLANs across multiple switches and is frequently tested in practical labs.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A trunk port carries multiple VLANs across one link by adding VLAN tags to frames, most commonly using IEEE 802.1Q. Trunks are used between switches, and between switches and routers/firewalls when multiple VLANs must traverse one physical interface. Typical command is switchport mode trunk, with optional restrictions such as switchport trunk allowed vlan.

Interview Tip: Explain trunking as multiplexing multiple VLANs over one cable.
</details>

---

## Question 4: 802.1Q Tagging - What fields are added by 802.1Q, and what is the tag size?
Study Note: Tag-level understanding shows protocol depth and helps in packet analysis discussions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: 802.1Q inserts a 4-byte tag into the Ethernet frame after source MAC. The tag includes TPID (typically 0x8100) and TCI fields. TCI contains PCP (priority bits), DEI, and VLAN ID (12 bits, supporting VLAN IDs 1-4094 usable). This lets switches identify VLAN membership and QoS priority on trunk links.

Interview Tip: Mention "4-byte tag, VLAN ID in 12 bits" to sound precise.
</details>

---

## Question 5: Native VLAN - What is the native VLAN on an 802.1Q trunk?
Study Note: Native VLAN behavior is a common source of mismatches and control-plane exposure in real networks.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: The native VLAN is the VLAN whose frames are sent untagged on an 802.1Q trunk by default. On Cisco devices, VLAN 1 is default native VLAN unless changed. Both trunk ends should agree on native VLAN to avoid traffic leaks and misforwarding. Best practice is to use an unused dedicated native VLAN and avoid carrying user traffic on it.

Interview Tip: Call out native VLAN mismatch as a classic troubleshooting and security issue.
</details>

---

## Question 6: Allowed VLAN List - Why should trunks use explicit allowed VLANs?
Study Note: Limiting trunk VLAN scope is a practical control for security hardening and failure domain reduction.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: By default, trunks may carry many VLANs, which can unnecessarily expand broadcast domains and attack surface. Explicitly setting allowed VLANs ensures only required VLANs traverse each trunk. Cisco command example: switchport trunk allowed vlan 10,20,30. This also simplifies troubleshooting because unexpected VLAN propagation is minimized.

Interview Tip: State that least-privilege applies to VLAN carriage too, not only to users.
</details>

---

## Question 7: Voice VLAN - How does a switch handle data VLAN and voice VLAN on one port?
Study Note: Voice plus data access design is common in enterprises and tested for endpoint integration readiness.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: On a phone-plus-PC port, the switchport can use an access VLAN for PC data and a separate voice VLAN for IP phone traffic. The phone tags voice frames (often via 802.1Q), while PC data remains untagged in the access VLAN. Cisco configuration often includes switchport access vlan <data_vlan> and switchport voice vlan <voice_vlan>. QoS policies commonly prioritize voice traffic.

Interview Tip: Mention that the switch can logically separate two traffic types on one physical edge port.
</details>

---

## Question 8: VLAN ID Ranges - What VLAN ranges are normal, extended, and reserved?
Study Note: Range awareness prevents design mistakes and helps explain platform behavior differences.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: VLAN IDs are 1-4094 usable in 802.1Q context. Historically on Cisco, normal range is 1-1005 and extended range is 1006-4094. VLAN 1 is default and generally avoided for user traffic. VLANs 1002-1005 are legacy reserved VLANs on many platforms. Exact handling can vary by switch OS version and feature set.

Interview Tip: Quote both ranges and then add "avoid user data on VLAN 1" as a practical rule.
</details>

---

## Question 9: Inter-VLAN Communication - Why can hosts in different VLANs not communicate directly?
Study Note: This is a high-frequency interview question that tests Layer 2 versus Layer 3 boundaries.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Different VLANs are different Layer 2 broadcast domains and subnets. A Layer 2 switch forwards frames within VLAN boundaries but does not route between subnets. Inter-VLAN communication requires a Layer 3 function, such as a router-on-a-stick subinterface or a multilayer switch SVI with routing enabled.

Interview Tip: Keep the phrase "switch forwards, router routes" in your answer.
</details>

---

## Question 10: Router-on-a-Stick - How does it provide inter-VLAN routing?
Study Note: This concept appears in CCNA-level labs and validates your understanding of trunking plus Layer 3 handoff.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Router-on-a-stick uses one physical router interface configured as an 802.1Q trunk with multiple subinterfaces, one per VLAN. Each subinterface has encapsulation dot1Q <vlan-id> and an IP address serving as default gateway for that VLAN. Traffic between VLANs enters the router, gets routed at Layer 3, and exits back out the same physical interface to the trunk.

Interview Tip: Mention this is functional but can become a throughput bottleneck at scale.
</details>

---

## Question 11: DTP Overview - What is Dynamic Trunking Protocol and where is it used?
Study Note: DTP knowledge helps prevent accidental trunks, a frequent misconfiguration in campus switching environments.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DTP is a Cisco proprietary protocol used between switches to negotiate whether a link becomes a trunk. Modes include dynamic desirable, dynamic auto, trunk, access, and nonegotiate. It is useful in controlled Cisco-only environments but often disabled in hardened designs to avoid unintended trunk formation.

Interview Tip: Say that DTP is convenience-oriented but explicit static trunk config is safer.
</details>

---

## Question 12: DTP Modes - How do dynamic auto and dynamic desirable differ?
Study Note: Interviewers use this to check precise behavior under negotiation scenarios, not just definitions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Dynamic desirable actively attempts to form a trunk, while dynamic auto passively waits for the other side to request trunking. Auto plus auto typically does not form a trunk. Desirable with auto usually forms a trunk. Operational behavior can differ if one side is hard-set to access or trunk.

Interview Tip: Use a pairing example like "desirable plus auto equals trunk" to show practical memory.
</details>

---

## Question 13: Disabling Negotiation - When should switchport nonegotiate be used?
Study Note: This setting is a common hardening practice and appears in security-focused switching interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: switchport nonegotiate disables DTP frames on a port. It is typically used when trunk state is statically configured and negotiation is unnecessary, especially on links to non-Cisco devices or security-sensitive uplinks. If used, ensure both sides are manually configured correctly, since auto-negotiation assistance is removed.

Interview Tip: Emphasize explicit configuration discipline when negotiation is disabled.
</details>

---

## Question 14: VTP Purpose - What problem does VTP attempt to solve?
Study Note: VTP is tested because it can simplify VLAN administration but also introduce major change risk.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: VLAN Trunking Protocol (VTP) distributes VLAN configuration information across switches in the same VTP domain over trunk links. It reduces repetitive manual VLAN creation on each switch. VTP includes advertisements containing revision numbers, and switches compare revisions to determine database updates.

Interview Tip: Mention both benefit and risk in one answer, centralized consistency versus blast radius.
</details>

---

## Question 15: VTP Modes - What are server, client, and transparent modes?
Study Note: You are expected to know VTP operating roles and how they affect VLAN database updates.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: In VTP server mode, a switch can create, modify, and delete VLANs and advertise updates. In client mode, it cannot modify VLANs locally but learns updates from servers. In transparent mode, it does not apply received VTP updates to its own VLAN database in classic behavior, but can forward advertisements. VTP version and platform specifics should always be validated in production.

Interview Tip: Explain operational authority clearly: who can edit VLANs and who only listens.
</details>

---

## Question 16: VTP Revision Number - Why can this value cause outages?
Study Note: Revision-number mistakes are infamous and interviewers ask this to test real-world caution.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A switch with a higher VTP revision number can overwrite VLAN information in the domain if domain name/password/version align. Introducing a previously used switch without resetting revision can propagate stale or incorrect VLAN database entries, potentially removing active VLANs and causing widespread outages. Best practice includes resetting VTP state and validating before connecting to production trunks.

Interview Tip: Give a brief cautionary scenario, then explain the preventive checklist.
</details>

---

## Question 17: VTP Pruning - What does it do and what does it not do?
Study Note: Candidates often overstate pruning effects, so interviewers look for precise boundaries.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: VTP pruning reduces unnecessary flooded traffic for VLANs that have no active ports on downstream switches, helping optimize trunk bandwidth. It does not replace allowed VLAN configuration, and it does not block all VLAN traffic types universally. It mainly affects flooded traffic behavior and should be combined with explicit trunk design controls.

Interview Tip: Say "optimization feature, not a security boundary" to sound exact.
</details>

---

## Question 18: Verification Commands - Which commands validate VLAN and trunk state on Cisco switches?
Study Note: Operational command fluency is a key interview discriminator for implementation-focused roles.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Common commands include show vlan brief (VLAN and access-port membership), show interfaces trunk (trunk status, native VLAN, allowed VLANs), show interfaces switchport (per-port mode details), show vtp status (domain, mode, revision), and show dtp interface (if supported) for DTP negotiation details. For MAC learning context, show mac address-table is also useful.

Interview Tip: Group commands by purpose: VLAN database, trunk status, negotiation status, forwarding evidence.
</details>

---

## Question 19: Native VLAN Mismatch - What symptoms appear and how do you troubleshoot?
Study Note: This is a common lab and production scenario that tests whether you can diagnose trunk consistency issues quickly.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Symptoms may include intermittent inter-switch connectivity issues, control-plane warnings, and traffic appearing in wrong VLANs. Troubleshooting starts by checking both trunk ends for encapsulation, mode, native VLAN, and allowed VLAN list. Use show interfaces trunk and review logs for mismatch alerts. Correct by aligning native VLAN and trunk policies on both devices.

Interview Tip: Mention configuration parity checks first, not packet capture first.
</details>

---

## Question 20: Design Best Practices - What are practical switching essentials for stable campus VLAN design?
Study Note: Best-practice framing demonstrates readiness to move from exam knowledge into production operations.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Use explicit access/trunk modes, restrict allowed VLANs, avoid user traffic on VLAN 1, use dedicated management VLANs, document VLAN ID purpose, and standardize trunk/native VLAN templates. Disable unused ports and place them in an unused VLAN. Use consistent naming and verification checks after changes. For environments not using VTP centrally, prefer transparent or off modes to limit unintended propagation.

Interview Tip: Present best practices as a repeatable deployment checklist to show operational maturity.
</details>

---
