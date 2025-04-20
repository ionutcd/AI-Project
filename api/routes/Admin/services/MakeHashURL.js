const CryptoJS = require("crypto-js");

const MakeHashURL = (chatbotInfo) => {
  try {
    const { org, app, email } = chatbotInfo;

    const o_token = CryptoJS.AES.encrypt(org, process.env.CRYPTO_KEY)
      .toString()
      .replaceAll("+", "xMl3Jk")
      .replaceAll("/", "Por21Ld")
      .replaceAll("=", "Ml32");

    const a_token = CryptoJS.AES.encrypt(app, process.env.CRYPTO_KEY)
      .toString()
      .replaceAll("+", "xMl3Jk")
      .replaceAll("/", "Por21Ld")
      .replaceAll("=", "Ml32");

    const e_token = CryptoJS.AES.encrypt(email, process.env.CRYPTO_KEY)
      .toString()
      .replaceAll("+", "xMl3Jk")
      .replaceAll("/", "Por21Ld")
      .replaceAll("=", "Ml32");
    const encrypt_url = `${process.env.MY_DOMAIN}/bot/${o_token}&${a_token}&${e_token}`;

    return encrypt_url;
  } catch (error) {
    console.log("making hash url", error);
    return null;
  }
};

module.exports = MakeHashURL;
