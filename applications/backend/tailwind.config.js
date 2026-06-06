/*eslint-env node*/
module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        myblack: '#222831',
        myyellow: '#FFD369',
        mygrey: '#393E46',
        mywhite: '#EEEEEE'
      }
    },
    container: {
      center: true
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
