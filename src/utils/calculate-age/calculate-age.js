export const calculateAge = (birthYear) => {
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Calculate the age
    const age = currentYear - birthYear;
    return age;
}
