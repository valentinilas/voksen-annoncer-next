export function formatCommentDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
  }