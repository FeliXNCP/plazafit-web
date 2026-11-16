(function () {
  'use strict';
  const api = window.PlazaFitConfirmation;
  let input = window.__PLAZAFIT_AUTH_RETURN__ || {};
  delete window.__PLAZAFIT_AUTH_RETURN__;
  const config = window.PLAZAFIT_AUTH_CONFIG;
  const title = document.getElementById('status-title');
  const description = document.getElementById('status-description');
  const detail = document.getElementById('status-detail');
  const card = document.getElementById('status-card');
  const retry = document.getElementById('retry-button');
  const openApp = document.getElementById('app-button');
  const hint = document.getElementById('app-hint');
  const webButton = document.getElementById('web-button');
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  const icons = document.querySelectorAll('[data-icon]');
  let busy = false;

  const messages = {
    loading: ['Un momento…', 'Estamos comprobando la confirmación de tu correo.', '', 'loading'],
    success: ['Correo verificado', 'Tu cuenta está lista. Vuelve a PlazaFit e inicia sesión para comenzar.',
      'Ya puedes cerrar esta página.', 'success'],
    neutral: ['Confirma tu correo', 'Abre el enlace que te enviamos por correo para completar tu registro.',
      'Si ya lo confirmaste, vuelve a la app e inicia sesión.', 'neutral'],
    expired: ['El enlace ya no está disponible', 'Puede haber vencido o haberse utilizado anteriormente.',
      'Prueba iniciar sesión en PlazaFit. Si tu correo sigue sin confirmar, solicita un nuevo enlace de confirmación.', 'warning'],
    invalid: ['No pudimos comprobar el enlace', 'El enlace puede estar incompleto, vencido o ya utilizado.',
      'Prueba iniciar sesión en PlazaFit. Si tu correo sigue sin confirmar, solicita un nuevo enlace de confirmación.', 'warning'],
    temporary: ['No pudimos conectar', 'La confirmación puede haberse completado, pero no conseguimos comprobarla ahora.',
      'Revisa tu conexión y pulsa Reintentar. También puedes volver a PlazaFit e intentar iniciar sesión.', 'warning'],
    configuration: ['Comprobación no disponible', 'No pudimos comprobar la confirmación en esta página.',
      'Vuelve a PlazaFit e intenta iniciar sesión. El equipo debe revisar la configuración de esta página.', 'warning'],
    unconfirmed: ['El correo aún no figura confirmado', 'No encontramos una confirmación válida para este enlace.',
      'Revisa el último correo de registro que recibiste o solicita un nuevo enlace de confirmación.', 'warning'],
    pkce: ['Continúa en PlazaFit', 'Este enlace usa un flujo de acceso que debe completarse desde la aplicación.',
      'Vuelve a PlazaFit e intenta iniciar sesión. Esta página no ha comprobado la confirmación.', 'neutral'],
    'other-flow': ['Continúa desde la app', 'Este enlace no corresponde a la confirmación de una cuenta nueva.',
      'Para recuperar tu contraseña, abre el correo de recuperación y sigue el proceso de PlazaFit.', 'neutral'],
  };

  function render(state) {
    const message = messages[state] || messages.invalid;
    card.dataset.state = state;
    title.textContent = message[0];
    description.textContent = message[1];
    detail.textContent = message[2];
    detail.hidden = !message[2];
    icons.forEach((icon) => { icon.hidden = icon.dataset.icon !== message[3]; });
    retry.hidden = state !== 'temporary';
    openApp.hidden = state === 'loading' || !mobile;
    webButton.hidden = state === 'loading' || mobile;
    hint.textContent = mobile
      ? 'Si el botón no abre la app, vuelve a PlazaFit manualmente e inicia sesión.'
      : 'Desde un computador, abre PlazaFit en tu teléfono para iniciar sesión.';
    hint.hidden = state === 'loading';
    document.title = message[0] + ' · PlazaFit';
    card.setAttribute('aria-busy', String(state === 'loading'));
  }

  async function run() {
    if (busy) return;
    busy = true;
    render('loading');
    try {
      const result = await api.verify(input, config, window.fetch.bind(window));
      render(result.state);
      // Reintentar solo una comprobación GET no consume otro correo ni vuelve a confirmar.
      // Se retiene la credencial exclusivamente en memoria ante error temporal.
      if (result.state !== 'temporary') input = {};
    } catch (_) {
      input = {};
      render('invalid');
    } finally { busy = false; }
  }

  retry.addEventListener('click', run);
  window.addEventListener('pagehide', () => { input = {}; });
  // BFCache: nunca mantener una verificación en curso o un botón de reintento sin credencial.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && card.dataset.state !== 'success') render('neutral');
  });
  if (!api) render('configuration');
  else void run();
})();
