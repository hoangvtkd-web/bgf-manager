/**
 * Sinh file HTML tinh de xem truoc dashboard theo tung role.
 * Vi dashboard that yeu cau dang nhap Supabase, ta mo phong giao dien
 * (sidebar + header + the thong ke) bang HTML de xem truoc nhanh.
 *
 * Chay: node tests/make-dashboard-preview.js
 */
const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..');

const ROLE_RANK = { employee: 1, manager: 2, admin: 3 };
const ROLE_LABEL = {
  admin: 'Quan tri vien',
  manager: 'Quan ly',
  employee: 'Nhan vien',
};

const NAV_ITEMS = [
  { title: 'Tong quan', href: '/dashboard', minRole: 'employee', icon: 'grid' },
  { title: 'Bao cao', href: '/reports', minRole: 'manager', icon: 'chart' },
  { title: 'Cau hinh he thong', href: '/settings', minRole: 'admin', icon: 'gear' },
  { title: 'Ca nhan', href: '/profile', minRole: 'employee', icon: 'user' },
];

const ICONS = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15v3M12 10v8M17 6v12"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  minus: '<path d="M5 12h14"/>',
};

const svg = (d, cls) =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

function sidebar(role) {
  const visible = NAV_ITEMS.filter((i) => ROLE_RANK[role] >= ROLE_RANK[i.minRole]);
  return visible
    .map((i) => {
      const active = i.href === '/dashboard';
      const badge =
        i.minRole === 'admin'
          ? '<span class="nav-badge">Quan tri vien</span>'
          : i.minRole === 'manager'
            ? '<span class="nav-badge">Quan ly+</span>'
            : '';
      return `<a class="nav-item${active ? ' active' : ''}">${svg(ICONS[i.icon], 'nav-ico')}<span>${i.title}</span>${badge}</a>`;
    })
    .join('');
}

