const CFG = {
        l1: "CHÚC MỪNG 20/10",
        l2: "💖 NGÀY PHỤ NỮ VIỆT NAM 💖",
        name: "Tập thể nữ Nhóm 3",
        intro:
          "Nhân ngày 20/10, chúc Hồng Lạc luôn xinh đẹp, rạng rỡ như đóa hồng đầu mùa. Mong mỗi ngày của bạn đều ngập tràn tiếng cười và thật nhiều yêu thương. 🌸",
        wishes: [
          ["🌸", "Luôn xinh đẹp", "Rạng rỡ từ nụ cười đến trái tim."],
          ["💖", "Thật hạnh phúc", "Mỗi ngày đều có một niềm vui nhỏ."],
          ["✨", "Bình yên", "Nhẹ nhàng giữa mọi bộn bề."],
          ["🌹", "Được yêu thương", "Nhiều hơn bạn có thể đếm hết."],
        ],
        quote:
          "Cảm ơn bạn vì đã xuất hiện và làm thế giới này dịu dàng hơn rất nhiều.",
        sign: "— Một người luôn nghĩ đến bạn 🌹",
      };
      const POOL = "ABCDEFGHIKLMNOPQRSTUVXYĂÂÊÔƠƯ0123456789";
      const rnd = (a) =>
        Array.isArray(a) || typeof a === "string"
          ? a[Math.floor(Math.random() * a.length)]
          : 0;
      const R = (a, b) => Math.random() * (b - a) + a;
      const $ = (id) => document.getElementById(id);

      for (let i = 0; i < 60; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.cssText = `left:${R(0, 100)}vw;top:${R(0, 100)}vh;animation-delay:${R(0, 3)}s`;
        document.body.appendChild(s);
      }

      $("name").textContent = CFG.name;
      $("sign").textContent = CFG.sign;
      $("quote").textContent = CFG.quote;
      $("wishes").innerHTML = CFG.wishes
        .map(
          (w) =>
            `<div class="w"><i>${w[0]}</i><b>${w[1]}</b><span>${w[2]}</span></div>`,
        )
        .join("");

      const flyers = [];
      let W = innerWidth,
        H = innerHeight,
        decoding = false,
        landed = 0,
        total = 0;
      function build(el, text, cls) {
        [...text].forEach((c) => {
          const s = document.createElement("span");
          s.className = "slot" + (c === " " ? " sp" : "");
          s.textContent = c === " " ? "\u00a0" : c;
          el.appendChild(s);
          if (c !== " ") flyers.push({ slot: s, c, cls, real: true });
        });
      }
      build($("l1"), CFG.l1, "l1");
      build($("l2"), CFG.l2, "l2");
      total = flyers.length;

      function init() {
        // chữ thật
        flyers.forEach((f) =>
          mk(f, parseFloat(getComputedStyle(f.slot).fontSize)),
        );
        // chữ gây nhiễu bay lung tung
        for (let i = 0; i < 34; i++) {
          const f = { real: false, c: "", cls: "" };
          flyers.push(f);
          mk(f, R(18, 56));
        }
        requestAnimationFrame(tick);
      }
      function mk(f, size) {
        const e = document.createElement("div");
        e.className = "fly";
        e.style.fontSize = size + "px";
        e.style.opacity = f.real ? 1 : 0.55;
        e.style.color = rnd([
          "#ffb3d4",
          "#ff6fae",
          "#ffd9a8",
          "#e0b3ff",
          "#fff",
        ]);
        e.textContent = rnd(POOL);
        document.body.appendChild(e);
        Object.assign(f, {
          el: e,
          x: R(0, W),
          y: R(0, H),
          vx: R(-2.6, 2.6),
          vy: R(-2.6, 2.6),
          rot: R(0, 360),
          vr: R(-4, 4),
          t: R(0, 6),
          sc: 1,
          state: "fly",
        });
      }
      function tick() {
        flyers.forEach((f) => {
          if (f.state === "done" || !f.el) return;
          if (f.state === "fly") {
            f.vx += R(-0.12, 0.12);
            f.vy += R(-0.12, 0.12);
            const m = Math.hypot(f.vx, f.vy),
              mx = 3.2;
            if (m > mx) {
              f.vx *= mx / m;
              f.vy *= mx / m;
            }
            f.x += f.vx;
            f.y += f.vy;
            f.rot += f.vr;
            f.t += 0.04;
            f.sc = 1 + Math.sin(f.t) * 0.35;
            if (f.x < 0 || f.x > W) f.vx *= -1;
            if (f.y < 0 || f.y > H) f.vy *= -1;
            f.x = Math.max(-10, Math.min(W + 10, f.x));
            f.y = Math.max(-10, Math.min(H + 10, f.y));
          } else {
            const k = 0.075;
            f.x += (f.tx - f.x) * k;
            f.y += (f.ty - f.y) * k;
            f.rot += (0 - f.rot) * k;
            f.sc += (1 - f.sc) * k;
            if (Math.hypot(f.tx - f.x, f.ty - f.y) < 1.2 && Math.abs(f.rot) < 1)
              land(f);
          }
          f.el.style.transform = `translate(${f.x}px,${f.y}px) translate(-50%,-50%) rotate(${f.rot}deg) scale(${f.sc})`;
        });
        requestAnimationFrame(tick);
      }
      function land(f) {
        f.state = "done";
        f.el.remove();
        f.slot.classList.add("ok");
        sparkle(f.slot);
        if (++landed === total) {
          $("hint").textContent = "Giải mã thành công 💖";
          heartStorm();
          setTimeout(showCard, 1800);
        }
      }
      setInterval(
        () =>
          flyers.forEach((f) => {
            if (f.el && f.state !== "done" && Math.random() < 0.4)
              f.el.textContent = rnd(POOL);
          }),
        150,
      );

      function decode() {
        if (decoding) return;
        decoding = true;
        $("btn").style.display = "none";
        $("hint").textContent = "Các chữ cái đang tìm về nhau... ✨";
        let i = 0;
        flyers.forEach((f) => {
          if (f.real) {
            setTimeout(
              () => {
                const r = f.slot.getBoundingClientRect();
                f.tx = r.left + r.width / 2;
                f.ty = r.top + r.height / 2;
                f.rot = (((f.rot % 360) + 540) % 360) - 180;
                f.state = "go";
                f.el.textContent = f.c;
              },
              600 + i++ * 160,
            );
          } else {
            setTimeout(
              () => {
                f.el.style.opacity = 0;
              },
              500 + R(0, 1500),
            );
            setTimeout(() => {
              f.state = "done";
              f.el.remove();
            }, 2600);
          }
        });
      }
      $("btn").onclick = decode;
      $("stage").addEventListener("click", (e) => {
        if (e.target.id !== "btn") decode();
      });
      addEventListener("resize", () => {
        W = innerWidth;
        H = innerHeight;
      });
      (document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve()
      ).then(init);

      function sparkle(el) {
        const r = el.getBoundingClientRect();
        for (let i = 0; i < 4; i++)
          burst(r.left + r.width / 2, r.top + r.height / 2, "✦", 10);
      }
      function burst(x, y, ch, size) {
        const b = document.createElement("div");
        b.className = "burst";
        b.textContent = ch;
        b.style.cssText += `left:${x}px;top:${y}px;font-size:${size + R(0, 10)}px;color:#ffc2dc;--bx:${R(-70, 70)}px;--by:${R(-70, 70)}px`;
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 900);
      }
      const HEARTS = ["❤", "💖", "💗", "💕", "💘", "🌸", "🌹", "💝"];
      function heart() {
        const h = document.createElement("div");
        h.className = "heart";
        h.textContent = rnd(HEARTS);
        const d = R(5, 11);
        h.style.cssText += `left:${R(0, 100)}vw;font-size:${R(16, 44)}px;animation-duration:${d}s;--dx:${R(-80, 80)}px;--rot:${R(-40, 40)}deg;opacity:${R(0.6, 1)}`;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), d * 1000);
      }
      function heartStorm() {
        for (let i = 0; i < 40; i++) setTimeout(heart, i * 60);
      }

      function showCard() {
        $("stage").classList.add("hide");
        $("card").classList.add("show");
        setInterval(heart, 280);
        heartStorm();
        let i = 0;
        setTimeout(function type() {
          $("msg").textContent = CFG.intro.slice(0, ++i);
          if (i < CFG.intro.length) setTimeout(type, 40);
          else {
            document
              .querySelectorAll(".w")
              .forEach((w, k) =>
                setTimeout(() => w.classList.add("on"), k * 350),
              );
            setTimeout(() => $("quote").classList.add("on2"), 1700);
            setTimeout(() => $("sign").classList.add("on2"), 2500);
            setTimeout(() => ($("btns").style.opacity = 1), 3000);
          }
        }, 1200);
      }
      addEventListener("keydown", (e) => {
        if (e.code === "Space") {
          e.preventDefault();
          if (!decoding) decode();
          else heartStorm();
        }
      });
      const cur = document.createElement("div");
      cur.id = "cur";
      cur.innerHTML = "<span>❤</span>";
      document.body.appendChild(cur);
      let lt = 0;
      addEventListener("pointermove", (e) => {
        cur.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
        cur.style.opacity = 1;
        const n = performance.now();
        if (n - lt < 50) return;
        lt = n;
        const t = document.createElement("div");
        t.className = "trail";
        t.textContent = rnd(["❤", "💖", "💗", "💕"]);
        t.style.cssText += `left:${e.clientX}px;top:${e.clientY}px;font-size:${R(10, 20)}px;--tx:${R(-30, 30)}px`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1100);
      });

      // Add the Supabase Publishable key from Project Settings > API Keys.
      const SUPABASE_URL = "https://qssgctzdlzslgwhtcfxu.supabase.co";
      const SUPABASE_KEY = "sb_publishable_xVz-EVRzLzDDUPPf5DsP-A_xlmQkLR7";
      const form = $("wish-form"), status = $("wish-status"), list = $("wish-list");
      let db = null;
      if (window.supabase && SUPABASE_KEY !== "PASTE_SB_PUBLISHABLE_KEY_HERE") {
        db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      }
      async function loadWishes() {
        if (!db) { list.textContent = "Cần cấu hình Publishable key Supabase để bật lời chúc chung."; return; }
        const { data, error } = await db.from("wishes").select("sender_name,message,created_at").eq("status","approved").order("created_at",{ascending:false}).limit(100);
        if (error) { list.textContent = "Không tải được lời chúc. Kiểm tra Data API, quyền bảng và RLS."; return; }
        list.replaceChildren();
        if (!data.length) { list.textContent = "Chưa có lời chúc công khai. Hãy gửi lời chúc đầu tiên nhé!"; return; }
        data.forEach(row => {
          const item = document.createElement("article"), name = document.createElement("strong"), msg = document.createElement("p");
          name.textContent = row.sender_name; msg.textContent = row.message;
          item.append(name,msg); list.appendChild(item);
        });
      }
      form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!db) { status.textContent = "Chưa cấu hình Publishable key Supabase."; return; }
        const sender_name = $("wish-name").value.trim(), message = $("wish-message").value.trim();
        if (!sender_name || !message) return;
        const button = form.querySelector("button"); button.disabled = true; status.textContent = "Đang gửi...";
        const { error } = await db.from("wishes").insert([{ sender_name, message }]);
        button.disabled = false;
        if (error) { status.textContent = "Gửi thất bại. Kiểm tra quyền INSERT/RLS trong Supabase."; return; }
        form.reset(); status.textContent = "Đã gửi! Lời chúc sẽ xuất hiện sau khi được duyệt 💗"; await loadWishes();
      });
      loadWishes();

      document.addEventListener("mouseleave", () => (cur.style.opacity = 0));
      $("card").addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") {
          for (let i = 0; i < 6; i++)
            burst(e.clientX, e.clientY, rnd(HEARTS), 18);
        }
      });
