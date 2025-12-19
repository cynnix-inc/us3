import { render } from '@testing-library/react-native';
import * as React from 'react';

import HomeScreen from '../../app/(tabs)/index';
import LeaderboardScreen from '../../app/(tabs)/leaderboard';
import PlayScreen from '../../app/(tabs)/play';
import SettingsScreen from '../../app/(tabs)/settings';

describe('tab routes', () => {
  it('renders Home', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Home')).toBeTruthy();
  });

  it('renders Play', () => {
    const { getByText } = render(<PlayScreen />);
    expect(getByText('Play')).toBeTruthy();
  });

  it('renders Leaderboard', () => {
    const { getByText } = render(<LeaderboardScreen />);
    expect(getByText('Leaderboard')).toBeTruthy();
  });

  it('renders Settings', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Settings')).toBeTruthy();
  });
});
