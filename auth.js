const Express = require('express');
const BodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

let secret;

app.get('/auth-totp-mfa', (req, res, next) => {
  secret = speakeasy.generateSecret({
    length: 20,
    name: 'https://tecnops.es',
  });
  
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    console.log(secret);
    res.json({
      qrcode: data_url,
      secret: secret.base32,
    });
  });
});

app.get('/auth-totp-mfa-verify', (req, res, next) => {
  const token = req.query.token;
  const secret = req.query.secret;
  const isValid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });

  res.json({
    isValid
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});