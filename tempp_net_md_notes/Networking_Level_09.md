## Question 1: Enterprise WAN Scope - What problems do WAN technologies solve for modern enterprises?
Study Note: Interviewers expect you to connect WAN design decisions to business outcomes like uptime, latency, and branch connectivity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: WAN technologies connect geographically distributed sites, cloud environments, data centers, and remote users. They provide controlled routing, security, segmentation, and service quality across long-distance links. Typical enterprise goals include resilient connectivity, predictable application performance, and secure internet and cloud access.

Interview Tip: Start with business outcomes, then map them to technical controls such as routing, encryption, and policy.
</details>

---

## Question 2: MPLS vs Internet WAN - How do they differ for enterprise use?
Study Note: This comparison is common in interviews because most organizations run hybrid WAN designs.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: MPLS provides private carrier-managed transport with QoS and predictable SLAs, often at higher cost. Internet WAN is lower cost and broadly available but less deterministic without overlay controls. Enterprises often combine both using SD-WAN overlays for policy-based path selection and resiliency.

Interview Tip: Present tradeoff clearly: predictability and SLA versus flexibility and cost.
</details>

---

## Question 3: BGP Fundamentals - What is BGP and where is it used?
Study Note: BGP basics are required for WAN and cloud interviews because BGP is central to inter-domain routing.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: BGP is a path-vector routing protocol used to exchange routes between autonomous systems (AS). It is the protocol of the internet and also used in enterprise edge, data center, and cloud interconnect designs. BGP sessions use TCP port 179 for reliable route exchange.

Interview Tip: Say "BGP is policy-driven inter-domain routing" to show conceptual clarity.
</details>

---

## Question 4: eBGP vs iBGP - What are the key differences?
Study Note: Interviewers use this to test foundational BGP architecture knowledge.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: eBGP runs between different autonomous systems, while iBGP runs within the same AS. eBGP neighbors are typically directly connected unless multihop is configured. iBGP has split-horizon behavior requiring route reflectors or full mesh to propagate routes at scale.

Interview Tip: Mention route reflectors when describing scalable iBGP design.
</details>

---

## Question 5: Autonomous System Numbers - Why do ASNs matter in BGP design?
Study Note: ASN usage is basic but important for peering, route policy, and troubleshooting.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: ASNs uniquely identify routing domains in BGP. Public ASNs are used for internet-facing routing, while private ASNs are often used internally and removed or rewritten at provider boundaries. Correct ASN planning is necessary for clean policy control and predictable AS_PATH behavior.

Interview Tip: Explain ASN as the identity label for policy decisions in BGP.
</details>

---

## Question 6: BGP Path Selection - Which attributes are most important in basic interviews?
Study Note: Path selection logic is a frequent interview test because BGP is policy-first, not shortest-path only.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Commonly discussed attributes include LOCAL_PREF (higher preferred inside AS), AS_PATH length (shorter preferred), and MED (lower preferred between certain neighboring AS paths). Other factors include origin, eBGP over iBGP, and next-hop reachability. Exact decision order depends on platform implementation, but policy attributes are key.

Interview Tip: Lead with LOCAL_PREF and AS_PATH to show enterprise policy awareness.
</details>

---

## Question 7: BGP Next Hop - What is next-hop-self and when is it needed?
Study Note: Next-hop issues are common in iBGP deployments and practical troubleshooting rounds.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: In iBGP, learned eBGP routes may carry external next-hop addresses that internal routers cannot reach. The next-hop-self setting on iBGP speakers rewrites next hop to the advertising router, ensuring internal reachability. Without it, routes may appear in BGP table but fail in forwarding path.

Interview Tip: Explain that route learning and next-hop reachability are separate checks.
</details>

---

## Question 8: BGP Policy Control - How do prefix lists and route maps help in enterprise WAN?
Study Note: Interviewers value candidates who can explain controlled route acceptance and advertisement.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Prefix lists filter which prefixes are permitted or denied. Route maps apply policy actions such as setting LOCAL_PREF, MED, communities, or AS path prepending. Together they control inbound and outbound routing behavior and reduce risk from accidental route leaks.

Interview Tip: Describe policy pipeline: match prefixes, then set attributes.
</details>

---

## Question 9: BGP Neighbor Bring-Up - What must match for a BGP session to establish?
Study Note: Session establishment checks are practical interview material for edge routing roles.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Both peers need IP reachability, correct neighbor IP and remote-as configuration, TCP 179 accessibility, and compatible update source settings where loopbacks are used. If using authentication, keys must match. Common checks include show ip bgp summary and transport reachability tests.

Interview Tip: Present in layers: IP path, TCP 179, BGP parameters.
</details>

---

## Question 10: BGP Verification - Which commands should you run first on Cisco?
Study Note: Command fluency is heavily weighted in implementation interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Start with show ip bgp summary for neighbor states and prefixes received. Use show ip bgp for route table and attributes, show ip route bgp for installed routes, and show run | section bgp for policy intent. For session problems, use ping and traceroute to neighbor and validate ACL/firewall path to TCP 179.

Interview Tip: Keep command sequence consistent: neighbors, routes, policy, transport.
</details>

---

