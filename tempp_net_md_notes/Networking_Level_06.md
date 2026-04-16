## Question 1: Dynamic Routing Fundamentals - Why use dynamic routing instead of only static routes?
Study Note: Interviewers ask this to test whether you can balance simplicity and scalability in real enterprise topologies.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Dynamic routing protocols automatically discover, share, and adapt routes when topology changes. This reduces manual configuration overhead compared with static routes, especially in medium to large networks. They improve convergence and resiliency, but add control-plane complexity and require protocol design discipline.

Interview Tip: Explain tradeoff clearly: static is simple, dynamic is scalable and adaptive.
</details>

---

## Question 2: OSPF Basics - What type of protocol is OSPF and what metric does it use?
Study Note: OSPF is one of the most common enterprise IGPs, so baseline protocol classification is expected.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: OSPF is a link-state interior gateway protocol that uses the SPF algorithm (Dijkstra) to compute shortest paths. Its metric is cost, typically derived from interface bandwidth. OSPF packets are carried directly in IP using protocol number 89, not TCP or UDP ports.

Interview Tip: Mention "link-state plus SPF plus cost" in one concise sentence.
</details>

---

## Question 3: OSPF Area 0 - Why is Area 0 mandatory in multi-area OSPF designs?
Study Note: Area design is a high-frequency interview topic because incorrect area planning causes routing and scaling issues.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Area 0 is the OSPF backbone and all non-backbone areas should connect to it, directly or through accepted design mechanisms. Inter-area routes are exchanged through the backbone by ABRs. If Area 0 continuity is broken, inter-area communication can fail.

Interview Tip: Say "Area 0 is the transit core for OSPF areas" to show architectural understanding.
</details>

---

## Question 4: OSPF Neighbor States - What are key OSPF adjacency states you should know?
Study Note: State transition knowledge is practical for troubleshooting stuck adjacencies during interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Common states include Down, Init, 2-Way, ExStart, Exchange, Loading, and Full. On broadcast networks, not all neighbors form Full with each other due to DR/BDR design; many remain 2-Way with non-DR peers. Full adjacency is expected with DR/BDR and on point-to-point links.

Interview Tip: Focus on where things fail most: neighbors stuck in ExStart/Exchange often indicate MTU or parameter mismatch.
</details>

---

## Question 5: OSPF Hello and Dead Timers - Why must timers match?
Study Note: Timer mismatch is a classic reason neighbors never reach Full state.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: OSPF neighbors on the same segment must agree on key parameters, including Hello and Dead intervals. If these values differ, adjacency formation fails. Typical broadcast defaults are Hello 10 seconds and Dead 40 seconds, though values depend on network type and platform.

Interview Tip: Mention timers alongside area ID and authentication as the first mismatch checks.
</details>

---

## Question 6: OSPF DR and BDR - What problem do DR and BDR solve on multiaccess networks?
Study Note: This demonstrates whether you understand OSPF scaling behavior on shared segments.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: On broadcast and NBMA networks, DR and BDR reduce adjacency count and LSA exchange overhead. Instead of full mesh adjacencies between all routers, DROTHER routers form full adjacency primarily with DR and BDR. DR election is based on highest OSPF interface priority, then highest router ID as tie-breaker.

Interview Tip: Explain using scaling math: fewer adjacencies means less control traffic.
</details>

---

## Question 7: OSPF Router ID - How is Router ID selected and why does it matter?
Study Note: Router ID affects adjacency identity and troubleshooting clarity across the OSPF domain.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: OSPF Router ID is a 32-bit value selected by manual configuration first, then highest loopback IP, then highest active physical interface IP if not manually set. It uniquely identifies the router in OSPF LSDB and protocol operations. Changing router ID often requires process reset to take effect.

Interview Tip: Recommend manually setting router IDs for deterministic operations.
</details>

---

## Question 8: OSPF Network Statements - What do OSPF network commands actually do?
Study Note: Candidates often misunderstand this command as route advertisement only, rather than interface matching.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: In classic OSPF configuration, the network statement matches local interfaces by wildcard mask and enables OSPF on those interfaces, assigning them to an area. It does not simply advertise arbitrary remote networks. Example: network 10.10.10.0 0.0.0.255 area 0.

Interview Tip: Use the phrase "match interfaces, then advertise connected prefixes on those interfaces."
</details>

---

## Question 9: OSPF Cost Calculation - How is OSPF cost derived and tuned?
Study Note: Cost tuning questions assess whether you can influence path selection intentionally.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: OSPF interface cost is typically reference bandwidth divided by interface bandwidth. On Cisco, default reference bandwidth may be too low for modern high-speed links unless adjusted with auto-cost reference-bandwidth. You can also set per-interface cost directly using ip ospf cost <value> for deterministic traffic engineering.

Interview Tip: Mention consistent reference bandwidth across all OSPF routers to avoid inconsistent path decisions.
</details>

---

## Question 10: OSPF Verification - Which commands validate OSPF health quickly?
Study Note: Command fluency is critical in interview labs and production troubleshooting scenarios.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Core commands include show ip ospf neighbor, show ip ospf interface, show ip route ospf, and show ip protocols. For deep analysis, show ip ospf database confirms LSA visibility. Ping and traceroute validate data-plane outcome after control-plane checks.

Interview Tip: Present checks in order: neighbors, interfaces, LSDB/routes, then data-plane tests.
</details>

