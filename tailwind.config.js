/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#F6F2EA', card: '#FFFFFF', deep: '#EFE9DD', sink: '#F0EBE1' },
        ink: { DEFAULT: '#22211E', muted: '#6E6A61', faint: '#9C968B' },
        brand: { DEFAULT: '#1FA46F', dark: '#16855A', soft: '#E7F4EC', mid: '#9FD9BC', border: '#CDEBD9' },
        line: '#EBE5D9',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(34,33,30,0.04), 0 8px 24px -12px rgba(34,33,30,0.12)',
        lift: '0 2px 6px rgba(34,33,30,0.06), 0 16px 40px -16px rgba(34,33,30,0.18)',
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
    },
  },
  plugins: [],
}
