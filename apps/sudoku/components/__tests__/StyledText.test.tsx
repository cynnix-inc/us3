import * as React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MonoText } from '../StyledText';

describe('MonoText', () => {
  it('renders correctly', () => {
    let tree: renderer.ReactTestRendererJSON | renderer.ReactTestRendererJSON[] | null = null;
    act(() => {
      tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });
});
