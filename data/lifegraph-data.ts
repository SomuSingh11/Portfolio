import { ClusterSeed, Entry, HighlightSeed } from "@/types/life-graph";

export const clusterSeeds: ClusterSeed[] = [
  { id: "work", label: "work", color: "#4FA8A0", count: 38, photo: "https://picsum.photos/seed/lg-work/160" },
  { id: "learning", label: "learning", color: "#D9A441", count: 29, photo: "https://picsum.photos/seed/lg-learning/160" },
  { id: "reading", label: "reading", color: "#8FA876", count: 21, photo: "https://picsum.photos/seed/lg-reading/160" },
  { id: "photography", label: "photography", color: "#9C87C9", count: 17, photo: "https://picsum.photos/seed/lg-photo/160" },
  { id: "reflection", label: "reflection", color: "#C97064", count: 24, photo: "https://picsum.photos/seed/lg-reflect/160" },
  { id: "travel", label: "travel", color: "#5D8FC9", count: 9, photo: "https://picsum.photos/seed/lg-travel/160" },
];

export const clusterEdgeSeeds: [string, string, number][] = [
  ["work", "learning", 6],
  ["work", "reflection", 4],
  ["learning", "reading", 5],
  ["reflection", "reading", 3],
  ["photography", "travel", 4],
  ["reflection", "travel", 2],
  ["work", "photography", 1],
  ["learning", "reflection", 3],
];

export const entriesByCluster: Record<string, Entry[]> = {
  work: [
    { date: "Aug 21", title: "Shipped the auth redesign", snip: "Finally closed out the OAuth migration — three weeks late but the token refresh bug is gone for good.", type: "experience" },
    { date: "Aug 12", title: "Standup notes → a pattern", snip: "Noticed our sprint estimates are consistently 30% short. Wrote it up for the retro.", type: "reflection" },
    { date: "Jul 28", title: "Client call, life sciences data model", snip: "Walking through the new schema with the client's data team went better than expected.", type: "experience" },
  ],
  learning: [
    { date: "Aug 26", title: "d3-force deep dive", snip: "Spent the evening actually reading the force simulation source instead of just using it.", type: "learning" },
    { date: "Aug 18", title: "Postgres indexing notes", snip: "B-tree vs GIN, when each actually helps, finally clicked.", type: "learning" },
    { date: "Aug 3", title: "Started the AWS study guide series", snip: "Turning course transcripts into structured notes I'll actually reread.", type: "blog_link" },
  ],
  reading: [
    { date: "Aug 14", title: "Finished 'The Overstory'", snip: "Took me two months. The last hundred pages undid me a little.", type: "reflection" },
    { date: "Jul 22", title: "Halfway through 'Sapiens' reread", snip: "Different book the second time around.", type: "experience" },
  ],
  photography: [
    { date: "Aug 9", title: "Golden hour at the fort", snip: "Went back with the 35mm instead of the zoom. Better choice.", type: "photo" },
    { date: "Jul 19", title: "Monsoon light through the window", snip: "Didn't leave the house, didn't need to.", type: "photo" },
  ],
  reflection: [
    { date: "Aug 24", title: "On staying at ZS a bit longer", snip: "Runway matters more than momentum right now. Still true a month later.", type: "reflection" },
    { date: "Aug 5", title: "What actually moved this year", snip: "Not the job title. The stuff built on weekends.", type: "reflection" },
  ],
  travel: [
    { date: "Jul 30", title: "Trip to Alibaug", snip: "Ferry was late, didn't matter. First real break in months.", type: "experience" },
  ],
};

export const highlightSeeds: HighlightSeed[] = Object.entries(entriesByCluster).flatMap(
  ([parent, entries]) =>
    entries.map((entry, index) => ({
      id: `h-${parent}-${index + 1}`,
      label: entry.title,
      parent,
      date: entry.date,
    })),
);
