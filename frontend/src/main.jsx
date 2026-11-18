// main.jsx is the "entry point": the first file Vite reads (see vite.config.js).
// Vite follows every `import` from here to find all the other files to bundle.
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Django already put the student's VMs into the page as JSON, inside
// <script id="vms-data" type="application/json"> (see workspace.html).
// We read that text and turn it back into a JavaScript object.
const vms = JSON.parse(document.getElementById('vms-data').textContent);

// Find the empty <div id="react-root"> that the Django template left for us,
// and let React draw the whole App inside it. React only controls what's inside
// this div; the navbar above it is still plain Django HTML.
createRoot(document.getElementById('react-root')).render(<App vms={vms} />);