function roleMatrix(currentRole) {
  const roles = ['employee', 'manager', 'admin'];
  const head = roles
    .map(
      (r) =>
        `<th class="${r === currentRole ? 'cur' : ''}">${ROLE_LABEL[r]}${r === currentRole ? ' <span class="tag">(ban)</span>' : ''}</th>`
    )
    .join('');
  const rows = NAV_ITEMS.map((i) => {
    const cells = roles
      .map((r) => {
        const allowed = ROLE_RANK[r] >= ROLE_RANK[i.minRole];
        return `<td>${allowed ? svg(ICONS.check, 'ic ok') : svg(ICONS.minus, 'ic no')}</td>`;
      })
      .join('');
    return `<tr><td class="route"><b>${i.title}</b><code>${i.href}</code></td>${cells}</tr>`;
  }).join('');
  return `<table class="matrix"><thead><tr><th>Route</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function permissionList(role) {
  const rows = NAV_ITEMS.map((i) => {
    const allowed = ROLE_RANK[role] >= ROLE_RANK[i.minRole];
    return `<div class="perm"><span>${svg(ICONS[i.icon], 'ic-sm')}${i.title}</span><span class="pill ${allowed ? 'yes' : 'no'}">${allowed ? 'Cho phep' : 'Bi chan'}</span></div>`;
  }).join('');
  const adminOk = role === 'admin';
  return (
    rows +
    `<div class="perm border-top"><span>${svg(ICONS.gear, 'ic-sm')}Cau hinh he thong</span><span class="pill ${adminOk ? 'yes' : 'no'}">${adminOk ? 'Cho phep' : 'Chi Admin'}</span></div>`
  );
}

const STATS = [
  ['Doanh thu thang', '186.420.000 d', '#10b981'],
  ['Don hang', '128', '#0ea5e9'],
  ['Khach hang', '42', '#8b5cf6'],
  ['Gia tri ton kho', '24.101.000 d', '#f59e0b'],
];

function page(role) {
  const name =
    role === 'admin'
      ? 'Quan Tri Vien'
      : role === 'manager'
        ? 'Tran Thi Quan Ly'
        : 'Nguyen Van Nhan Vien';
  const visibleCount = NAV_ITEMS.filter(
    (i) => ROLE_RANK[role] >= ROLE_RANK[i.minRole]
  ).length;

  return `<!DOCTYPE html>
<html lang="vi" class="${role}">
<head>
<meta charset="UTF-8">
<title>Preview Dashboard - ${ROLE_LABEL[role]}</title>
<style>
:root{--bg:#ffffff;--fg:#09090b;--muted:#f4f4f5;--muted-fg:#71717a;--border:#e4e4e7;--primary:#e11d48;--primary-fg:#fff5f7;--card:#fff;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;background:#f4f4f5;color:var(--fg);font-size:14px;}
.shell{display:flex;min-height:100vh;}
aside{width:256px;flex-shrink:0;background:var(--card);border-right:1px solid var(--border);display:flex;flex-direction:column;}
.brand{height:56px;display:flex;flex-direction:column;justify-content:center;padding:0 16px;border-bottom:1px solid var(--border);}
.brand b{font-size:16px;letter-spacing:-.01em;}
.brand span{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted-fg);}
.nav{padding:12px 8px;display:grid;gap:4px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:7px;font-size:14px;font-weight:500;color:var(--muted-fg);text-decoration:none;}
.nav-item.active{background:var(--primary);color:var(--primary-fg);}
.nav-ico{width:16px;height:16px;flex-shrink:0;}
.nav-badge{margin-left:auto;font-size:9px;border:1px solid currentColor;border-radius:5px;padding:1px 5px;opacity:.75;}
.side-foot{margin-top:auto;border-top:1px solid var(--border);padding:12px 16px;}
.side-foot p{font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted-fg);}
.side-foot span{display:block;margin-top:4px;font-size:11px;color:var(--muted-fg);}
main{flex:1;min-width:0;display:flex;flex-direction:column;}
header{height:56px;display:flex;align-items:center;gap:12px;padding:0 16px;background:rgba(255,255,255,.95);border-bottom:1px solid var(--border);position:sticky;top:0;}
.role-chip{font-size:12px;background:var(--muted);border-radius:6px;padding:3px 8px;color:var(--muted-fg);}
.spacer{flex:1;}
.toggle{width:34px;height:34px;border-radius:7px;display:grid;place-items:center;color:var(--muted-fg);}
.user{display:flex;align-items:center;gap:8px;}
.avatar{width:28px;height:28px;border-radius:50%;background:var(--muted);display:grid;place-items:center;font-size:11px;font-weight:600;}
.user small{display:block;font-size:11px;line-height:1.2;}
.user em{display:block;font-size:10px;color:var(--muted-fg);font-style:normal;}
.content{padding:24px;display:flex;flex-direction:column;gap:24px;}
h1{font-size:24px;letter-spacing:-.02em;}
.sub{font-size:13px;color:var(--muted-fg);margin-top:4px;}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;}
.card h3{font-size:13px;font-weight:500;color:var(--muted-fg);}
.card .val{font-size:20px;font-weight:700;margin-top:8px;}
.card .hint{font-size:11px;color:var(--muted-fg);margin-top:4px;}
.grid3{display:grid;grid-template-columns:2fr 1fr;gap:16px;}
.card-title{font-size:15px;font-weight:600;}
.card-desc{font-size:12px;color:var(--muted-fg);margin-top:3px;margin-bottom:14px;}
table.matrix{width:100%;border-collapse:collapse;font-size:13px;}
.matrix th{text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);color:var(--muted-fg);font-weight:500;}
.matrix th:not(:first-child){text-align:center;}
.matrix th.cur{color:var(--primary);}
.matrix td{padding:8px 10px;border-bottom:1px solid var(--border);}
.matrix td:not(:first-child){text-align:center;}
.matrix tr:last-child td{border-bottom:none;}
.route b{font-weight:600;}
.route code{margin-left:8px;font-size:11px;background:var(--muted);border-radius:5px;padding:1px 6px;color:var(--muted-fg);}
.ic{width:15px;height:15px;}
.ic.ok{color:#10b981;}
.ic.no{color:#d4d4d8;}
.ic-sm{width:14px;height:14px;color:var(--muted-fg);}
.tag{font-size:10px;}
.perm{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;font-size:13px;}
.perm span:first-child{display:flex;align-items:center;gap:8px;}
.border-top{border-top:1px solid var(--border);padding-top:12px;margin-top:3px;}
.pill{font-size:11px;font-weight:600;border-radius:6px;padding:2px 9px;}
.pill.yes{background:#10b981;color:#fff;}
.pill.no{background:var(--muted);color:var(--muted-fg);}
</style>
</head>
<body>
<div class="shell">
  <aside>
    <div class="brand"><b>BA GIA FOOD</b><span>${ROLE_LABEL[role]}</span></div>
    <nav class="nav">${sidebar(role)}</nav>
    <div class="side-foot">
      <p>Pham vi quyen</p>
      <span>${role === 'admin' ? 'Ca nhan . Tong quan . Bao cao . Cau hinh' : role === 'manager' ? 'Ca nhan . Tong quan . Bao cao' : 'Ca nhan . Tong quan'}</span>
    </div>
  </aside>
  <main>
    <header>
      <span class="role-chip">${ROLE_LABEL[role]}</span>
      <div class="spacer"></div>
      <div class="toggle">${svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', 'ic')}</div>
      <div class="user">
        <span class="avatar">${name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
        <span><small>${name}</small><em>${ROLE_LABEL[role]}</em></span>
      </div>
    </header>
    <div class="content">
      <div>
        <h1>Xin chao, ${name}</h1>
        <p class="sub">Ban dang truy cap voi quyen <b>${role}</b>. Menu sidebar chi hien thi ${visibleCount}/4 muc phu hop voi quyen cua ban.</p>
      </div>
      <div class="grid4">
        ${STATS.map(([l, v, c]) => `<div class="card"><h3>${l}</h3><div class="val" style="color:${c}">${v}</div><div class="hint">Du lieu minh hoa</div></div>`).join('')}
      </div>
      <div class="grid3">
        <div class="card">
          <div class="card-title">Phan quyen theo vai tro</div>
          <div class="card-desc">Cau truc RBAC duoc ap dung o middleware + sidebar + trang.</div>
          ${roleMatrix(role)}
        </div>
        <div class="card">
          <div class="card-title">Quyen cua ban</div>
          <div class="card-desc">Danh sach route ban duoc phep truy cap.</div>
          ${permissionList(role)}
        </div>
      </div>
    </div>
  </main>
</div>
</body>
</html>`;
}

['employee', 'manager', 'admin'].forEach((role) => {
  const out = path.join(base, 'tests', `_preview-dashboard-${role}.html`);
  fs.writeFileSync(out, page(role), 'utf8');
  console.log('WROTE ' + out);
});
