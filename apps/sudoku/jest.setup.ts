// Importing the library registers its built-in Jest matchers.
import '@testing-library/react-native';

// Keep tests deterministic regardless of developer machine settings.
process.env.TZ = 'UTC';

// A small safety net: treat missing act() as an error.
// (React Native Testing Library does a good job here; this is mainly for intent.)
