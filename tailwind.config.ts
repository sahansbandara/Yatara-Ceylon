import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class', 'class'],
    content: [
        './src/**/*.{ts,tsx}',
    ],
    theme: {
    	extend: {
    		colors: {
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
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			display: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			]
    		},
    		animation: {
    			'fade-in': 'fadeIn 0.6s ease-out',
    			'slide-up': 'slideUp 0.6s ease-out',
    			'slide-down': 'slideDown 0.3s ease-out',
    			'scale-in': 'scaleIn 0.3s ease-out',
    			float: 'float 6s ease-in-out infinite',
    			shimmer: 'shimmer 2s linear infinite'
    		},
    		keyframes: {
    			fadeIn: {
    				'0%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			slideUp: {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(30px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			slideDown: {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(-10px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			scaleIn: {
    				'0%': {
    					opacity: '0',
    					transform: 'scale(0.95)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'scale(1)'
    				}
    			},
    			float: {
    				'0%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-20px)'
    				}
    			},
    			shimmer: {
    				'0%': {
    					backgroundPosition: '-200% 0'
    				},
    				'100%': {
    					backgroundPosition: '200% 0'
    				}
    			}
    		},
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'hero-gradient': 'linear-gradient(135deg, rgba(2,132,199,0.9) 0%, rgba(3,105,161,0.8) 100%)'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
