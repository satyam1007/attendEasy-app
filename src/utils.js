// export function formatDate(date, withDayName = false) {
//   const options = {
//     month: '2-digit',
//     day: '2-digit',
//     year: 'numeric'
//   };

//   if (withDayName) {
//     options.weekday = 'long';
//     return date.toLocaleDateString('en-US', options);
//   }

//   return date.toLocaleDateString('en-US', options);
// }

// // Initialize localStorage with default values if empty
// export function initializeLocalStorage() {
//   if (!localStorage.getItem('attendEaseClasses')) {
//     localStorage.setItem('attendEaseClasses', JSON.stringify(['10-A']));
//   }
//   if (!localStorage.getItem('attendEaseStudents')) {
//     localStorage.setItem('attendEaseStudents', JSON.stringify([]));
//   }
//   if (!localStorage.getItem('attendEaseAttendance')) {
//     localStorage.setItem('attendEaseAttendance', JSON.stringify({}));
//   }
//   if (!localStorage.getItem('attendEaseHistory')) {
//     localStorage.setItem('attendEaseHistory', JSON.stringify([]));
//   }
// }