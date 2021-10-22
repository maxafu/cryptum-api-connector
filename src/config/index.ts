export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  cryptumConfig: {
    environment: process.env.NODE_ENV || 'development',
    apiKey: process.env.CRYPTUM_API_KEY,
  },
});
