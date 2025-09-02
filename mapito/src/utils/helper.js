export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const getInitials = (name) => {
    if (!name) return '';
  
    const words = name.split(' ');
    let initials = '';
  
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }
  
    return initials.toUpperCase();
  };

  export const validatePassword = (password) => {
  if (typeof password !== 'string') return false;
  // Regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return strongPasswordRegex.test(password);
};
  
  
  
  
