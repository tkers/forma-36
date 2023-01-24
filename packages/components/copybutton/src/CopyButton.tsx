import React, {
  useCallback,
  useState,
  type MouseEventHandler,
  type FocusEventHandler,
} from 'react';
import { CopyIcon } from '@contentful/f36-icons';
import type { ExpandProps } from '@contentful/f36-core';
import { Tooltip, type TooltipProps } from '@contentful/f36-tooltip';
import { Button, type ButtonProps } from '@contentful/f36-button';
import { getCopyButtonStyles } from './CopyButton.styles';
import { cx } from 'emotion';

export type CopyButtonProps = Omit<
  ButtonProps,
  'children' | 'endIcon' | 'startIcon' | 'isDisabed' | 'size'
> & {
  /**
   * Function that gets called when the button is clicked
   */
  onCopy?: (string) => void;
  /**
   * Text to be shown when the button is clicked
   * @default Copied!
   */
  tooltipCopiedText?: string;
  /**
   * Text to be shown when button is hovered or focused
   * @default Copy to clipboard
   */
  tooltipText?: string;
  /**
   * Props that are passed to the tooltip component
   */
  tooltipProps?: Omit<TooltipProps, 'content' | 'children'>;
  /**
   * Label to be used on aria-label for the button
   * @default Copy to clipboard
   */
  label?: string;
  /**
   * Allows to disable the copy button, when true the tooltip would not be shown
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Allows setting size of the copy button to small
   * @default medium
   */
  size?: 'small' | 'medium';
  /**
   * Value that will be copied to clipboard when the button is clicked
   */
  value: string;
};

function _CopyButton(
  {
    className,
    isDisabled = false,
    isLoading = false,
    label,
    onBlur,
    onCopy,
    size = 'medium',
    testId = 'cf-ui-copy-button',
    tooltipCopiedText = 'Copied!',
    tooltipProps,
    tooltipText = 'Copy to clipboard',
    value,
    ...otherProps
  }: ExpandProps<CopyButtonProps>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const styles = getCopyButtonStyles({ size });
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async () => {
    try {
      await window.navigator.clipboard.writeText(value);
    } catch (error) {
      console.error(error);
      return;
    }

    onCopy?.(value);
    setCopied(true);
  }, [onCopy, value]);

  const handleBlur: FocusEventHandler<HTMLButtonElement> = (event) => {
    if (copied) {
      setCopied(false);
    }

    onBlur?.(event);
  };

  return (
    <Tooltip
      content={copied ? tooltipCopiedText : tooltipText}
      {...tooltipProps}
      isDisabled={isDisabled}
    >
      <Button
        aria-label={
          copied ? 'Value copied to clipboard' : label ?? `Copy to clipboard`
        }
        aria-live="assertive"
        className={cx(styles.button, className)}
        isDisabled={isLoading || isDisabled}
        isLoading={isLoading}
        onBlur={handleBlur}
        testId={testId}
        {...otherProps}
        onClick={handleClick}
        ref={ref}
        startIcon={
          <CopyIcon
            variant="muted"
            size={size === 'small' ? 'tiny' : 'small'}
          />
        }
        variant="secondary"
      />
    </Tooltip>
  );
}

_CopyButton.displayName = 'CopyButton';

export const CopyButton = React.forwardRef(_CopyButton);
