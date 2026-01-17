
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  // URL Normalization for PUMO Guide
  // Strategy: Underscores -> Hyphens, Uppercase -> Lowercase
  // Example: /pumo-guide/Fotele_Fotele_rozkładane -> /pumo-guide/fotele-fotele-rozkladane
  
  if (url.pathname.startsWith("/pumo-guide/") && 
      url.pathname !== "/pumo-guide/" && 
      url.pathname !== "/pumo-guide" &&
      !url.pathname.startsWith("/pumo-guide/dla-agentow") // Exclude special pages if needed, though they are likely compliant
      ) {
      
     // Check if normalization is needed
     if (url.pathname.includes("_") || /[A-Z]/.test(url.pathname)) {
        // Create new path
        const newPath = url.pathname
            .toLowerCase()
            .replace(/_/g, "-");
            
        // Return 301 Permanent Redirect
        return context.redirect(newPath, 301);
     }
  }
  
  return next();
});