---

## Question 11: EIGRP Basics - What kind of protocol is EIGRP and what algorithm does it use?
Study Note: EIGRP conceptual clarity is expected even in mixed-vendor interview contexts.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: EIGRP is an advanced distance-vector protocol using the DUAL algorithm for loop-free and rapid convergence behavior. It sends updates incrementally after initial exchange rather than periodic full table updates. EIGRP uses IP protocol number 88 and commonly multicasts to 224.0.0.10 for neighbor communication on IPv4.

Interview Tip: Emphasize DUAL and fast convergence with loop-free calculations.
</details>

---

## Question 12: EIGRP Metric Components - Which values affect EIGRP metric by default?
Study Note: Metric-component knowledge is a frequent interview checkpoint tied to path selection behavior.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: By default EIGRP metric uses minimum bandwidth along the path and cumulative delay. Reliability and load exist as optional components but are not used with default K-values. MTU is tracked but not part of metric calculation. Accurate interface bandwidth settings are therefore very important for predictable routing.

Interview Tip: Say "bandwidth and delay by default" first, then mention K-values.
</details>

---

## Question 13: EIGRP Formula Context - Why do K-values matter?
Study Note: This checks if you can explain metric behavior without overcomplicating the math.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: K-values determine which parameters contribute to EIGRP composite metric. If neighbors have mismatched K-values, adjacency will not form. In most deployments, defaults are used to avoid instability and incompatibility. Adjusting K-values is rare and should be done only with strong design justification.

Interview Tip: Mention adjacency failure on K-value mismatch, interviewers often look for that detail.
</details>

---

## Question 14: Feasible Distance and Reported Distance - What is the difference?
Study Note: DUAL terminology is central to EIGRP interview questions and troubleshooting logic.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Feasible Distance (FD) is the total best metric from the local router to a destination. Reported Distance (RD), also called Advertised Distance, is the metric a neighbor reports for that destination from its own perspective. EIGRP uses FD and RD comparisons to determine successor and feasible successor paths.

Interview Tip: Use local versus neighbor perspective to make the distinction easy.
</details>

---

## Question 15: Feasibility Condition - How does EIGRP choose a feasible successor?
Study Note: This is a classic EIGRP interview concept for proving loop-free backup path understanding.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A route qualifies as feasible successor if the neighbor's RD is less than the local router's current FD to that destination. This feasibility condition ensures loop-free backup paths. If a feasible successor exists, failover is fast without active recomputation queries.

Interview Tip: Say "RD < current FD" exactly, then explain it provides prevalidated backup.
</details>

---

## Question 16: EIGRP Passive Interface - Why use passive-interface in routing protocols?
Study Note: Passive-interface usage shows security and control-plane hygiene in enterprise operations.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: passive-interface prevents routing hello packets on selected interfaces while still allowing connected networks on those interfaces to be advertised. This reduces unnecessary neighbor attempts and limits routing exposure on user-facing segments. It is a standard hardening and control-plane cleanup technique.

Interview Tip: Explain it as "advertise network, do not form neighbor there."
</details>

---

## Question 17: OSPF vs EIGRP - How would you compare them in an interview?
Study Note: Comparative reasoning is often used to evaluate architecture judgement, not just memorization.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: OSPF is open standard, link-state, and common in multi-vendor environments; EIGRP is traditionally Cisco-centric though standards information exists. OSPF uses cost and LSDB with SPF calculations, while EIGRP uses DUAL with composite metric based on bandwidth and delay. Both converge well when designed correctly, but selection often depends on interoperability requirements and operational familiarity.

Interview Tip: Anchor your comparison around standards support, metric logic, and operational environment.
</details>

---

## Question 18: Route Summarization in Dynamic Routing - Why summarize at boundaries?
Study Note: Summarization is a key scalability and stability concept in both OSPF and EIGRP discussions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Summarization reduces routing table size, decreases update volume, and limits failure-domain visibility. In OSPF, summarization is commonly done on ABRs/ASBRs. In EIGRP, summarization can be configured per interface. Good summaries improve convergence behavior and operational readability but must be aligned on contiguous boundaries.

Interview Tip: Mention both benefits and risk: wrong summary can black-hole traffic.
</details>

---

## Question 19: Dynamic Routing Troubleshooting - A neighbor is down, what is your first checklist?
Study Note: Structured troubleshooting answers score higher than command dumps in interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: First verify Layer 1 and Layer 2 status, then IP addressing and subnet match on both sides. For OSPF, validate area ID, timers, authentication, network type, and MTU. For EIGRP, validate AS number, K-values, and authentication if configured. Use show ip ospf neighbor or show ip eigrp neighbors, then inspect interface and protocol configs.

Interview Tip: Present as layers: physical, IP, protocol parameters, then route table impact.
</details>

---

## Question 20: Scenario Drill - OSPF neighbors are Full but route is missing. What could cause this?
Study Note: Advanced interview questions test whether you can separate adjacency health from route advertisement logic.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Full adjacency does not guarantee every prefix is present. Possible causes include missing network statement/interface enablement, passive interface behavior, area type filtering, route summarization mistakes, distribute-list or route filtering policies, or route not installed due to better AD/longest prefix from another source. Check show ip route, show ip ospf database, and running config for interface-to-area mapping.

Interview Tip: Explain that control-plane adjacency and prefix policy are separate verification steps.
</details>

---
