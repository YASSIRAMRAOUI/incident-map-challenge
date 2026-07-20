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
      package: "com.anonymous.incidentmap",
      adaptiveIcon: {
        backgroundColor: "#0f172a"
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
        }
      }
    },
    extra: {
      eas: {
        projectId: "563d7334-8894-40e5-8316-76ec7a1d2c8d"
      }
    }
  }
};
