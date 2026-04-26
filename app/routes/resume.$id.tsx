import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const Resume = () => {
  const { id } = useParams();
  const { kv } = usePuterStore();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;

        const res = await kv.get(`resume:${id}`);

        if (!res) {
          console.log("❌ No data found in KV");
          return;
        }

        const parsed = JSON.parse(res);

        // EXACT SAME STYLE AS YT (console output)
        console.log("RESUME DATA:", parsed);

        setData(parsed);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // loading state
  if (loading) return <h1>Loading...</h1>;

  // safety fallback
  if (!data) return <h1>No data found</h1>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Resume Result</h1>

      <h2>Company: {data.companyName}</h2>
      <h2>Job: {data.jobTitle}</h2>

      <h3>Feedback:</h3>
      <pre>{JSON.stringify(data.feedback, null, 2)}</pre>
    </div>
  );
};

export default Resume;