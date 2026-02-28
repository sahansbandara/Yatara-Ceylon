import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
	darkMode: ['class', 'class'],
	content: [
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'deep-emerald': '#043927',
				'antique-gold': '#D4AF37',
				'off-white': '#FAFAFA',
				ocean: {
					'50': '#F0F9FF',
					'100': '#E0F2FE',
					'200': '#BAE6FD',
					'300': '#7DD3FC',
					'400': '#38BDF8',
					'500': '#0EA5E9',
					'600': '#0284C7',
					'700': '#0369A1',
					'800': '#075985',
					'900': '#0C4A6E',
					'950': '#082F49'
				},
				sand: {
					'50': '#FEFCE8',
					'100': '#FEF9C3',
					'200': '#FEF08A',
					'300': '#FDE047',
					'400': '#FACC15',
					'500': '#EAB308'
				},
				forest: {
					'50': '#F0FDF4',
					'100': '#DCFCE7',
					'400': '#4ADE80',
					'500': '#22C55E',
					'600': '#16A34A'
				},
				// Liquid Glass palette tokens
				glass: {
					'white': 'rgba(255, 255, 255, 0.12)',
					'white-medium': 'rgba(255, 255, 255, 0.4)',
					'white-strong': 'rgba(255, 255, 255, 0.7)',
					'dark': 'rgba(4, 57, 39, 0.85)',
					'dark-medium': 'rgba(4, 57, 39, 0.6)',
					'gold': 'rgba(212, 175, 55, 0.15)',
					'gold-strong': 'rgba(212, 175, 55, 0.3)',
					'border': 'rgba(255, 255, 255, 0.25)',
					'border-gold': 'rgba(212, 175, 55, 0.2)',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: [
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
				serif: [
					'"Cormorant Garamond"',
					'serif'
				],
				display: [
					'"Playfair Display"',
					'"Cormorant Garamond"',
					'serif'
				],
				nav: [
					'Manrope',
					'Montserrat',
					'system-ui',
					'sans-serif'
				]
			},
			animation: {
				'fade-in': 'fadeIn 0.6s ease-out',
				'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'slide-up': 'slideUp 0.6s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
				'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
				'slide-in-right': 'slideInRight 0.6s ease-out forwards',
				'scale-in': 'scaleIn 0.3s ease-out',
				'scale-reveal': 'scaleReveal 0.5s ease-out forwards',
				float: 'float 6s ease-in-out infinite',
				'float-soft': 'floatSoft 4s ease-in-out infinite',
				shimmer: 'shimmer 2s linear infinite',
				'glass-shine': 'glassShine 3s ease-in-out infinite',
				'text-reveal': 'textReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
				'marquee': 'marqueeScroll 30s linear infinite',
				'counter-up': 'counterUp 0.5s ease-out forwards',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideDown: {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				slideInRight: {
					'0%': { opacity: '0', transform: 'translateX(40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				scaleReveal: {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				floatSoft: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				glassShine: {
					'0%': { transform: 'translateX(-100%) skewX(-15deg)' },
					'100%': { transform: 'translateX(200%) skewX(-15deg)' }
				},
				textReveal: {
					'0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' }
				},
				pulseGlow: {
					'0%, 100%': { boxShadow: '0 0 8px rgba(212, 175, 55, 0.2)' },
					'50%': { boxShadow: '0 0 24px rgba(212, 175, 55, 0.5)' }
				},
				marqueeScroll: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				counterUp: {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-gradient': 'linear-gradient(135deg, rgba(2,132,199,0.9) 0%, rgba(3,105,161,0.8) 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
				'glass-gradient-gold': 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)',
				'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(212,175,55,0.06) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(4,57,39,0.04) 0%, transparent 50%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backdropBlur: {
				'xl': '24px',
				'2xl': '32px',
				'3xl': '48px',
			}
		}
	},
	plugins: [tailwindcssAnimate],
};

export default config;
