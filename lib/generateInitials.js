export function generateInitials (fullName) {
    const words = fullName.split(/\s+/);
    const initials = words.map((word)=> word.charAt(0)).join('')
    return initials.toUpperCase();
};
