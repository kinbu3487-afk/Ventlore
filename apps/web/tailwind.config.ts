import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173F35',
          hover: '#102E27',
          light: '#235e50',
        },
        jade: '#2C7563',
        sage: '#DCE8DA',
        ivory: '#F5F1E8',
        amber: {
          DEFAULT: '#F0A44B',
          hover: '#df9237',
        },
        waypoint: '#F0A44B',
        ink: {
          DEFAULT: '#182522',
          secondary: '#52645C',
          muted: '#71857c',
        },
        surface: {
          canvas: '#F5F1E8',
          card: '#FFFFFF',
          subtle: '#DCE8DA',
        },
        status: {
          review: '#225A91',
          'review-bg': '#EAF2FB',
          pending: '#805400',
          'pending-bg': '#FFF1D6',
          danger: '#AD3C32',
          'danger-bg': '#FCEDEA',
          success: '#21654B',
          'success-bg': '#E7F3EA',
          neutral: '#52645C',
          'neutral-bg': '#EDF0ED',
          vip: '#70502A',
          'vip-bg': '#F4EBDD',
        },
      },
      borderRadius: {
        card: '16px',
        control: '12px',
        input: '10px',
      },
      minHeight: {
        control: '48px',
        touch: '44px',
      },
      height: {
        control: '48px',
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam)', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
