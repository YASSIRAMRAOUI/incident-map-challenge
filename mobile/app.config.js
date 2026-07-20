module.exports = {
  expo: {
    name: "Incident Map",
    slug: "incident-map",
    version: "1.0.0",
    orientation: "default",
    userInterfaceStyle: "dark",
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#0f172a"
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
        }
      }
    }
  }
};
