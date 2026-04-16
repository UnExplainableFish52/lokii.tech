## Question 1: Routing Basics - What is the core job of a router?
Study Note: Interviewers use this to check whether you can separate Layer 2 switching behavior from Layer 3 forwarding logic.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A router forwards packets between different IP networks using a routing table. It examines the destination IP address, performs longest prefix match, selects a next hop or exit interface, rewrites Layer 2 headers, and forwards the packet. Unlike switches, routers do not forward Layer 2 broadcasts by default.

Interview Tip: Start with "routers connect different subnets" and add longest prefix match for technical depth.
</details>

---

## Question 2: Longest Prefix Match - How does a router choose between multiple matching routes?
Study Note: Route selection order is a common interview test because it directly affects real path outcomes.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Routers choose the most specific route, meaning the route with the longest prefix length. For example, if both 10.0.0.0/8 and 10.10.20.0/24 exist, traffic to 10.10.20.15 uses /24. If multiple routes have equal prefix length, selection can depend on administrative distance and metric.

Interview Tip: Use one clear example with /8 and /24 to demonstrate deterministic matching.
</details>

---

## Question 3: Static Route Definition - What is a static route and why use it?
Study Note: Static routes are still heavily used at edges, stubs, and controlled paths, so practical understanding is expected.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A static route is a manually configured route that defines destination prefix and next hop or exit interface. Example Cisco command: ip route 192.168.50.0 255.255.255.0 10.0.0.2. Benefits include predictability, low overhead, and security control. Drawbacks include manual scaling and maintenance burden in large topologies.

Interview Tip: Explain where static routes are strong, branch stubs and internet edge defaults, not large dynamic cores.
</details>

---

## Question 4: Next Hop vs Exit Interface - What is the difference when configuring static routes?
Study Note: Correct static route style impacts recursive lookup behavior and troubleshooting complexity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A static route can point to a next-hop IP, an exit interface, or both. Next-hop routes require recursive lookup to find how to reach the next hop. Exit-interface routes are common on point-to-point links. On multi-access Ethernet, next-hop form is often preferred to avoid excessive ARP behavior tied to interface-only routes.

Interview Tip: Mention "point-to-point versus multi-access" to show implementation awareness.
</details>

---

## Question 5: Default Route - What is a default route and when is it used?
Study Note: Default routing is foundational for internet access and stub network design.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A default route (0.0.0.0/0 in IPv4) matches any destination not found in the routing table. It is used to send unknown traffic toward an upstream router, commonly at branch or access layers. Cisco example: ip route 0.0.0.0 0.0.0.0 203.0.113.1.

Interview Tip: Describe it as the "last-resort path" for unknown destinations.
</details>

---

## Question 6: Gateway of Last Resort - What does this phrase mean in routing output?
Study Note: Interviewers often present command output and expect interpretation, not only conceptual definitions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Gateway of last resort refers to the next hop used by the default route. In Cisco show ip route output, it indicates where packets go when no specific route matches. If missing in a stub router, off-net traffic can fail even when local routes are correct.

Interview Tip: Tie this directly to default route presence and internet reachability checks.
</details>

---

## Question 7: Administrative Distance - How does AD influence static versus dynamic route preference?
Study Note: AD knowledge is required to predict active path selection when multiple route sources exist.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Administrative Distance is route source trust value; lower is preferred. Connected routes have AD 0, static routes usually AD 1, and dynamic protocols have higher defaults (for example OSPF 110). A static route generally overrides OSPF if prefixes are equal, unless static AD is raised for backup behavior.

Interview Tip: Use one sentence: "same prefix, lowest AD wins."
</details>

---

## Question 8: Floating Static Route - What is it and why deploy it?
Study Note: Backup path design is a practical interview scenario where floating statics are often expected.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A floating static route is a static route configured with higher AD so it stays inactive until the primary route fails. Example: ip route 192.168.10.0 255.255.255.0 10.1.1.2 200. This creates deterministic failover without running a dynamic protocol on all links.

Interview Tip: Emphasize that the route "floats" below the primary due to AD.
</details>

---

## Question 9: Recursive Lookup - What is recursive routing resolution?
Study Note: Recursive resolution appears in troubleshooting when a static route points to an unreachable next hop.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Recursive lookup happens when a route points to a next-hop IP, and the router must find another route to reach that next-hop address. If that supporting route disappears, the dependent static route becomes unusable. This is why next-hop reachability and connected path validation are critical in static route troubleshooting.

Interview Tip: Explain it as "route to route" resolution before forwarding can happen.
</details>

---

## Question 10: Null Route - Why configure a static route to Null0?
Study Note: Null routes are used in summarization and protection against routing loops, which interviewers value as design maturity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A static route to Null0 discards matching traffic. It is commonly used with summary routes so packets for unknown sub-prefixes inside the summary are safely dropped instead of looping. Example: ip route 10.10.0.0 255.255.0.0 Null0.

Interview Tip: Frame this as controlled discard for stability, not as accidental packet loss.
</details>

---

