import { useEffect, useState } from "react";
import "./styles.css";

const JOB_API = "https://hacker-news.firebaseio.com/v0/jobstories.json";
const JOB_DETAILS_API = "https://hacker-news.firebaseio.com/v0/item/";
const PER_PAGE = 6;

export default function App() {
  const [ids, setIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [start, setStart] = useState(0);
  const [fetchingJobDetails, setFetchingJobDetails] = useState(false);

  const getJobIds = async () => {
    const res = await fetch(JOB_API);
    const ids = await res.json();
    console.log("idss", ids);
    setIds(ids);
  };

  useEffect(() => {
    getJobIds();
  }, []);

  const getJobDetails = async (start, end) => {
    setFetchingJobDetails(true);
    const idArr = ids.slice(start, end);

    let arr = [];
    for (let id of idArr) {
      arr.push(fetch(`${JOB_DETAILS_API}${id}.json`).then((res) => res.json()));
    }

    console.log("arr", arr);

    try {
      const jobDetails = await Promise.all(arr);
      console.log("jobDetails", jobDetails);

      setJobs([...jobs, ...jobDetails]);
    } catch (error) {
      console.log(`errr`, error);
    } finally {
      setFetchingJobDetails(false);
    }
  };

  useEffect(() => {
    if (ids.length > 0) {
      getJobDetails(start, start + PER_PAGE);
    }
  }, [ids, start]);

  const loadMore = () => {
    setStart((prev) => prev + PER_PAGE);
  };

  return (
    <div className="App">
      <h1>Job Listing</h1>

      <div>
        {jobs.length > 0
          ? jobs.map((job) => (
              <ul>
                <li>{job.title}</li>
              </ul>
            ))
          : null}
      </div>

      <div>
        {jobs.length < ids.length && (
          <button
            onClick={loadMore}
            className="load-more"
            disabled={fetchingJobDetails}
          >
            {fetchingJobDetails ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}
