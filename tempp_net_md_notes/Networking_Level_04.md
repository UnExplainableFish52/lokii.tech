## Question 1: STP Core Purpose - Why is Spanning Tree Protocol mandatory in redundant Layer 2 designs?
Study Note: Redundancy without loop control causes broadcast storms and MAC table instability, which can take down entire campus domains.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: STP (IEEE 802.1D) prevents Layer 2 loops by creating a loop-free logical topology while keeping physical redundancy. It elects a root bridge and blocks selected redundant paths. Without STP, flooded traffic (broadcast, unknown unicast, multicast) can circulate indefinitely, leading to broadcast storms, duplicate frames, and MAC address table flapping.

Interview Tip: Explain that STP is not optional in switched redundancy, it is the control-plane safety net.
</details>

---

## Question 2: BPDU Fundamentals - What are BPDUs and how are they used?
Study Note: BPDU behavior is central to understanding root election and topology change handling in enterprise switching.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Bridge Protocol Data Units (BPDUs) are Layer 2 control frames exchanged by switches to build and maintain the spanning tree. They carry bridge ID, root ID, path cost, and timer information. Switches compare received BPDUs to determine best path to the root bridge and decide which ports forward or block.

Interview Tip: Say "BPDUs are STP control messages" first, then mention root ID and path cost fields.
</details>

---

## Question 3: Root Bridge Election - How is the STP root bridge selected?
Study Note: Interviewers expect exact election criteria, because root placement strongly affects traffic flow.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: The root bridge is the switch with the lowest Bridge ID (BID). BID is composed of bridge priority plus MAC address. If priorities are equal, the lower MAC wins. Best practice is to set root bridge intentionally using lower priority values, for example on Cisco: spanning-tree vlan 10 root primary.

Interview Tip: Mention "lowest BID wins" and immediately add that production networks should never rely on default election.
</details>

---

## Question 4: STP Port Roles - What are root, designated, and non-designated ports?
Study Note: Port role accuracy shows whether you can read topology diagrams and predict forwarding behavior.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A root port is each non-root switch's best path toward the root bridge (one per switch). A designated port is the forwarding port for a segment with the best path from that segment toward the root. Non-designated ports are alternate redundant ports placed in blocking state in classic STP to prevent loops.

Interview Tip: Use "best path to root" as your anchor phrase for role explanation.
</details>

---

## Question 5: STP Port States - What are the 802.1D states and their purpose?
Study Note: State transition knowledge helps explain convergence delay and temporary outages during topology changes.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Classic STP states are Blocking, Listening, Learning, Forwarding, and Disabled. In Listening, ports process BPDUs but do not learn MACs. In Learning, MAC learning starts but data forwarding still does not occur. Forwarding allows normal traffic. These staged transitions reduce loop risk but increase convergence time.

Interview Tip: Connect states to behavior: "when does it learn, when does it forward."
</details>

---

## Question 6: RSTP Improvements - How does RSTP improve convergence over classic STP?
Study Note: Fast convergence is a major operational requirement, and RSTP is a standard interview topic for modern campus networks.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: RSTP (802.1w) accelerates convergence by redefining port roles/states and using handshake mechanisms (proposal/agreement) on point-to-point links. It replaces several legacy states with Discarding, Learning, and Forwarding. It also introduces alternate and backup roles to rapidly transition when failures occur, typically much faster than 802.1D timer-based behavior.

Interview Tip: Emphasize that RSTP is event-driven and handshake-oriented, not purely timer-driven.
</details>

---

## Question 7: Path Cost Logic - How does STP choose the best path to the root bridge?
Study Note: Path-cost logic appears often in topology design and troubleshooting interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: STP selects the path with the lowest cumulative root path cost. Cost is based on link bandwidth using standardized values, and total path cost is additive hop by hop. If costs tie, STP uses tie-breakers such as lowest upstream BID and then lowest port ID. You can inspect results with show spanning-tree.

Interview Tip: Describe the decision order: lowest cost first, then deterministic tie-breakers.
</details>

---

## Question 8: STP Timers - What are Hello, Max Age, and Forward Delay timers?
Study Note: Timer understanding is useful for diagnosing unexpected convergence behavior and legacy interoperability issues.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: In classic STP, Hello timer controls BPDU transmission interval (default 2 seconds), Max Age controls BPDU aging (default 20 seconds), and Forward Delay controls Listening/Learning duration (default 15 seconds each). These defaults contribute to slower convergence in 802.1D. RSTP reduces dependence on these long transitions for many scenarios.

Interview Tip: State defaults confidently, then note that manual timer tuning should be done carefully and consistently.
</details>

---

## Question 9: STP Variants - Compare PVST+, Rapid PVST+, and MST.
Study Note: Variant selection impacts scalability, convergence speed, and operational complexity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: PVST+ runs a separate STP instance per VLAN (Cisco), allowing per-VLAN root control but higher CPU/control overhead. Rapid PVST+ brings RSTP speed per VLAN. MST (802.1s) maps multiple VLANs into fewer spanning tree instances, reducing overhead while preserving design control. Large campus networks often use MST for scale.

Interview Tip: Explain tradeoff in one line: flexibility vs control-plane scale.
</details>

---

## Question 10: PortFast - What does PortFast do and where should it be enabled?
Study Note: PortFast improves user experience at the edge but can be dangerous if applied incorrectly.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: PortFast allows access ports to transition quickly to forwarding, bypassing normal STP delay states. It is intended for edge ports connected to end hosts, not switch-to-switch links. Typical Cisco command: spanning-tree portfast on access interfaces. Misuse on transit links can create loops.

Interview Tip: Always pair PortFast with edge-host context and mention risk on inter-switch links.
</details>

