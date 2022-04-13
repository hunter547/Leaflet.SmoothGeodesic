// curved paths

// export const getPathOptions = (
//   origin: [number, number],
//   destination: [number, number]
// ) => {
//   return {
//     color: `rgba(${themeRgb.accent400}, .9)`,
//     weight: 4,
//     animate: {
//       duration: getCurveAnimationDuration(origin, destination),
//       iterations: 1,
//       easing: "ease-in-out",
//       direction: "alternate"
//     }
//   } as CurveOptions
// }

export const getCurveAnimationDuration = (
  origin: [number, number],
  destination: [number, number]
) => {
  const offsetX = destination[1] - origin[1],
    offsetY = destination[0] - origin[0]
  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))

  const durationBase = 1000
  return Math.sqrt(Math.log(r)) * durationBase
}
