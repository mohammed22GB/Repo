export const listNums = (entries) => {
  const roundNum = Math.ceil(entries / 10);
  const tens = Math.floor(roundNum / 10);
  const arr = Array.from({ length: tens }, (_, i) => (i + 1) * 10);
  const maxNum = Math.max.apply(null, arr);
  let filteredArr = arr.filter((arrNum) => arrNum < 100);

  if (!filteredArr.includes(10)) {
    filteredArr.push(10);
  }
  if (!filteredArr.includes(20)) {
    filteredArr.push(20);
  }
  if (!filteredArr.includes(30)) {
    filteredArr.push(30);
  }
  if (!filteredArr.includes(50) && entries > 59) {
    filteredArr.push(50);
  }
  if (!filteredArr.includes(100) && entries > 99) {
    filteredArr.push(100);
  }
  if ((!filteredArr.includes(200) && entries > 299) || maxNum >= 200) {
    filteredArr.push(200);
  }
  // if ((!filteredArr.includes(500) && entries > 599) || maxNum >= 500) {
  //   filteredArr.push(500);
  // }
  filteredArr = filteredArr.filter(
    (num) => num !== 40 && num !== 60 && num !== 70 && num !== 80
  );
  filteredArr = filteredArr.sort((a, b) => a - b);
  return filteredArr;
};

// export const getFilteredTensNumbers = (num) => {
//   const divided = Math.ceil(num / 10);
//   const tensDigit = Math.floor(divided / 10);
//   const tensArray = Array.from(
//     { length: tensDigit },
//     (_, index) => (index + 1) * 10
//   );
//   tensArray.push(divided);

//   const filteredArray = tensArray.filter(function (number) {
//     return number <= 100;
//   });

//   const maxUnfiltered = Math.max.apply(null, tensArray);

//   if (maxUnfiltered <= 100) {
//     filteredArray = filteredArray.filter(function (number) {
//       return number % 10 !== 0;
//     });
//   }

//   if (maxUnfiltered >= 200) {
//     filteredArray.push(200);
//   }
//   if (maxUnfiltered >= 500) {
//     filteredArray.push(500);
//   }
//   if (!filteredArray.includes(10)) {
//     filteredArray.push(10);
//   }
//   if (!filteredArray.includes(20)) {
//     filteredArray.push(20);
//   }
//   if (!filteredArray.includes(30)) {
//     filteredArray.push(30);
//   }

//   return filteredArray;
// };
