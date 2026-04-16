## Question 1: IPv4 Basics - What are the components of an IPv4 address?
Study Note: You need precise IPv4 language in interviews because most enterprise networks still rely heavily on IPv4 addressing plans.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: An IPv4 address is 32 bits, written as four octets in dotted decimal format, for example 192.168.10.25. It has a network portion and a host portion, defined by the subnet mask or prefix length. Routers forward based on the network prefix, while hosts identify endpoints inside that subnet using the host bits.

Interview Tip: Start with "32 bits, 4 octets," then explain network vs host bits with one example.
</details>

---

## Question 2: Subnet Masks - How does a subnet mask determine network boundaries?
Study Note: Subnet mask understanding is the core of route lookup, host communication scope, and interview subnetting exercises.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A subnet mask marks network bits as 1 and host bits as 0. For example, 255.255.255.0 means /24, so the first 24 bits are network and the last 8 bits are host. Hosts in the same network can communicate directly at Layer 2; traffic to other networks is sent to the default gateway. Incorrect masks can cause local delivery attempts for remote networks or unnecessary gateway usage.

Interview Tip: Use one quick example: "10.1.1.10/24 is in network 10.1.1.0."
</details>

---

## Question 3: CIDR Notation - How do you convert between /prefix and dotted masks?
Study Note: Interviewers test this because CIDR notation appears in route tables, ACL objects, cloud subnets, and firewall rules.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: CIDR /n means n leading 1s in the subnet mask. Common conversions include /24 = 255.255.255.0, /25 = 255.255.255.128, /26 = 255.255.255.192, /27 = 255.255.255.224, /28 = 255.255.255.240, /30 = 255.255.255.252. To convert manually, count full octets of 8 bits, then calculate partial octet values using powers of two.

Interview Tip: Memorize /24 through /30 cold. It speeds up whiteboard subnetting dramatically.
</details>

---

## Question 4: Network Math - How do you find network and broadcast addresses for 192.168.50.130/26?
Study Note: Fast network and broadcast identification is expected for routing, ACL design, and troubleshooting host reachability.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: /26 means block size 64 in the last octet (0, 64, 128, 192). Address 192.168.50.130 falls in the 128-191 block. So network address is 192.168.50.128, broadcast address is 192.168.50.191, and usable hosts are 192.168.50.129 to 192.168.50.190.

Interview Tip: Say "block size method" and show the ranges quickly. That demonstrates production-ready subnetting speed.
</details>

---

## Question 5: RFC1918 - What are private IPv4 ranges and why are they used?
Study Note: Private addressing is a fundamental enterprise design concept tied directly to NAT, segmentation, and address conservation.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: RFC1918 private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These addresses are not routable on the public internet and are used inside organizations. Internet access from private hosts typically requires NAT or PAT at the edge firewall or router.

Interview Tip: Mention all three ranges from memory and add one practical use case like branch office LANs.
</details>

---

## Question 6: Public vs Private - What is the practical difference in enterprise networks?
Study Note: Interviewers look for operational understanding, not definitions, especially around internet reachability and security boundaries.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Public IP addresses are globally unique and internet routable. Private IP addresses are internally scoped and require translation for internet connectivity. Enterprises often use private addressing for endpoints and reserve public addresses for edge interfaces, public services, or load balancers. This design reduces public IP consumption and improves internal architecture flexibility.

Interview Tip: Frame your answer as "inside addressing strategy plus edge translation strategy."
</details>

---

## Question 7: APIPA - What does a 169.254.x.x address indicate?
Study Note: APIPA diagnosis is a common support and interview scenario that quickly reveals DHCP troubleshooting maturity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: 169.254.0.0/16 is link-local IPv4 (APIPA) assigned automatically when a host cannot reach a DHCP server and no static IP is configured. It allows limited local subnet communication but usually indicates DHCP failure in managed networks. Troubleshoot by checking VLAN assignment, DHCP scope availability, relay configuration, and uplink path to DHCP server.

Interview Tip: State that APIPA is a symptom, not the root cause, then list likely DHCP path checks.
</details>

---

