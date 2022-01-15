/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    POLYGON_PRIVATE_KEY: process.env.POLYGON_PRIVATE_KEY,
    NFT_STORAGE: process.env.NFT_STORAGE,
  },
};
