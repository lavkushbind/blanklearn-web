// src/types.d.ts

// This tells TypeScript that Firebase modules (which might be ESM-only) can be imported 
// even if they don't have standard declaration files available immediately.

declare module 'firebase/database' {
    // Exporting the necessary functions if the error persists on specific functions
    // If the error is only about module existence, this simple declaration is enough.
}

declare module 'firebase/auth' {
    // We already handled RecaptchaVerifier export in firebase.ts, but this ensures module existence.
}

// To fix issues with modules that don't export types by default (like some Firebase ESM modules)
declare module 'firebase/app' {
    export * from 'firebase/app';
}