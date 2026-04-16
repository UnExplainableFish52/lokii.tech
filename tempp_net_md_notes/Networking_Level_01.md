## Question 1: OSI Model - Why does the OSI model still matter in modern networks?
Study Note: The OSI model gives interview-ready language for fault isolation. It helps you map symptoms to the right layer before touching production devices.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: The OSI model is a conceptual framework with 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Even though real stacks often follow TCP/IP, OSI is essential for structured troubleshooting. For example, no link light indicates Layer 1, MAC table issues indicate Layer 2, missing routes indicate Layer 3, and failed TCP three-way handshake indicates Layer 4. Cisco troubleshooting workflows often start by identifying the failing layer and validating with commands like show interfaces, show mac address-table, and show ip route.

Interview Tip: Explain that OSI is a diagnostic map, not just theory. Give one practical example from each of the first four layers.
</details>

---

## Question 2: Protocol Data Units - What is the difference between a frame, packet, and segment?
Study Note: Correct PDU terminology shows precision. Interviewers use this to gauge whether you can communicate clearly with operations and engineering teams.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A segment is the Layer 4 PDU for TCP (UDP uses datagram), a packet is the Layer 3 PDU (IP header plus payload), and a frame is the Layer 2 PDU (Ethernet header/trailer plus Layer 3 packet). As data moves down the stack, each layer encapsulates data with its own header; at the receiver, decapsulation happens in reverse. On Ethernet, the frame includes source and destination MAC addresses and FCS for error detection.

Interview Tip: Draw encapsulation quickly on paper. Interviewers value candidates who can explain the data path cleanly.
</details>

---

## Question 3: Layer Mapping - Which devices typically operate at Layers 1, 2, and 3?
Study Note: Device-to-layer mapping is core for role-based interviews, especially when discussing where to enforce policy or isolate faults.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Layer 1 includes hubs and media repeaters. Layer 2 includes switches and bridges that forward based on MAC addresses and VLAN tags (802.1Q). Layer 3 includes routers and Layer 3 switches that forward based on IP prefixes and routing tables. Modern firewalls can operate across Layers 3-7, but routing decision logic itself is Layer 3.

Interview Tip: Mention that multilayer devices can work across layers, but forwarding decisions still map to specific headers.
</details>

---

## Question 4: TCP vs UDP - When do you choose TCP over UDP, and vice versa?
Study Note: This question tests whether you can align protocol behavior with application requirements like reliability, latency, and ordering.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: TCP is connection-oriented and provides reliability, sequencing, acknowledgments, retransmission, and flow control. It suits applications like HTTP/HTTPS (ports 80/443), SSH (22), and SMTP (25). UDP is connectionless with low overhead and no guaranteed delivery, so it suits real-time or lightweight traffic such as DNS queries (53), DHCP (67/68), and voice/video streams. The choice depends on whether the application prefers reliability or minimal latency and overhead.

Interview Tip: State the tradeoff first: reliability vs speed. Then give two concrete protocol examples for each.
</details>

---

## Question 5: TCP Handshake - What happens during the TCP three-way handshake?
Study Note: Handshake knowledge is foundational for analyzing connection failures in packet captures and firewall logs.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Step 1: client sends SYN with an initial sequence number. Step 2: server replies SYN-ACK with its own sequence number and acknowledgment of client SYN. Step 3: client sends ACK, establishing the session. This process negotiates sequence tracking and confirms bidirectional reachability before application data transfer. If SYNs are sent repeatedly with no SYN-ACK, investigate ACLs, firewalls, routing, or server availability.

Interview Tip: Use directional language: client to server, server to client, client to server. It makes your explanation sound operationally mature.
</details>

---

