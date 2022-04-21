import pkg from "./package.json";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const banner = `/*! Leaflet.SmoothGeodesic ${pkg.version} - created by Hunter Evanoff - https://github.com/hunter547/Leaflet.SmoothGeodesic */`;

const bundle = (format, filename, options = {}) => ({
	input: "src/smoothgeodesic.ts",
	output: {
		file: filename,
		format: format,
		banner: banner,
		name: "leaflet.smoothgeodesic",
		sourcemap: false,
		globals: {
			leaflet: "L",
		},
	},
	external: [
		...Object.keys(pkg.peerDependencies),
		...(!options.resolve ? Object.keys(pkg.dependencies) : []),
	],
	plugins: [
		...(options.resolve ? [resolve()] : []),
		commonjs(),
		typescript({
			typescript: require("typescript"),
			clean: true,
		}),
		...(options.minimize ? [terser()] : []),
	],
});

export default [
	bundle("umd", pkg.browser, { resolve: true, minimize: true }),
	bundle("esm", pkg.main, { resolve: true, minimize: true }),
	{
		input: "typings/smoothgeodesic/index.d.ts",
		output: {
			file: pkg.types,
			format: "es",
		},
		plugins: [dts()],
	},
];
