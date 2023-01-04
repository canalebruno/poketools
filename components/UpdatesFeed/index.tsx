import updates from "../../json/update.json";
import { useEffect, useState } from "react";

interface Updates {
  id: number;
  date: string;
  updates: string[];
}

export default function UpdatesFeed() {
  const [latestUpdates, setLatestUpdates] = useState({} as Updates[]);

  useEffect(() => {
    if (updates) {
      setLatestUpdates(
        updates.sort((a, b) => {
          return b.id - a.id;
        })
      );
    }
  }, []);

  return (
    <>
      {latestUpdates.length > 0 &&
        latestUpdates.map((update) => {
          return (
            <div key={update.id}>
              <p>{update.date}</p>
              <ul>
                {update.updates.flatMap((item) => {
                  return (
                    <li dangerouslySetInnerHTML={{ __html: item.toString() }} />
                  );
                })}
              </ul>
            </div>
          );
        })}
    </>
  );
}
