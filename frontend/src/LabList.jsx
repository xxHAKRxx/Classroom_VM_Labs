import { useEffect, useState } from 'react';

// Column 1: the list of labs. It doesn't load anything itself. App gives it:
//   labs        the list from /api/labs/
//   selectedId  which lab to highlight
//   onSelect    a function to call when a lab is clicked (App's setSelectedId)
export default function LabList({ labs, selectedId, onSelect }) {
  // Is the sidebar collapsed to a strip of icons? The starting value is read from
  // localStorage (the browser's small per-site storage), so it's remembered between visits.
  // Passing a function to useState means it's only read once, not on every render.
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('labsCollapsed') === '1');

  // The page's CSS shrinks the sidebar when <body> has the class "labs-collapsed".
  // <body> is outside React's <div>, so React can't set that class through JSX.
  // An effect is the React way to update things outside React: it runs after
  // every render where `collapsed` changed.
  useEffect(() => {
    document.body.classList.toggle('labs-collapsed', collapsed);
    localStorage.setItem('labsCollapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <aside className="labs-sidebar bg-dark text-light p-3 border-end border-secondary">
      {/* Heading and the collapse button */}
      <div className="labs-header d-flex align-items-center justify-content-between mb-3">
        <h6 className="labs-heading text-uppercase text-secondary small fw-bold mb-0">Labs</h6>
        <button
          className="btn btn-sm btn-link text-secondary p-0"
          id="toggleLabs"
          title="Collapse/expand labs"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className="bi bi-chevron-double-left"></i>
        </button>
      </div>

      {/* One <li> per lab. React needs a unique `key` on each item of a list. */}
      <ul className="nav flex-column flex-nowrap gap-1">
        {labs.map((lab) => (
          <li className="nav-item" key={lab.id}>
            <a
              href="#"
              title={lab.title}
              // Bootstrap highlights the link that has the "active" class
              className={'nav-link d-flex align-items-center gap-2' + (lab.id === selectedId ? ' active' : '')}
              onClick={(event) => {
                event.preventDefault(); // don't follow href="#" (it would jump to the top)
                onSelect(lab.id);       // tell App which lab was clicked
              }}
            >
              <i className={'bi ' + lab.icon}></i>
              <span className="lab-label flex-grow-1">{lab.title}</span>
              <span className="badge rounded-pill text-bg-secondary">{lab.task_count}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}