## Question 11: Inter-VLAN Routing Concept - Why is Layer 3 required between VLANs?
Study Note: Inter-VLAN routing is a core enterprise task and often appears in practical interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: VLANs are separate Layer 2 domains and usually separate IP subnets. Communication between VLANs requires a Layer 3 gateway that can route between those subnets. This can be done using router-on-a-stick or multilayer switch SVIs.

Interview Tip: Keep it direct: different VLAN means different subnet, so routing is mandatory.
</details>

---

## Question 12: Router-on-a-Stick Configuration - What are the key commands and checks?
Study Note: Command-level confidence is frequently tested for entry network engineering roles.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Configure switch uplink as trunk, then create router subinterfaces per VLAN with encapsulation dot1Q and gateway IPs. Example: interface g0/0.10, encapsulation dot1Q 10, ip address 192.168.10.1 255.255.255.0. Validate with show ip interface brief on router and show interfaces trunk on switch.

Interview Tip: Mention both sides, switch trunk plus router subinterfaces, to show end-to-end thinking.
</details>

---

## Question 13: SVI-Based Inter-VLAN Routing - How does a multilayer switch perform routing?
Study Note: Modern campus networks commonly use SVIs, so this is a high-value implementation topic.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A multilayer switch creates Switch Virtual Interfaces for VLANs, assigns gateway IPs, and enables Layer 3 routing with ip routing. Hosts use SVI IP as default gateway. Traffic between VLANs is routed internally in hardware forwarding path, usually faster and simpler than external router-on-a-stick at scale.

Interview Tip: Compare it briefly to router-on-a-stick and mention performance and scalability benefits.
</details>

---

## Question 14: Default Gateway for VLAN Hosts - How should host gateways be planned?
Study Note: Bad gateway planning causes large outage domains and migration complexity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Each VLAN subnet needs a gateway IP, commonly the first or last usable address, such as .1 or .254 by policy. Consistent standards improve operations and automation. Redundant gateways can use FHRPs like HSRP or VRRP, but the host still points to one virtual default gateway address.

Interview Tip: Mention consistency and redundancy together, it signals production design mindset.
</details>

---

## Question 15: Route Table Verification - Which commands confirm static and default routes on Cisco?
Study Note: Interviewers expect command fluency to validate assumptions quickly in live troubleshooting.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Use show ip route to view installed routes and route codes, show running-config | include ^ip route to view configured static routes, and show ip interface brief for interface status. For path tests, use ping and traceroute from the router with source options when needed.

Interview Tip: Give commands in a logical order: table, config, interfaces, active path tests.
</details>

---

## Question 16: Asymmetric Routing - Why can static designs cause asymmetric paths?
Study Note: Asymmetry affects firewalls, troubleshooting clarity, and performance visibility.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Asymmetric routing occurs when forward and return traffic use different paths due to route preferences or partial static entries. In stateful firewall environments, this can break sessions if return traffic bypasses expected inspection points. Good design uses consistent route policies, complete return routes, and validation with traceroute from both ends.

Interview Tip: Mention that asymmetry is not always wrong, but it must be intentional and compatible with security devices.
</details>

---

## Question 17: Stub Network Design - Why are static routes common in branch stubs?
Study Note: Branch design is a common interview scenario where route simplicity and reliability matter.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Branch stubs often have one upstream path, so a default static route to HQ or ISP is simple and effective. Core side may add specific static routes back to branch subnets or use summarization. This reduces protocol complexity and control-plane overhead on small devices.

Interview Tip: Explain static routing as operationally efficient when topology is simple and predictable.
</details>

---

## Question 18: IPv6 Default Route - What is the equivalent of IPv4 0.0.0.0/0 in IPv6?
Study Note: Even in IPv4-focused roles, interviewers often test whether you can map key concepts into IPv6.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: IPv6 default route is ::/0. Cisco example: ipv6 route ::/0 2001:db8:100::1. It functions like IPv4 default route by matching destinations that lack more-specific IPv6 entries.

Interview Tip: State both notations quickly, 0.0.0.0/0 and ::/0, to show dual-stack readiness.
</details>

---

## Question 19: Black Hole Troubleshooting - How can a wrong static route create silent traffic drops?
Study Note: Static route errors are deterministic but severe, and interviewers value candidates who can isolate them methodically.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A misconfigured static route can send traffic to a dead next hop or incorrect interface, creating a black hole. Symptoms include one-way reachability or total timeout despite link-up states. Troubleshoot using show ip route, next-hop reachability ping, interface status, and traceroute hop analysis.

Interview Tip: Explain that static routes do exactly what configured, so verification of intent versus config is critical.
</details>

---

## Question 20: Practical Scenario - A user in VLAN 20 can reach the gateway but not VLAN 30. What should you check first?
Study Note: Scenario questions test layered reasoning, not memorized definitions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: First confirm Layer 3 path between VLAN gateways, including SVI or subinterface status and IP routing enabled on multilayer switch. Then verify VLAN 30 gateway IP/mask, host default gateway correctness, and ACL policies that may block inter-VLAN traffic. On Cisco, use show ip interface brief, show run interface vlan 20, show run interface vlan 30, show ip route, and ACL checks.

Interview Tip: Present checks in sequence: gateway, routing, policy, endpoint config.
</details>

---
