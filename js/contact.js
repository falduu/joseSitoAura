(() => {
  'use strict';

  const copyButton = document.querySelector('[data-copy-phone]');
  const status = document.getElementById('copy-phone-status');
  if (!copyButton || !status) return;

  copyButton.addEventListener('click', async () => {
    const phone = copyButton.dataset.copyPhone;
    if (!phone) {
      status.textContent = 'Numero non disponibile per la copia.';
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(phone);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = phone;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();
        if (!copied) throw new Error('Clipboard copy was rejected');
      }

      status.textContent = 'Numero copiato negli appunti.';
    } catch (error) {
      status.textContent = 'Copia non riuscita. Seleziona e copia il numero manualmente.';
      console.error('Unable to copy the contact phone number.', error);
    }
  });
})();