## Question 11: VPN Categories - What is the difference between site-to-site and remote-access VPN?
Study Note: VPN type differentiation is common in branch and workforce connectivity interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Site-to-site VPN connects entire networks over untrusted transport using gateways at each side. Remote-access VPN connects individual users to corporate resources securely from external locations. Site-to-site is network-to-network, while remote-access is user-to-network with identity-centric controls.

Interview Tip: Explain from endpoint perspective: branch gateway versus individual user client.
</details>

---

## Question 12: IPsec Basics - What does IPsec provide and which protocols or ports are involved?
Study Note: IPsec details are interview staples for secure WAN and cloud connectivity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: IPsec provides confidentiality, integrity, authentication, and anti-replay protection for IP traffic. IKE negotiation commonly uses UDP 500, and NAT traversal uses UDP 4500. ESP carries encrypted payloads using IP protocol 50, while AH uses protocol 51 but is less common in enterprise deployments.

Interview Tip: Mention UDP 500 and UDP 4500 immediately, then ESP protocol 50.
</details>

---

## Question 13: IKEv1 vs IKEv2 - Why is IKEv2 generally preferred today?
Study Note: Protocol version awareness signals modern implementation readiness.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: IKEv2 offers improved efficiency, reliability, and support for modern authentication and mobility features compared with IKEv1. It simplifies negotiation and is generally easier to scale and troubleshoot in current enterprise environments. Most modern platforms and cloud VPN services recommend IKEv2.

Interview Tip: Keep answer concise: stronger operational behavior and better modern compatibility.
</details>

---

## Question 14: SSL VPN vs IPsec VPN - When might you choose each?
Study Note: This question tests your ability to align security technology with access model and user experience.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: SSL VPN (often TLS based) is common for remote users and browser or client-based access with simpler firewall traversal. IPsec VPN is common for full-tunnel site-to-site or robust remote-access clients requiring broad network reach. Choice depends on application model, endpoint control, and operational policy.

Interview Tip: Tie decision to user type: workforce remote users versus branch gateway links.
</details>

---

## Question 15: GRE over IPsec - Why combine GRE with IPsec?
Study Note: Combined tunneling and encryption patterns often appear in advanced WAN interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: GRE provides multiprotocol encapsulation and supports routing protocol carriage, while IPsec provides encryption and integrity. GRE over IPsec is used when you need dynamic routing across encrypted overlays. The tradeoff is additional overhead and MTU considerations.

Interview Tip: Explain each layer's role separately: GRE for transport flexibility, IPsec for security.
</details>

---

## Question 16: DMVPN Concept - What business and technical problem does DMVPN solve?
Study Note: DMVPN knowledge demonstrates understanding of scalable hub-and-spoke overlay evolution.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: DMVPN uses mGRE, NHRP, and IPsec to build scalable hub-and-spoke overlays with on-demand spoke-to-spoke tunnels. It reduces need for static full-mesh tunnel configuration while maintaining secure transport. It is useful for large branch networks requiring dynamic path flexibility.

Interview Tip: Mention mGRE plus NHRP plus IPsec as the core component trio.
</details>

---

## Question 17: SD-WAN Fundamentals - What is SD-WAN and how is it different from traditional WAN?
Study Note: SD-WAN is a high-priority enterprise interview topic because it changes control and policy models.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: SD-WAN centralizes policy and path control across multiple transports such as MPLS, broadband, and LTE. It separates control and data planes with centralized orchestration and application-aware routing. Unlike static per-device configuration, SD-WAN applies intent-driven policies consistently across sites.

Interview Tip: Explain SD-WAN as centralized policy and transport abstraction, not just a new tunnel type.
</details>

---

## Question 18: SD-WAN Path Selection - How does application-aware routing improve user experience?
Study Note: Interviewers look for practical reasoning on performance and resiliency.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: SD-WAN continuously measures path metrics such as latency, jitter, and loss and steers applications according to SLA policies. Real-time traffic can prefer low-jitter links, while bulk traffic can use lower-cost paths. If quality degrades, traffic can fail over dynamically without manual route changes.

Interview Tip: Map one app to one SLA policy example, such as voice on low-jitter path.
</details>

---

## Question 19: Cloud Integration - How do enterprises connect on-prem networks to public cloud securely?
Study Note: Hybrid cloud networking is now standard interview material for enterprise roles.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Common patterns include IPsec VPN over internet and dedicated private circuits such as AWS Direct Connect or Azure ExpressRoute. BGP is often used for dynamic route exchange across these links. Strong design includes segmentation, route filtering, and redundant paths across zones or regions.

Interview Tip: Mention both quick-start VPN and dedicated circuit options with BGP policy control.
</details>

---

## Question 20: Hybrid WAN Troubleshooting Scenario - Branch users cannot reach SaaS normally but fallback tunnel works. What should you check first?
Study Note: Scenario-based troubleshooting demonstrates production readiness beyond protocol memorization.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: First validate SD-WAN policy and path health metrics for the primary transport, including loss, latency, jitter thresholds, and application classification. Then check BGP route preference and NAT behavior on primary egress path, plus DNS resolution path for SaaS endpoints. Compare with fallback tunnel policy to identify misclassification, degraded underlay, or policy mismatch.

Interview Tip: Present this as control-plane, policy-plane, and data-plane checks in sequence.
</details>

---
