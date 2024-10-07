import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { type AvatarProps } from './Avatar';
import {
  APP_BORDER_RADIUS,
  applyMuted,
  avatarColorMap,
  getColorWidth,
  getTotalBorderWidth,
  parseSize,
  toPixels,
  type ColorVariant,
} from './utils';

export const getColorVariantStyles = (colorVariant: ColorVariant) => {
  const colorToken: string = avatarColorMap[colorVariant];

  return {
    boxShadow: [
      `0px 0px 0px ${getColorWidth(colorVariant)}px ${colorToken} inset`,
      `0px 0px 0px ${getTotalBorderWidth(colorVariant)}px ${
        tokens.colorWhite
      } inset`,
    ].join(', '),
  };
};

const getInitialsFontSize = (size: number) => Math.round(size / 2);

export const getAvatarStyles = ({
  size: sizeOption,
  variant,
  colorVariant,
}: {
  size: AvatarProps['size'];
  variant: AvatarProps['variant'];
  colorVariant: ColorVariant;
}) => {
  const borderRadius = variant === 'app' ? APP_BORDER_RADIUS : '100%';

  // The inner border radius is smaller than the outer border radius
  // See https://github.com/webuild-community/advent-of-sharing/blob/main/2022/day-06.md
  const innerBorderRadius =
    variant === 'app'
      ? APP_BORDER_RADIUS - getTotalBorderWidth(colorVariant)
      : '100%';

  const isMuted = colorVariant === 'muted';

  const size = parseSize(sizeOption);

  return {
    fallback: css({
      backgroundColor: isMuted ? applyMuted(tokens.gray300) : tokens.gray300,
      color: isMuted ? applyMuted(tokens.gray700) : tokens.gray700,
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontStretch: 'semi-condensed',
      fontSize: toPixels(getInitialsFontSize(size)),
    }),
    image: css({
      borderRadius: innerBorderRadius,
      display: 'block',

      // loading skeleton
      '& + svg': {
        borderRadius: innerBorderRadius,
        rect: { rx: 0, ry: 0 }, // has a default 4px border radius
      },
    }),
    root: css({
      borderRadius,
      height: size,
      width: size,
      overflow: 'hidden',
      position: 'relative',
      padding: getTotalBorderWidth(colorVariant),

      // color variant border
      '&::after': {
        borderRadius,
        bottom: 0,
        content: '""',
        display: 'block',
        left: 0,
        position: 'absolute',
        top: 0,
        right: 0,
        ...getColorVariantStyles(colorVariant),
      },
    }),
    imageContainer: css(
      {
        backgroundColor: tokens.colorWhite,
        overflow: 'visible',
        zIndex: 1,
      },
      colorVariant === 'muted' && {
        img: {
          opacity: 0.5,
        },
      },
    ),
    overlayIcon: css({
      svg: {
        backgroundColor: tokens.colorWhite,
        borderRadius: '100%',
        position: 'absolute',
        bottom: 0,
        right: '-10%',
        width: '40%',
        height: '40%',
        zIndex: 1,
      },
    }),
  };
};