---

## Question 11: BPDU Guard - Why is BPDU Guard used with PortFast?
Study Note: This is a common hardening control and a frequent interview check for practical Layer 2 security awareness.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: BPDU Guard protects edge ports by err-disabling a PortFast interface if a BPDU is received, indicating an unexpected switch connection. This prevents accidental or malicious topology influence from edge ports. On Cisco, it can be enabled globally for PortFast ports: spanning-tree portfast bpduguard default.

Interview Tip: Phrase it as "trust boundary for edge ports." That framing sounds operational and security-focused.
</details>

---

## Question 12: Root Guard - How does Root Guard protect topology design?
Study Note: Root stability is a design objective, and Root Guard enforces intended control-plane hierarchy.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Root Guard prevents a port from becoming a root port by blocking superior BPDUs on designated interfaces. If superior BPDUs are seen, the port enters root-inconsistent state until condition clears. This helps ensure access or distribution boundaries do not accidentally replace intended root bridge locations.

Interview Tip: Explain Root Guard as policy enforcement for "where root is allowed to exist."
</details>

---

## Question 13: Loop Guard and UDLD - How do they prevent unidirectional link issues?
Study Note: Unidirectional failures are subtle and can bypass basic link-up checks, causing loop risks and instability.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Loop Guard prevents non-designated ports from incorrectly moving to forwarding if expected BPDUs stop due to one-way failures. UDLD (Unidirectional Link Detection) actively detects one-way fiber/copper faults by exchanging protocol messages and can err-disable affected interfaces in aggressive mode. Together they reduce risk from partial link failures.

Interview Tip: Mention that physical link up does not guarantee bidirectional control-plane health.
</details>

---

## Question 14: EtherChannel Purpose - Why bundle links instead of using STP-blocked redundancy?
Study Note: EtherChannel is a key design method to increase bandwidth while keeping loop-free behavior.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: EtherChannel combines multiple physical links into one logical port-channel. STP treats the bundle as a single logical link, so member links do not get individually blocked for loop prevention. This increases aggregate bandwidth and resiliency. If one member fails, traffic continues over remaining links.

Interview Tip: Highlight both benefits together: active-active throughput and fault tolerance.
</details>

---

## Question 15: LACP vs PAgP vs Static - What are key differences in EtherChannel negotiation?
Study Note: Interviewers often test negotiation protocol knowledge and compatibility constraints.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: LACP (IEEE 802.3ad/802.1AX) is standards-based and interoperable across vendors. PAgP is Cisco proprietary. Static "on" mode forms channel without negotiation, requiring exact manual parity on both ends. In LACP, active initiates, passive responds; active-active or active-passive forms channel, passive-passive does not.

Interview Tip: Recommend LACP by default in multi-vendor or future-proof designs.
</details>

---

## Question 16: EtherChannel Consistency - Which mismatches prevent channel formation?
Study Note: Configuration consistency is the top practical cause of EtherChannel deployment issues.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Member interfaces must match in speed, duplex, VLAN mode, allowed VLAN list, native VLAN, and trunk/access configuration. Protocol mode compatibility (LACP/PAgP/static) must also align. Mismatches can place links in suspended or standalone states. Verification commands include show etherchannel summary and show interfaces port-channel.

Interview Tip: Answer with "match all Layer 2 characteristics before bundling" to show disciplined implementation mindset.
</details>

---

## Question 17: EtherChannel Load Balancing - How is traffic distributed across member links?
Study Note: This topic checks whether you understand why aggregate bandwidth may not help a single large flow.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Traffic distribution uses a hash of selected header fields, such as source/destination MAC, IP, or Layer 4 port values depending on platform settings. A single flow usually stays on one member link, while multiple flows can distribute across members. Therefore, throughput gain is best with many conversations, not one elephant flow.

Interview Tip: State clearly that EtherChannel is flow-based load sharing, not per-packet striping in most enterprise switching.
</details>

---

## Question 18: Storm Control - How does storm control protect Layer 2 domains?
Study Note: Broadcast or multicast storms can saturate links and CPU, so defensive controls are expected in production designs.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Storm control limits broadcast, multicast, and sometimes unknown unicast traffic rates on interfaces. When thresholds are exceeded, the switch can drop excess traffic and optionally generate logs/traps. This mitigates impact from loops, misbehaving hosts, or malware generating excessive flood traffic.

Interview Tip: Mention it as a mitigation control, not a replacement for correct STP and topology design.
</details>

---

## Question 19: DHCP Snooping and DAI - How do these features stop common Layer 2 attacks?
Study Note: Layer 2 attack prevention is practical interview territory for campus and branch access network roles.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DHCP Snooping classifies ports as trusted/untrusted and builds binding tables from valid DHCP exchanges, blocking rogue DHCP server replies on untrusted ports. Dynamic ARP Inspection (DAI) uses those bindings to validate ARP packets and block spoofed ARP responses. Together they reduce man-in-the-middle and address-poisoning risks on access VLANs.

Interview Tip: Explain them as a pair: DHCP Snooping builds trust data, DAI enforces ARP integrity.
</details>

---

## Question 20: IP Source Guard - What role does it play in access-layer security?
Study Note: Access edge controls are crucial in interviews because they reflect defense-in-depth at the first hop.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: IP Source Guard filters traffic on untrusted access ports based on DHCP Snooping bindings (IP/MAC/port mapping). It blocks packets with spoofed source IP addresses that do not match learned bindings. This feature is often deployed alongside Port Security, DHCP Snooping, and DAI to harden user-facing switchports.

Interview Tip: Present this as first-hop anti-spoofing tied directly to validated endpoint bindings.
</details>

---
