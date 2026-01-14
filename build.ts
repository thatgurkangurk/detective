import tailwind from "bun-plugin-tailwind";

await Bun.build({
  entrypoints: ["./src/main.ts"],
  compile: {
    outfile: "./server",
  },
  minify: {
    whitespace: true,
    syntax: true,
    keepNames: true,
    identifiers: true,
  },
  throw: true,
  plugins: [tailwind],
});
