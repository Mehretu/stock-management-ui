export function convertIsoToDate(isoDate) {
    const date = new Date(isoDate); // Create a Date object from the ISO date string
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    let normalDate = date.toLocaleDateString('en-US', options);
    return normalDate;
}