
export type Teacher = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  voiceId: string;
  description: string;
  subjects: string[];
};

// Teacher profiles with centered face image
export const teachers: Teacher[] = [
  {
    id: "alakh-pandey",
    name: "Alakh Pandey",
    title: "Physics Expert",
    avatar: "/lovable-uploads/27be2557-ce2e-4f04-89a3-e40dea54893d.png",
    voiceId: "m5qndnI7u4OAdXhH0Mr5", // Krishna voice ID (Alakh Pandey customized)
    description: "Learn physics concepts in Alakh sir's unique teaching style.",
    subjects: ["Physics"],
  },
];
