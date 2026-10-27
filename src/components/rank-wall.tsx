"use client";

import { useState } from "react";
import { StoryLayer, topperStories, type StorySession } from "@/components/stories";
import { TopperCard } from "@/components/topper-card";
import { noidaToppers } from "@/lib/data";

const stories = topperStories(noidaToppers);

export function RankWall({ limit = 5 }: { limit?: number }) {
  const [session, setSession] = useState<StorySession | null>(null);

  return (
    <>
      <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 pb-1 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
        {noidaToppers.slice(0, limit).map((t, i) => (
          <li key={t.name} className="w-[42%] shrink-0 sm:w-[30%] md:w-auto">
            <TopperCard topper={t} onOpen={() => setSession({ stories, start: i })} />
          </li>
        ))}
      </ul>
      <StoryLayer session={session} onClose={() => setSession(null)} />
    </>
  );
}