## Question 6: MTU and Fragmentation - Why does MTU matter for performance and troubleshooting?
Study Note: MTU mismatches are common in enterprise and VPN environments, and they create subtle outages that look like random application failures.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: MTU defines the maximum Layer 3 packet size carried without fragmentation. Standard Ethernet MTU is typically 1500 bytes. If packets exceed path MTU and DF (Don't Fragment) is set, devices drop the packet and may send ICMP "Fragmentation Needed". PMTUD relies on these ICMP messages. In tunnel or VPN environments, overhead can reduce effective MTU, requiring MSS clamping or MTU tuning. On Cisco interfaces, you can verify with show interface and adjust with mtu or ip tcp adjust-mss where appropriate.

Interview Tip: Mention that blocked ICMP can break PMTUD, leading to "small packets work, large packets fail" symptoms.
</details>

---

## Question 7: Ethernet Cabling - Compare Cat5e, Cat6, and Cat6a for enterprise use.
Study Note: Cabling decisions impact bandwidth ceilings, distance limits, and future-proofing, all of which are relevant in deployment interviews.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Cat5e supports up to 1 Gbps at 100 meters and can sometimes support 2.5/5G in certain conditions. Cat6 supports 1 Gbps at 100 meters and up to 10 Gbps at shorter distances (commonly up to 55 meters depending on environment). Cat6a is designed for 10 Gbps up to 100 meters with better alien crosstalk performance. For new enterprise horizontal runs targeting 10G readiness, Cat6a is usually preferred.

Interview Tip: Tie cable type to use case and budget, not just raw speed specs.
</details>

---

## Question 8: Fiber Basics - When should you use single-mode versus multi-mode fiber?
Study Note: Fiber type selection is a common design interview topic, especially for campus and data center interconnect scenarios.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Single-mode fiber (SMF) has a small core (about 9 microns), uses laser optics, and is ideal for long-distance links, often kilometers to tens of kilometers. Multi-mode fiber (MMF), usually OM3/OM4/OM5, has larger cores (50 or 62.5 microns), uses VCSEL optics, and is common for shorter data center or building links. SMF optics are typically costlier but scale better over distance.

Interview Tip: State distance first, then optics type. This mirrors real design decision flow.
</details>

---

## Question 9: Duplex and Speed - What issues appear with duplex mismatches?
Study Note: Duplex mismatches create classic intermittent performance degradation cases that interviewers expect you to identify quickly.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Duplex mismatch occurs when one side uses full duplex and the other side uses half duplex. Symptoms include low throughput, high late collisions/FCS errors, and poor application performance despite link up status. Auto-negotiation should usually be enabled on both sides unless a strict design standard says otherwise. Validate on Cisco with show interfaces and check input errors, CRC, collisions, and duplex/speed status.

Interview Tip: Emphasize that "link up" does not mean "healthy link." Mention error counters explicitly.
</details>

---

## Question 10: Network Topologies - What are the strengths and weaknesses of star, mesh, and bus topologies?
Study Note: Topology questions test your ability to connect design choices to resilience, cost, and operational complexity.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Star topology is simple and common in LANs, with centralized control but potential central-point dependency. Full mesh provides high redundancy and path diversity but is expensive and complex to scale. Bus topology is low-cost and simple historically, but poor fault tolerance and scalability make it rare in modern enterprise LANs. Most real networks use hybrid topologies combining hierarchical star with partial mesh uplinks.

Interview Tip: Give one sentence per topology and finish with why hybrid designs are used in practice.
</details>

---

## Question 11: Collision and Broadcast Domains - How do switches and routers affect each domain?
Study Note: Understanding traffic domains is key to segmentation, security boundaries, and performance tuning.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A switch creates separate collision domains per port, reducing collisions compared with hub-based designs. By default, a VLAN on a switch is one broadcast domain. Routers and Layer 3 interfaces break broadcast domains, because Layer 3 forwarding does not propagate Layer 2 broadcasts across interfaces. VLANs plus routing provide scalable segmentation in enterprise networks.

Interview Tip: Keep it crisp: switch separates collisions, router separates broadcasts.
</details>

---

## Question 12: ARP Fundamentals - Why is ARP critical in IPv4 Ethernet networks?
Study Note: ARP is often the missing link between "IP connectivity should work" and "frames are not forwarding correctly." 

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: ARP resolves IPv4 addresses to MAC addresses so hosts can build Ethernet frames for local delivery. If a destination is local subnet, host ARPs for target IP; if remote, host ARPs for default gateway IP. ARP entries are cached temporarily. Problems like stale ARP, spoofing, or duplicate IPs can cause intermittent or misdirected traffic. Verification commands include arp -a on endpoints and show ip arp on Cisco devices.

Interview Tip: Mention local-destination ARP versus default-gateway ARP to show practical understanding.
</details>

---

## Question 13: MAC Address Learning - How does a switch learn and forward frames?
Study Note: Interviewers ask this to verify you understand deterministic Layer 2 forwarding and unknown unicast behavior.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: A switch learns source MAC addresses by examining incoming frames and mapping source MAC to ingress port in the CAM table. For known destination MACs, it forwards only out the mapped port. For unknown unicast destinations, it floods within the VLAN except ingress port. Broadcast and multicast handling also depends on VLAN scope and control features like IGMP snooping for multicast optimization.

Interview Tip: Use a quick "learn, look up, forward or flood" sequence. It is easy for interviewers to follow.
</details>

---

## Question 14: Error Detection - What does the Ethernet FCS do, and what does it not do?
Study Note: Candidates often confuse detection with correction. Clear distinction reflects strong protocol-level understanding.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Ethernet Frame Check Sequence (FCS), based on CRC, detects corruption in transmitted frames. The receiver recalculates CRC and compares it to the FCS value. If mismatch occurs, frame is discarded. FCS detects errors, but it does not correct them. Recovery is handled by higher-layer mechanisms, such as TCP retransmission.

Interview Tip: Say "detect, discard, recover at higher layer" in that exact order.
</details>

---

## Question 15: Physical Layer Signals - Why is attenuation important in copper and fiber links?
Study Note: Signal integrity knowledge differentiates candidates who can troubleshoot physical instability, not just logical configuration issues.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Attenuation is signal loss over distance and media characteristics. On copper, attenuation increases with frequency and cable quality issues; on fiber, attenuation depends on wavelength, connector quality, and splice loss. Excessive attenuation can cause bit errors, retransmissions, and flapping links. Validation may include interface optical power readings (on supported transceivers), error counters, and certification testing for structured cabling.

Interview Tip: Connect attenuation to business impact: intermittent links and unstable applications.
</details>

---

## Question 16: Common Ports - Which ports should you know cold for entry networking interviews?
Study Note: Fast recall of common ports signals operational readiness for troubleshooting and firewall conversations.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Key ports include SSH 22, Telnet 23, DNS 53 (TCP/UDP), DHCP 67/68 (UDP), HTTP 80, HTTPS 443, FTP 20/21, TFTP 69 (UDP), SNMP 161/162 (UDP), NTP 123 (UDP), SMTP 25, POP3 110, IMAP 143, RDP 3389. You should also understand when protocols can use both TCP and UDP, such as DNS.

Interview Tip: Group ports by function (management, web, infrastructure, email) instead of listing randomly.
</details>

---

## Question 17: Latency, Jitter, and Loss - How do these metrics affect application behavior?
Study Note: Modern roles require translating network metrics into user experience and service quality outcomes.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Latency is one-way or round-trip delay; high latency impacts interactive apps and transaction response times. Jitter is variation in delay; it degrades real-time audio/video quality. Packet loss forces retransmissions for TCP and can directly degrade UDP streams. Baseline thresholds vary by application, but voice traffic is especially sensitive to jitter and loss. Tools like ping, traceroute, and interface counters help isolate where impairment starts.

Interview Tip: Tie each metric to one app type, for example VoIP for jitter and web transactions for latency.
</details>

---

## Question 18: Throughput vs Bandwidth - Why are they not the same thing?
Study Note: This distinction is central when explaining why a 1 Gbps link does not deliver 1 Gbps of application data.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Bandwidth is theoretical link capacity, while throughput is actual delivered data rate after protocol overhead, contention, latency effects, and device limitations. For example, Ethernet, IP, and TCP headers consume bytes, and retransmissions reduce effective throughput further. Good performance tuning focuses on bottlenecks, error rates, duplex consistency, and end-to-end path behavior, not only link speed.

Interview Tip: Give a practical number example: "1 Gbps link, but 930 Mbps real throughput under ideal conditions."
</details>

---

## Question 19: Baseline Troubleshooting - What is a practical first-response workflow for a link-down incident?
Study Note: Interviewers want a repeatable process, not random commands. Methodical response reduces MTTR in real operations.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Start with Layer 1 checks: cable seated, link LEDs, transceiver compatibility, interface admin state. Then verify Layer 2 status and errors (show interfaces status, show interfaces counters). Next confirm Layer 3 addressing and gateway (ipconfig/ifconfig, show ip interface brief). Finally test reachability in scope order: local gateway, remote subnet, then application endpoint. Document findings and changes for handoff and incident tracking.

Interview Tip: Present this as a top-down checklist. It demonstrates composure under pressure.
</details>

---

## Question 20: Network Documentation - Why are diagrams and interface descriptions interview-worthy topics?
Study Note: Strong documentation habits are a professional multiplier, especially in handoffs, audits, and outage response.

<details>
<summary>Click to reveal Answer & Preparation Guide</summary>

Technical Answer: Accurate diagrams and interface descriptions reduce troubleshooting time, prevent mispatching, and support safer change execution. At minimum, document device names, management IPs, uplinks, VLAN intent, and circuit/provider references. On Cisco devices, interface descriptions can be configured directly with description under each interface. Good documentation also supports root cause analysis and compliance requirements.

Interview Tip: Mention that "if it is not documented, it is not operationally complete." Interviewers value this mindset.
</details>

---
