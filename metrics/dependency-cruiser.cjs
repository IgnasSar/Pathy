module.exports = {
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "node_modules|/tests/|\\.d\\.ts$" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: `${__dirname}/tsconfig.depcruise.json` },
  },
};
