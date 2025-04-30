
import { useState } from "react";
import { Teacher } from "@/data/teacherProfiles";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";

interface TeacherSelectionProps {
  teachers: Teacher[];
  onTeacherSelect: (teacherId: string) => void;
}

export default function TeacherSelection({
  teachers,
  onTeacherSelect,
}: TeacherSelectionProps) {
  const [hoveredTeacher, setHoveredTeacher] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your AI Tutor</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select a tutor with expertise in your subject area for a personalized
          learning experience.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {teachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            className={`bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border ${
              hoveredTeacher === teacher.id
                ? "ring-2 ring-primary scale-[1.02]"
                : ""
            }`}
            onMouseEnter={() => setHoveredTeacher(teacher.id)}
            onMouseLeave={() => setHoveredTeacher(null)}
            variants={itemVariants}
          >
            <div className="h-64 overflow-hidden">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-1">{teacher.name}</h3>
              <div className="text-primary text-sm font-medium mb-4">
                {teacher.title}
              </div>

              <p className="text-muted-foreground mb-4">
                {teacher.description}
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              <Button
                className="w-full"
                onClick={() => onTeacherSelect(teacher.id)}
              >
                Learn with {teacher.name.split(" ")[0]}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
