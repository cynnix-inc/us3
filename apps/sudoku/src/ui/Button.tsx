import * as React from 'react';
import { Pressable, Text } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  testID?: string;
};

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  testID,
}: ButtonProps) {
  const base = 'px-4 py-3 rounded-xl items-center justify-center';

  const variantClass =
    variant === 'primary'
      ? 'bg-appAccent-light dark:bg-appAccent-dark'
      : variant === 'secondary'
        ? 'bg-appCard-light dark:bg-appCard-dark border border-appBorder-light dark:border-appBorder-dark'
        : variant === 'danger'
          ? 'bg-appDanger-light dark:bg-appDanger-dark'
          : 'bg-transparent';

  const labelClass =
    variant === 'secondary' || variant === 'ghost'
      ? 'text-appFg-light dark:text-appFg-dark'
      : 'text-white';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={[base, variantClass, disabled ? 'opacity-50' : 'opacity-100'].join(' ')}
    >
      <Text className={['text-base font-semibold', labelClass].join(' ')}>{label}</Text>
    </Pressable>
  );
}