## Question 8: Default Gateway - Why is the default gateway essential?
Study Note: Gateway behavior is central to Layer 3 forwarding and one of the first checks in any connectivity issue.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: The default gateway is the Layer 3 next hop a host uses for destinations outside its local subnet. If gateway IP is wrong, unreachable, or in a different subnet, off-subnet traffic fails while same-subnet traffic may still work. On endpoints, verify with ipconfig or ip route. On network devices, validate SVI and routing with show ip interface brief and show ip route.

Interview Tip: Use the phrase "same subnet direct, different subnet via gateway" to keep your explanation crisp.
</details>

---

## Question 9: Subnetting Speed - What is a quick method to calculate hosts per subnet?
Study Note: Quick host calculations are heavily tested in CCNA style interviews and practical screening rounds.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Hosts per subnet in IPv4 are calculated as 2^(host bits) - 2 for traditional subnets (excluding network and broadcast). For example, /27 leaves 5 host bits, so 2^5 - 2 = 30 usable hosts. /30 gives 2 usable hosts, often used on point-to-point links. For /31 links on modern routers, both addresses can be used for point-to-point per RFC 3021.

Interview Tip: Explain both formula and one exception like /31 to show depth.
</details>

---

## Question 10: VLSM Purpose - Why is VLSM better than fixed-length subnetting in enterprise design?
Study Note: VLSM demonstrates that you can optimize address utilization across different-sized segments.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Variable Length Subnet Masking allows different prefix lengths within the same major network block, matching subnet size to actual host needs. This reduces waste compared with fixed-length subnetting. For example, a user VLAN may need /24, a server segment /27, and WAN links /30 or /31. VLSM requires classless routing support and careful planning to avoid overlaps.

Interview Tip: Mention "efficiency plus scalability" and provide a simple multi-subnet example.
</details>

---

## Question 11: VLSM Design - How would you subnet 10.10.0.0/24 for 100, 50, and 20-host networks?
Study Note: This is a classic interview task that tests planning order and allocation logic, not just math.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Allocate largest first. 100 hosts needs /25 (126 usable): 10.10.0.0/25. 50 hosts needs /26 (62 usable): 10.10.0.128/26. 20 hosts needs /27 (30 usable): 10.10.0.192/27. Remaining addresses 10.10.0.224/27 can be reserved for growth. This avoids fragmentation and preserves contiguous blocks.

Interview Tip: Always say "largest-to-smallest allocation" before doing calculations.
</details>

---

## Question 12: Route Summarization - What is supernetting and why does it matter?
Study Note: Summarization reduces routing table size and instability propagation, which are key enterprise and service provider concerns.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Supernetting combines multiple contiguous networks into a shorter prefix summary route. Example: 192.168.0.0/24 through 192.168.3.0/24 can be summarized as 192.168.0.0/22. Benefits include smaller route tables, faster convergence behavior, and reduced update overhead. Summaries must align on binary boundaries and represent only valid contiguous blocks.

Interview Tip: Explain one exact summary example and why it improves scalability.
</details>

---

## Question 13: IPv6 Structure - How is an IPv6 address represented and compressed?
Study Note: IPv6 is increasingly required in modern enterprise and cloud environments, and representation mistakes are common in interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: IPv6 is 128 bits, written as eight 16-bit hexadecimal blocks, for example 2001:0db8:0000:0000:02aa:00ff:fe9a:4ca2. Leading zeros in each block can be omitted, and one consecutive run of all-zero blocks can be replaced with :: once per address. So the example can become 2001:db8::2aa:ff:fe9a:4ca2.

Interview Tip: Show one expansion and one compression example to prove comfort with notation.
</details>

---

## Question 14: IPv6 Address Types - What are global unicast, link-local, and unique local addresses?
Study Note: Correct IPv6 type identification is essential for neighbor discovery, routing scope, and management reachability.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Global unicast addresses are internet-routable and generally fall under 2000::/3. Link-local addresses are FE80::/10 and exist on every IPv6 interface for local-link communication and next-hop operations. Unique local addresses are FC00::/7 (commonly FD00::/8 in practice) and are private-like internal addresses. IPv6 also uses multicast extensively, for example FF02::1 for all nodes on the local link.

