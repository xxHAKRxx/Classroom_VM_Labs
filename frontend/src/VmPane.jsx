import { useRef, useState } from 'react';

// Column 3: the VM console. App gives it:
//   vmid  the selected lab's VM id (from the API), or undefined while the lab is loading
//   vms   every VM this student may use, from Django, e.g. { "100": { name, node, status, console_url } }
export default function VmPane({ vmid, vms }) {
  const [reloads, setReloads] = useState(0); // add 1 to reconnect the console (see the iframe's key)
  const frameWrap = useRef(null);            // the real <div> around the iframe, for fullscreen

  // Look up this lab's VM. It's undefined while loading, or if the student's
  // Proxmox account doesn't have access to that VM.
  const vm = vms[vmid];

  // ---- Status badge text and color ----
  let status = 'loading';
  if (vmid !== undefined) status = vm ? vm.status : 'not available';

  let badgeColor = 'text-bg-warning';                        // yellow: loading / not available
  if (status === 'running') badgeColor = 'text-bg-success';  // green
  else if (vm) badgeColor = 'text-bg-secondary';             // gray: e.g. "stopped"

  return (
    <main className="vm-pane">
      {/* ---- Toolbar: status, VM name, buttons ---- */}
      <div className="d-flex align-items-center gap-2 px-3 py-2 bg-body border-bottom">
        <span className={'badge ' + badgeColor}>{status}</span>
        <span className="fw-semibold small">
          {vm ? `${vm.name} (VM ${vm.vmid} on ${vm.node})` : vmid !== undefined && `VM ${vmid}`}
        </span>
        <div className="ms-auto btn-group btn-group-sm">
          {/* Reconnect: changing `reloads` changes the iframe's key below */}
          <button
            className="btn btn-outline-secondary"
            title="Reconnect"
            disabled={!vm}
            onClick={() => setReloads(reloads + 1)}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
          {/* Open the console in its own browser tab */}
          <a
            className={'btn btn-outline-secondary' + (vm ? '' : ' disabled')}
            href={vm?.console_url}
            target="_blank"
            rel="noopener"
            title="Open console in a new tab"
          >
            <i className="bi bi-box-arrow-up-right"></i>
          </a>
          {/* Fullscreen: needs the real DOM element, which the ref gives us */}
          <button
            className="btn btn-outline-secondary"
            title="Fullscreen"
            onClick={() => frameWrap.current.requestFullscreen()}
          >
            <i className="bi bi-arrows-fullscreen"></i>
          </button>
        </div>
      </div>

      {/* ---- The console itself, or a message ---- */}
      {/* ref={frameWrap} makes frameWrap.current point at this <div> once it's on the page */}
      <div className="vm-frame-wrap" ref={frameWrap}>
        {vm ? (
          // THIS is what shows the VM: the iframe loads the Proxmox console page.
          // The browser sends the PVEAuthCookie Django set, so the console is logged in.
          // A new key makes React replace the iframe, which reloads the console.
          <iframe
            key={`${vm.vmid}-${reloads}`}
            src={vm.console_url}
            title="Virtual machine console"
            allow="clipboard-read; clipboard-write; fullscreen"
          />
        ) : (
          <div className="vm-placeholder">
            <i className="bi bi-display fs-1 mb-2"></i>
            {vmid === undefined ? (
              <div>Loading...</div>
            ) : (
              <>
                <div>VM {vmid} isn't available to your Proxmox account.</div>
                <small>VMs you can access: {Object.keys(vms).join(', ') || 'none'}</small>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}