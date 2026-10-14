import * as THREE from 'three'
import * as CANNON from 'cannon-es'

// A 3D pile of MOAR bars for the shop builder. Bars are real physics bodies: they
// fall in one by one, tumble, land and settle into a heap on the orange panel.
// Loaded on demand (dynamic import), so the rest of the site never pays for it.

export interface PileScene {
  setCount: (n: number) => void
  dropAgain: () => void
  dispose: () => void
}

const L = 1.0 // bar length
const W = 0.34 // width
const T = 0.16 // thickness at the middle

export function createPileScene(container: HTMLElement, textureUrl: string): PileScene {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---------- renderer ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  container.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

  // Soft studio reflections: a warm gradient room baked into an environment map,
  // so the wrapper picks up highlights instead of looking flat.
  const envCanvas = document.createElement('canvas')
  envCanvas.width = 512
  envCanvas.height = 256
  const ectx = envCanvas.getContext('2d')!
  const grad = ectx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#fff6ee')
  grad.addColorStop(0.42, '#ffd9bf')
  grad.addColorStop(0.55, '#ff7a33')
  grad.addColorStop(1, '#5a1e06')
  ectx.fillStyle = grad
  ectx.fillRect(0, 0, 512, 256)
  ectx.fillStyle = 'rgba(255,255,255,0.95)'
  ectx.fillRect(150, 30, 120, 40)
  ectx.fillRect(330, 50, 60, 30)
  const envTex = new THREE.CanvasTexture(envCanvas)
  envTex.mapping = THREE.EquirectangularReflectionMapping
  envTex.colorSpace = THREE.SRGBColorSpace
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envMap = pmrem.fromEquirectangular(envTex).texture
  scene.environment = envMap

  const key = new THREE.DirectionalLight(0xfff1e6, 2.1)
  key.position.set(-2.5, 7, 4.5)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 })
  key.shadow.radius = 6
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.02
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xffc49a, 0.8)
  rim.position.set(3, 3, -4)
  scene.add(rim)
  scene.add(new THREE.HemisphereLight(0xfff4ec, 0x7a2a06, 0.45))

  // The floor only catches shadows; the orange panel behind is the floor colour.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.32 }))
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
  // A soft dark patch under the pile so it sits on the floor.
  const blobCanvas = document.createElement('canvas')
  blobCanvas.width = blobCanvas.height = 128
  const bctx = blobCanvas.getContext('2d')!
  const rg = bctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  rg.addColorStop(0, 'rgba(90,25,0,0.45)')
  rg.addColorStop(1, 'rgba(90,25,0,0)')
  bctx.fillStyle = rg
  bctx.fillRect(0, 0, 128, 128)
  const blobTex = new THREE.CanvasTexture(blobCanvas)
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }))
  blob.rotation.x = -Math.PI / 2
  blob.position.y = 0.002
  scene.add(blob)

  // ---------- the bar: a flow-wrap pillow with flat crimped ends ----------
  const geo = new THREE.BoxGeometry(L, T, W, 48, 2, 16)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const ex = Math.min(1, Math.abs(x) / (L / 2))
    const ez = Math.min(1, Math.abs(z) / (W / 2))
    const along = ex < 0.86 ? 1 : Math.max(0, 1 - (ex - 0.86) / 0.14) // flattens into the crimp
    const across = Math.pow(Math.cos((ez * Math.PI) / 2), 0.55) // rounded sides
    pos.setY(i, y * (0.08 + 0.92 * along * across))
  }
  geo.computeVertexNormals()
  const tex = new THREE.TextureLoader().load(textureUrl)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.center.set(0.5, 0.5)
  tex.rotation = Math.PI / 2
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  const face = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.4, metalness: 0.08, clearcoat: 0.35, clearcoatRoughness: 0.4, envMapIntensity: 0.45 })
  const side = new THREE.MeshPhysicalMaterial({ color: 0xc0400a, roughness: 0.45, metalness: 0.08, clearcoat: 0.25, envMapIntensity: 0.4 })
  const mats = [side, side, face, face, side, side]

  // ---------- physics ----------
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -26, 0), allowSleep: true })
  world.broadphase = new CANNON.NaiveBroadphase()
  ;(world.solver as CANNON.GSSolver).iterations = 20
  const wrapMat = new CANNON.Material('wrapper')
  const floorMat = new CANNON.Material('floor')
  // Wrappers barely bounce and grip a little: they land, slide a touch and settle.
  world.addContactMaterial(new CANNON.ContactMaterial(wrapMat, wrapMat, { friction: 0.5, restitution: 0.04 }))
  world.addContactMaterial(new CANNON.ContactMaterial(wrapMat, floorMat, { friction: 0.85, restitution: 0.05 }))
  const addPlane = (pos: CANNON.Vec3, axis: CANNON.Vec3, angle: number) => {
    const b = new CANNON.Body({ mass: 0, material: floorMat })
    b.addShape(new CANNON.Plane())
    b.position.copy(pos)
    b.quaternion.setFromAxisAngle(axis, angle)
    world.addBody(b)
  }
  addPlane(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // floor
  // Invisible walls just inside the frame, so no bar slides out of view.
  addPlane(new CANNON.Vec3(2.0, 0, 0), new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
  addPlane(new CANNON.Vec3(-2.0, 0, 0), new CANNON.Vec3(0, 1, 0), Math.PI / 2)
  addPlane(new CANNON.Vec3(0, 0, -1.3), new CANNON.Vec3(0, 1, 0), 0)
  addPlane(new CANNON.Vec3(0, 0, 1.6), new CANNON.Vec3(0, 1, 0), Math.PI)
  const shape = new CANNON.Box(new CANNON.Vec3((L / 2) * 0.97, (T / 2) * 0.98, (W / 2) * 0.97))

  const bars: { body: CANNON.Body; mesh: THREE.Mesh }[] = []
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
  let queue = 0
  // animation loop state (the loop itself is further down)
  const STEP = 1 / 120
  let raf = 0, last = 0, acc = 0, spawnT = 0, visible = false, idleFrames = 0
  const t0 = performance.now()

  const spawn = () => {
    const n = bars.length
    const spread = 0.35 + Math.sqrt(n / 36) * 0.45
    const body = new CANNON.Body({ mass: 0.055, material: wrapMat, linearDamping: 0.08, angularDamping: 0.35 })
    body.addShape(shape)
    body.sleepSpeedLimit = 0.12
    body.sleepTimeLimit = 0.5
    body.position.set(gauss() * spread, 2.6 + Math.random() * 0.9 + Math.min(1.2, n * 0.02), gauss() * spread * 0.6)
    // Mostly flat as it falls, like a real wrapper, facing any direction.
    body.quaternion.setFromEuler(gauss() * 0.7, Math.random() * Math.PI * 2, gauss() * 0.7, 'YXZ')
    body.angularVelocity.set(gauss() * 2.2, gauss() * 1.5, gauss() * 2.2)
    body.velocity.set(gauss() * 0.15, -1.5, gauss() * 0.15)
    world.addBody(body)
    const mesh = new THREE.Mesh(geo, mats)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(body.position.x, body.position.y, body.position.z)
    mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w)
    scene.add(mesh)
    bars.push({ body, mesh })
  }

  // Fewer bars (or "drop again"): the whole pile falls away through the floor and
  // out of view, then the new amount drops in fresh from the top.
  const falling: { body: CANNON.Body; mesh: THREE.Mesh; t: number }[] = []
  let refillIn = -1 // seconds until the refill starts; -1 = no refill pending
  const dropAway = () => {
    queue = 0
    for (const b of bars) {
      b.body.collisionFilterMask = 0 // pass through the floor, the walls and each other
      b.body.wakeUp()
      b.body.velocity.y = Math.min(b.body.velocity.y, -0.5 - Math.random() * 1.5)
      b.body.angularVelocity.set(gauss() * 1.5, gauss() * 1.5, gauss() * 1.5)
      falling.push({ ...b, t: 0 })
    }
    bars.length = 0
    refillIn = 0.55
  }

  let target = 0
  const setCount = (n: number) => {
    const fewer = n < target || n < bars.length
    target = n
    if (fewer && bars.length) dropAway()
    else if (refillIn < 0) queue = Math.max(0, n - bars.length)
    wake()
  }

  // ---------- camera framing ----------
  let base = { d: 6, y: 2.4, look: 0.45 }
  const fit = () => {
    const w = container.clientWidth, h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const fovV = (camera.fov * Math.PI) / 180
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect)
    const d = 2.2 / Math.tan(fovH / 2)
    // On tall panels the pile sits a little lower in the frame.
    const lift = Math.max(0, 1 / camera.aspect - 0.9) * 1.2
    base = { d, y: d * 0.4 + lift * 0.3, look: 0.42 + lift }
    camera.updateProjectionMatrix()
    wake()
  }
  const ro = new ResizeObserver(fit)
  ro.observe(container)
  fit()

  // ---------- loop: runs only while on screen ----------
  function frame(now: number) {
    raf = 0
    const dt = last ? Math.min(0.05, (now - last) / 1000) : STEP
    last = now
    spawnT += dt
    if (refillIn >= 0) {
      refillIn -= dt
      if (refillIn < 0) queue = Math.max(0, target - bars.length)
    }
    while (queue > 0 && spawnT > 0.07) { queue--; spawn(); spawnT -= 0.07 }
    if (queue === 0) spawnT = 0
    if (reduce) { for (let i = 0; i < 400; i++) world.step(STEP) }
    else { acc += dt; while (acc >= STEP) { world.step(STEP); acc -= STEP } }

    let cx = 0, cz = 0, awake = false
    for (const { body, mesh } of bars) {
      mesh.position.set(body.position.x, body.position.y, body.position.z)
      mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w)
      cx += body.position.x
      cz += body.position.z
      if (body.sleepState !== CANNON.Body.SLEEPING) awake = true
    }
    if (bars.length) { cx /= bars.length; cz /= bars.length }
    for (let i = falling.length - 1; i >= 0; i--) {
      const f = falling[i]
      f.t += dt
      f.mesh.position.set(f.body.position.x, f.body.position.y, f.body.position.z)
      f.mesh.quaternion.set(f.body.quaternion.x, f.body.quaternion.y, f.body.quaternion.z, f.body.quaternion.w)
      if (f.body.position.y < -7 || f.t > 2.5) { world.removeBody(f.body); scene.remove(f.mesh); falling.splice(i, 1) }
    }
    const r = 1.2 + Math.sqrt(bars.length / 36) * 2.2
    blob.position.x += (cx - blob.position.x) * 0.05
    blob.position.z += (cz - blob.position.z) * 0.05
    blob.scale.setScalar(blob.scale.x + (r * 1.6 - blob.scale.x) * 0.05)
    // A very slow sway so the depth reads.
    const s = reduce ? 0 : Math.sin((now - t0) / 4200) * 0.35
    camera.position.set(s * base.d * 0.12, base.y, base.d)
    camera.lookAt(0, base.look, 0)
    renderer.render(scene, camera)

    // Keep going while bars move or the camera sways; stop when off screen.
    idleFrames = awake || queue > 0 || falling.length || refillIn >= 0 ? 0 : idleFrames + 1
    if (visible && !document.hidden && (!reduce || idleFrames < 2)) raf = requestAnimationFrame(frame)
  }
  function wake() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame) } }

  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting
    if (visible) {
      if (target && bars.length + queue + falling.length === 0 && refillIn < 0) setCount(target)
      wake()
    }
  }, { threshold: 0.15 })
  io.observe(container)
  const onVis = () => wake()
  document.addEventListener('visibilitychange', onVis)

  return {
    setCount,
    dropAgain: () => { if (bars.length) dropAway(); else setCount(target); wake() },
    dispose: () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      geo.dispose(); face.dispose(); side.dispose(); tex.dispose()
      envTex.dispose(); envMap.dispose(); pmrem.dispose(); blobTex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
