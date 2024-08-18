const size = {
  desktop: 1440,
  labtopL: 1300,
  labtopM: 1180,
  labtopS: 1000,
  tablet: 800,
  mobileL: 576,
  mobileM: 480,
  mobileS: 414,
};

export const deviceMaxWidth = {
  desktop: `(max-width: ${size.desktop}px)`,
  labtopL: `(max-width: ${size.labtopL}px)`,
  labtopM: `(max-width: ${size.labtopM}px)`,
  labtopS: `(max-width: ${size.labtopS}px)`,
  tablet: `(max-width: ${size.tablet}px)`,
  mobileL: `(max-width: ${size.mobileL}px)`,
  mobileM: `(max-width: ${size.mobileM}px)`,
  mobileS: `(max-width: ${size.mobileS}px)`,
};

export const deviceMinWidth = {
  desktop: `(min-width: ${size.desktop + 1}px)`,
  labtopL: `(min-width: ${size.labtopL + 1}px)`,
  labtopM: `(min-width: ${size.labtopM + 1}px)`,
  labtopS: `(min-width: ${size.labtopS + 1}px)`,
  tablet: `(min-width: ${size.tablet + 1}px)`,
  mobileL: `(min-width: ${size.mobileL + 1}px)`,
  mobileM: `(min-width: ${size.mobileM + 1}px)`,
  mobileS: `(min-width: ${size.mobileS + 1}px)`,
};

export const betweenMobileSandTablet = `(min-width: ${size.mobileS + 1}px) and (max-width: ${size.labtopS}px)`;

export default size;
