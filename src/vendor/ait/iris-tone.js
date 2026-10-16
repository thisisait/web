/* Iris tone model — a small, explainable decision model for the eye.
   text ─► features (lexicon hits, punctuation, caps, emoji)
        ─► tone      { valence -1..1, arousal, uncertainty, curiosity, fatigue 0..1 }
        ─► policy    softmax over expression classes, per role (user | iris) and agent state
        ─► params    the probability-weighted blend of expression presets the eye renders.
   Everything numeric lives in MODEL, so "fine-tuning" means refitting MODEL.policy
   from labelled turns — no code change. decide() returns its reasons, never just a verdict. */
(function (root) {
  "use strict";

  var MODEL = {
    version: "iris-tone/0.1",
    // Prefix match on diacritics-folded lowercase tokens; "word=" = exact token; "a b" = phrase.
    lexicon: {
      pos: ["super", "skvel", "vyborn", "paradn", "dobr", "hezk", "funguj", "povedl", "konecne", "jo=", "jj=", "lecgou", "yes", "great", "nice", "good", "works", "perfect", "awesome", "love", "cool", "ok=", "hotovo", "healthy", "zelen", "ready"],
      thanks: ["diky", "dik=", "dikes", "dekuj", "thanks", "thank", "thx"],
      neg: ["spatn", "nefunguj", "rozbit", "nejde", "problem", "bohuzel", "blbe", "bad", "broken", "wrong", "fail", "sucks", "hate", "pomal", "slow"],
      anger: ["kua=", "kurv", "tvle", "dpc", "do prdele", "sakra", "wtf", "damn", "shit", "zase", "again", "fuck", "kruci"],
      alarm: ["urgent", "hned", "ihned", "rychle", "asap", "down=", "spadl", "pada", "failing", "error", "chyb", "disarmed", "critical", "kritick", "outage", "incident", "utok", "attack", "leak", "unik"],
      hedge: ["mozna", "asi=", "nevim", "snad", "nejsem si jist", "maybe", "perhaps", "not sure", "i think", "might", "probably", "pravdepodobne", "unknown"],
      curious: ["ukaz", "proc", "jak=", "co je", "vysvetli", "zajima", "show", "why", "how", "what", "explain", "graf", "chart", "rad", "rows", "kolik"],
      tired: ["unaven", "pozde", "spat", "tired", "sleepy", "late", "exhausted", "dlouho"]
    },
    negators: ["ne", "not", "no", "nijak", "never", "neni"],
    tone: { // logistic / tanh heads over capped counts
      valence: { bias: 0, pos: 0.9, thanks: 1.1, emojiPos: 0.8, neg: -1.0, anger: -1.3, alarm: -0.7, emojiNeg: -0.8 },
      arousal: { bias: -1.2, excl: 0.7, caps: 1.6, alarm: 0.9, anger: 0.8, emojiPos: 0.3, emojiNeg: 0.3 },
      uncertainty: { bias: -1.6, hedge: 1.1, quest: 0.6, ellipsis: 0.5 },
      curiosity: { bias: -1.4, curious: 1.0, quest: 0.5 },
      fatigue: { bias: -2.0, tired: 1.8 }
    },
    classes: ["neutral", "curious", "focused", "happy", "concerned", "alarmed", "annoyed", "tired"],
    // policy[role][class] = [bias, v+, v-, arousal, uncertainty, curiosity, fatigue]
    // role "user" is an EMPATHY policy: an angry operator makes Iris concerned, never annoyed back.
    policy: {
      user: {
        neutral: [0.6, 0, 0, -0.8, -0.5, -0.5, -0.5],
        curious: [-0.6, 0.3, 0, 0.2, 0.8, 3.0, 0],
        focused: [-0.4, 0, 1.6, 1.0, 0.6, 0.8, 0],
        happy: [-1.0, 3.2, 0, 0.3, 0, 0, 0],
        concerned: [-1.2, 0, 2.2, 0.2, 2.4, 0, 0.6],
        alarmed: [-2.6, 0, 1.4, 2.8, 0, 0, 0],
        annoyed: [-6, 0, 0, 0, 0, 0, 0],
        tired: [-2.0, 0, 0, 0, 0, 0, 4.0]
      },
      iris: { // Iris' own words: hedging shows, alarm shows, pleasure shows
        neutral: [0.6, 0, 0, -0.5, -0.8, -0.3, -0.3],
        curious: [-1.0, 0.2, 0, 0, 0, 1.6, 0],
        focused: [-0.4, 0, 0.8, 0.4, 0, 0.4, 0],
        happy: [-0.8, 2.6, 0, 0.2, 0, 0, 0],
        concerned: [-1.4, 0, 1.4, 0, 3.0, 0, 0],
        alarmed: [-2.6, 0, 0.8, 2.6, 0, 0, 0],
        annoyed: [-2.8, 0, 1.4, 1.2, 0, 0, 0],
        tired: [-2.5, 0, 0, 0, 0, 0, 3.0]
      }
    },
    stateBias: {
      idle: { neutral: 0.5 }, listening: { curious: 0.4 }, thinking: { focused: 0.8 },
      tool: { focused: 1.0 }, speaking: { neutral: 0.3 }
    },
    temperature: 1.0,
    // What each class looks like. pupil 0..1 · openU upper lid (1 = rest) · openL lower-lid raise
    // tilt -1 angry (inner corner down) .. +1 sad (inner corner up) · blink / saccade rate multipliers · wet = specular
    presets: {
      neutral: { pupil: 0.45, openU: 1.0, openL: 0.0, tilt: 0.0, blink: 1.0, saccade: 1.0, wet: 1.0 },
      curious: { pupil: 0.62, openU: 1.12, openL: 0.0, tilt: 0.15, blink: 0.8, saccade: 1.3, wet: 1.1 },
      focused: { pupil: 0.40, openU: 0.84, openL: 0.32, tilt: -0.12, blink: 0.5, saccade: 0.6, wet: 1.0 },
      happy: { pupil: 0.56, openU: 0.90, openL: 0.62, tilt: 0.05, blink: 1.1, saccade: 1.0, wet: 1.25 },
      concerned: { pupil: 0.50, openU: 1.04, openL: 0.10, tilt: 0.60, blink: 1.3, saccade: 1.1, wet: 1.15 },
      alarmed: { pupil: 0.82, openU: 1.26, openL: 0.0, tilt: 0.25, blink: 0.4, saccade: 1.8, wet: 1.0 },
      annoyed: { pupil: 0.34, openU: 0.74, openL: 0.30, tilt: -0.65, blink: 1.4, saccade: 0.9, wet: 0.9 },
      tired: { pupil: 0.46, openU: 0.58, openL: 0.06, tilt: 0.22, blink: 1.6, saccade: 0.5, wet: 0.8 }
    }
  };

  function fold(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function sig(x) { return 1 / (1 + Math.exp(-x)); }
  function cap(n, m) { return Math.min(n, m || 3); }

  function features(text) {
    var raw = String(text || ""), t = fold(raw);
    var tokens = t.split(/[^a-z0-9']+/).filter(Boolean), padded = " " + tokens.join(" ") + " ";
    var hits = {}, f = {}, cat;
    for (cat in MODEL.lexicon) { hits[cat] = []; f[cat] = 0; }
    for (cat in MODEL.lexicon) {
      MODEL.lexicon[cat].forEach(function (e) {
        if (e.indexOf(" ") >= 0) { if (padded.indexOf(" " + e + " ") >= 0 || padded.indexOf(" " + e) >= 0) { f[cat]++; hits[cat].push(e); } return; }
        var exact = e.charAt(e.length - 1) === "=", w = exact ? e.slice(0, -1) : e;
        tokens.forEach(function (tok, i) {
          if (exact ? tok === w : tok.indexOf(w) === 0) {
            // "not good" / "ne dobré": a negated positive counts as negative
            if (cat === "pos" && i > 0 && MODEL.negators.indexOf(tokens[i - 1]) >= 0) { f.neg++; hits.neg.push(tokens[i - 1] + " " + tok); return; }
            f[cat]++; hits[cat].push(tok);
          }
        });
      });
    }
    var words = raw.split(/\s+/).filter(function (w) { return /[A-Za-zÀ-ž]{3,}/.test(w); });
    var shout = words.filter(function (w) { return w === w.toUpperCase() && /[A-Z]/.test(w); }).length;
    f.excl = (raw.match(/!/g) || []).length;
    f.quest = (raw.match(/\?/g) || []).length;
    f.ellipsis = (raw.match(/\.\.\.|…/g) || []).length;
    f.caps = words.length ? shout / words.length : 0;
    f.emojiPos = (raw.match(/[😀-😊😍🙂🙏👍❤🎉✨💪🥳]/gu) || []).length;
    f.emojiNeg = (raw.match(/[😞-😧😡😠😤💀😭😢👎🤬]/gu) || []).length;
    return { f: f, hits: hits };
  }

  function head(w, f) {
    var x = w.bias || 0, k;
    for (k in w) if (k !== "bias") x += w[k] * (k === "caps" ? (f[k] || 0) : cap(f[k] || 0, k === "excl" ? 4 : 3));
    return x;
  }

  function tone(text) {
    var fx = features(text), f = fx.f, T = MODEL.tone;
    return {
      valence: Math.tanh(head(T.valence, f)),
      arousal: sig(head(T.arousal, f)),
      uncertainty: sig(head(T.uncertainty, f)),
      curiosity: sig(head(T.curiosity, f)),
      fatigue: sig(head(T.fatigue, f)),
      features: f, hits: fx.hits
    };
  }

  var AXES = ["bias", "valence+", "valence-", "arousal", "uncertainty", "curiosity", "fatigue"];
  function decide(text, role, state) {
    var tn = tone(text), pol = MODEL.policy[role === "iris" ? "iris" : "user"], sb = MODEL.stateBias[state] || {};
    var x = [1, Math.max(tn.valence, 0), Math.max(-tn.valence, 0), tn.arousal, tn.uncertainty, tn.curiosity, tn.fatigue];
    var logits = MODEL.classes.map(function (c) {
      var w = pol[c], s = sb[c] || 0, i;
      for (i = 0; i < w.length; i++) s += w[i] * x[i];
      return s / MODEL.temperature;
    });
    var mx = Math.max.apply(null, logits), ex = logits.map(function (l) { return Math.exp(l - mx); });
    var sum = ex.reduce(function (a, b) { return a + b; }, 0);
    var probs = {}, top = null;
    MODEL.classes.forEach(function (c, i) { probs[c] = ex[i] / sum; if (!top || probs[c] > probs[top]) top = c; });
    // reasons: the axes that pushed the winning class hardest, with the words behind them
    var w = pol[top], reasons = [];
    for (var i = 1; i < w.length; i++) if (w[i] * x[i] > 0.15) reasons.push({ axis: AXES[i], push: +(w[i] * x[i]).toFixed(2) });
    reasons.sort(function (a, b) { return b.push - a.push; });
    if (sb[top]) reasons.push({ axis: "state:" + state, push: sb[top] });
    return { role: role, state: state, tone: tn, probs: probs, top: top, params: blend(probs), reasons: reasons, model: MODEL.version };
  }

  function blend(probs) {
    var out = {}, c, k;
    for (c in probs) for (k in MODEL.presets[c]) out[k] = (out[k] || 0) + probs[c] * MODEL.presets[c][k];
    return out;
  }

  root.IrisTone = { MODEL: MODEL, features: features, tone: tone, decide: decide, blend: blend, fold: fold };
})(typeof window !== "undefined" ? (window.AIT = window.AIT || {}) : module.exports);
