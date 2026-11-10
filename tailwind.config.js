/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { tampu: { earth: '#3A4B40', leaf: '#719B5C', carrot: '#F3793B', coral: '#E46A60', white: '#FFFFFF' } }, gridTemplateColumns: { 13: 'repeat(13, minmax(0, 1fr))' }, gridTemplateRows: { 13: 'repeat(13, minmax(0, 1fr))' } } },
  plugins: [],
}
