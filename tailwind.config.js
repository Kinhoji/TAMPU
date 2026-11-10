/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { tampu: { green: '#10B981', amber: '#F59E0B', ink: '#142320' } }, gridTemplateColumns: { 13: 'repeat(13, minmax(0, 1fr))' }, gridTemplateRows: { 13: 'repeat(13, minmax(0, 1fr))' } } },
  plugins: [],
}
