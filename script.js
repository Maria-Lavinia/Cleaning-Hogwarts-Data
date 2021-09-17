"use strict";


//cleaning the data
window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {
  console.log("ready");
  registerButtons();
  loadJSON();
}
// const settings = {
//   filter: "all",
//   sortBy: "name",
//   sortDir: "asc",
// };
//buttons
function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

//cleaning data

function loadJSON() {
  console.log("loadJSON");
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((r) => r.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
  console.log("JSON loaded");
}

function prepareObjects(jsonData) {
  jsonData.forEach((elm) => {
    const Student = {
      firstName: "",
      lastName: "",
      middleName: "",
      nickname: "",
      image: "",
      house: "",
    };

    const student = Object.create(Student);

    let fullname = elm.fullname.trim();
    let house = elm.house.trim();
    let firstName = (student.firstName = fullname.substring(fullname.lastIndexOf(), fullname.indexOf(" ")));

    if (fullname.indexOf(" ") >= 0) {
      student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();
    } else {
      firstName = student.firstName = fullname.substring(fullname.indexOf(" ") + 1);
    }

    let middleName = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));

    if (middleName.includes('"')) {
      student.nickname = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
    } else {
      student.middleName = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
      student.middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1).toLowerCase();
    }

    let lastName = (student.lastName = fullname.substring(fullname.lastIndexOf(" ") + 1));
    if (fullname.indexOf(" ") >= 0) {
      student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();
    } else {
      lastName = student.lastName = "";
    }

    student.house = house;
    student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();

    if (fullname.indexOf(" ") == -1) {
      student.image = student.lastName.toLowerCase() + `_${student.firstName.substring(0, 1).toLowerCase()}` + `.png`;
    } else {
      student.image = student.lastName.substring(fullname.indexOf(" ") + 1).toLowerCase() + `_${student.firstName.substring(0, 1).toLowerCase()}` + `.png`;
    }
    allStudents.push(student);
  });

  displayList(allStudents);
  console.log("allStudents", allStudents);
}


//filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  filterList(filter);
}

function filterList(studentHouse) {
  let filteredList = allStudents;
  if (studentHouse === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (studentHouse === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (studentHouse === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (studentHouse === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  }

  displayList(filteredList);
}
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

//sorting

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // toggle the direction

  if (sortDir === "asc"){
    event.target.dataset.sortDirection = "desc";
  }else{
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user selected ${sortBy} -  ${sortDir}`);
  sortList(sortBy, sortDir);
}

function sortList(sortBy, sortDir){
  let sortedList = allStudents;
  let direction = 1;
  if (sortDir ==="desc"){
    direction= -1;
  }else{
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

function sortByProperty(studentA, studentB){
  console.log(`sortBy is ${sortBy}`);
  if (studentA[sortBy]<studentB[sortBy]){
    return -1 * direction;
  }else{
    return 1 * direction;
  }
}
displayList(sortedList);
}

// function sortByLastName(studentA, studentB){
//   if (studentA.lastName<studentB.lastName){
//     return -1;
//   }else{
//     return 1;
//   }
// }
// function sortByHouse(studentA, studentB){
//   if (studentA.house<studentB.house){
//     return -1;
//   }else{
//     return 1;
//   }
// }

function displayStudent(student) {
  //   // create clone
  const clone = document.querySelector("template#studentTemplate").content.cloneNode(true);

  //   // set clone data
  clone.querySelector(".firstname").textContent = student.firstName;
  clone.querySelector(".middlename").textContent = student.middleName;
  clone.querySelector(".lastname").textContent = student.lastName;
  clone.querySelector(".house").textContent = student.house;
  // clone.querySelector(".nickname").textContent = student.nickname;
  // clone.querySelector("[data-field=image] img").src = `images/${
  //   student.lastName
  // }_${student.firstName[0]}.png`;
  if (student.lastName.includes("-")) {
    clone.querySelector(".student_img").src = `images/${student.lastName.substring(student.lastName.indexOf("-") + 1)}_${student.firstName[0]}.png`;
  } else {
    clone.querySelector(".student_img").src = `images/${student.lastName}_${student.firstName[0]}.png`;
  }
  if (student.lastName.includes("Patil")) {
    clone.querySelector(".student_img").src = `images/${student.lastName}_${student.firstName}.png`;
  }
  //   // append clone to list
  document.querySelector("#studentlist").appendChild(clone);
}
function displayList(students) {
  // clear the list
  document.querySelector("#studentlist").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}
