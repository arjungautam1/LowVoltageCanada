import type { TopicName } from "@/lib/types";

export interface TopicContent {
  name: TopicName;
  slug: string;
  title: string;
  description: string;
  introduction: string;
  scope: string;
  perspective: string;
}

export const topicContent: TopicContent[] = [
  {
    name: "AV & Collaboration",
    slug: "av-collaboration",
    title: "AV & Collaboration News in Canada",
    description:
      "Explore AV and collaboration news in Canada: professional audio, video, meeting technology, manufacturers, integrators, people, and industry events.",
    introduction:
      "Professional audiovisual technology brings sound, images, and communication into shared spaces. This sector connects meeting rooms and classrooms with venues, public spaces, and workplaces. Low Voltage Canada brings a Canadian perspective to the products, companies, and people working across AV and collaboration.",
    scope:
      "Our AV coverage spans professional audio, displays, video distribution, conferencing, digital signage, and system control. Collaboration connects these systems with the tools people use to meet, present, teach, and work together. Explore product announcements, company news, integrator stories, individual perspectives, and industry events as they are published.",
    perspective:
      "For Canadian integrators, consultants, manufacturers, distributors, and technology teams, an AV story can involve both equipment and the spaces where it is used. This collection brings those subjects together, with links to related networking, security, and smart building coverage where the sectors meet.",
  },
  {
    name: "Security",
    slug: "security",
    title: "Security Industry News in Canada",
    description:
      "Follow Canadian electronic security news covering access control, video surveillance, intrusion systems, manufacturers, integrators, people, and events.",
    introduction:
      "Electronic security brings together systems used to monitor spaces, manage access, and detect intrusions. Cameras, access control equipment, sensors, and software form part of this sector. Low Voltage Canada focuses on the technology and the people behind electronic security, with a Canadian industry perspective.",
    scope:
      "This collection covers access control, video surveillance, intrusion detection, and the software and infrastructure that connect security systems. Its editorial scope includes product news, manufacturers and distributors, integrator projects, industry people, and events. Published stories appear below as our coverage develops.",
    perspective:
      "Security systems sit within a wider connected environment. Networking supports communication between devices, while building systems and AV can share the same spaces. Our Canadian coverage provides a place to follow these subjects across manufacturers, integrators, consultants, and the teams responsible for facilities.",
  },
  {
    name: "Networking",
    slug: "networking",
    title: "Networking Industry News in Canada",
    description:
      "Explore networking news in Canada: structured cabling, switching, wireless, connectivity, infrastructure, manufacturers, integrators, people, and events.",
    introduction:
      "Networks connect the devices, systems, and people inside modern spaces. Structured cabling, switching, wireless connectivity, and supporting infrastructure form the foundation for many low voltage installations. Low Voltage Canada follows this sector through the products, organizations, and people serving Canada's connected industry.",
    scope:
      "Our networking scope includes structured cabling, fibre, switches, wireless networks, and connectivity infrastructure. These subjects support workplaces and buildings as well as connected AV, electronic security, and building systems. This collection brings together relevant product announcements, company developments, integrator stories, perspectives, and events.",
    perspective:
      "Canadian networking stories can involve equipment manufacturers, distributors, cabling specialists, integrators, consultants, and technology teams. We bring their subjects into one publication, alongside coverage of the systems that depend on network connections. Browse the published stories below or explore a related sector.",
  },
  {
    name: "Smart Buildings",
    slug: "smart-buildings",
    title: "Smart Building News in Canada",
    description:
      "Explore Canadian smart building news covering connected spaces, automation, sensors, building systems, companies, integrators, people, and industry events.",
    introduction:
      "Smart buildings bring connected technology into the operation and use of physical spaces. Sensors, automation, controls, and software connect building systems with the people who manage them. Low Voltage Canada explores the products, organizations, and industry perspectives behind these connected environments in Canada.",
    scope:
      "This collection covers building automation, connected sensors, controls, system integration, and the infrastructure that links them. Its scope includes products, companies, integrators, people, and events across the built environment. Published coverage can also connect with AV, electronic security, and networking where these systems share a space.",
    perspective:
      "For Canadian integrators, consultants, manufacturers, building operators, and technology teams, connected buildings involve several disciplines. This collection offers a place to explore those subjects within the wider low voltage industry. Follow the stories below and use the related sector links to continue reading.",
  },
];

export function getTopicContent(slug: string): TopicContent | undefined {
  return topicContent.find((topic) => topic.slug === slug);
}
