import * as THREE from 'three';
import { useMemo } from 'react';

export function createRobotModel() {
  /* ================= materials ================= */
  const M = {
    armor: new THREE.MeshPhysicalMaterial({
      color: 0xe8eaee, metalness: 0.85, roughness: 0.22,
      clearcoat: 1, clearcoatRoughness: 0.12,
    }),
    dark: new THREE.MeshStandardMaterial({ color: 0x14161c, metalness: 0.9, roughness: 0.45 }),
    gun: new THREE.MeshStandardMaterial({ color: 0x3a3f4a, metalness: 0.95, roughness: 0.3 }),
    face: new THREE.MeshPhysicalMaterial({
      color: 0xd8dade, metalness: 0.55, roughness: 0.3,
      clearcoat: 0.8, clearcoatRoughness: 0.2,
    }),
    glow: new THREE.MeshStandardMaterial({
      color: 0xffb03a, emissive: 0xff9a1e, emissiveIntensity: 2.6,
      metalness: 0.2, roughness: 0.3,
    }),
    cable: new THREE.MeshStandardMaterial({ color: 0x0c0e12, metalness: 0.6, roughness: 0.7 }),
  };

  /* ================= helpers ================= */
  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scale.set(sx, sy, sz);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m); return m;
  };
  const G = {
    sphere: (r: number, w = 32, h = 24) => new THREE.SphereGeometry(r, w, h),
    box: (a: number, b: number, c: number) => new THREE.BoxGeometry(a, b, c),
    cyl: (rt: number, rb: number, h: number, s = 24, openEnded = false) => new THREE.CylinderGeometry(rt, rb, h, s, 1, openEnded),
    caps: (r: number, l: number) => new THREE.CapsuleGeometry(r, l, 8, 24),
    torus: (r: number, t: number) => new THREE.TorusGeometry(r, t, 16, 40),
  };

  /* ================= robot build ================= */
  const robot = new THREE.Group();

  /* ---- head ---- */
  const headGrp = new THREE.Group();
  headGrp.position.set(0, 2.62, 0);
  robot.add(headGrp);

  // skull + helmet dome
  add(headGrp, G.sphere(0.30), M.face, 0, 0.02, 0, 0, 0, 0, 0.86, 1, 0.92);
  const helmet = add(headGrp, G.sphere(0.33, 48, 32), M.armor, 0, 0.05, -0.02);
  helmet.scale.set(0.9, 1.02, 0.96);
  // helmet opening for the face: cheat with a face plate slightly forward
  add(headGrp, G.sphere(0.285), M.face, 0, -0.01, 0.055, 0, 0, 0, 0.8, 0.94, 0.82);
  // jaw / chin
  add(headGrp, G.sphere(0.16), M.face, 0, -0.2, 0.1, 0, 0, 0, 0.85, 0.9, 0.75);
  // brow ridge
  add(headGrp, G.box(0.34, 0.05, 0.1), M.armor, 0, 0.13, 0.24, -0.25);
  // crest seam on helmet
  add(headGrp, G.box(0.02, 0.36, 0.2), M.dark, 0, 0.22, 0.14, -0.5);

  // eyes — glowing amber (dedicated material so eye/core glow animate independently)
  const eyeMat = M.glow.clone();
  const eyeGeo = G.sphere(0.045, 20, 16);
  const eyeL = add(headGrp, eyeGeo, eyeMat, -0.105, 0.035, 0.245, 0, 0, 0, 1.25, 0.7, 0.6);
  const eyeR = add(headGrp, eyeGeo, eyeMat, 0.105, 0.035, 0.245, 0, 0, 0, 1.25, 0.7, 0.6);
  // eye sockets
  add(headGrp, G.torus(0.055, 0.012), M.dark, -0.105, 0.035, 0.245, 0, 0, 0, 1.2, 0.75, 1);
  add(headGrp, G.torus(0.055, 0.012), M.dark, 0.105, 0.035, 0.245, 0, 0, 0, 1.2, 0.75, 1);
  // nose + mouth hint
  add(headGrp, G.box(0.03, 0.09, 0.04), M.face, 0, -0.05, 0.285);
  add(headGrp, G.box(0.1, 0.014, 0.03), M.dark, 0, -0.155, 0.25);

  // ear discs
  for (const s of [-1, 1]) {
    add(headGrp, G.cyl(0.09, 0.09, 0.06, 24), M.gun, s * 0.29, 0.02, 0, 0, 0, Math.PI / 2);
    add(headGrp, G.cyl(0.05, 0.05, 0.075, 24), M.armor, s * 0.3, 0.02, 0, 0, 0, Math.PI / 2);
    add(headGrp, G.torus(0.07, 0.012), M.dark, s * 0.315, 0.02, 0, 0, Math.PI / 2, 0);
  }

  /* ---- neck: core + cables ---- */
  const neck = new THREE.Group();
  neck.position.set(0, 2.28, 0);
  robot.add(neck);
  add(neck, G.cyl(0.09, 0.12, 0.32, 20), M.gun, 0, 0.05, 0);
  add(neck, G.torus(0.1, 0.02), M.dark, 0, 0.14, 0, Math.PI / 2);
  add(neck, G.torus(0.11, 0.02), M.dark, 0, 0.02, 0, Math.PI / 2);
  // cables from helmet to shoulders
  const cableCurve = (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) => new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx, sy, sz),
      new THREE.Vector3(sx * 1.4, (sy + ey) / 2, sz + 0.06),
      new THREE.Vector3(ex, ey, ez),
    ]), 20, 0.018, 8);
  for (const s of [-1, 1]) {
    add(robot, cableCurve(s * 0.16, 2.5, 0.12, s * 0.3, 2.05, 0.1), M.cable);
    add(robot, cableCurve(s * 0.2, 2.48, -0.05, s * 0.34, 2.02, -0.08), M.cable);
  }

  /* ---- torso ---- */
  const torso = new THREE.Group();
  torso.position.set(0, 1.55, 0);
  robot.add(torso);

  // chest armor (two pectoral plates, split down the middle like the reference)
  const chestGeo = G.box(0.34, 0.5, 0.3);
  const pecL = add(torso, chestGeo, M.armor, -0.21, 0.42, 0.08, 0.08, 0.12, 0.06);
  const pecR = add(torso, chestGeo, M.armor, 0.21, 0.42, 0.08, 0.08, -0.12, -0.06);
  // @ts-ignore
  pecL.geometry = pecR.geometry = chestGeo;
  // collarbone plates
  add(torso, G.box(0.4, 0.1, 0.22), M.armor, -0.22, 0.66, 0.03, 0, 0.25, 0.18);
  add(torso, G.box(0.4, 0.1, 0.22), M.armor, 0.22, 0.66, 0.03, 0, -0.25, -0.18);
  // high collar
  add(torso, G.cyl(0.24, 0.3, 0.18, 24, true), M.armor, 0, 0.72, -0.02);
  // exposed spine column in the middle
  add(torso, G.cyl(0.07, 0.09, 0.85, 16), M.gun, 0, 0.28, 0.02);
  for (let i = 0; i < 6; i++)
    add(torso, G.torus(0.085, 0.016), M.dark, 0, 0.62 - i * 0.13, 0.02, Math.PI / 2);
  // chest core — glowing amber ring + center (own material for independent glow)
  const coreRing = add(torso, G.torus(0.075, 0.02), M.gun, 0, 0.30, 0.16);
  const core = add(torso, G.cyl(0.05, 0.05, 0.05, 24), M.glow.clone(), 0, 0.30, 0.16, Math.PI / 2);
  // back plate
  add(torso, G.box(0.52, 0.62, 0.16), M.armor, 0, 0.4, -0.16, -0.06);
  // abdomen segments
  for (let i = 0; i < 3; i++)
    add(torso, G.cyl(0.2 - i * 0.015, 0.21 - i * 0.015, 0.09, 20), M.gun, 0, -0.02 - i * 0.12, 0.02);
  // pelvis
  add(torso, G.box(0.42, 0.22, 0.3), M.armor, 0, -0.46, 0, 0, 0, 0);
  add(torso, G.box(0.2, 0.16, 0.32), M.dark, 0, -0.52, 0);

  /* ---- shoulders + arms ---- */
  function buildArm(side: number) { // side: -1 left, +1 right
    const s = side;
    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.52, 2.12, 0);
    robot.add(shoulder);
    // pauldron
    add(shoulder, G.sphere(0.19, 24, 18), M.armor, 0, 0.03, 0, 0, 0, s * -0.3, 1, 0.85, 1);
    add(shoulder, G.box(0.3, 0.1, 0.26), M.armor, s * 0.02, 0.16, 0, 0, 0, s * -0.35);
    add(shoulder, G.sphere(0.11), M.gun, 0, -0.05, 0);

    // upper arm
    const upper = new THREE.Group();
    upper.position.set(0, -0.08, 0);
    shoulder.add(upper);
    add(upper, G.caps(0.085, 0.3), M.armor, 0, -0.22, 0);
    add(upper, G.cyl(0.06, 0.06, 0.34, 16), M.dark, 0, -0.22, 0);

    // elbow + forearm
    const elbow = new THREE.Group();
    elbow.position.set(0, -0.46, 0);
    upper.add(elbow);
    add(elbow, G.sphere(0.09), M.gun);
    add(elbow, G.torus(0.09, 0.018), M.dark, 0, 0, 0, 0, Math.PI / 2);
    const fore = new THREE.Group();
    elbow.add(fore);
    add(fore, G.caps(0.075, 0.26), M.armor, 0, -0.24, 0, 0, 0, 0, 1, 1, 0.85);
    add(fore, G.box(0.1, 0.3, 0.05), M.dark, s * 0.05, -0.24, 0);

    // hand
    const hand = new THREE.Group();
    hand.position.set(0, -0.44, 0);
    fore.add(hand);
    add(hand, G.box(0.11, 0.14, 0.06), M.face, 0, -0.06, 0);
    for (let f = 0; f < 4; f++)
      add(hand, G.caps(0.016, 0.07), M.gun, -0.04 + f * 0.027, -0.19, 0);
    add(hand, G.caps(0.018, 0.06), M.gun, s * 0.075, -0.1, 0.02, 0, 0, s * -0.6);

    return { shoulder, upper, elbow, fore, hand };
  }
  const armL = buildArm(-1);
  const armR = buildArm(1);

  /* ---- legs ---- */
  function buildLeg(side: number) {
    const s = side;
    const hip = new THREE.Group();
    hip.position.set(s * 0.17, 1.02, 0);
    robot.add(hip);
    add(hip, G.sphere(0.12), M.gun);
    // thigh
    add(hip, G.caps(0.11, 0.34), M.armor, 0, -0.28, 0.01, 0, 0, 0, 1, 1, 0.9);
    add(hip, G.box(0.16, 0.34, 0.06), M.dark, s * 0.06, -0.28, -0.08);
    // knee
    const knee = new THREE.Group();
    knee.position.set(0, -0.55, 0.01);
    hip.add(knee);
    add(knee, G.sphere(0.1), M.gun);
    add(knee, G.box(0.16, 0.14, 0.08), M.armor, 0, 0.01, 0.09, -0.3);
    // shin
    const shin = new THREE.Group();
    knee.add(shin);
    add(shin, G.caps(0.085, 0.32), M.armor, 0, -0.27, 0, 0, 0, 0, 0.9, 1, 1);
    add(shin, G.cyl(0.05, 0.05, 0.36, 12), M.dark, 0, -0.27, -0.05);
    // foot
    add(shin, G.box(0.15, 0.09, 0.32), M.armor, 0, -0.5, 0.07);
    add(shin, G.box(0.16, 0.04, 0.34), M.dark, 0, -0.545, 0.07);
    return { hip, knee, shin };
  }
  const legL = buildLeg(-1);
  const legR = buildLeg(1);

  // Return all rigged parts for animation
  return {
    robot, headGrp, torso, neck,
    armL, armR, legL, legR, core, coreRing, eyeL, eyeR,
    M
  };
}

export function useRobotModel() {
  // Only construct the geometry once using useMemo
  const model = useMemo(() => createRobotModel(), []);
  return model;
}
