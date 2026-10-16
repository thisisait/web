/* <ait-iris-eye> — Iris' eye. A framework-free custom element (works in SvelteKit,
   React, Latte, plain HTML) that renders one photoreal eye in a WebGL fragment shader
   and drives it with a small motor model:

     gaze   saccades toward a fixation target (pointer, user, up, side), microsaccades,
            drift; the upper lid follows vertical gaze (lid–gaze coupling)
     lids   blink scheduler (rate per expression, blink on big saccades, on demand)
     pupil  slow spring + hippus; dilation comes from the expression
     face   expression params blended from AIT.IrisTone presets / decisions

   Attributes: state="idle|listening|thinking|tool|speaking"  expression="<preset>"
               follow="pointer|none"  iris="#hex"  iris-inner="#hex"  skin="warm|porcelain|graphite"
   API:        el.state, el.setExpression(nameOrParams), el.feel(text, role) -> decision,
               el.setMood(params, holdSeconds), el.blink(), el.lookAt(x, y, ms)
   No dependencies, offline. Falls back to a flat CSS pupil when WebGL is missing. */
(function (AIT) {
  "use strict";
  if (typeof window === "undefined" || !window.customElements || customElements.get("ait-iris-eye")) return;

  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime,uPupil,uOpenU,uOpenL,uTilt,uBlink,uWet,uSeed;",
    "uniform vec2 uGaze;uniform vec3 uIris,uIris2,uSkin;uniform vec4 uBox;uniform vec4 uHead;",
    "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}",
    "float pow2(float x){return x*x;}",
    "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}",
    // angular noise, periodic in x with period P: no seam where atan wraps
    "float pnoise(vec2 p,float P){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);float i0=mod(i.x,P),i1=mod(i.x+1.,P);",
    " return mix(mix(hash(vec2(i0,i.y)),hash(vec2(i1,i.y)),u.x),mix(hash(vec2(i0,i.y+1.)),hash(vec2(i1,i.y+1.)),u.x),u.y);}",
    "float pfbm(vec2 p,float P){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*pnoise(p,P);p*=2.;P*=2.;a*=.5;}return v;}",
    "void main(){",
    // framing: cover-fit the design box uBox (centre xy, half-extent zw) into the canvas
    " float fitS=max(uRes.x/(2.*uBox.z),uRes.y/(2.*uBox.w)); float px=1.25/fitS;",
    " vec2 p=(gl_FragCoord.xy-.5*uRes)/fitS+uBox.xy;",
    // head: the whole face drifts, turns and nods a little (uHead = dx, dy, roll, lean)
    " p-=uHead.xy; float cr=cos(uHead.z), sr=sin(uHead.z); p=mat2(cr,-sr,sr,cr)*p/uHead.w;",
    // ── lid geometry: almond opening, inner corner on the left
    " float cx=1.34; float xn=clamp(p.x/cx,-1.,1.);",
    " float bell=pow(max(1.-xn*xn,0.),.72)*(1.+.06*xn*(1.-xn*xn));",
    " float cant=.045*xn;",
    " float yUo=(.60*uOpenU)*bell*(1.-.07*xn)+uTilt*.15*(-xn)*bell+.03+cant;",
    " float yL=-(.40-.22*uOpenL)*pow(bell,.9)*(1.+.06*xn)-.03+cant;",
    " yL+=.05*uBlink*bell;",
    " float yU=mix(yUo,yL+.01,uBlink);",
    " float inside=smoothstep(-px,px,yU-p.y)*smoothstep(-px,px,p.y-yL)*step(abs(p.x),cx);",
    // ── eyeball: sphere, gaze-rotated iris frame
    " vec2 q=p-vec2(0.,-.03); float R=1.08; float d2=dot(q,q);",
    " vec3 n=normalize(vec3(q,sqrt(max(R*R-d2,.02))));",
    " float ax=uGaze.x*.55, ay=uGaze.y*.42;",
    " vec3 g=vec3(sin(ax)*cos(ay),sin(ay),cos(ax)*cos(ay));",
    " vec3 rt=normalize(cross(vec3(0.,1.,0.),g)); vec3 up=cross(g,rt);",
    " float cosA=dot(n,g); float ang=acos(clamp(cosA,-1.,1.)); float r=ang/.50;",
    " vec3 tv=n-g*cosA; float th=atan(dot(tv,up),dot(tv,rt));",
    " float a=th/6.2831853+.5;",
    // ── iris stroma
    " float rp=mix(.22,.60,uPupil);",
    " float rr=clamp((r-rp)/(1.-rp),0.,1.);",
    " float fib=pfbm(vec2(a*72.,rr*2.6+uSeed),72.);",
    " float fib2=pfbm(vec2(a*28.,rr*6.+uSeed*2.),28.);",
    " float coll=.32+.07*(pnoise(vec2(a*22.,uSeed),22.)-.5);",
    " vec3 ic=mix(uIris2,uIris,smoothstep(coll-.05,coll+.10,rr));",
    " ic*=.5+.8*fib;",
    " ic*=1.-.18*(smoothstep(.55,.6,rr)-smoothstep(.6,.66,rr))-.14*(smoothstep(.72,.76,rr)-smoothstep(.76,.81,rr));", // contraction furrows
    " ic=mix(ic,ic*1.35+.06,fib2*.35*smoothstep(.25,.7,rr));",
    " float crypt=smoothstep(.60,.74,pfbm(vec2(a*16.,rr*4.+3.+uSeed),16.))*(1.-smoothstep(.5,.85,rr))*step(.0,rr-.08);",
    " ic*=1.-.5*crypt;",
    " ic=mix(vec3(dot(ic,vec3(.3,.59,.11))),ic,.72);",
    " ic*=1.-.72*smoothstep(.78,1.,rr);",                       // limbal ring
    " ic=mix(ic,vec3(.12,.07,.05),.7*(1.-smoothstep(.0,.05,rr)));", // pupillary ruff
    " ic*=.8+.3*smoothstep(-.9,.6,-dot(tv,up)/max(length(tv),.001));", // lit from below through the cornea
    " float irisM=1.-smoothstep(.96,1.04,r);",
    " float pupM=1.-smoothstep(rp-.025,rp+.012,r);",
    " vec3 pc=vec3(.012,.014,.02)+.035*(1.-r/max(rp,.01));",
    // ── sclera: warm white, pinker toward the corners, thin veins away from the iris
    " vec3 sc=vec3(.90,.88,.85);",
    " sc=mix(sc,vec3(.88,.70,.66),.45*smoothstep(.55,1.,abs(xn)));",
    " float vn=1.-abs(2.*fbm(p*4.2+uSeed*7.)-1.); float vn2=1.-abs(2.*fbm(p*9.+uSeed*3.)-1.);",
    " float far=smoothstep(1.1,2.2,r);",
    " sc=mix(sc,vec3(.74,.30,.28),(smoothstep(.94,.99,vn)*.35+smoothstep(.96,.995,vn2)*.22)*far);",
    " sc*=.94+.06*fbm(p*14.);",
    " vec3 col=mix(sc,ic,irisM); col=mix(col,pc,pupM);",
    // caruncle: pink inner corner
    " float car=exp(-dot((p-vec2(-cx*.9,(yU+yL)*.5))*vec2(6.5,9.),(p-vec2(-cx*.9,(yU+yL)*.5))*vec2(6.5,9.)));",
    " col=mix(col,vec3(.82,.48,.47)*(.8+.3*fbm(p*30.)),.85*car);",
    // ── shading
    " vec3 L=normalize(vec3(-.35,.55,1.));",
    " col*=.62+.42*max(dot(n,L),0.);",
    " col*=mix(.45,1.,smoothstep(.0,.85,n.z));",
    " col*=1.-.18*smoothstep(-.1,-.45,p.y-0.)*(1.-irisM*.5);",
    " float shU=smoothstep(0.,.24,yU-p.y); col*=mix(.32,1.,shU);",
    " col*=mix(.7,1.,smoothstep(0.,.07,p.y-yL));",
    " col*=1.-.35*smoothstep(.62,1.,abs(xn));",
    // ── cornea: bulged normal, softbox + point reflections, tear meniscus
    " vec3 nc=normalize(n+g*.38*(1.-smoothstep(.7,1.18,r)));",
    " vec3 Rf=2.*nc.z*nc-vec3(0.,0.,1.);",
    " float sb=(1.-smoothstep(.035,.075,abs(Rf.x+.42)))*(1.-smoothstep(.05,.095,abs(Rf.y-.50)));",
    " float pt=pow(max(dot(Rf,normalize(vec3(-.42,.5,.76))),0.),700.);",
    " float fill=(1.-smoothstep(.02,.06,length(Rf.xy-vec2(.36,-.30))))*.25;",
    " float spm=mix(.22,1.,1.-smoothstep(.9,1.18,r))*shU;",
    " col+=uWet*(.85*sb+.9*pt+fill)*spm;",
    " float tq=(p.y-yL)/.014; float tm=exp(-tq*tq)*bell; col+=.22*uWet*tm;",
    // ── skin
    " float dU=p.y-yU, dL=yL-p.y;",
    " vec3 sk=uSkin*(.93+.09*fbm(p*38.+uSeed));",
    " float cxf=1.-smoothstep(.92,1.08,abs(p.x)/cx);",  // fade lid terms past the corners
    " float yCr=yUo+.24*bell+.06; float cq=(p.y-yCr)/.035; float crease=exp(-cq*cq)*pow(bell,.5)*(1.-.6*uBlink);",
    " sk*=1.-.32*crease;",
    " sk*=mix(vec3(1.),vec3(1.05,.93,.90),.7*smoothstep(.35,.8,fbm(p*1.8+uSeed*1.7)));",   // uneven redness
    " vec2 fc=floor(p*16.+uSeed); vec2 fo=vec2(hash(fc),hash(fc+7.3)); float fr=length(fract(p*16.+uSeed)-fo*.6-.2);",
    " sk*=1.-.08*step(.9,hash(fc+3.1))*(1.-smoothstep(.05,.12,fr));",                             // sparse freckles
    " float lineU=exp(-pow2((p.y-yCr-.07-.012*sin(p.x*7.+uSeed))/.006))*pow(bell,.8)*.06;",   // fine lid lines
    " float uv=(dL-.15-.015*sin(p.x*5.+uSeed*2.))/.0055; float lineL=exp(-uv*uv)*smoothstep(.2,.8,bell)*step(0.,dL)*.07;",
    " float uv2=(dL-.23-.02*sin(p.x*4.+uSeed))/.007; lineL+=exp(-uv2*uv2)*smoothstep(.3,.9,bell)*step(0.,dL)*.05;",
    " vec2 oc=p-vec2(cx*1.02,cant+.0); float rho=length(oc), phi=atan(oc.y,oc.x);",          // crow's feet, outer corner
    " float rays=1.-smoothstep(.0,.07,abs(fract(phi*2.6+.35*noise(p*5.+uSeed))-.5));",
    " float crow=rays*smoothstep(.1,.18,rho)*(1.-smoothstep(.28,.5,rho))*(1.-smoothstep(.75,1.15,abs(phi)))*(.05+.16*uOpenL);",
    " sk*=1.-lineU-lineL-crow;",
    " sk*=.84+.24*smoothstep(yCr,yCr+.5,p.y);",                      // brow bone catches light
    " sk*=1.-.30*exp(-max(dU,0.)*5.)*step(0.,dU)*(1.-uBlink*.5)*cxf;",   // socket AO above
    " sk*=1.-.22*exp(-max(dL,0.)*7.)*step(0.,dL)*cxf;",
    " float lidRoll=smoothstep(.0,.05,dU)*(1.-smoothstep(.05,.16,dU));", // upper lid rolls toward the light
    " sk*=1.+.10*lidRoll*cxf;",
    " float inX=1.-smoothstep(.86,1.,abs(xn));",
    " float mU=step(0.,dU)*(1.-smoothstep(.008,.022,dU))*inX; float mL=step(0.,dL)*(1.-smoothstep(.006,.02,dL))*inX;",
    " sk=mix(sk,uSkin*vec3(.95,.62,.58),.6*max(mU,mL));",           // wet lid margin
    " sk*=1.-.55*step(0.,dU)*(1.-smoothstep(.012,.04,dU))*inX*(1.-mU*.6);", // lash line
    " float bag=step(0.,dL)*smoothstep(.02,.07,dL)*(1.-smoothstep(.07,.2,dL)); sk*=1.+.08*bag*inX-.08*step(0.,dL)*smoothstep(.16,.26,dL)*(1.-smoothstep(.26,.4,dL))*inX;",
    " sk*=1.-.38*smoothstep(.7,1.5,length(p*vec2(.52,.82)));",       // falloff
    // lashes: upper sweep outward and up, lower short and sparse
    " float lash=0.;",
    " for(int L=0;L<2;L++){ float fL=float(L);",
    "  float fq=36.+fL*17.; float s=p.x*fq+fL*.5;",
    "  float id=floor(s-dU*(19.+fL*6.)*xn); float hj=hash(vec2(id,uSeed+fL));",
    "  s-=dU*((19.+fL*6.)*xn+(hj-.5)*9.)+dU*dU*(46.+20.*hj)*xn;",
    "  float ln=((.13+.12*hj)*(1.-.35*fL))*pow(bell,.35)+.025;",
    "  float k=clamp(dU/ln,0.,1.); float wl=.34*(1.-k*k)+.02;",
    "  float fl=abs(fract(s)-.5);",
    "  lash=max(lash,(1.-smoothstep(wl-.12,wl,fl))*step(0.,dU)*step(dU,ln)*step(abs(xn),.95)*(.75+.25*hj)); }",
    " float s2=p.x*34.+dL*(18.*xn);",
    " float fl2=abs(fract(s2+.4*hash(vec2(floor(s2),5.)))-.5);",
    " float len2=.065*pow(bell,.5);",
    " float lash2=(1.-smoothstep(0.,.16*(1.-dL/max(len2,.001))+.001,fl2))*step(0.,dL)*step(dL,len2)*step(abs(xn),.9)*.7;",
    " sk=mix(sk,vec3(.035,.028,.026),max(lash,lash2)*.92);",
    " col=mix(sk,col,inside);",
    // lash shadow speckle on the eyeball just under the lid
    " col*=1.-.25*inside*smoothstep(.12,0.,yU-p.y)*step(.55,fract(p.x*40.+.2));",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  var SKINS = { warm: [0.78, 0.58, 0.48], porcelain: [0.90, 0.78, 0.71], graphite: [0.25, 0.26, 0.28] };
  var GAZE = { // state -> fixation anchor (x right, y up, -1..1)
    idle: [0, 0], listening: [0, -0.08], speaking: [0, 0], thinking: [-0.42, 0.55], tool: [0.48, -0.08]
  };

  function hex(c, fb) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(c || "").trim());
    if (!m) return fb;
    var n = parseInt(m[1], 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function neutral() {
    var p = AIT.IrisTone && AIT.IrisTone.MODEL.presets.neutral;
    return p ? Object.assign({}, p) : { pupil: 0.45, openU: 1, openL: 0, tilt: 0, blink: 1, saccade: 1, wet: 1 };
  }

  class AitIrisEye extends HTMLElement {
    static get observedAttributes() { return ["state", "expression", "iris", "iris-inner", "skin", "follow", "framing"]; }
    constructor() {
      super();
      var root = this.attachShadow({ mode: "open" });
      root.innerHTML = '<style>:host{display:block;position:relative;aspect-ratio:2/1;min-width:60px;overflow:hidden;background:#2a2320}' +
        ":host([framing=wide]){aspect-ratio:5/3}canvas{position:absolute;inset:0;width:100%;height:100%;display:block}" +
        ".fb{position:absolute;inset:0;display:grid;place-items:center}.fb i{width:30%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#111 0 34%,#4a6f94 36% 70%,#e9e4dc 72%)}</style><canvas></canvas>";
      this._cv = root.querySelector("canvas");
      this._seed = Math.random() * 10;
      this._expr = neutral(); this._mood = null; this._moodUntil = 0; this._forced = null;
      this.head = { x: 0, y: 0, r: 0, s: 1 };
      this.cur = { gx: 0, gy: 0, vx: 0, vy: 0, pupil: 0.45, openU: 1, openL: 0, tilt: 0, wet: 1, blink: 0 };
      this._fix = [0, 0]; this._fixAt = 0; this._override = null;
      this._blinkT = -1; this._nextBlink = performance.now() / 1000 + rand(1.5, 4);
      this._ptr = null; this._ptrAt = -1e9; this._scan = 0; this._wander = [0, 0]; this._wanderAt = 0;
      this._reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      this._onPtr = (e) => { this._ptr = [e.clientX, e.clientY]; this._ptrAt = performance.now() / 1000; };
      this._tick = this._tick.bind(this);
    }
    connectedCallback() {
      if (!this._gl && !this._init()) {
        this.shadowRoot.innerHTML += '<div class="fb"><i></i></div>';
        return;
      }
      window.addEventListener("pointermove", this._onPtr, { passive: true });
      this._ro = new ResizeObserver(() => this._resize()); this._ro.observe(this);
      this._io = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; if (this._visible) this._kick(); });
      this._io.observe(this);
      this._resize(); this._visible = true; this._kick();
    }
    disconnectedCallback() {
      window.removeEventListener("pointermove", this._onPtr);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      cancelAnimationFrame(this._raf); this._raf = 0;
    }
    attributeChangedCallback(name, _, v) {
      if (name === "expression" && v) this.setExpression(v);
      if (name === "state") this._fixAt = 0; // re-aim now
    }

    // ── public API ───────────────────────────────────────────────────────
    get state() { return this.getAttribute("state") || "idle"; }
    set state(v) { this.setAttribute("state", v); }
    setExpression(e) { // a preset name or a params object; stays until cleared with null
      var P = AIT.IrisTone && AIT.IrisTone.MODEL.presets;
      this._forced = e == null ? null : typeof e === "string" ? (P && P[e] ? Object.assign({}, P[e]) : null) : Object.assign(neutral(), e);
      return this;
    }
    setMood(params, hold) { this._mood = Object.assign(neutral(), params); this._moodUntil = performance.now() / 1000 + (hold || 10); return this; }
    feel(text, role) {
      if (!AIT.IrisTone) return null;
      var d = AIT.IrisTone.decide(text, role || "user", this.state);
      this.setMood(d.params, role === "iris" ? 8 : 12);
      return d;
    }
    blink() { if (this._blinkT < 0) this._blinkT = 0; return this; }
    lookAt(x, y, ms) { this._override = { x: clamp(x, -1, 1), y: clamp(y, -1, 1), until: performance.now() / 1000 + (ms || 800) / 1000 }; this._fixAt = 0; return this; }

    // ── GL ───────────────────────────────────────────────────────────────
    _init() {
      var gl = this._cv.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true });
      if (!gl) return false;
      function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
      gl.useProgram(pr);
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this._u = {};
      ["uRes", "uTime", "uPupil", "uOpenU", "uOpenL", "uTilt", "uBlink", "uWet", "uSeed", "uGaze", "uIris", "uIris2", "uSkin", "uBox", "uHead"].forEach((k) => { this._u[k] = gl.getUniformLocation(pr, k); });
      this._gl = gl;
      return true;
    }
    _resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.max(1, Math.round(this.clientWidth * dpr)), h = Math.max(1, Math.round(this.clientHeight * dpr));
      if (this._cv.width !== w || this._cv.height !== h) { this._cv.width = w; this._cv.height = h; }
      this._rect = this.getBoundingClientRect();
    }
    _kick() { if (!this._raf && this._gl) { this._last = performance.now() / 1000; this._raf = requestAnimationFrame(this._tick); } }

    // ── motor model ──────────────────────────────────────────────────────
    _target(now) { // expression = forced > mood (decaying) > neutral
      var base = neutral(), t = this._forced;
      if (!t && this._mood) {
        var k = clamp((this._moodUntil - now) / 3, 0, 1); // hold, then fade over the last 3 s
        t = {}; for (var key in base) t[key] = base[key] + (this._mood[key] - base[key]) * k;
        if (k === 0) this._mood = null;
      }
      t = t || base;
      if (this.state === "listening") t = Object.assign({}, t, { pupil: t.pupil + 0.08 });
      if (this.state === "thinking") t = Object.assign({}, t, { openU: t.openU * 0.94, blink: t.blink * 0.7 });
      return t;
    }
    _aim(now, ex) {
      var st = this.state, a = GAZE[st] || GAZE.idle, x = a[0], y = a[1];
      var follow = (this.getAttribute("follow") || "pointer") === "pointer";
      if (this._override && now < this._override.until) return [this._override.x, this._override.y];
      if (follow && this._ptr && now - this._ptrAt < 2.5 && st !== "thinking" && st !== "tool") {
        var r = this._rect || this.getBoundingClientRect(), D = 520; // assumed viewing distance in px
        var dx = this._ptr[0] - (r.left + r.width / 2), dy = (r.top + r.height / 2) - this._ptr[1];
        return [clamp(Math.atan2(dx, D) / 0.55, -1, 1), clamp(Math.atan2(dy, D) / 0.42, -1, 1)];
      }
      if (st === "thinking") { // slow wander around the upper corner
        if (now > this._wanderAt) { this._wander = [rand(-0.18, 0.18), rand(-0.12, 0.12)]; this._wanderAt = now + rand(0.9, 2.0) / ex.saccade; }
        return [x + this._wander[0], y + this._wander[1]];
      }
      if (st === "tool") { // reading saccades: left-to-right sweep, return, repeat
        var step = Math.floor(now / 0.24) % 6;
        return [x - 0.2 + Math.min(step, 4) * 0.1, y - (Math.floor(now / 1.44) % 3) * 0.05];
      }
      if (st === "speaking" && now > this._wanderAt) { // brief glances away, then back to the user
        this._wanderAt = now + rand(2.5, 5);
        this._wander = Math.random() < 0.5 ? [rand(-0.35, 0.35), rand(-0.1, 0.15)] : [0, 0];
        this._wanderEnd = now + 0.45;
      }
      if (st === "speaking" && now < (this._wanderEnd || 0)) return [this._wander[0], this._wander[1]];
      return [x, y];
    }
    _tick() {
      this._raf = 0;
      if (!this._visible || document.hidden) return;
      var now = performance.now() / 1000, dt = Math.max(0, Math.min(0.05, now - this._last)); this._last = now; // rAF stamps frame start: never negative
      var c = this.cur, ex = this._target(now), rm = this._reduced;

      // saccade: commit to a new fixation after a short latency when the aim moved enough
      var aim = this._aim(now, ex), d = Math.hypot(aim[0] - this._fix[0], aim[1] - this._fix[1]);
      if (d > 0.035 && now >= this._fixAt) {
        if (d > 0.5 && Math.random() < 0.3) this.blink();
        this._fix = aim; this._fixAt = now + rand(0.06, 0.16);
      } else if (!rm && now >= this._fixAt + rand(0.5, 1.4) / ex.saccade) { // microsaccade
        this._fix = [this._fix[0] + rand(-0.018, 0.018), this._fix[1] + rand(-0.014, 0.014)]; this._fixAt = now + 0.05;
      }
      var w = rm ? 14 : 55, ew = Math.exp(-w * dt); // exact critically damped step, ~50 ms saccades
      var x0 = c.gx - this._fix[0], j = (c.vx + w * x0) * dt;
      c.gx = this._fix[0] + (x0 + j) * ew; c.vx = (c.vx - w * j) * ew;
      x0 = c.gy - this._fix[1]; j = (c.vy + w * x0) * dt;
      c.gy = this._fix[1] + (x0 + j) * ew; c.vy = (c.vy - w * j) * ew;

      // head: follows big gaze shifts by ~30 %, sways, nods while speaking, tilts while thinking
      var st = this.state, H = this.head, t = now + this._seed * 10, amp = rm ? 0 : 1;
      var hx = 0.3 * this._fix[0] + amp * (0.22 * Math.sin(t * 0.31) + 0.12 * Math.sin(t * 0.77 + 1.3));
      var hy = 0.3 * this._fix[1] + amp * (0.18 * Math.sin(t * 0.23 + 2.1) + 0.08 * Math.sin(t * 0.61));
      var hr = amp * 0.03 * Math.sin(t * 0.17 + 0.7) + (st === "thinking" ? 0.06 : 0) + ex.tilt * 0.02;
      if (st === "speaking") hy += amp * 0.12 * Math.sin(t * 6.1) * (0.5 + 0.5 * Math.sin(t * 1.3));
      var hs = 1 + (st === "listening" ? 0.04 : 0) + (ex.pupil - 0.45) * 0.08; // lean in when interested
      var eh = 1 - Math.exp(-dt / 0.55);
      H.x += (hx - H.x) * eh; H.y += (hy - H.y) * eh; H.r += (hr - H.r) * eh; H.s += (hs - H.s) * eh;

      // slow channels: pupil (+ hippus), lids, tilt, wetness
      var e = 1 - Math.exp(-dt / 0.35), e2 = 1 - Math.exp(-dt / 0.18);
      var hip = rm ? 0 : 0.025 * Math.sin(now * 0.9 + this._seed) + 0.015 * Math.sin(now * 2.3);
      c.pupil += (clamp(ex.pupil + hip, 0.05, 1) - c.pupil) * e;
      c.openU += (ex.openU + 0.22 * clamp(c.gy, -1, 1) - c.openU) * e2; // lid–gaze coupling
      c.openL += (ex.openL + 0.08 * Math.max(-c.gy, 0) - c.openL) * e2;
      c.tilt += (ex.tilt - c.tilt) * e; c.wet += (ex.wet - c.wet) * e;

      // blink: 75 ms close, 35 ms hold, 160 ms open
      if (this._blinkT < 0 && now >= this._nextBlink) {
        this._blinkT = 0; this._nextBlink = now + rand(2.0, 5.5) / Math.max(ex.blink, 0.2);
        if (Math.random() < 0.15) this._double = true;
      }
      if (this._blinkT >= 0) {
        this._blinkT += dt; var t = this._blinkT;
        c.blink = t < 0.075 ? t / 0.075 : t < 0.11 ? 1 : t < 0.27 ? 1 - (t - 0.11) / 0.16 : 0;
        c.blink = c.blink * c.blink * (3 - 2 * c.blink);
        if (t >= 0.27) { this._blinkT = this._double ? -0.0001 : -1; if (this._double) { this._double = false; this._nextBlink = now + 0.12; } }
      }
      this._draw(now);
      this._raf = requestAnimationFrame(this._tick);
    }
    _draw(now) {
      var gl = this._gl, u = this._u, c = this.cur;
      gl.viewport(0, 0, this._cv.width, this._cv.height);
      gl.uniform2f(u.uRes, this._cv.width, this._cv.height);
      gl.uniform1f(u.uTime, now); gl.uniform1f(u.uSeed, this._seed);
      var h = this.head, wide = this.getAttribute("framing") === "wide";
      gl.uniform4f(u.uBox, 0, wide ? 0 : 0.07, wide ? 1.67 : 1.7, wide ? 1.0 : 0.85);
      gl.uniform4f(u.uHead, h.x * 0.16, h.y * 0.11, h.r, h.s);
      gl.uniform2f(u.uGaze, c.gx - h.x * 0.25, c.gy - h.y * 0.25); // the head took part of the turn
      gl.uniform1f(u.uPupil, c.pupil); gl.uniform1f(u.uOpenU, c.openU); gl.uniform1f(u.uOpenL, c.openL);
      gl.uniform1f(u.uTilt, c.tilt); gl.uniform1f(u.uBlink, c.blink); gl.uniform1f(u.uWet, c.wet);
      var ir = hex(this.getAttribute("iris"), [0.33, 0.45, 0.58]);       // Czech-blue grey
      var ir2 = hex(this.getAttribute("iris-inner"), [0.58, 0.44, 0.27]); // aurora-amber collarette
      var sk = SKINS[this.getAttribute("skin")] || hex(this.getAttribute("skin"), SKINS.warm);
      gl.uniform3fv(u.uIris, ir); gl.uniform3fv(u.uIris2, ir2); gl.uniform3fv(u.uSkin, sk);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  customElements.define("ait-iris-eye", AitIrisEye);
  AIT.IrisEye = AitIrisEye;
})(window.AIT = window.AIT || {});
