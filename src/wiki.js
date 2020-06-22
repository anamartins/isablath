let list = document.querySelectorAll("table")[2].querySelectorAll("tr");

let result = Array.from(list).map((item, index) => {
  let columns = Array.from(item.querySelectorAll("td"));
  if (columns[0]) {
    return {
      name: columns[0].innerText,
      species: columns[1].innerText,
      gender: columns[2].innerText,
      personality: columns[3].innerText,
      birthday: columns[4].innerText,
      catchphrase: columns[5].innerText,
    };
  }
  return null;
});
