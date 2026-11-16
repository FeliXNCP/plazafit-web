/* Sin SDK, almacenamiento de sesión ni llamadas a la base de datos de PlazaFit. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlazaFitConfirmation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function readReturn(hash, search) {
    const fragment = new URLSearchParams(String(hash || '').replace(/^#/, ''));
    const query = new URLSearchParams(String(search || '').replace(/^\?/, ''));
    const get = (key) => fragment.get(key) ?? query.get(key) ?? '';
    return {
      // El flujo implícito de Supabase entrega la credencial en el fragmento.
      // No aceptamos un token puesto en query (se enviaría al hosting).
      accessToken: fragment.get('access_token') || '',
      type: get('type'),
      hasError: ['error', 'error_code', 'error_description'].some(
        (key) => fragment.has(key) || query.has(key)
      ),
      errorCode: get('error_code'),
      hasCode: fragment.has('code') || query.has('code'),
      hasQueryToken: query.has('access_token'),
    };
  }

  function publicConfig(config) {
    if (!config || typeof config.supabaseUrl !== 'string' || typeof config.publicKey !== 'string') {
      throw new Error('CONFIG_INVALID');
    }
    const url = new URL(config.supabaseUrl.trim());
    if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/i.test(url.hostname) ||
        url.username || url.password || url.port || (url.pathname !== '/' && url.pathname !== '') ||
        url.search || url.hash) throw new Error('CONFIG_INVALID');
    const key = config.publicKey.trim();
    if (!/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(key)) {
      // Solo comprobación de configuración: no se usa este JWT como identidad del usuario.
      const parts = key.split('.');
      if (parts.length !== 3) throw new Error('PUBLIC_KEY_REQUIRED');
      try {
        let encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        encoded += '='.repeat((4 - encoded.length % 4) % 4);
        const payload = JSON.parse(atob(encoded));
        if (payload.role !== 'anon') throw new Error('PUBLIC_KEY_REQUIRED');
      } catch (_) { throw new Error('PUBLIC_KEY_REQUIRED'); }
    }
    return { url: url.origin, key };
  }

  function initialState(input) {
    if (!input) return 'neutral';
    if (input.hasError) return input.errorCode === 'otp_expired' ? 'expired' : 'invalid';
    if (input.type && !['signup', 'email'].includes(input.type)) return 'other-flow';
    if (input.hasQueryToken) return 'invalid';
    if (input.hasCode) return 'pkce';
    if (!input.accessToken) return 'neutral';
    if (input.accessToken.length > 16384 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(input.accessToken)) {
      return 'invalid';
    }
    return 'verify';
  }

  async function verify(input, config, fetcher, timeoutMs = 15000) {
    const state = initialState(input);
    if (state !== 'verify') return { state };
    let safe;
    try { safe = publicConfig(config); }
    catch (_) { return { state: 'configuration' }; }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(safe.url + '/auth/v1/user', {
        method: 'GET',
        headers: { apikey: safe.key, Authorization: 'Bearer ' + input.accessToken },
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        redirect: 'error',
        signal: controller.signal,
      });
      if (response.status === 429 || response.status >= 500) return { state: 'temporary' };
      if (!response.ok) return { state: 'invalid' };
      const user = await response.json();
      // Solo una respuesta del servidor con correo confirmado habilita el estado de éxito.
      if (user && typeof user.id === 'string' && user.id.length > 0 &&
          typeof user.email === 'string' && user.email.length > 0 &&
          typeof user.email_confirmed_at === 'string' &&
          Number.isFinite(Date.parse(user.email_confirmed_at))) return { state: 'success' };
      return { state: 'unconfirmed' };
    } catch (_) {
      return { state: 'temporary' };
    } finally {
      clearTimeout(timeout);
    }
  }

  return Object.freeze({ readReturn, publicConfig, initialState, verify });
});
