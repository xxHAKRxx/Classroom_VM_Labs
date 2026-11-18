import { useEffect, useState } from 'react';
import { getJSON } from './api.js';
import LabList from './LabList.jsx';
import TaskList from './TaskList.jsx';
import VmPane from './VmPane.jsx';

// App is the top component. It owns the data that more than one column needs,
// loads it from the API, and passes pieces of it down to the three columns as props.
// `vms` comes from main.jsx (Django put it in the page).
export default function App({ vms }) {
  // ---- State ----
  const [labs, setLabs] = useState([]);               // short list for the sidebar
  const [selectedId, setSelectedId] = useState(null); // id of the lab the student clicked
  const [lab, setLab] = useState(null);               // full details of that lab (null = loading)
  const [done, setDone] = useState({});               // finished tasks, e.g. { 1: true, 4: true }
  const [error, setError] = useState(null);           // message to show if a request fails

  // ---- Effect 1: once, when the page loads, get the list of labs ----
  // The empty [] at the end means "don't run this again after the first time".
  useEffect(() => {
    getJSON('/api/labs/')
      .then((data) => {
        setLabs(data);
        if (data.length > 0) setSelectedId(data[0].id); // start on the first lab
      })
      .catch((err) => setError(err.message));
  }, []);

  // ---- Effect 2: every time selectedId changes, get that lab's tasks ----
  // [selectedId] at the end means "run again whenever selectedId changes".
  // Clicking a lab only changes selectedId; this effect then does the loading.
  useEffect(() => {
    if (selectedId === null) return; // nothing selected yet (the lab list is still loading)

    let ignore = false; // becomes true if the student picks another lab before this one arrives
    setLab(null);       // TaskList shows "Loading..." while lab is null

    getJSON(`/api/labs/${selectedId}/`)
      .then((data) => {
        if (!ignore) setLab(data); // only show it if it's still the lab the student wants
      })
      .catch((err) => setError(err.message));

    // Cleanup: React runs this just before running the effect again for a new
    // selectedId, so the old request's answer gets ignored when it arrives.
    return () => {
      ignore = true;
    };
  }, [selectedId]);

  // Called by TaskList when a task's answers are submitted.
  // State must be replaced, not changed in place, so make a new object
  // with everything in `done` plus this task.
  function markDone(taskId) {
    setDone({ ...done, [taskId]: true });
  }

  // ---- What to draw ----
  if (error) {
    return <div className="alert alert-danger m-3">Couldn't load the labs: {error}</div>;
  }

  // <> ... </> is a "fragment": it groups the three columns without adding an extra <div>,
  // because the page's CSS expects them directly inside <div id="react-root" class="workspace">.
  return (
    <>
      <LabList labs={labs} selectedId={selectedId} onSelect={setSelectedId} />
      {/* key: a different lab gets a brand-new TaskList, so its first task opens */}
      <TaskList key={selectedId} lab={lab} done={done} onDone={markDone} />
      {/* lab?.vmid is undefined while the lab is loading (lab is null) */}
      <VmPane vmid={lab?.vmid} vms={vms} />
    </>
  );
}