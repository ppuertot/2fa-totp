(() => {
  const qrCode = window.localStorage.getItem('qrCode');
  const secretItem = window.localStorage.getItem('secret');
  const inputToken = document.querySelector('#code');
  const btnNewQrCode = document.querySelector('#btn-new-qrcode');
  const API = {
    BASEURL: 'http://localhost:3000',
    AUTH: '/auth-totp-mfa',
    VERIFY: '/auth-totp-mfa-verify',
  };
  !qrCode && !secretItem ? generateNewQrCode() : document.getElementById('qrCode').src = qrCode;
  const generateNewQrCode = async () => {
    const { BASEURL, AUTH } = API;
    try {
      const { qrcode, secret } = await (await fetch(`${BASEURL}${AUTH}`)).json();
      document.querySelector('#qrCode').src = qrcode;
      window.localStorage.setItem('qrCode', qrcode);
      window.localStorage.setItem('secret', secret);
    } catch (err) {
      toats({ type: 'alert', msn: err });
    }
  };
  const sendCode = async (evt) => {
    if (evt.keyCode === 13) {
      const { BASEURL, VERIFY } = API;
      try {
        const { isValid } = await (await fetch(`${BASEURL}${VERIFY}?token=${inputToken.value}&secret=${secretItem}`)).json();
        toats({ type: isValid ? 'success' : 'alert', msn:  `The code is ${isValid ? 'valid' : 'not valid'}` });
        inputToken.value = '';
      } catch (err) {
        toats({ type: 'alert', msn: err });
      }
    }
  };
  const toats = ({ type, msn }) => {
    Metro.toast.create(msn, null, 1000, type);
  }
  btnNewQrCode.addEventListener('click', generateNewQrCode);
  inputToken.addEventListener('keydown', async (evt) => sendCode(evt));
  
})();