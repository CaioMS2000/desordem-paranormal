module.exports = (request, options) => {
  // If the request ends with .js, try to resolve it as .ts
  if (request.endsWith(".js")) {
    const tsRequest = request.replace(/\.js$/, ".ts");
    try {
      return options.defaultResolver(tsRequest, options);
    } catch (e) {
      // If .ts doesn't exist, fallthrough to default resolver
    }
  }

  // Fall back to default resolver
  return options.defaultResolver(request, options);
};
