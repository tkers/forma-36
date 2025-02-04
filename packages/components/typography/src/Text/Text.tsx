import React from 'react';
import tokens, {
  FontSizeTokens,
  LineHeightTokens,
  FontWeightTokens,
  FontStackTokens,
  ColorTokens,
  LetterSpacingTokens,
} from '@contentful/f36-tokens';
import { css, cx } from 'emotion';
import {
  Box,
  type PolymorphicComponent,
  type CommonProps,
  type MarginProps,
  type PolymorphicProps,
  type ExpandProps,
} from '@contentful/f36-core';

export interface TextInternalProps extends CommonProps, MarginProps {
  children?: React.ReactNode;
  fontSize?: FontSizeTokens;
  lineHeight?: LineHeightTokens;
  letterSpacing?: LetterSpacingTokens;
  fontStack?: FontStackTokens;
  fontWeight?: FontWeightTokens;
  fontColor?: ColorTokens;
  isTruncated?: boolean;
  isWordBreak?: boolean;
}

const TEXT_DEFAULT_TAG = 'span';

function truncatedStyle() {
  return css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  });
}

function wordBreakStyle() {
  return css({
    wordBreak: 'break-word',
  });
}

export type TextProps<E extends React.ElementType = typeof TEXT_DEFAULT_TAG> =
  PolymorphicProps<TextInternalProps, E, 'color'>;

function _Text<E extends React.ElementType = typeof TEXT_DEFAULT_TAG>(
  props: TextProps<E>,
  ref: React.Ref<any>,
) {
  const {
    fontSize = 'fontSizeM',
    fontStack = 'fontStackPrimary',
    fontWeight = 'fontWeightNormal',
    fontColor = 'gray800',
    lineHeight = 'lineHeightM',
    letterSpacing = 'letterSpacingDefault',
    children,
    isTruncated,
    isWordBreak,
    as,
    className,
    margin = 'none',
    ...otherProps
  } = props;
  const Element: React.ElementType = as || TEXT_DEFAULT_TAG;

  return (
    <Box
      {...otherProps}
      as={Element}
      className={cx(
        css({
          padding: 0,
          fontFamily: tokens[fontStack],
          fontWeight: tokens[fontWeight],
          color: tokens[fontColor],
          fontSize: tokens[fontSize],
          lineHeight: tokens[lineHeight],
          letterSpacing: tokens[letterSpacing],
        }),
        isTruncated ? truncatedStyle() : null,
        isWordBreak ? wordBreakStyle() : null,
        className,
      )}
      margin={margin}
      ref={ref}
    >
      {children}
    </Box>
  );
}

_Text.displayName = 'Text';

export const Text: PolymorphicComponent<
  ExpandProps<TextInternalProps>,
  typeof TEXT_DEFAULT_TAG,
  'color'
> = React.forwardRef(_Text);
