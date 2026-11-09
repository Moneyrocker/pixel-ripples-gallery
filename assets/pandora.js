(() => {
  'use strict';
  const config = window.PANDORA_PUBLIC;
  if (!config?.verified || !config.adminUrl) return;
  let url;
  try { url = new URL(config.adminUrl); } catch { return; }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash
      || !host.includes('.') || host.endsWith('.local') || host.endsWith('.localhost')
      || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return;
  const link = document.getElementById('pandoraEntry');
  link.href = url.href;
  link.hidden = false;
  document.getElementById('deploymentPending').hidden = true;
  document.querySelectorAll('[data-deployment-status]').forEach(el => { el.textContent = '管理后台已部署 · 仅授权 Owner 可访问'; });
})();