Interview Tip: Emphasize scope: global, local-link, internal-only.
</details>

---

## Question 15: SLAAC vs DHCPv6 - How do hosts get IPv6 addresses?
Study Note: Address assignment behavior in IPv6 is frequently tested because operational models differ from IPv4 DHCP-only expectations.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Hosts can use SLAAC based on Router Advertisements (ICMPv6) to generate interface addresses from advertised prefixes, typically /64. DHCPv6 can provide stateful assignment and options like DNS settings, depending on RA flags (M and O bits). Many environments use a hybrid model: SLAAC for address plus DHCPv6 for additional options. Core protocols include ICMPv6 Neighbor Discovery rather than ARP.

Interview Tip: Mention RA flags and the hybrid pattern, it sounds practical and current.
</details>

---

## Question 16: EUI-64 and Privacy - How is the interface ID formed, and why use privacy addresses?
Study Note: Interviewers use this to test whether you understand IPv6 addressing behavior and endpoint privacy implications.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: With EUI-64, the host interface ID is derived from the 48-bit MAC by inserting FFFE in the middle and flipping the universal/local bit. This can expose hardware identity patterns, so modern systems often use temporary privacy addresses (RFC 4941) for outbound connections. Stable addresses may still be retained for inbound management or policy consistency.

Interview Tip: Explain EUI-64 quickly, then highlight privacy addresses as the security-aware improvement.
</details>

---

## Question 17: IPv6 Subnetting - Why is /64 commonly used, and can you use other prefix lengths?
Study Note: Prefix-length decisions affect interoperability with SLAAC and operational consistency across enterprise segments.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: /64 is the standard subnet size for most IPv6 LANs because SLAAC expects a 64-bit interface ID boundary. Shorter or longer prefixes are possible in special cases, but deviating from /64 on user LANs can break expected behavior. Point-to-point links may use /127 in some designs to reduce certain neighbor-related issues. Enterprises usually allocate larger blocks per site, then standardize /64 per VLAN.

Interview Tip: Say "standardize /64 for LAN consistency" and mention /127 only as a targeted design choice.
</details>

---

## Question 18: Transition Strategies - Compare dual-stack, tunneling, and translation approaches.
Study Note: Migration strategy questions assess architecture awareness and real-world deployment thinking.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Dual-stack runs IPv4 and IPv6 simultaneously, providing maximum compatibility but operational complexity. Tunneling (for example GRE or 6in4 variants) encapsulates one protocol over another where native support is missing. Translation methods like NAT64 and DNS64 allow IPv6-only clients to reach IPv4 services. Most enterprises prefer phased dual-stack with selective translation at boundaries.

Interview Tip: State that dual-stack is operationally common, then explain when translation is required.
</details>

---

## Question 19: IP Troubleshooting - How do you isolate wrong mask, wrong gateway, and duplicate IP issues?
Study Note: Structured troubleshooting answers are scored highly because they map directly to incident response performance.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Start by validating local interface config with ipconfig /all (Windows) or ip a and ip route (Linux). Check subnet mask and whether gateway is in the same subnet. Test path in sequence: ping self, ping gateway, ping remote IP, then test DNS name resolution. For duplicate IP, review ARP behavior (arp -a), look for MAC flapping or gateway ARP instability, and verify DHCP reservation conflicts.

Interview Tip: Present checks in fixed order and say what each result means before moving to the next test.
</details>

---

## Question 20: Scenario Drill - A host 172.16.34.77/20 cannot reach 172.16.48.10. What should you check first?
Study Note: Scenario framing demonstrates whether you can convert subnet theory into immediate operational decisions.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: /20 corresponds to mask 255.255.240.0, so subnets increment by 16 in the third octet. Host 172.16.34.77 belongs to 172.16.32.0/20 (range 172.16.32.0-172.16.47.255). Destination 172.16.48.10 is in a different subnet (172.16.48.0/20), so traffic must go via default gateway. First checks: correct gateway config on source host, gateway reachability, and route presence on upstream router for 172.16.48.0/20.

Interview Tip: Verbally compute the /20 boundary before troubleshooting steps, it signals confident subnet logic.
</details>

---
