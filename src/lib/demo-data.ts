import type { PortableTextBlock } from "@portabletext/types";
import type { Article } from "./types";

const previewNote =
  "This is a sample story created to preview Low Voltage Canada. It is not published reporting.";

type StorySection = { heading: string; paragraphs: string[] };

function storyBody(
  introduction: string,
  sections: StorySection[],
): PortableTextBlock[] {
  let index = 0;
  const block = (
    text: string,
    style = "normal",
    italic = false,
  ): PortableTextBlock => {
    const key = `preview-block-${index++}`;
    return {
      _type: "block",
      _key: key,
      style,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${key}-span`,
          text,
          marks: italic ? ["em"] : [],
        },
      ],
    };
  };

  return [
    block(previewNote, "normal", true),
    block(introduction),
    ...sections.flatMap(({ heading, paragraphs }) => [
      block(heading, "h2"),
      ...paragraphs.map((paragraph) => block(paragraph)),
    ]),
  ];
}

function photograph(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;
}

export const demoArticles: Article[] = [
  {
    id: "preview-connected-spaces",
    slug: "the-next-chapter-of-canadas-connected-spaces",
    title: "The next chapter of Canada’s connected spaces",
    excerpt:
      "From the first cable to the final experience, a closer look at the technology shaping the places we share.",
    kind: "Insights",
    topic: "Smart Buildings",
    image: photograph("photo-1517935706615-2717063c2225"),
    imageAlt:
      "Toronto skyline with the CN Tower rising above the city's buildings",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T15:00:00.000Z",
    readTime: 5,
    featured: true,
    province: "Ontario",
    isDemo: true,
    body: storyBody(
      "A connected space is more than a collection of devices. It is a place where communication, security, network infrastructure, and building systems work together in ways that people can understand. Low Voltage Canada will explore the decisions behind those experiences, through a Canadian lens.",
      [
        {
          heading: "Start with the space, and the people in it",
          paragraphs: [
            "An office, a campus, and a community facility each ask different things of their technology. Our coverage will look at how project teams define those needs, where different disciplines meet, and how an early design choice can affect daily operations long after installation.",
            "That means examining practical details alongside the larger ideas: a room that is easy to use, an access system that fits a building's routines, or a network that can support an evolving mix of connected equipment. The most useful stories make those connections visible.",
          ],
        },
        {
          heading: "A Canadian conversation",
          paragraphs: [
            "We intend to bring together the perspectives of manufacturers, consultants, integrators, operators, and the people who use the spaces they create. Project context matters, including location, building type, installation constraints, and the expectations of the customer.",
            "Future reporting will ask what was specified, why it was chosen, how it was commissioned, and what the team learned. This preview introduces that editorial direction; real project stories will be researched, attributed, and clearly distinguished from opinion.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-effortless-meeting-room",
    slug: "what-makes-a-meeting-room-feel-effortless",
    title: "What makes a meeting room feel effortless?",
    excerpt:
      "The product questions that matter when cameras, audio, displays, and controls have to work as one.",
    kind: "Products",
    topic: "AV & Collaboration",
    image: photograph("photo-1497366754035-f200968a6e72"),
    imageAlt:
      "A contemporary office corridor lined with glass meeting-room partitions",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T14:00:00.000Z",
    readTime: 4,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "The best meeting-room experience begins before anyone presses Join. A room's layout, acoustics, lighting, connectivity, and controls all influence how people collaborate. Our product coverage will examine equipment in that wider context rather than treating a specification sheet as the whole story.",
      [
        {
          heading: "Ask what the product changes",
          paragraphs: [
            "For a camera, the useful questions include who it can see and how its framing behaves in the intended room. For audio, they include where people sit, how they move, and how background noise affects a conversation. Displays and controls deserve the same attention to actual use.",
            "A product story should also explain what is needed around the device. Network requirements, platform compatibility, mounting options, power, and commissioning can shape whether a proposed solution is a good fit for a project.",
          ],
        },
        {
          heading: "Keep the evaluation transparent",
          paragraphs: [
            "Low Voltage Canada's future coverage will distinguish manufacturer information from firsthand observations. Where we evaluate a product, we will describe the setup, relevant limitations, and the basis for our conclusions.",
            "This sample is an introduction to that approach. It does not review a specific device or announce a launch. The goal is to show how a product-focused story can help a Canadian reader ask better questions before specifying a room.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-workplace-network",
    slug: "the-quiet-infrastructure-behind-a-connected-workplace",
    title: "The quiet infrastructure behind a connected workplace",
    excerpt:
      "Why the conversations about connected buildings should begin with the network beneath them.",
    kind: "Insights",
    topic: "Networking",
    image: photograph("photo-1558494949-ef010cbdcc31"),
    imageAlt: "Rows of illuminated server equipment in a data centre",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T13:00:00.000Z",
    readTime: 4,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "A workplace network supports more than laptops. It can also carry the communications that AV, access control, sensors, and other connected systems depend on. Our networking coverage will explore how those requirements are understood and coordinated across a project.",
      [
        {
          heading: "Make the requirements visible",
          paragraphs: [
            "Useful planning starts with an equipment inventory and a conversation about how each system will be used. Bandwidth, power, addressing, segmentation, and management requirements should be considered with the people responsible for the network.",
            "Physical infrastructure matters too. Equipment locations, cable pathways, rack space, and access for maintenance can affect the installation and its future serviceability. These details give a networking story substance beyond a headline about connectivity.",
          ],
        },
        {
          heading: "Follow the handover",
          paragraphs: [
            "The editorial lens will extend into commissioning and operations: who owns a configuration, how changes are documented, and what information a customer receives at handover. Clear responsibilities can be as valuable as the choice of hardware.",
            "Future stories will use attributed project experience and documented product requirements to explore these themes. This preview illustrates the subject area without making claims about a particular network, provider, or installation.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-thoughtful-integrator",
    slug: "behind-every-smart-space-a-thoughtful-integrator",
    title: "Behind every smart space, a thoughtful integrator",
    excerpt:
      "An editorial look at the craft, coordination, and curiosity behind a well-delivered project.",
    kind: "Integrators",
    topic: "Smart Buildings",
    image: photograph("photo-1519389950473-47ba0277781c"),
    imageAlt:
      "A project team collaborating around laptops and working materials at a table",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T12:00:00.000Z",
    readTime: 5,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "An integrator's work brings plans, equipment, and people into the same conversation. This preview introduces the kind of professional profile Low Voltage Canada will publish: stories that explore how someone thinks through a project, develops their craft, and collaborates with a wider team.",
      [
        {
          heading: "The questions behind the installation",
          paragraphs: [
            "A useful profile might begin with the questions an engineer asks at a site visit. What does the customer need to accomplish? Who will use the system? What constraints are visible now, and which ones need further investigation before design can move forward?",
            "We will seek the person's own account of how they translate those answers into decisions. The interesting detail is often in coordination: working with another trade, adapting a design to a building, or explaining a technical choice to a customer.",
          ],
        },
        {
          heading: "Give the craft room to breathe",
          paragraphs: [
            "Profiles can also explore training, mentoring, documentation, and the habits that help a team deliver consistently. Specific examples, attributed to the people involved, will make those lessons useful to readers across the Canadian industry.",
            "No person, interview, or project is being represented in this sample. It sets out an editorial intention: to make room for the people whose judgment and practical skills connect the technologies we cover.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-access-control",
    slug: "access-control-is-becoming-a-building-wide-conversation",
    title: "Access control is a building-wide conversation",
    excerpt:
      "Looking beyond the reader to the credentials, workflows, and infrastructure around every door.",
    kind: "Products",
    topic: "Security",
    image: photograph("photo-1486406146926-c627a92ad1ab"),
    imageAlt: "Glass office-building facades photographed from street level",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T11:00:00.000Z",
    readTime: 4,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "The experience at a door is shaped by much more than a reader. Credentials, permissions, operating procedures, and the building's infrastructure all influence how an access-control system is used. Our security coverage will look at those relationships alongside individual products.",
      [
        {
          heading: "Understand the everyday workflow",
          paragraphs: [
            "Who issues a credential, changes a permission, or helps a visitor? How are staff changes handled? These are useful starting questions because the people administering a system need an approach that fits their responsibilities and routines.",
            "Product stories will examine documented compatibility and deployment requirements, including power, communications, and integration interfaces. Where a feature depends on another service or component, readers should be able to understand that dependency.",
          ],
        },
        {
          heading: "Connect specification to operations",
          paragraphs: [
            "Future reporting will seek input from qualified practitioners on commissioning, maintenance, and handover. The aim is to describe the choices and tradeoffs a project team considers, with enough context for readers to interpret them responsibly.",
            "This is an editorial preview, not a product recommendation or a statement about a particular building's security. Any future coverage of a real product will identify its sources and distinguish reported information from evaluation.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-industry-event",
    slug: "a-better-way-to-navigate-your-next-industry-event",
    title: "A better way to navigate your next industry event",
    excerpt:
      "A practical guide to making room for demonstrations, technical questions, and useful conversations.",
    kind: "Events",
    topic: "AV & Collaboration",
    image: photograph("photo-1505373877841-8d25f7d46678"),
    imageAlt:
      "A presentation screen and seating inside an industry event venue",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T10:00:00.000Z",
    readTime: 3,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "An industry event can put a great deal of information into a short day. A little preparation helps turn that information into something useful. Low Voltage Canada's event coverage will aim to help readers understand an event's focus and identify the conversations most relevant to their work.",
      [
        {
          heading: "Arrive with a short list of questions",
          paragraphs: [
            "Consider the projects or technical challenges you are currently working through. A focused list can make a demonstration more useful: ask how a product is configured, what it requires around it, and where the presenter sees limitations in its intended application.",
            "Leave space for discussion with peers as well as exhibitors. A conversation about installation experience or a difficult handover may prompt a question you had not considered when planning your day.",
          ],
        },
        {
          heading: "Turn notes into follow-up",
          paragraphs: [
            "After the event, separate an interesting idea from a verified requirement. Collect relevant documentation and follow up with the right technical contact before applying something new to a specification or project.",
            "This sample does not announce an event or provide dates, venues, or registration details. Future event listings will link to the organiser's information so readers can confirm those details before making plans.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-project-partner",
    slug: "from-product-catalogue-to-project-partner",
    title: "From product catalogue to project partner",
    excerpt:
      "The questions that reveal how a technology company supports the work around its products.",
    kind: "Companies",
    topic: "Networking",
    image: photograph("photo-1497366811353-6870744d04b2"),
    imageAlt: "Open modern office with tables, seating, and large windows",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T09:00:00.000Z",
    readTime: 4,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "A technology company's role in a project can extend beyond the product itself. Documentation, technical support, training, and channel relationships shape how that product reaches an installation. Company coverage at Low Voltage Canada will explore those parts of the story with the same care as the headline.",
      [
        {
          heading: "Look at the support around the technology",
          paragraphs: [
            "A useful company profile can explain how a team supports a design question, provides application information, or helps an integrator work through commissioning. Concrete, attributed examples will help readers understand what a company does and how it works with others.",
            "We will also ask how information reaches Canadian customers. Availability, distribution, service arrangements, and training should be verified with the relevant sources rather than assumed from a global product announcement.",
          ],
        },
        {
          heading: "Keep the reader's perspective",
          paragraphs: [
            "The editorial goal is to give context for business developments and company news: why an announcement matters, who it affects, and which details remain to be confirmed. A clear separation between editorial coverage and commercial content is part of that goal.",
            "No company announcement or business change is being reported here. This illustrative story describes the questions future reporting will use to connect industry news with the practical concerns of our readers.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-engineering-curiosity",
    slug: "the-people-turning-curiosity-into-better-projects",
    title: "The people turning curiosity into better projects",
    excerpt:
      "Why listening, teaching, and asking the next question belong in the industry's spotlight.",
    kind: "People",
    topic: "AV & Collaboration",
    image: photograph("photo-1522071820081-009f0129c71c"),
    imageAlt: "Colleagues discussing ideas together at an office meeting table",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T08:00:00.000Z",
    readTime: 4,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "Technical industries are also people industries. Every design review, installation, and support conversation relies on someone understanding a problem and sharing what they know. Low Voltage Canada's people coverage will make those experiences part of the wider industry conversation.",
      [
        {
          heading: "Ask about the path, not just the title",
          paragraphs: [
            "A profile might explore how a professional entered the industry, which experiences shaped their approach, and what they wish they had known earlier. An engineer's perspective can be especially useful when it connects a design decision to the people who will use or maintain the result.",
            "The strongest insights will come from specific examples in a person's own words. We will seek informed views on collaboration, learning, and the practical choices that make a project work, while keeping interviews clearly attributed.",
          ],
        },
        {
          heading: "Make room for the next generation",
          paragraphs: [
            "Coverage can also explore mentoring and the exchange of knowledge between experienced practitioners and people beginning their careers. Readers should come away with a clearer sense of the work and the range of skills it calls for.",
            "This preview does not depict an interview with the people in its stock photograph. It is a sample of our intended editorial scope; published profiles will identify the individual and the basis of the reporting.",
          ],
        },
      ],
    ),
  },
  {
    id: "preview-building-handover",
    slug: "what-a-connected-building-needs-after-handover",
    title: "What a connected building needs after handover",
    excerpt:
      "Documentation, ownership, and the everyday details that keep a smart space understandable.",
    kind: "Insights",
    topic: "Smart Buildings",
    image: photograph("photo-1454165804606-c3d57bc86b40"),
    imageAlt: "People reviewing project documents and charts at a desk",
    author: "LVC Editorial",
    publishedAt: "2026-10-08T07:00:00.000Z",
    readTime: 4,
    featured: false,
    province: "Canada",
    isDemo: true,
    body: storyBody(
      "Handover is a transition between the team delivering a system and the people living with it. In a connected building, that transition may cross several technical disciplines. Our coverage will follow the story beyond installation to explore how systems become part of everyday operations.",
      [
        {
          heading: "Make ownership clear",
          paragraphs: [
            "Operators need to understand which systems they manage, where relevant information lives, and who to contact when an issue crosses boundaries. A documented division of responsibilities can help the right people participate in changes and troubleshooting.",
            "Training is part of that conversation. A useful handover considers the tasks different users need to perform and gives them information they can revisit. The details will vary with the system, the building, and the customer's operating model.",
          ],
        },
        {
          heading: "Keep learning from the space",
          paragraphs: [
            "Future project stories will ask what teams learn after a space opens and how they use that experience in later work. Feedback from operators and occupants can add valuable context to a discussion of equipment and design.",
            "This sample illustrates an editorial theme without evaluating a real building or its performance. Published case studies will identify their sources, explain their scope, and distinguish observations from broader conclusions.",
          ],
        },
      ],
    ),
  },
];
