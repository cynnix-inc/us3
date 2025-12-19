import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Button } from '../Button';

describe('Button', () => {
  it('renders a label', () => {
    const { getByText } = render(<Button label="Continue" />);
    expect(getByText('Continue')).toBeTruthy();
  });

  it('exposes disabled accessibility state', () => {
    const { getByTestId } = render(<Button testID="btn" label="Continue" disabled />);
    expect(getByTestId('btn').props.accessibilityState).toEqual({
      disabled: true,
    });
  });
});
