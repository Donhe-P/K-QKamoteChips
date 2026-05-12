import { render, screen } from '@testing-library/react';
import App from './App';

test('renders K&Q storefront', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Crunchy Homemade Kamote Chips/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Order Now/i })).toBeInTheDocument();
});
