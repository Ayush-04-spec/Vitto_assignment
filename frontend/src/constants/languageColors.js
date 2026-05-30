// Language badge color schemes
export const LANGUAGE_COLORS = {
  Hindi: {
    background: '#FFF3E0',
    text: '#E65100'
  },
  Tamil: {
    background: '#E3F2FD',
    text: '#0D47A1'
  },
  Telugu: {
    background: '#F3E5F5',
    text: '#4A148C'
  },
  Marathi: {
    background: '#E0F2F1',
    text: '#004D40'
  },
  English: {
    background: '#F5F5F5',
    text: '#424242'
  }
};

// Helper function to get language colors
export const getLanguageColors = (language) => {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.English;
};
