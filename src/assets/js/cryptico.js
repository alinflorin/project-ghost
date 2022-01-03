var cryptico = (function (t, s) {
  "use strict";
  function e(t) {
    return t && "object" == typeof t && "default" in t ? t : { default: t };
  }
  var i = e(s);
  !(function () {
    const t = {};
    try {
      if (process)
        return (
          (process.env = Object.assign({}, process.env)),
          void Object.assign(process.env, t)
        );
    } catch (t) {}
    globalThis.process = { env: t };
  })();
  const r = {
      Sbox: [
        99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171,
        118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164,
        114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113,
        216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39,
        178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227,
        47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76,
        88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60,
        159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16,
        255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61,
        100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20,
        222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98,
        145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244,
        234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221,
        116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53,
        87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155,
        30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104,
        65, 153, 45, 15, 176, 84, 187, 22,
      ],
      ShiftRowTab: [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11],
      Sbox_Inv: new Array(256),
      ShiftRowTab_Inv: new Array(16),
      xtime: new Array(256),
      Init() {
        for (let t = 0; t < 256; t++) this.Sbox_Inv[this.Sbox[t]] = t;
        for (let t = 0; t < 16; t++)
          this.ShiftRowTab_Inv[this.ShiftRowTab[t]] = t;
        for (let t = 0; t < 128; t++)
          (this.xtime[t] = t << 1), (this.xtime[128 + t] = (t << 1) ^ 27);
      },
      Done() {
        (this.Sbox_Inv.length = 0),
          (this.Sbox_Inv.length = 256),
          (this.ShiftRowTab_Inv.length = 0),
          (this.ShiftRowTab_Inv.length = 16),
          (this.xtime.length = 0),
          (this.xtime.length = 256);
      },
      ExpandKey(t) {
        const s = t.length;
        let e,
          i = 1;
        switch (s) {
          case 16:
            e = 176;
            break;
          case 24:
            e = 208;
            break;
          case 32:
            e = 240;
            break;
          default:
            throw "my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!";
        }
        for (let n = s; n < e; n += 4) {
          let e = t.slice(n - 4, n);
          n % s == 0
            ? ((e = [
                r.Sbox[e[1]] ^ i,
                r.Sbox[e[2]],
                r.Sbox[e[3]],
                r.Sbox[e[0]],
              ]),
              (i <<= 1) >= 256 && (i ^= 283))
            : s > 24 &&
              n % s == 16 &&
              (e = [r.Sbox[e[0]], r.Sbox[e[1]], r.Sbox[e[2]], r.Sbox[e[3]]]);
          for (let i = 0; i < 4; i++) t[n + i] = t[n + i - s] ^ e[i];
        }
      },
      Encrypt(t, s) {
        const e = s.length;
        let i;
        for (r.AddRoundKey(t, s.slice(0, 16)), i = 16; i < e - 16; i += 16)
          r.SubBytes(t, r.Sbox),
            r.ShiftRows(t, r.ShiftRowTab),
            r.MixColumns(t),
            r.AddRoundKey(t, s.slice(i, i + 16));
        r.SubBytes(t, r.Sbox),
          r.ShiftRows(t, r.ShiftRowTab),
          r.AddRoundKey(t, s.slice(i, e));
      },
      Decrypt(t, s) {
        const e = s.length;
        r.AddRoundKey(t, s.slice(e - 16, e)),
          r.ShiftRows(t, r.ShiftRowTab_Inv),
          r.SubBytes(t, r.Sbox_Inv);
        for (let i = e - 32; i >= 16; i -= 16)
          r.AddRoundKey(t, s.slice(i, i + 16)),
            r.MixColumns_Inv(t),
            r.ShiftRows(t, r.ShiftRowTab_Inv),
            r.SubBytes(t, r.Sbox_Inv);
        r.AddRoundKey(t, s.slice(0, 16));
      },
      SubBytes(t, s) {
        for (let e = 0; e < 16; e++) t[e] = s[t[e]];
      },
      AddRoundKey(t, s) {
        for (let e = 0; e < 16; e++) t[e] ^= s[e];
      },
      ShiftRows(t, s) {
        const e = new Array().concat(t);
        for (let i = 0; i < 16; i++) t[i] = e[s[i]];
      },
      MixColumns(t) {
        for (let s = 0; s < 16; s += 4) {
          const e = t[s + 0],
            i = t[s + 1],
            n = t[s + 2],
            o = t[s + 3],
            h = e ^ i ^ n ^ o;
          (t[s + 0] ^= h ^ r.xtime[e ^ i]),
            (t[s + 1] ^= h ^ r.xtime[i ^ n]),
            (t[s + 2] ^= h ^ r.xtime[n ^ o]),
            (t[s + 3] ^= h ^ r.xtime[o ^ e]);
        }
      },
      MixColumns_Inv(t) {
        for (let s = 0; s < 16; s += 4) {
          const e = t[s + 0],
            i = t[s + 1],
            n = t[s + 2],
            o = t[s + 3],
            h = e ^ i ^ n ^ o,
            c = r.xtime[h],
            u = r.xtime[r.xtime[c ^ e ^ n]] ^ h,
            f = r.xtime[r.xtime[c ^ i ^ o]] ^ h;
          (t[s + 0] ^= u ^ r.xtime[e ^ i]),
            (t[s + 1] ^= f ^ r.xtime[i ^ n]),
            (t[s + 2] ^= u ^ r.xtime[n ^ o]),
            (t[s + 3] ^= f ^ r.xtime[o ^ e]);
        }
      },
    },
    n = [],
    o = 256,
    h = Math.pow(2, 52),
    c = 2 * h,
    u = Math.pow(o, 6),
    f = {
      seedrandom(t, s = !1) {
        const e = [];
        t = m(
          a(s ? [t, n] : arguments.length ? t : [new Date().getTime(), n], 3),
          e
        );
        const i = new l(e);
        return (
          m(i.S, n),
          (f.random = function () {
            let t = i.g(6),
              s = u,
              e = 0;
            for (; t < h; ) (t = (t + e) * o), (s *= o), (e = i.g(1));
            for (; t >= c; ) (t /= 2), (s /= 2), (e >>>= 1);
            return (t + e) / s;
          }),
          t
        );
      },
      random: function () {
        return Math.random();
      },
    };
  class l {
    i = 0;
    j = 0;
    S = [];
    c = [];
    constructor(t) {
      let s,
        e,
        i = t.length,
        r = 0,
        n = 0;
      for (i || (t = [i++]); r < o; ) this.S[r] = r++;
      for (r = 0; r < o; r++)
        (s = this.S[r]),
          (n = d(n + s + t[r % i])),
          (e = this.S[n]),
          (this.S[r] = e),
          (this.S[n] = s);
      this.g(o);
    }
    g(t) {
      const s = this.S;
      let e = d(this.i + 1),
        i = s[e],
        r = d(this.j + i),
        n = s[r];
      (s[e] = n), (s[r] = i);
      let h = s[d(i + n)];
      for (; --t; )
        (e = d(e + 1)),
          (i = s[e]),
          (r = d(r + i)),
          (n = s[r]),
          (s[e] = n),
          (s[r] = i),
          (h = h * o + s[d(i + n)]);
      return (this.i = e), (this.j = r), h;
    }
  }
  function a(t, s) {
    const e = [],
      i = typeof t;
    if (s && "object" === i)
      for (const i in t)
        if (i.indexOf("S") < 5)
          try {
            e.push(a(t[i], s - 1));
          } catch (t) {
            console.error(t);
          }
    return e.length ? e : t + ("string" !== i ? "\0" : "");
  }
  function m(t, s) {
    const e = t + "";
    let i = 0;
    for (let t = 0; t < e.length; t++)
      s[d(t)] = d((i ^= 19 * s[d(t)]) + e.charCodeAt(t));
    let r = "";
    return s.forEach((t) => (r += String.fromCharCode(t))), r;
  }
  function d(t) {
    return 255 & t;
  }
  m(Math.random(), n);
  class p {
    nextBytes(t) {
      for (let s = 0; s < t.length; s++) t[s] = Math.floor(256 * f.random());
    }
  }
  class g {
    i = 0;
    j = 0;
    S = [];
    init(t) {
      let s, e, i;
      for (s = 0; s < 256; ++s) this.S[s] = s;
      for (e = 0, s = 0; s < 256; ++s)
        (e = (e + this.S[s] + t[s % t.length]) & 255),
          (i = this.S[s]),
          (this.S[s] = this.S[e]),
          (this.S[e] = i);
      (this.i = 0), (this.j = 0);
    }
    next() {
      (this.i = (this.i + 1) & 255), (this.j = (this.j + this.S[this.i]) & 255);
      const t = this.S[this.i];
      return (
        (this.S[this.i] = this.S[this.j]),
        (this.S[this.j] = t),
        this.S[(t + this.S[this.i]) & 255]
      );
    }
  }
  let b,
    S,
    T = [];
  function w() {
    var t;
    (t = new Date().getTime()),
      (T[S++] ^= 255 & t),
      (T[S++] ^= (t >> 8) & 255),
      (T[S++] ^= (t >> 16) & 255),
      (T[S++] ^= (t >> 24) & 255),
      S >= 256 && (S -= 256);
  }
  if (!T) {
    let t;
    for (T = [], S = 0; S < 256; )
      (t = Math.floor(65536 * Math.random())),
        (T[S++] = t >>> 8),
        (T[S++] = 255 & t);
    (S = 0), w();
  }
  function y() {
    if (!b) {
      for (w(), b = new g(), b.init(T), S = 0; S < T.length; ++S) T[S] = 0;
      S = 0;
    }
    return b.next();
  }
  class v {
    nextBytes(t) {
      let s;
      for (s = 0; s < t.length; ++s) t[s] = y();
    }
  }
  const D = (t, s) => t & s,
    A = (t, s) => t | s,
    x = (t, s) => t ^ s,
    B = (t, s) => t & ~s;
  class R {
    static DB = 30;
    static DM = (1 << 30) - 1;
    static DV = 1 << 30;
    static FV = Math.pow(2, 52);
    static F1 = 22;
    static F2 = 8;
    static ZERO = new R(0);
    static ONE = new R(1);
    s = 0;
    t = 0;
    constructor(t, s, e) {
      t &&
        ("number" == typeof t
          ? s
            ? this.fromNumber(t, s, e)
            : this.fromInt(t)
          : this.fromString(t, s || 256));
    }
    am(t, s, e, i, r, n) {
      const o = 32767 & s,
        h = s >> 15;
      for (; --n >= 0; ) {
        let s = 32767 & this[t];
        const n = this[t++] >> 15,
          c = h * s + n * o;
        (s = o * s + ((32767 & c) << 15) + e[i] + (1073741823 & r)),
          (r = (s >>> 30) + (c >>> 15) + h * n + (r >>> 30)),
          (e[i++] = 1073741823 & s);
      }
      return r;
    }
    copyTo(t) {
      for (let s = this.t - 1; s >= 0; --s) t[s] = this[s];
      (t.t = this.t), (t.s = this.s);
    }
    fromInt(t) {
      (this.t = 1),
        (this.s = t < 0 ? -1 : 0),
        t > 0 ? (this[0] = t) : t < -1 ? (this[0] = t + R.DV) : (this.t = 0);
    }
    fromString(t, s) {
      let e;
      if (16 === s) e = 4;
      else if (8 === s) e = 3;
      else if (256 === s) e = 8;
      else if (2 === s) e = 1;
      else if (32 === s) e = 5;
      else {
        if (4 !== s) return void this.fromRadix(t, s);
        e = 2;
      }
      (this.t = 0), (this.s = 0);
      let i = t.length,
        r = !1,
        n = 0;
      for (; --i >= 0; ) {
        const s = 8 === e ? t[i] : I(t, i);
        s < 0
          ? "-" === t.charAt(i) && (r = !0)
          : ((r = !1),
            0 === n
              ? (this[this.t++] = s)
              : n + e > R.DB
              ? ((this[this.t - 1] |= (s & ((1 << (R.DB - n)) - 1)) << n),
                (this[this.t++] = s >> (R.DB - n)))
              : (this[this.t - 1] |= s << n),
            (n += e),
            n >= R.DB && (n -= R.DB));
      }
      8 === e &&
        0 != (128 & t[0]) &&
        ((this.s = -1),
        n > 0 && (this[this.t - 1] |= ((1 << (R.DB - n)) - 1) << n)),
        this.clamp(),
        r && R.ZERO.subTo(this, this);
    }
    clamp() {
      const t = this.s & R.DM;
      for (; this.t > 0 && this[this.t - 1] === t; ) --this.t;
    }
    toString(t = 16) {
      if (this.s < 0) return "-" + this.negate().toString(t);
      let s;
      if (16 === t) s = 4;
      else if (8 === t) s = 3;
      else if (2 === t) s = 1;
      else if (32 === t) s = 5;
      else if (64 === t) s = 6;
      else {
        if (4 !== t) return this.toRadix(t);
        s = 2;
      }
      const e = (1 << s) - 1;
      let i,
        r = !1,
        n = "",
        o = this.t,
        h = R.DB - ((o * R.DB) % s);
      if (o-- > 0)
        for (
          h < R.DB && (i = this[o] >> h) > 0 && ((r = !0), (n = O(i)));
          o >= 0;

        )
          h < s
            ? ((i = (this[o] & ((1 << h) - 1)) << (s - h)),
              (i |= this[--o] >> (h += R.DB - s)))
            : ((i = (this[o] >> (h -= s)) & e), h <= 0 && ((h += R.DB), --o)),
            i > 0 && (r = !0),
            r && (n += O(i));
      return r ? n : "0";
    }
    negate() {
      const t = new R();
      return R.ZERO.subTo(this, t), t;
    }
    abs() {
      return this.s < 0 ? this.negate() : this;
    }
    compareTo(t) {
      let s = this.s - t.s;
      if (0 !== s) return s;
      let e = this.t;
      if (((s = e - t.t), 0 !== s)) return s;
      for (; --e >= 0; ) if (0 != (s = this[e] - t[e])) return s;
      return 0;
    }
    bitLength() {
      return this.t <= 0
        ? 0
        : R.DB * (this.t - 1) + q(this[this.t - 1] ^ (this.s & R.DM));
    }
    dlShiftTo(t, s) {
      let e;
      for (e = this.t - 1; e >= 0; --e) s[e + t] = this[e];
      for (e = t - 1; e >= 0; --e) s[e] = 0;
      (s.t = this.t + t), (s.s = this.s);
    }
    drShiftTo(t, s) {
      for (let e = t; e < this.t; ++e) s[e - t] = this[e];
      (s.t = Math.max(this.t - t, 0)), (s.s = this.s);
    }
    lShiftTo(t, s) {
      const e = t % R.DB,
        i = R.DB - e,
        r = (1 << i) - 1,
        n = Math.floor(t / R.DB);
      let o,
        h = (this.s << e) & R.DM;
      for (o = this.t - 1; o >= 0; --o)
        (s[o + n + 1] = (this[o] >> i) | h), (h = (this[o] & r) << e);
      for (o = n - 1; o >= 0; --o) s[o] = 0;
      (s[n] = h), (s.t = this.t + n + 1), (s.s = this.s), s.clamp();
    }
    rShiftTo(t, s) {
      s.s = this.s;
      const e = Math.floor(t / R.DB);
      if (e >= this.t) return void (s.t = 0);
      const i = t % R.DB,
        r = R.DB - i,
        n = (1 << i) - 1;
      s[0] = this[e] >> i;
      for (let t = e + 1; t < this.t; ++t)
        (s[t - e - 1] |= (this[t] & n) << r), (s[t - e] = this[t] >> i);
      i > 0 && (s[this.t - e - 1] |= (this.s & n) << r),
        (s.t = this.t - e),
        s.clamp();
    }
    subTo(t, s) {
      const e = Math.min(t.t, this.t);
      let i = 0,
        r = 0;
      for (; i < e; ) (r += this[i] - t[i]), (s[i++] = r & R.DM), (r >>= R.DB);
      if (t.t < this.t) {
        for (r -= t.s; i < this.t; )
          (r += this[i]), (s[i++] = r & R.DM), (r >>= R.DB);
        r += this.s;
      } else {
        for (r += this.s; i < t.t; )
          (r -= t[i]), (s[i++] = r & R.DM), (r >>= R.DB);
        r -= t.s;
      }
      (s.s = r < 0 ? -1 : 0),
        r < -1 ? (s[i++] = R.DV + r) : r > 0 && (s[i++] = r),
        (s.t = i),
        s.clamp();
    }
    multiplyTo(t, s) {
      const e = this.abs(),
        i = t.abs();
      let r = e.t;
      for (s.t = r + i.t; --r >= 0; ) s[r] = 0;
      for (r = 0; r < i.t; ++r) s[r + e.t] = e.am(0, i[r], s, r, 0, e.t);
      (s.s = 0), s.clamp(), this.s !== t.s && R.ZERO.subTo(s, s);
    }
    squareTo(t) {
      const s = this.abs();
      let e = (t.t = 2 * s.t);
      for (; --e >= 0; ) t[e] = 0;
      for (e = 0; e < s.t - 1; ++e) {
        const i = s.am(e, s[e], t, 2 * e, 0, 1);
        (t[e + s.t] += s.am(e + 1, 2 * s[e], t, 2 * e + 1, i, s.t - e - 1)) >=
          R.DV && ((t[e + s.t] -= R.DV), (t[e + s.t + 1] = 1));
      }
      t.t > 0 && (t[t.t - 1] += s.am(e, s[e], t, 2 * e, 0, 1)),
        (t.s = 0),
        t.clamp();
    }
    divRemTo(t, s, e) {
      const i = t.abs();
      if (i.t <= 0) return;
      const r = this.abs();
      if (r.t < i.t) return s && s.fromInt(0), void (e && this.copyTo(e));
      e || (e = new R());
      const n = new R(),
        o = this.s,
        h = t.s,
        c = R.DB - q(i[i.t - 1]);
      c > 0 ? (i.lShiftTo(c, n), r.lShiftTo(c, e)) : (i.copyTo(n), r.copyTo(e));
      const u = n.t,
        f = n[u - 1];
      if (0 === f) return;
      const l = f * (1 << R.F1) + (u > 1 ? n[u - 2] >> R.F2 : 0),
        a = R.FV / l,
        m = (1 << R.F1) / l,
        d = 1 << R.F2,
        p = s || new R();
      let g = e.t,
        b = g - u;
      for (
        n.dlShiftTo(b, p),
          e.compareTo(p) >= 0 && ((e[e.t++] = 1), e.subTo(p, e)),
          R.ONE.dlShiftTo(u, p),
          p.subTo(n, n);
        n.t < u;

      )
        n[n.t++] = 0;
      for (; --b >= 0; ) {
        let t = e[--g] === f ? R.DM : Math.floor(e[g] * a + (e[g - 1] + d) * m);
        if ((e[g] += n.am(0, t, e, b, 0, u)) < t)
          for (n.dlShiftTo(b, p), e.subTo(p, e); e[g] < --t; ) e.subTo(p, e);
      }
      s && (e.drShiftTo(u, s), o !== h && R.ZERO.subTo(s, s)),
        (e.t = u),
        e.clamp(),
        c > 0 && e.rShiftTo(c, e),
        o < 0 && R.ZERO.subTo(e, e);
    }
    mod(t) {
      const s = new R();
      return (
        this.abs().divRemTo(t, void 0, s),
        this.s < 0 && s.compareTo(R.ZERO) > 0 && t.subTo(s, s),
        s
      );
    }
    invDigit() {
      if (this.t < 1) return 0;
      const t = this[0];
      if (0 == (1 & t)) return 0;
      let s = 3 & t;
      return (
        (s = (s * (2 - (15 & t) * s)) & 15),
        (s = (s * (2 - (255 & t) * s)) & 255),
        (s = (s * (2 - (((65535 & t) * s) & 65535))) & 65535),
        (s = (s * (2 - ((t * s) % R.DV))) % R.DV),
        s > 0 ? R.DV - s : -s
      );
    }
    isEven() {
      return 0 === (this.t > 0 ? 1 & this[0] : this.s);
    }
    exp(t, s) {
      if (t > 4294967295 || t < 1) return R.ONE;
      const e = s.convert(this);
      let i = new R(),
        r = new R(),
        n = q(t) - 1;
      for (e.copyTo(i); --n >= 0; )
        if ((s.sqrTo(i, r), (t & (1 << n)) > 0)) s.mulTo(r, e, i);
        else {
          const t = i;
          (i = r), (r = t);
        }
      return s.revert(i);
    }
    modPowInt(t, s) {
      let e;
      return (e = t < 256 || s.isEven() ? new P(s) : new N(s)), this.exp(t, e);
    }
    clone() {
      const t = new R();
      return this.copyTo(t), t;
    }
    intValue() {
      if (this.s < 0) {
        if (1 === this.t) return this[0] - R.DV;
        if (0 === this.t) return -1;
      } else {
        if (1 === this.t) return this[0];
        if (0 === this.t) return 0;
      }
      return ((this[1] & ((1 << (32 - R.DB)) - 1)) << R.DB) | this[0];
    }
    byteValue() {
      return 0 === this.t ? this.s : (this[0] << 24) >> 24;
    }
    shortValue() {
      return 0 === this.t ? this.s : (this[0] << 16) >> 16;
    }
    chunkSize(t) {
      return Math.floor((Math.LN2 * R.DB) / Math.log(t));
    }
    signum() {
      return this.s < 0
        ? -1
        : this.t <= 0 || (1 === this.t && this[0] <= 0)
        ? 0
        : 1;
    }
    toRadix(t) {
      if ((t || (t = 10), 0 === this.signum() || t < 2 || t > 36)) return "0";
      const s = this.chunkSize(t),
        e = Math.pow(t, s),
        i = new R(e),
        r = new R(),
        n = new R();
      let o = "";
      for (this.divRemTo(i, r, n); r.signum() > 0; )
        (o = (e + n.intValue()).toString(t).substr(1) + o), r.divRemTo(i, r, n);
      return n.intValue().toString(t) + o;
    }
    fromRadix(t, s) {
      this.fromInt(0), s || (s = 10);
      const e = this.chunkSize(s),
        i = Math.pow(s, e);
      let r = !1,
        n = 0,
        o = 0;
      for (let h = 0; h < t.length; ++h) {
        const c = I(t, h);
        c < 0
          ? "-" === t.charAt(h) && 0 === this.signum() && (r = !0)
          : ((o = s * o + c),
            ++n >= e &&
              (this.dMultiply(i), this.dAddOffset(o, 0), (n = 0), (o = 0)));
      }
      n > 0 && (this.dMultiply(Math.pow(s, n)), this.dAddOffset(o, 0)),
        r && R.ZERO.subTo(this, this);
    }
    fromNumber(t, s, e) {
      if ("number" == typeof s)
        if (t < 2) this.fromInt(1);
        else
          for (
            this.fromNumber(t, e),
              this.testBit(t - 1) ||
                this.bitwiseTo(R.ONE.shiftLeft(t - 1), A, this),
              this.isEven() && this.dAddOffset(1, 0);
            !this.isProbablePrime(s);

          )
            this.dAddOffset(2, 0),
              this.bitLength() > t && this.subTo(R.ONE.shiftLeft(t - 1), this);
      else {
        const e = [],
          i = 7 & t;
        (e.length = 1 + (t >> 3)),
          s.nextBytes(e),
          i > 0 ? (e[0] &= (1 << i) - 1) : (e[0] = 0),
          this.fromString(e, 256);
      }
    }
    toByteArray() {
      const t = [];
      let s = this.t;
      t[0] = this.s;
      let e,
        i = R.DB - ((s * R.DB) % 8),
        r = 0;
      if (s-- > 0)
        for (
          i < R.DB &&
          (e = this[s] >> i) != (this.s & R.DM) >> i &&
          (t[r++] = e | (this.s << (R.DB - i)));
          s >= 0;

        )
          i < 8
            ? ((e = (this[s] & ((1 << i) - 1)) << (8 - i)),
              (e |= this[--s] >> (i += R.DB - 8)))
            : ((e = (this[s] >> (i -= 8)) & 255), i <= 0 && ((i += R.DB), --s)),
            0 != (128 & e) && (e |= -256),
            0 === r && (128 & this.s) != (128 & e) && ++r,
            (r > 0 || e !== this.s) && (t[r++] = e);
      return t;
    }
    equals(t) {
      return 0 === this.compareTo(t);
    }
    min(t) {
      return this.compareTo(t) < 0 ? this : t;
    }
    max(t) {
      return this.compareTo(t) > 0 ? this : t;
    }
    bitwiseTo(t, s, e) {
      const i = Math.min(t.t, this.t);
      let r;
      for (let r = 0; r < i; ++r) e[r] = s(this[r], t[r]);
      if (t.t < this.t) {
        r = t.s & R.DM;
        for (let t = i; t < this.t; ++t) e[t] = s(this[t], r);
        e.t = this.t;
      } else {
        r = this.s & R.DM;
        for (let n = i; n < t.t; ++n) e[n] = s(r, t[n]);
        e.t = t.t;
      }
      (e.s = s(this.s, t.s)), e.clamp();
    }
    and(t) {
      const s = new R();
      return this.bitwiseTo(t, D, s), s;
    }
    or(t) {
      const s = new R();
      return this.bitwiseTo(t, A, s), s;
    }
    xor(t) {
      const s = new R();
      return this.bitwiseTo(t, x, s), s;
    }
    andNot(t) {
      const s = new R();
      return this.bitwiseTo(t, B, s), s;
    }
    not() {
      const t = new R();
      for (let s = 0; s < this.t; ++s) t[s] = R.DM & ~this[s];
      return (t.t = this.t), (t.s = ~this.s), t;
    }
    shiftLeft(t) {
      const s = new R();
      return t < 0 ? this.rShiftTo(-t, s) : this.lShiftTo(t, s), s;
    }
    shiftRight(t) {
      const s = new R();
      return t < 0 ? this.lShiftTo(-t, s) : this.rShiftTo(t, s), s;
    }
    getLowestSetBit() {
      for (let t = 0; t < this.t; ++t)
        if (0 !== this[t]) return t * R.DB + K(this[t]);
      return this.s < 0 ? this.t * R.DB : -1;
    }
    bitCount() {
      const t = this.s & R.DM;
      let s = 0;
      for (let e = 0; e < this.t; ++e) s += k(this[e] ^ t);
      return s;
    }
    testBit(t) {
      const s = Math.floor(t / R.DB);
      return s >= this.t ? 0 !== this.s : 0 != (this[s] & (1 << t % R.DB));
    }
    changeBit(t, s) {
      const e = R.ONE.shiftLeft(t);
      return this.bitwiseTo(e, s, e), e;
    }
    setBit(t) {
      return this.changeBit(t, A);
    }
    clearBit(t) {
      return this.changeBit(t, B);
    }
    flipBit(t) {
      return this.changeBit(t, x);
    }
    addTo(t, s) {
      const e = Math.min(t.t, this.t);
      let i = 0,
        r = 0;
      for (; i < e; ) (r += this[i] + t[i]), (s[i++] = r & R.DM), (r >>= R.DB);
      if (t.t < this.t) {
        for (r += t.s; i < this.t; )
          (r += this[i]), (s[i++] = r & R.DM), (r >>= R.DB);
        r += this.s;
      } else {
        for (r += this.s; i < t.t; )
          (r += t[i]), (s[i++] = r & R.DM), (r >>= R.DB);
        r += t.s;
      }
      (s.s = r < 0 ? -1 : 0),
        r > 0 ? (s[i++] = r) : r < -1 && (s[i++] = R.DV + r),
        (s.t = i),
        s.clamp();
    }
    add(t) {
      const s = new R();
      return this.addTo(t, s), s;
    }
    subtract(t) {
      const s = new R();
      return this.subTo(t, s), s;
    }
    multiply(t) {
      const s = new R();
      return this.multiplyTo(t, s), s;
    }
    square() {
      const t = new R();
      return this.squareTo(t), t;
    }
    divide(t) {
      const s = new R();
      return this.divRemTo(t, s, void 0), s;
    }
    remainder(t) {
      const s = new R();
      return this.divRemTo(t, void 0, s), s;
    }
    divideAndRemainder(t) {
      const s = new R(),
        e = new R();
      return this.divRemTo(t, s, e), [s, e];
    }
    dMultiply(t) {
      (this[this.t] = this.am(0, t - 1, this, 0, 0, this.t)),
        ++this.t,
        this.clamp();
    }
    dAddOffset(t, s) {
      if (0 !== t) {
        for (; this.t <= s; ) this[this.t++] = 0;
        for (this[s] += t; this[s] >= R.DV; )
          (this[s] -= R.DV), ++s >= this.t && (this[this.t++] = 0), ++this[s];
      }
    }
    pow(t) {
      return this.exp(t, new V());
    }
    multiplyLowerTo(t, s, e) {
      let i,
        r = Math.min(this.t + t.t, s);
      for (e.s = 0, e.t = r; r > 0; ) e[--r] = 0;
      for (i = e.t - this.t; r < i; ++r)
        e[r + this.t] = this.am(0, t[r], e, r, 0, this.t);
      for (i = Math.min(t.t, s); r < i; ++r) this.am(0, t[r], e, r, 0, s - r);
      e.clamp();
    }
    multiplyUpperTo(t, s, e) {
      --s;
      let i = (e.t = this.t + t.t - s);
      for (e.s = 0; --i >= 0; ) e[i] = 0;
      for (i = Math.max(s - this.t, 0); i < t.t; ++i)
        e[this.t + i - s] = this.am(s - i, t[i], e, 0, 0, this.t + i - s);
      e.clamp(), e.drShiftTo(1, e);
    }
    modPow(t, s) {
      let e,
        i,
        r = t.bitLength(),
        n = new R(1);
      if (r <= 0) return n;
      (e = r < 18 ? 1 : r < 48 ? 3 : r < 144 ? 4 : r < 768 ? 5 : 6),
        (i = r < 8 ? new P(s) : s.isEven() ? new _(s) : new N(s));
      const o = [],
        h = e - 1,
        c = (1 << e) - 1;
      let u = 3;
      if (((o[1] = i.convert(this)), e > 1)) {
        const t = new R();
        for (i.sqrTo(o[1], t); u <= c; )
          (o[u] = new R()), i.mulTo(t, o[u - 2], o[u]), (u += 2);
      }
      let f,
        l,
        a = t.t - 1,
        m = !0,
        d = new R();
      for (r = q(t[a]) - 1; a >= 0; ) {
        for (
          r >= h
            ? (f = (t[a] >> (r - h)) & c)
            : ((f = (t[a] & ((1 << (r + 1)) - 1)) << (h - r)),
              a > 0 && (f |= t[a - 1] >> (R.DB + r - h))),
            u = e;
          0 == (1 & f);

        )
          (f >>= 1), --u;
        if (((r -= u) < 0 && ((r += R.DB), --a), m)) o[f].copyTo(n), (m = !1);
        else {
          for (; u > 1; ) i.sqrTo(n, d), i.sqrTo(d, n), (u -= 2);
          u > 0 ? i.sqrTo(n, d) : ((l = n), (n = d), (d = l)),
            i.mulTo(d, o[f], n);
        }
        for (; a >= 0 && 0 == (t[a] & (1 << r)); )
          i.sqrTo(n, d),
            (l = n),
            (n = d),
            (d = l),
            --r < 0 && ((r = R.DB - 1), --a);
      }
      return i.revert(n);
    }
    gcd(t) {
      let s = this.s < 0 ? this.negate() : this.clone(),
        e = t.s < 0 ? t.negate() : t.clone();
      if (s.compareTo(e) < 0) {
        const t = s;
        (s = e), (e = t);
      }
      let i = s.getLowestSetBit(),
        r = e.getLowestSetBit();
      if (r < 0) return s;
      for (
        i < r && (r = i), r > 0 && (s.rShiftTo(r, s), e.rShiftTo(r, e));
        s.signum() > 0;

      )
        (i = s.getLowestSetBit()) > 0 && s.rShiftTo(i, s),
          (i = e.getLowestSetBit()) > 0 && e.rShiftTo(i, e),
          s.compareTo(e) >= 0
            ? (s.subTo(e, s), s.rShiftTo(1, s))
            : (e.subTo(s, e), e.rShiftTo(1, e));
      return r > 0 && e.lShiftTo(r, e), e;
    }
    modInt(t) {
      if (t <= 0) return 0;
      const s = R.DV % t;
      let e = this.s < 0 ? t - 1 : 0;
      if (this.t > 0)
        if (0 === s) e = this[0] % t;
        else for (let i = this.t - 1; i >= 0; --i) e = (s * e + this[i]) % t;
      return e;
    }
    modInverse(t) {
      const s = t.isEven();
      if ((this.isEven() && s) || 0 === t.signum()) return R.ZERO;
      const e = t.clone(),
        i = this.clone(),
        r = new R(1),
        n = new R(0),
        o = new R(0),
        h = new R(1);
      for (; 0 !== e.signum(); ) {
        for (; e.isEven(); )
          e.rShiftTo(1, e),
            s
              ? ((r.isEven() && n.isEven()) ||
                  (r.addTo(this, r), n.subTo(t, n)),
                r.rShiftTo(1, r))
              : n.isEven() || n.subTo(t, n),
            n.rShiftTo(1, n);
        for (; i.isEven(); )
          i.rShiftTo(1, i),
            s
              ? ((o.isEven() && h.isEven()) ||
                  (o.addTo(this, o), h.subTo(t, h)),
                o.rShiftTo(1, o))
              : h.isEven() || h.subTo(t, h),
            h.rShiftTo(1, h);
        e.compareTo(i) >= 0
          ? (e.subTo(i, e), s && r.subTo(o, r), n.subTo(h, n))
          : (i.subTo(e, i), s && o.subTo(r, o), h.subTo(n, h));
      }
      return 0 !== i.compareTo(R.ONE)
        ? R.ZERO
        : h.compareTo(t) >= 0
        ? h.subtract(t)
        : h.signum() < 0
        ? (h.addTo(t, h), h.signum() < 0 ? h.add(t) : h)
        : h;
    }
    static lowprimes = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
      71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149,
      151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
      233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
      317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
      419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499,
      503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601,
      607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691,
      701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809,
      811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907,
      911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997,
    ];
    static lplim = (1 << 26) / R.lowprimes[R.lowprimes.length - 1];
    isProbablePrime(t) {
      const s = this.abs();
      let e;
      if (1 === s.t && s[0] <= R.lowprimes[R.lowprimes.length - 1]) {
        for (e = 0; e < R.lowprimes.length; ++e)
          if (s[0] === R.lowprimes[e]) return !0;
        return !1;
      }
      if (s.isEven()) return !1;
      for (e = 1; e < R.lowprimes.length; ) {
        let t = R.lowprimes[e],
          i = e + 1;
        for (; i < R.lowprimes.length && t < R.lplim; ) t *= R.lowprimes[i++];
        for (t = s.modInt(t); e < i; ) if (t % R.lowprimes[e++] == 0) return !1;
      }
      return s.millerRabin(t);
    }
    millerRabin(t) {
      const s = this.subtract(R.ONE),
        e = s.getLowestSetBit();
      if (e <= 0) return !1;
      const i = s.shiftRight(e);
      (t = (t + 1) >> 1) > R.lowprimes.length && (t = R.lowprimes.length);
      const r = new R();
      for (let n = 0; n < t; ++n) {
        r.fromInt(R.lowprimes[Math.floor(f.random() * R.lowprimes.length)]);
        let t = r.modPow(i, this);
        if (0 !== t.compareTo(R.ONE) && 0 !== t.compareTo(s)) {
          let i = 1;
          for (; i++ < e && 0 !== t.compareTo(s); )
            if (((t = t.modPowInt(2, this)), 0 === t.compareTo(R.ONE)))
              return !1;
          if (0 !== t.compareTo(s)) return !1;
        }
      }
      return !0;
    }
  }
  const C = [];
  let E, M;
  for (E = "0".charCodeAt(0), M = 0; M <= 9; ++M) C[E++] = M;
  for (E = "a".charCodeAt(0), M = 10; M < 36; ++M) C[E++] = M;
  for (E = "A".charCodeAt(0), M = 10; M < 36; ++M) C[E++] = M;
  function O(t) {
    return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t);
  }
  function I(t, s) {
    const e = C[t.charCodeAt(s)];
    return null == e ? -1 : e;
  }
  function q(t) {
    let s,
      e = 1;
    return (
      0 != (s = t >>> 16) && ((t = s), (e += 16)),
      0 != (s = t >> 8) && ((t = s), (e += 8)),
      0 != (s = t >> 4) && ((t = s), (e += 4)),
      0 != (s = t >> 2) && ((t = s), (e += 2)),
      0 != (s = t >> 1) && (e += 1),
      e
    );
  }
  class P {
    m;
    constructor(t) {
      this.m = t;
    }
    convert(t) {
      return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t;
    }
    revert(t) {
      return t;
    }
    reduce(t) {
      t.divRemTo(this.m, void 0, t);
    }
    mulTo(t, s, e) {
      t.multiplyTo(s, e), this.reduce(e);
    }
    sqrTo(t, s) {
      t.squareTo(s), this.reduce(s);
    }
  }
  class N {
    m;
    mp;
    mpl;
    mph;
    um;
    mt2;
    constructor(t) {
      (this.m = t),
        (this.mp = t.invDigit()),
        (this.mpl = 32767 & this.mp),
        (this.mph = this.mp >> 15),
        (this.um = (1 << (R.DB - 15)) - 1),
        (this.mt2 = 2 * t.t);
    }
    convert(t) {
      const s = new R();
      return (
        t.abs().dlShiftTo(this.m.t, s),
        s.divRemTo(this.m, void 0, s),
        t.s < 0 && s.compareTo(R.ZERO) > 0 && this.m.subTo(s, s),
        s
      );
    }
    revert(t) {
      const s = new R();
      return t.copyTo(s), this.reduce(s), s;
    }
    reduce(t) {
      for (; t.t <= this.mt2; ) t[t.t++] = 0;
      for (let s = 0; s < this.m.t; ++s) {
        let e = 32767 & t[s];
        const i =
          (e * this.mpl +
            (((e * this.mph + (t[s] >> 15) * this.mpl) & this.um) << 15)) &
          R.DM;
        for (
          e = s + this.m.t, t[e] += this.m.am(0, i, t, s, 0, this.m.t);
          t[e] >= R.DV;

        )
          (t[e] -= R.DV), t[++e]++;
      }
      t.clamp(),
        t.drShiftTo(this.m.t, t),
        t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
    }
    sqrTo(t, s) {
      t.squareTo(s), this.reduce(s);
    }
    mulTo(t, s, e) {
      t.multiplyTo(s, e), this.reduce(e);
    }
  }
  function K(t) {
    if (0 === t) return -1;
    let s = 0;
    return (
      0 == (65535 & t) && ((t >>= 16), (s += 16)),
      0 == (255 & t) && ((t >>= 8), (s += 8)),
      0 == (15 & t) && ((t >>= 4), (s += 4)),
      0 == (3 & t) && ((t >>= 2), (s += 2)),
      0 == (1 & t) && ++s,
      s
    );
  }
  function k(t) {
    let s = 0;
    for (; 0 !== t; ) (t &= t - 1), ++s;
    return s;
  }
  class V {
    convert = L;
    revert = L;
    reduce = () => {};
    mulTo(t, s, e) {
      t.multiplyTo(s, e);
    }
    sqrTo(t, s) {
      t.squareTo(s);
    }
  }
  function L(t) {
    return t;
  }
  class _ {
    r2;
    q3;
    mu;
    m;
    constructor(t) {
      (this.r2 = new R()),
        (this.q3 = new R()),
        R.ONE.dlShiftTo(2 * t.t, this.r2),
        (this.mu = this.r2.divide(t)),
        (this.m = t);
    }
    convert(t) {
      if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
      if (t.compareTo(this.m) < 0) return t;
      {
        const s = new R();
        return t.copyTo(s), this.reduce(s), s;
      }
    }
    revert(t) {
      return t;
    }
    reduce(t) {
      for (
        t.drShiftTo(this.m.t - 1, this.r2),
          t.t > this.m.t + 1 && ((t.t = this.m.t + 1), t.clamp()),
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        t.compareTo(this.r2) < 0;

      )
        t.dAddOffset(1, this.m.t + 1);
      for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; ) t.subTo(this.m, t);
    }
    sqrTo(t, s) {
      t.squareTo(s), this.reduce(s);
    }
    mulTo(t, s, e) {
      t.multiplyTo(s, e), this.reduce(e);
    }
  }
  function j(t) {
    t = t.replace(/\r\n/g, "\n");
    let s = "";
    for (let e = 0; e < t.length; e++) {
      const i = t.charCodeAt(e);
      i < 128
        ? (s += String.fromCharCode(i))
        : i > 127 && i < 2048
        ? ((s += String.fromCharCode((i >> 6) | 192)),
          (s += String.fromCharCode((63 & i) | 128)))
        : ((s += String.fromCharCode((i >> 12) | 224)),
          (s += String.fromCharCode(((i >> 6) & 63) | 128)),
          (s += String.fromCharCode((63 & i) | 128)));
    }
    return s;
  }
  const F = process.env.NODEJS
      ? function (t) {
          return i.default.createHash("sha256").update(t, "utf8").digest("hex");
        }
      : function (t) {
          function s(t, s) {
            const e = (65535 & t) + (65535 & s);
            return (((t >> 16) + (s >> 16) + (e >> 16)) << 16) | (65535 & e);
          }
          function e(t, s) {
            return (t >>> s) | (t << (32 - s));
          }
          function i(t, s) {
            return t >>> s;
          }
          function r(t, s, e) {
            return (t & s) ^ (~t & e);
          }
          function n(t, s, e) {
            return (t & s) ^ (t & e) ^ (s & e);
          }
          function o(t) {
            return e(t, 2) ^ e(t, 13) ^ e(t, 22);
          }
          function h(t) {
            return e(t, 6) ^ e(t, 11) ^ e(t, 25);
          }
          function c(t) {
            return e(t, 7) ^ e(t, 18) ^ i(t, 3);
          }
          return (function (t) {
            const s = "0123456789abcdef";
            let e = "";
            for (let i = 0; i < 4 * t.length; i++)
              e +=
                s.charAt((t[i >> 2] >> (8 * (3 - (i % 4)) + 4)) & 15) +
                s.charAt((t[i >> 2] >> (8 * (3 - (i % 4)))) & 15);
            return e;
          })(
            (function (t, u) {
              const f = [
                  1116352408, 1899447441, 3049323471, 3921009573, 961987163,
                  1508970993, 2453635748, 2870763221, 3624381080, 310598401,
                  607225278, 1426881987, 1925078388, 2162078206, 2614888103,
                  3248222580, 3835390401, 4022224774, 264347078, 604807628,
                  770255983, 1249150122, 1555081692, 1996064986, 2554220882,
                  2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
                  113926993, 338241895, 666307205, 773529912, 1294757372,
                  1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
                  2730485921, 2820302411, 3259730800, 3345764771, 3516065817,
                  3600352804, 4094571909, 275423344, 430227734, 506948616,
                  659060556, 883997877, 958139571, 1322822218, 1537002063,
                  1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
                  2428436474, 2756734187, 3204031479, 3329325298,
                ],
                l = [
                  1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
                  2600822924, 528734635, 1541459225,
                ],
                a = new Array(64);
              let m, d, p, g, b, S, T, w, y, v;
              (t[u >> 5] |= 128 << (24 - (u % 32))),
                (t[15 + (((u + 64) >> 9) << 4)] = u);
              for (let u = 0; u < t.length; u += 16) {
                (m = l[0]),
                  (d = l[1]),
                  (p = l[2]),
                  (g = l[3]),
                  (b = l[4]),
                  (S = l[5]),
                  (T = l[6]),
                  (w = l[7]);
                for (let l = 0; l < 64; l++)
                  (a[l] =
                    l < 16
                      ? t[l + u]
                      : s(
                          s(
                            s(
                              e((D = a[l - 2]), 17) ^ e(D, 19) ^ i(D, 10),
                              a[l - 7]
                            ),
                            c(a[l - 15])
                          ),
                          a[l - 16]
                        )),
                    (y = s(s(s(s(w, h(b)), r(b, S, T)), f[l]), a[l])),
                    (v = s(o(m), n(m, d, p))),
                    (w = T),
                    (T = S),
                    (S = b),
                    (b = s(g, y)),
                    (g = p),
                    (p = d),
                    (d = m),
                    (m = s(y, v));
                (l[0] = s(m, l[0])),
                  (l[1] = s(d, l[1])),
                  (l[2] = s(p, l[2])),
                  (l[3] = s(g, l[3])),
                  (l[4] = s(b, l[4])),
                  (l[5] = s(S, l[5])),
                  (l[6] = s(T, l[6])),
                  (l[7] = s(w, l[7]));
              }
              var D;
              return l;
            })(
              (function (t) {
                const s = [];
                for (let e = 0; e < 8 * t.length; e += 8)
                  s[e >> 5] |= (255 & t.charCodeAt(e / 8)) << (24 - (e % 32));
                return s;
              })((t = j(t))),
              8 * t.length
            )
          );
        },
    Z = process.env.NODEJS
      ? function (t) {
          return i.default.createHash("sha1").update(t, "utf8").digest("hex");
        }
      : function (t) {
          function s(t, s) {
            return (t << s) | (t >>> (32 - s));
          }
          function e(t) {
            let s,
              e = "";
            for (let i = 7; i >= 0; i--)
              (s = (t >>> (4 * i)) & 15), (e += s.toString(16));
            return e;
          }
          let i, r, n;
          const o = new Array(80);
          let h,
            c,
            u,
            f,
            l,
            a,
            m = 1732584193,
            d = 4023233417,
            p = 2562383102,
            g = 271733878,
            b = 3285377520;
          const S = (t = j(t)).length,
            T = [];
          for (r = 0; r < S - 3; r += 4)
            (n =
              (t.charCodeAt(r) << 24) |
              (t.charCodeAt(r + 1) << 16) |
              (t.charCodeAt(r + 2) << 8) |
              t.charCodeAt(r + 3)),
              T.push(n);
          switch (S % 4) {
            case 0:
              r = 2147483648;
              break;
            case 1:
              r = (t.charCodeAt(S - 1) << 24) | 8388608;
              break;
            case 2:
              r =
                (t.charCodeAt(S - 2) << 24) |
                (t.charCodeAt(S - 1) << 16) |
                32768;
              break;
            case 3:
              r =
                (t.charCodeAt(S - 3) << 24) |
                (t.charCodeAt(S - 2) << 16) |
                (t.charCodeAt(S - 1) << 8) |
                128;
          }
          for (T.push(r); T.length % 16 != 14; ) T.push(0);
          for (
            T.push(S >>> 29), T.push((S << 3) & 4294967295), i = 0;
            i < T.length;
            i += 16
          ) {
            for (r = 0; r < 16; r++) o[r] = T[i + r];
            for (r = 16; r <= 79; r++)
              o[r] = s(o[r - 3] ^ o[r - 8] ^ o[r - 14] ^ o[r - 16], 1);
            for (h = m, c = d, u = p, f = g, l = b, r = 0; r <= 19; r++)
              (a =
                (s(h, 5) + ((c & u) | (~c & f)) + l + o[r] + 1518500249) &
                4294967295),
                (l = f),
                (f = u),
                (u = s(c, 30)),
                (c = h),
                (h = a);
            for (r = 20; r <= 39; r++)
              (a =
                (s(h, 5) + (c ^ u ^ f) + l + o[r] + 1859775393) & 4294967295),
                (l = f),
                (f = u),
                (u = s(c, 30)),
                (c = h),
                (h = a);
            for (r = 40; r <= 59; r++)
              (a =
                (s(h, 5) +
                  ((c & u) | (c & f) | (u & f)) +
                  l +
                  o[r] +
                  2400959708) &
                4294967295),
                (l = f),
                (f = u),
                (u = s(c, 30)),
                (c = h),
                (h = a);
            for (r = 60; r <= 79; r++)
              (a =
                (s(h, 5) + (c ^ u ^ f) + l + o[r] + 3395469782) & 4294967295),
                (l = f),
                (f = u),
                (u = s(c, 30)),
                (c = h),
                (h = a);
            (m = (m + h) & 4294967295),
              (d = (d + c) & 4294967295),
              (p = (p + u) & 4294967295),
              (g = (g + f) & 4294967295),
              (b = (b + l) & 4294967295);
          }
          return (e(m) + e(d) + e(p) + e(g) + e(b)).toLowerCase();
        },
    H = process.env.NODEJS
      ? function (t) {
          return i.default.createHash("md5").update(t, "utf8").digest("hex");
        }
      : function (t) {
          function s(t, s) {
            return (t << s) | (t >>> (32 - s));
          }
          function e(t, s) {
            const e = 2147483648 & t,
              i = 2147483648 & s,
              r = 1073741824 & t,
              n = 1073741824 & s,
              o = (1073741823 & t) + (1073741823 & s);
            return r & n
              ? 2147483648 ^ o ^ e ^ i
              : r | n
              ? 1073741824 & o
                ? 3221225472 ^ o ^ e ^ i
                : 1073741824 ^ o ^ e ^ i
              : o ^ e ^ i;
          }
          function i(t, i, r, n, o, h, c) {
            return (
              (t = e(
                t,
                e(
                  e(
                    (function (t, s, e) {
                      return (t & s) | (~t & e);
                    })(i, r, n),
                    o
                  ),
                  c
                )
              )),
              e(s(t, h), i)
            );
          }
          function r(t, i, r, n, o, h, c) {
            return (
              (t = e(
                t,
                e(
                  e(
                    (function (t, s, e) {
                      return (t & e) | (s & ~e);
                    })(i, r, n),
                    o
                  ),
                  c
                )
              )),
              e(s(t, h), i)
            );
          }
          function n(t, i, r, n, o, h, c) {
            return (
              (t = e(
                t,
                e(
                  e(
                    (function (t, s, e) {
                      return t ^ s ^ e;
                    })(i, r, n),
                    o
                  ),
                  c
                )
              )),
              e(s(t, h), i)
            );
          }
          function o(t, i, r, n, o, h, c) {
            return (
              (t = e(
                t,
                e(
                  e(
                    (function (t, s, e) {
                      return s ^ (t | ~e);
                    })(i, r, n),
                    o
                  ),
                  c
                )
              )),
              e(s(t, h), i)
            );
          }
          function h(t) {
            let s,
              e,
              i = "",
              r = "";
            for (e = 0; e <= 3; e++)
              (s = (t >>> (8 * e)) & 255),
                (r = "0" + s.toString(16)),
                (i += r.substr(r.length - 2, 2));
            return i;
          }
          let c, u, f, l, a, m, d, p, g;
          const b = (function (t) {
            let s;
            const e = t.length,
              i = e + 8,
              r = 16 * ((i - (i % 64)) / 64 + 1),
              n = Array(r - 1);
            let o = 0,
              h = 0;
            for (; h < e; )
              (s = (h - (h % 4)) / 4),
                (o = (h % 4) * 8),
                (n[s] = n[s] | (t.charCodeAt(h) << o)),
                h++;
            return (
              (s = (h - (h % 4)) / 4),
              (o = (h % 4) * 8),
              (n[s] = n[s] | (128 << o)),
              (n[r - 2] = e << 3),
              (n[r - 1] = e >>> 29),
              n
            );
          })((t = j(t)));
          for (
            m = 1732584193,
              d = 4023233417,
              p = 2562383102,
              g = 271733878,
              c = 0;
            c < b.length;
            c += 16
          )
            (u = m),
              (f = d),
              (l = p),
              (a = g),
              (m = i(m, d, p, g, b[c + 0], 7, 3614090360)),
              (g = i(g, m, d, p, b[c + 1], 12, 3905402710)),
              (p = i(p, g, m, d, b[c + 2], 17, 606105819)),
              (d = i(d, p, g, m, b[c + 3], 22, 3250441966)),
              (m = i(m, d, p, g, b[c + 4], 7, 4118548399)),
              (g = i(g, m, d, p, b[c + 5], 12, 1200080426)),
              (p = i(p, g, m, d, b[c + 6], 17, 2821735955)),
              (d = i(d, p, g, m, b[c + 7], 22, 4249261313)),
              (m = i(m, d, p, g, b[c + 8], 7, 1770035416)),
              (g = i(g, m, d, p, b[c + 9], 12, 2336552879)),
              (p = i(p, g, m, d, b[c + 10], 17, 4294925233)),
              (d = i(d, p, g, m, b[c + 11], 22, 2304563134)),
              (m = i(m, d, p, g, b[c + 12], 7, 1804603682)),
              (g = i(g, m, d, p, b[c + 13], 12, 4254626195)),
              (p = i(p, g, m, d, b[c + 14], 17, 2792965006)),
              (d = i(d, p, g, m, b[c + 15], 22, 1236535329)),
              (m = r(m, d, p, g, b[c + 1], 5, 4129170786)),
              (g = r(g, m, d, p, b[c + 6], 9, 3225465664)),
              (p = r(p, g, m, d, b[c + 11], 14, 643717713)),
              (d = r(d, p, g, m, b[c + 0], 20, 3921069994)),
              (m = r(m, d, p, g, b[c + 5], 5, 3593408605)),
              (g = r(g, m, d, p, b[c + 10], 9, 38016083)),
              (p = r(p, g, m, d, b[c + 15], 14, 3634488961)),
              (d = r(d, p, g, m, b[c + 4], 20, 3889429448)),
              (m = r(m, d, p, g, b[c + 9], 5, 568446438)),
              (g = r(g, m, d, p, b[c + 14], 9, 3275163606)),
              (p = r(p, g, m, d, b[c + 3], 14, 4107603335)),
              (d = r(d, p, g, m, b[c + 8], 20, 1163531501)),
              (m = r(m, d, p, g, b[c + 13], 5, 2850285829)),
              (g = r(g, m, d, p, b[c + 2], 9, 4243563512)),
              (p = r(p, g, m, d, b[c + 7], 14, 1735328473)),
              (d = r(d, p, g, m, b[c + 12], 20, 2368359562)),
              (m = n(m, d, p, g, b[c + 5], 4, 4294588738)),
              (g = n(g, m, d, p, b[c + 8], 11, 2272392833)),
              (p = n(p, g, m, d, b[c + 11], 16, 1839030562)),
              (d = n(d, p, g, m, b[c + 14], 23, 4259657740)),
              (m = n(m, d, p, g, b[c + 1], 4, 2763975236)),
              (g = n(g, m, d, p, b[c + 4], 11, 1272893353)),
              (p = n(p, g, m, d, b[c + 7], 16, 4139469664)),
              (d = n(d, p, g, m, b[c + 10], 23, 3200236656)),
              (m = n(m, d, p, g, b[c + 13], 4, 681279174)),
              (g = n(g, m, d, p, b[c + 0], 11, 3936430074)),
              (p = n(p, g, m, d, b[c + 3], 16, 3572445317)),
              (d = n(d, p, g, m, b[c + 6], 23, 76029189)),
              (m = n(m, d, p, g, b[c + 9], 4, 3654602809)),
              (g = n(g, m, d, p, b[c + 12], 11, 3873151461)),
              (p = n(p, g, m, d, b[c + 15], 16, 530742520)),
              (d = n(d, p, g, m, b[c + 2], 23, 3299628645)),
              (m = o(m, d, p, g, b[c + 0], 6, 4096336452)),
              (g = o(g, m, d, p, b[c + 7], 10, 1126891415)),
              (p = o(p, g, m, d, b[c + 14], 15, 2878612391)),
              (d = o(d, p, g, m, b[c + 5], 21, 4237533241)),
              (m = o(m, d, p, g, b[c + 12], 6, 1700485571)),
              (g = o(g, m, d, p, b[c + 3], 10, 2399980690)),
              (p = o(p, g, m, d, b[c + 10], 15, 4293915773)),
              (d = o(d, p, g, m, b[c + 1], 21, 2240044497)),
              (m = o(m, d, p, g, b[c + 8], 6, 1873313359)),
              (g = o(g, m, d, p, b[c + 15], 10, 4264355552)),
              (p = o(p, g, m, d, b[c + 6], 15, 2734768916)),
              (d = o(d, p, g, m, b[c + 13], 21, 1309151649)),
              (m = o(m, d, p, g, b[c + 4], 6, 4149444226)),
              (g = o(g, m, d, p, b[c + 11], 10, 3174756917)),
              (p = o(p, g, m, d, b[c + 2], 15, 718787259)),
              (d = o(d, p, g, m, b[c + 9], 21, 3951481745)),
              (m = e(m, u)),
              (d = e(d, f)),
              (p = e(p, l)),
              (g = e(g, a));
          return (h(m) + h(d) + h(p) + h(g)).toLowerCase();
        };
  function J(t, s) {
    return new R(t, s);
  }
  function U(t, s) {
    if (s < t.length + 11)
      throw "Message too long for RSA (n=" + s + ", l=" + t.length + ")";
    const e = [];
    let i = t.length - 1;
    for (; i >= 0 && s > 0; ) {
      const r = t.charCodeAt(i--);
      r < 128
        ? (e[--s] = r)
        : r > 127 && r < 2048
        ? ((e[--s] = (63 & r) | 128), (e[--s] = (r >> 6) | 192))
        : ((e[--s] = (63 & r) | 128),
          (e[--s] = ((r >> 6) & 63) | 128),
          (e[--s] = (r >> 12) | 224));
    }
    e[--s] = 0;
    const r = new v(),
      n = [];
    for (; s > 2; ) {
      for (n[0] = 0; 0 === n[0]; ) r.nextBytes(n);
      e[--s] = n[0];
    }
    return (e[--s] = 2), (e[--s] = 0), new R(e);
  }
  class z {
    n = new R();
    e = 0;
    d = new R();
    p = new R();
    q = new R();
    dmp1 = new R();
    dmq1 = new R();
    coeff = new R();
    setPublic(t, s) {
      if (!t || !s) throw "Invalid RSA public key";
      (this.n = J(t, 16)), (this.e = parseInt(s, 16));
    }
    doPublic(t) {
      return t.modPowInt(this.e, this.n);
    }
    encrypt(t) {
      const s = U(t, (this.n.bitLength() + 7) >> 3),
        e = this.doPublic(s).toString(16);
      return 0 == (1 & e.length) ? e : "0" + e;
    }
    setPrivate(t, s, e) {
      if (!(!t && !s && t.length > 0 && s.length > 0))
        throw "Invalid RSA private key";
      (this.n = J(t, 16)), (this.e = parseInt(s, 16)), (this.d = J(e, 16));
    }
    setPrivateEx(t, s, e, i, r, n, o, h) {
      if (!(!t && !s && t.length > 0 && s.length > 0))
        throw new Error("Invalid RSA private key");
      (this.n = J(t, 16)),
        (this.e = parseInt(s, 16)),
        (this.d = J(e, 16)),
        (this.p = J(i, 16)),
        (this.q = J(r, 16)),
        (this.dmp1 = J(n, 16)),
        (this.dmq1 = J(o, 16)),
        (this.coeff = J(h, 16));
    }
    generate(t, s) {
      const e = new p(),
        i = t >> 1;
      this.e = parseInt(s, 16);
      const r = new R(s, 16);
      for (;;) {
        for (
          ;
          (this.p = new R(t - i, 1, e)),
            0 !== this.p.subtract(R.ONE).gcd(r).compareTo(R.ONE) ||
              !this.p.isProbablePrime(10);

        );
        for (
          ;
          (this.q = new R(i, 1, e)),
            0 !== this.q.subtract(R.ONE).gcd(r).compareTo(R.ONE) ||
              !this.q.isProbablePrime(10);

        );
        if (this.p.compareTo(this.q) <= 0) {
          const t = this.p;
          (this.p = this.q), (this.q = t);
        }
        const s = this.p.subtract(R.ONE),
          n = this.q.subtract(R.ONE),
          o = s.multiply(n);
        if (0 === o.gcd(r).compareTo(R.ONE)) {
          (this.n = this.p.multiply(this.q)),
            (this.d = r.modInverse(o)),
            (this.dmp1 = this.d.mod(s)),
            (this.dmq1 = this.d.mod(n)),
            (this.coeff = this.q.modInverse(this.p));
          break;
        }
      }
    }
    doPrivate(t) {
      if (!this.p || !this.q) return t.modPow(this.d, this.n);
      let s = t.mod(this.p).modPow(this.dmp1, this.p);
      const e = t.mod(this.q).modPow(this.dmq1, this.q);
      for (; s.compareTo(e) < 0; ) s = s.add(this.p);
      return s
        .subtract(e)
        .multiply(this.coeff)
        .mod(this.p)
        .multiply(this.q)
        .add(e);
    }
    decrypt(t) {
      const s = J(t, 16),
        e = this.doPrivate(s);
      return e instanceof R ? X(e, (this.n.bitLength() + 7) >> 3) : null;
    }
    signString = Y;
    signStringWithSHA1 = $;
    signStringWithSHA256 = tt;
    verifyHexSignatureForMessage = it;
    verifyString = rt;
    toJSON() {
      return JSON.stringify({
        coeff: this.coeff.toString(16),
        d: this.d.toString(16),
        dmp1: this.dmp1.toString(16),
        dmq1: this.dmq1.toString(16),
        e: this.e.toString(16),
        n: this.n.toString(16),
        p: this.p.toString(16),
        q: this.q.toString(16),
      });
    }
    static parse(t) {
      const s = "string" == typeof t ? JSON.parse(t) : t;
      if (!s) return null;
      const e = new z();
      return (
        e.setPrivateEx(s.n, s.e, s.d, s.p, s.q, s.dmp1, s.dmq1, s.coeff), e
      );
    }
  }
  function X(t, s) {
    const e = t.toByteArray();
    let i = 0;
    for (; i < e.length && 0 === e[i]; ) ++i;
    if (e.length - i != s - 1 || 2 !== e[i]) return null;
    for (++i; 0 !== e[i]; ) if (++i >= e.length) return null;
    let r = "";
    for (; ++i < e.length; ) {
      const t = 255 & e[i];
      t < 128
        ? (r += String.fromCharCode(t))
        : t > 191 && t < 224
        ? ((r += String.fromCharCode(((31 & t) << 6) | (63 & e[i + 1]))), ++i)
        : ((r += String.fromCharCode(
            ((15 & t) << 12) | ((63 & e[i + 1]) << 6) | (63 & e[i + 2])
          )),
          (i += 2));
    }
    return r;
  }
  const W = {
      sha1: "3021300906052b0e03021a05000414",
      sha256: "3031300d060960864801650304020105000420",
    },
    G = { sha1: Z, sha256: F };
  function Q(t, s, e) {
    const i = s / 4,
      r = (0, G[e])(t),
      n = "0001",
      o = "00" + W[e] + r;
    let h = "";
    const c = i - n.length - o.length;
    for (let t = 0; t < c; t += 2) h += "ff";
    return n + h + o;
  }
  function Y(t, s) {
    const e = J(Q(t, this.n.bitLength(), s), 16);
    return this.doPrivate(e).toString(16);
  }
  function $(t) {
    const s = J(Q(t, this.n.bitLength(), "sha1"), 16);
    return this.doPrivate(s).toString(16);
  }
  function tt(t) {
    const s = J(Q(t, this.n.bitLength(), "sha256"), 16);
    return this.doPrivate(s).toString(16);
  }
  function st(t, s, e) {
    return (function (t, s, e) {
      const i = new z();
      return i.setPublic(s, e), i.doPublic(t);
    })(t, s, e)
      .toString(16)
      .replace(/^1f+00/, "");
  }
  function et(t) {
    for (const s in W) {
      const e = W[s],
        i = e.length;
      if (t.substring(0, i) === e) return [s, t.substring(i)];
    }
    return [];
  }
  function it(t, s) {
    return (function (t, s, e, i) {
      const r = et(st(s, e, i));
      if (0 === r.length) return !1;
      const n = r[0];
      return r[1] === (0, G[n])(t);
    })(t, J(s, 16), this.n.toString(16), this.e.toString(16));
  }
  function rt(t, s) {
    const e = J((s = s.replace(/[ \n]+/g, "")), 16),
      i = et(
        this.doPublic(e)
          .toString(16)
          .replace(/^1f+00/, "")
      );
    if (0 === i.length) return !1;
    const r = i[0];
    return i[1] === (0, G[r])(t);
  }
  const nt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    ot = "::52cee64bb3a38f6403386519a39ac91c::";
  r.Init();
  return (
    (t.BigInteger = R),
    (t.RSAKey = z),
    (t.SecureRandom = v),
    (t.SeededRandom = p),
    (t.aes = r),
    (t.byte2Hex = function (t) {
      return t < 16 ? "0" + t.toString(16) : t.toString(16);
    }),
    (t.cryptico = class {
      static b256to64(t) {
        let s,
          e,
          i = 0,
          r = "",
          n = 0;
        const o = t.length;
        for (e = 0; e < o; e++)
          (s = t.charCodeAt(e)),
            0 === n
              ? ((r += nt.charAt((s >> 2) & 63)), (i = (3 & s) << 4))
              : 1 === n
              ? ((r += nt.charAt(i | ((s >> 4) & 15))), (i = (15 & s) << 2))
              : 2 === n &&
                ((r += nt.charAt(i | ((s >> 6) & 3))),
                (r += nt.charAt(63 & s))),
            (n += 1),
            3 === n && (n = 0);
        return (
          n > 0 && ((r += nt.charAt(i)), (r += "=")), 1 === n && (r += "="), r
        );
      }
      static b64to256(t) {
        let s,
          e,
          i = "",
          r = 0,
          n = 0;
        const o = t.length;
        for (e = 0; e < o; e++)
          (s = nt.indexOf(t.charAt(e))),
            s >= 0 &&
              (r && (i += String.fromCharCode(n | ((s >> (6 - r)) & 255))),
              (r = (r + 2) & 7),
              (n = (s << r) & 255));
        return i;
      }
      static b16to64(t) {
        let s,
          e,
          i = "";
        for (
          t.length % 2 == 1 && (t = "0" + t), s = 0;
          s + 3 <= t.length;
          s += 3
        )
          (e = parseInt(t.substring(s, s + 3), 16)),
            (i += nt.charAt(e >> 6) + nt.charAt(63 & e));
        for (
          s + 1 === t.length
            ? ((e = parseInt(t.substring(s, s + 1), 16)),
              (i += nt.charAt(e << 2)))
            : s + 2 === t.length &&
              ((e = parseInt(t.substring(s, s + 2), 16)),
              (i += nt.charAt(e >> 2) + nt.charAt((3 & e) << 4)));
          (3 & i.length) > 0;

        )
          i += "=";
        return i;
      }
      static b64to16(t) {
        let s,
          e = "",
          i = 0,
          r = 0;
        for (s = 0; s < t.length && "=" !== t.charAt(s); ++s) {
          const n = nt.indexOf(t.charAt(s));
          n < 0 ||
            (0 === i
              ? ((e += O(n >> 2)), (r = 3 & n), (i = 1))
              : 1 === i
              ? ((e += O((r << 2) | (n >> 4))), (r = 15 & n), (i = 2))
              : 2 === i
              ? ((e += O(r)), (e += O(n >> 2)), (r = 3 & n), (i = 3))
              : ((e += O((r << 2) | (n >> 4))), (e += O(15 & n)), (i = 0)));
        }
        return 1 === i && (e += O(r << 2)), e;
      }
      static string2bytes(t) {
        const s = [];
        for (let e = 0; e < t.length; e++) s.push(t.charCodeAt(e));
        return s;
      }
      static bytes2string(t) {
        let s = "";
        for (let e = 0; e < t.length; e++) s += String.fromCharCode(t[e]);
        return s;
      }
      static utf82string(t) {
        return unescape(encodeURIComponent(t));
      }
      static string2utf8(t) {
        return decodeURIComponent(escape(t));
      }
      static utf82bytes(t) {
        const s = unescape(encodeURIComponent(t));
        return this.string2bytes(s);
      }
      static bytes2utf8(t) {
        const s = this.bytes2string(t);
        return decodeURIComponent(escape(s));
      }
      static blockXOR(t, s) {
        const e = new Array(16);
        for (let i = 0; i < 16; i++) e[i] = t[i] ^ s[i];
        return e;
      }
      static blockIV() {
        const t = new v(),
          s = new Array(16);
        return t.nextBytes(s), s;
      }
      static pad16(t) {
        const s = t.slice(0),
          e = (16 - (t.length % 16)) % 16;
        for (let i = t.length; i < t.length + e; i++) s.push(0);
        return s;
      }
      static depad(t) {
        let s = t.slice(0);
        for (; 0 === s[s.length - 1]; ) s = s.slice(0, s.length - 1);
        return s;
      }
      static encryptAESCBC(t, s) {
        const e = s.slice(0);
        r.ExpandKey(e);
        let i = this.utf82bytes(t);
        i = this.pad16(i);
        let n = this.blockIV();
        for (let t = 0; t < i.length / 16; t++) {
          let s = i.slice(16 * t, 16 * t + 16);
          const o = n.slice(16 * t, 16 * t + 16);
          (s = this.blockXOR(o, s)), r.Encrypt(s, e), (n = n.concat(s));
        }
        const o = this.bytes2string(n);
        return this.b256to64(o);
      }
      static decryptAESCBC(t, s) {
        const e = s.slice(0);
        r.ExpandKey(e);
        const i = this.b64to256(t),
          n = this.string2bytes(i);
        let o = [];
        for (let t = 1; t < n.length / 16; t++) {
          let s = n.slice(16 * t, 16 * t + 16);
          const i = n.slice(16 * (t - 1), 16 * (t - 1) + 16);
          r.Decrypt(s, e), (s = this.blockXOR(i, s)), (o = o.concat(s));
        }
        return (o = this.depad(o)), this.bytes2utf8(o);
      }
      static wrap60(t) {
        let s = "";
        for (let e = 0; e < t.length; e++)
          e % 60 == 0 && 0 !== e && (s += "\n"), (s += t[e]);
        return s;
      }
      static generateAESKey() {
        const t = new Array(32);
        return new v().nextBytes(t), t;
      }
      static generateRSAKey(t, s) {
        f.seedrandom(F(t));
        const e = new z();
        return e.generate(s, "03"), e;
      }
      static publicKeyString(t) {
        return this.b16to64(t.n.toString(16));
      }
      static publicKeyID(t) {
        return H(t);
      }
      static publicKeyFromString(t) {
        const s = this.b64to16(t.split("|")[0]),
          e = new z();
        return e.setPublic(s, "03"), e;
      }
      static encrypt(t, s, e) {
        {
          let i = "";
          const r = this.generateAESKey();
          try {
            const t = this.publicKeyFromString(s);
            i += this.b16to64(t.encrypt(this.bytes2string(r))) + "?";
          } catch (t) {
            return { status: "Invalid public key" };
          }
          if (e) {
            const s = this.sign(t, e);
            (t += ot), (t += this.publicKeyString(e)), (t += ot), (t += s);
          }
          return (
            (i += this.encryptAESCBC(t, r)), { status: "success", cipher: i }
          );
        }
      }
      static decrypt(t, s) {
        const e = t.split("?"),
          i = s.decrypt(this.b64to16(e[0]));
        if (null == i) return { status: "failure" };
        const r = this.string2bytes(i),
          n = this.decryptAESCBC(e[1], r).split(ot);
        return n.length > 1
          ? this._confirm(n)
          : { status: "success", plaintext: n[0], signature: "unsigned" };
      }
      static sign(t, s) {
        return this.b16to64(s.signString(t, "sha256"));
      }
      static verify(t) {
        const s = this._confirm(t);
        return "success" === s.status && "verified" === s.signature;
      }
      static _confirm(t) {
        if (3 === t.length) {
          const s = this.publicKeyFromString(t[1]),
            e = this.b64to16(t[2]);
          return s.verifyString(t[0], e)
            ? {
                status: "success",
                plaintext: t[0],
                signature: "verified",
                publicKeyString: this.publicKeyString(s),
              }
            : {
                status: "success",
                plaintext: t[0],
                signature: "forged",
                publicKeyString: this.publicKeyString(s),
              };
        }
        return { status: "failure" };
      }
    }),
    (t.int2char = O),
    (t.linebrk = function (t, s) {
      let e = "",
        i = 0;
      for (; i + s < t.length; ) (e += t.substring(i, i + s) + "\n"), (i += s);
      return e + t.substring(i, t.length);
    }),
    (t.math = f),
    (t.md5 = H),
    (t.op_and = D),
    (t.op_andnot = B),
    (t.op_or = A),
    (t.op_xor = x),
    (t.parseBigInt = J),
    (t.pkcs1pad2 = U),
    (t.pkcs1unpad2 = X),
    (t.sha1 = Z),
    (t.sha256 = F),
    Object.defineProperty(t, "__esModule", { value: !0 }),
    t
  );
})({}, crypto);
//# sourceMappingURL=cryptico.iife.js.map
