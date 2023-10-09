module.exports = function (api) {
    api.cache(true);
  
    const presets = [
     "@babel/preset-typescript"
    ];
  
    const plugins = [
      "transform-remove-console"
    ];
  
    return {
      presets,
      plugins
    };
  };