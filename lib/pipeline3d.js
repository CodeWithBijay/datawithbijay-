/* FIG. 01 in 3D: the St. Louis HELP pipeline as a blueprint scene (Three.js, built in code, no model files).
   Wireframe blocks on a grid floor, data packets travelling along the pipes, slow sway, mouse tilt and hover tips.
   Loaded only on desktop with a mouse; phones and reduced-motion visitors keep the flat SVG diagram. */
import {
  Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, BoxGeometry, EdgesGeometry, LineSegments,
  LineBasicMaterial, MeshBasicMaterial, GridHelper, Vector3, Raycaster, Vector2, SphereGeometry,
  BufferGeometry, Line, LineDashedMaterial, CatmullRomCurve3, AdditiveBlending, Color,
} from "three";

const C = { mint: 0x5eead4, sky: 0x7dd3fc, amber: 0xf59e0b, blue: 0x60a5fa, dim: 0x5f84a3 };

export function mountPipeline3D(host, tipEl, tips) {
  const W = () => host.clientWidth, H = () => host.clientHeight;
  const scene = new Scene();
  const cam = new PerspectiveCamera(32, W() / H(), 0.1, 100);
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.setSize(W(), H());
  renderer.domElement.className = "p3d-canvas";
  host.appendChild(renderer.domElement);
  const labels = document.createElement("div");
  labels.className = "p3d-labels";
  host.appendChild(labels);

  const world = new Group();
  scene.add(world);

  // grid floor (fine + coarse lines like the page background)
  const g1 = new GridHelper(18, 36, 0x16405f, 0x0f2e47); g1.position.y = -0.01; world.add(g1);
  const g2 = new GridHelper(18, 6, 0x1f5378, 0x1f5378); g2.material.transparent = true; g2.material.opacity = 0.7; world.add(g2);

  // blocks: [key, label, sub, x, y, z, w, h, d, color, tipIndex]
  const B = [
    ["jot", "Jotform API", "", -6.6, 0, -2.0, 1.9, 0.5, 1.0, C.sky, 0],
    ["csv", "CSV / files", "", -6.6, 0, 1.9, 1.9, 0.5, 1.0, C.sky, 1],
    ["py", "Python", "extract · load", -2.9, 0, 0, 1.7, 0.9, 2.6, C.sky, 2],
    ["raw", "raw", "", 0.9, 0, 0, 2.2, 0.42, 1.8, C.amber, 3],
    ["clean", "cleaned", "", 0.9, 0.62, 0, 2.2, 0.42, 1.8, C.blue, 4],
    ["rep", "reporting", "", 0.9, 1.24, 0, 2.2, 0.42, 1.8, C.mint, 5],
    ["test", "data tests", "✓ passing", 4.4, 0, 0, 1.5, 0.6, 1.0, C.sky, 6],
    ["dash", "Dashboard", "+ donor reports", 4.4, 0, 4.3, 2.0, 0.7, 1.1, C.sky, 7],
    ["ins", "Insight", "answers for the team", -1.2, 0, 4.3, 2.3, 0.7, 1.1, C.mint, 8],
  ];
  const nodes = {}, hits = [];
  for (const [k, label, sub, x, y, z, w, h, d, col, ti] of B) {
    const geo = new BoxGeometry(w, h, d);
    const fill = new Mesh(geo, new MeshBasicMaterial({ color: 0x0b2238, transparent: true, opacity: 0.82 }));
    const edges = new LineSegments(new EdgesGeometry(geo), new LineBasicMaterial({ color: col, transparent: true, opacity: 0.95 }));
    const grp = new Group(); grp.add(fill, edges); grp.position.set(x, y + h / 2, z);
    world.add(grp);
    const el = document.createElement("div");
    el.className = "p3d-l" + (k === "rep" || k === "ins" ? " hi" : "");
    el.innerHTML = `<b>${label}</b>${sub ? `<i>${sub}</i>` : ""}`;
    labels.appendChild(el);
    fill.userData = { k, ti };
    hits.push(fill);
    const side = k === "raw" || k === "clean" || k === "rep";
    if (side) el.classList.add("side");
    nodes[k] = { grp, edges, el, col, side, top: side ? new Vector3(x - w / 2 - 0.12, y + h / 2, z + d / 2) : new Vector3(x, y + h + 0.05, z), base: y + h / 2 };
  }
  // the warehouse frame around the three layers
  {
    const geo = new BoxGeometry(2.6, 2.0, 2.2);
    const frame = new LineSegments(new EdgesGeometry(geo), new LineBasicMaterial({ color: C.mint, transparent: true, opacity: 0.35 }));
    frame.position.set(0.9, 1.0, 0); world.add(frame);
    const el = document.createElement("div"); el.className = "p3d-l cap"; el.textContent = "WAREHOUSE · POSTGRESQL"; labels.appendChild(el);
    nodes.wh = { el, top: new Vector3(0.9, 2.15, 0) };
    const el2 = document.createElement("div"); el2.className = "p3d-l cap"; el2.textContent = "ORCHESTRATION · GITHUB ACTIONS · RUNS NIGHTLY"; labels.appendChild(el2);
    nodes.orch = { el: el2, top: new Vector3(-1.2, 0.02, 6.2) };
  }

  // pipes + travelling data packets
  const P = (x, y, z) => new Vector3(x, y, z);
  const routes = [
    [P(-5.65, 0.25, -2.0), P(-4.4, 0.25, -1.8), P(-3.75, 0.3, -0.6)],
    [P(-5.65, 0.25, 1.9), P(-4.4, 0.25, 1.7), P(-3.75, 0.3, 0.6)],
    [P(-2.05, 0.3, 0), P(-0.2, 0.21, 0)],
    [P(2.0, 1.45, 0), P(3.0, 1.0, 0), P(3.65, 0.3, 0)],
    [P(4.4, 0.3, 0.5), P(4.4, 0.3, 3.75)],
    [P(3.4, 0.35, 4.3), P(-0.05, 0.35, 4.3)],
  ];
  const packets = [];
  routes.forEach((pts, i) => {
    const curve = new CatmullRomCurve3(pts, false, "catmullrom", 0.2);
    const line = new Line(new BufferGeometry().setFromPoints(curve.getPoints(40)),
      new LineDashedMaterial({ color: C.sky, dashSize: 0.14, gapSize: 0.1, transparent: true, opacity: 0.8 }));
    line.computeLineDistances(); world.add(line);
    for (let j = 0; j < 2; j++) {
      const dot = new Mesh(new SphereGeometry(0.07, 12, 12), new MeshBasicMaterial({ color: C.mint }));
      const halo = new Mesh(new SphereGeometry(0.18, 12, 12), new MeshBasicMaterial({ color: C.mint, transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false }));
      dot.add(halo); world.add(dot);
      packets.push({ dot, curve, t: (j * 0.5 + i * 0.17) % 1, speed: 0.22 + (i % 3) * 0.04 });
    }
  });

  world.position.set(0.6, 0, -1.0);
  const target = new Vector3(0, 0.3, 1.2);

  // interaction
  const ray = new Raycaster(), m = new Vector2(), mouse = { x: 0, y: 0, in: false };
  const defTip = tipEl ? tipEl.textContent : "";
  let hover = null;
  const onMove = (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1; mouse.in = true;
  };
  const onLeave = () => { mouse.in = false; setHover(null); };
  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener("pointerleave", onLeave);
  function setHover(h) {
    if (h === hover) return;
    if (hover) { const n = nodes[hover.k]; n.edges.material.color.setHex(n.col); n.grp.position.y = n.base; n.el.classList.remove("on"); }
    hover = h;
    if (hover) { const n = nodes[hover.k]; n.edges.material.color = new Color(0xffffff); n.el.classList.add("on"); if (tipEl) tipEl.textContent = "▸ " + (tips[hover.ti] || ""); renderer.domElement.style.cursor = "pointer"; }
    else { if (tipEl) tipEl.textContent = defTip; renderer.domElement.style.cursor = ""; }
  }

  // render loop (paused when off screen or the tab is hidden)
  let visible = true, raf = 0, last = performance.now(), yaw = 0, pitch = 0;
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); });
  io.observe(host);
  const v = new Vector3();
  function tick(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = Math.max(last, now);
    // slow sway, plus a gentle tilt toward the mouse
    const sway = Math.sin(now / 5200) * 0.28;
    yaw += ((mouse.in ? mouse.x * 0.35 : 0) + sway - yaw) * Math.min(1, dt * 2.2);
    pitch += ((mouse.in ? mouse.y * 0.08 : 0) - pitch) * Math.min(1, dt * 2.2);
    const R = 17, el = 0.62 + pitch;
    cam.position.set(Math.sin(yaw) * R * Math.cos(el), R * Math.sin(el), Math.cos(yaw) * R * Math.cos(el));
    cam.lookAt(target);
    for (const p of packets) { p.t = (((p.t + dt * p.speed) % 1) + 1) % 1; p.dot.position.copy(p.curve.getPoint(p.t)); }
    if (hover) { const n = nodes[hover.k]; n.grp.position.y = n.base + 0.08 + Math.sin(now / 180) * 0.02; }
    if (mouse.in) { m.set(mouse.x, mouse.y); ray.setFromCamera(m, cam); const h = ray.intersectObjects(hits, false)[0]; setHover(h ? h.object.userData : null); }
    renderer.render(scene, cam);
    // HTML labels follow their blocks (crisp text at any size)
    const w = W(), hh = H();
    for (const k in nodes) {
      const n = nodes[k]; v.copy(n.top); world.localToWorld(v); v.project(cam);
      n.el.style.transform = `${n.side ? "translate(-100%,-50%)" : "translate(-50%,-100%)"} translate(${((v.x + 1) / 2) * w}px,${((1 - v.y) / 2) * hh}px)`;
    }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } });
  const ro = new ResizeObserver(() => { cam.aspect = W() / H(); cam.updateProjectionMatrix(); renderer.setSize(W(), H()); });
  ro.observe(host);
  return true;
}
