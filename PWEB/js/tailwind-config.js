/**
 * =========================================================================
 * CONFIGURAÇÃO DO TAILWIND CSS (PALETA E TIPOGRAFIA HORTAVIVA)
 * =========================================================================
 */
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        },
        colors: {
          hv: {
            sage: '#EAF3DE',
            forest: '#27500A',
            green: '#3B6D11',
            greenHover: '#2E560D',
            leaf: '#B8D688',
            amber: '#EF9F27',
            amberHover: '#E08F18',
            badgePos: '#C2DF9B',
            badgeWarn: '#FAD284',
            warnText: '#5C3A00',
            border: '#C7DDA8',
            softRow: '#F7FBF2',
          }
        }
      }
    }
  };
}

