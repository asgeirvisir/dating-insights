import type { Story } from "@/types/story";
import StoryCard from "./StoryCard";

interface StoryGridProps {
  stories: Story[];
  columns?: 2 | 3 | 4;
}

const columnStyles: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export default function StoryGrid({ stories, columns = 3 }: StoryGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${columnStyles[columns]}`}>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} size="standard" />
      ))}
    </div>
  );
}
