"use strict";

//cleaning the data
window.addEventListener("DOMContentLoaded", start);

const arrayExpelled = [];
const allStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickname: "",
  image: "",
  house: "",
  expel: false,
  blood: "",
  gender: "",
  squad:false,
  status: "Not Expelled",
  prefect: false,
};
const settings = {
  filter: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

function start() {
  console.log("ready");
  registerButtons();
  loadJSON();
}
//buttons
function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

//cleaning data

function loadJSON() {
  console.log("loadJSON");

  Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((resp) => resp.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((resp) => resp.json())]).then((jsonData) => {
    prepareObjects(jsonData[0], jsonData[1]);
  });
  console.log("JSON loaded");
}

function prepareObjects(jsonData) {
  jsonData.forEach((elm) => {
    const student = Object.create(Student);

    let fullname = elm.fullname.trim();
    let house = elm.house.trim();
    let gender = elm.gender.trim();
    let firstName = (student.firstName = fullname.substring(fullname.lastIndexOf(), fullname.indexOf(" ")));

    if (fullname.indexOf(" ") >= 0) {
      student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1);
    } else {
      firstName = student.firstName = fullname.substring(fullname.indexOf(" ") + 1);
    }

    let middleName = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));

    if (middleName.includes('"')) {
      student.nickname = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
    } else {
      student.middleName = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
      student.middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1);
    }

    let lastName = (student.lastName = fullname.substring(fullname.lastIndexOf(" ") + 1));
    if (fullname.indexOf(" ") >= 0) {
      student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1);
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
student.gender = gender;
    student.gender = student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1).toLowerCase();
    allStudents.push(student);
  });

  buildList();
}

//filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {

  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Expelled") {
    filteredList = arrayExpelled;
  } 

  return filteredList;
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

  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");
  event.target.classList.add("sortby");
  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user selected ${sortBy} -  ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}
function buildList() {
  const currentList = filterList(allStudents);
  const sortedlist = sortList(currentList);
  displayList(sortedlist);
}

function displayStudent(student) {
  //   // create clone
  const clone = document.querySelector("template#studentTemplate").content.cloneNode(true);

  //   // set clone data
  clone.querySelector(".firstname").textContent = student.firstName;
  clone.querySelector(".middlename").textContent = student.middleName;
  clone.querySelector(".lastname").textContent = student.lastName;
  clone.querySelector(".house").textContent = student.house;
  clone.querySelector(".nickname").textContent = student.nickname;
  if (student.lastName.includes("-")) {
    clone.querySelector(".student_img").src = `images/${student.lastName.substring(student.lastName.indexOf("-") + 1).toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
  } else {
    clone.querySelector(".student_img").src = `images/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
  }
  if (student.lastName.includes("Patil")) {
    clone.querySelector(".student_img").src = `images/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
  }

  //expell
  clone.querySelector("[data-field='expel']").dataset.expel = student.expel;
 
  clone.querySelector("[data-field='expel']").addEventListener("click", clickExpelled);

  function clickExpelled() {
    student.status = "Expelled";
    const indexOfCurrentStu = allStudents.findIndex((element) => element.firstName === student.firstName);
    const arrayOfRemovedStu = allStudents.splice(indexOfCurrentStu, 1);

    arrayExpelled.push(arrayOfRemovedStu[0]);

    console.log("clickExpelled inex in array", allStudents);
    console.log("expelled students", arrayExpelled);
    buildList();
  }

  //make squad
  clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
  clone.querySelector("[data-field=squad]").addEventListener("click", makeSquad);

  function makeSquad() {
    if (student.squad === true) {
      student.squad = false;
    } else if(student.house="Slytherin") {
      student.squad = true;
    }else{
      student.squad = true;
    }
    buildList();

  }
// make prefect

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", makePrefect);

function makePrefect(){
  if (student.prefect === true){
    student.prefect = false;
  }else{
    tryToMakeAPrefect(student)
   
  }
  buildList();
}

function tryToMakeAPrefect(selectedStudent){

  const prefects = allStudents.filter(student => student.prefect);
  const numberOfPrefects = prefects.length;
  const other = prefects.filter(student => student.house === selectedStudent.house).shift();
  if (other !== undefined){
    console.log("there can only be one prefect of each house")
    removeOther(other)
  }else if (numberOfPrefects>=2){
    console.log("there can only be 2 winners")
    removeAorB(prefects[0], prefects[1]);
  }else{
    makePrefect(selectedStudent);
  }
 

function removeOther(other){

document.querySelector("#onlyonehouse").classList.add("show");
document.querySelector("#onlyonehouse .closebutton").addEventListener("click", closeDialog);
document.querySelector("#onlyonehouse .remove").addEventListener("click", clickRemoveOther);


function closeDialog(){
  document.querySelector("#onlyonehouse").classList.remove("show");
  document.querySelector("#onlyonehouse .remove").removeEventListener("click", clickRemoveOther);
  document.querySelector("#onlyonehouse .closebutton").removeEventListener("click", closeDialog);
}

function clickRemoveOther(){
    removePrefect(other);
    makePrefect(selectedStudent);
    buildList();
closeDialog();
}

}
function removeAorB(prefectA, prefectB){
  document.querySelector("#onlysixprefects").classList.add("show");
  document.querySelector("#onlysixprefects .closebutton").addEventListener("click", closeDialog);
  document.querySelector("#onlysixprefects .removeA").addEventListener("click", clickRemoveA);
  document.querySelector("#onlysixprefects .removeB").addEventListener("click", clickRemoveB);
  


  function closeDialog(){
    document.querySelector("#onlysixprefects").classList.remove("show");
  document.querySelector("#onlysixprefects .closebutton").removeEventListener("click", closeDialog);
  document.querySelector("#onlysixprefects .removeA").removeEventListener("click", clickRemoveA);
  document.querySelector("#onlysixprefects .removeB").removeEventListener("click", clickRemoveB);
  
  }
  function clickRemoveA(){

    removePrefect(prefectA);
    makePrefect(selectedStudent);
    buildList();
    closeDialog();
  }

function clickRemoveB(){
  
  removePrefect(prefectB);
  makePrefect(selectedStudent);
  buildList();
  closeDialog();
}


}
function removePrefect(prefectStudent){
  prefectStudent.prefect = false;
}
function makePrefect(student){
  student.prefect = true;
}
}
  // modal

  clone.querySelector(".img_container").addEventListener("click", modal);
  function modal() {
    const modal = document.querySelector(".modal");
    let expelStud = modal.querySelector("#modal-expel");
    const modalBg = document.querySelector(".modal-bg");
    modalBg.classList.remove("hide");


      expelStud.textContent = "Student Status: " + student.status;
    modal.querySelector("#modal-firstname").textContent = student.firstName;
    modal.querySelector("#modal-middlename").textContent = student.middleName;
    modal.querySelector("#modal-lastname").textContent = student.lastName;

    let squadStatus = document.querySelector("#modal-squad");
    if (student.squad === false){
      squadStatus.style.filter = "grayscale(1)";
    } else if (student.squad === true){
      squadStatus.style.filter = "grayscale(0)";
    }
    let prefectStatus = document.querySelector("#modal-prefect");
     if (student.prefect === false){
      prefectStatus.style.filter = "grayscale(1)";
    } else if (student.prefect=== true){
      prefectStatus.style.filter = "grayscale(0)";
    }
    modal.querySelector("#modal-gender").textContent = "Gender: " + student.gender
    modal.querySelector(".modal-img").src = `images/${student.lastName.substring(student.lastName.indexOf("-") + 1).toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    modal.querySelector(".modal-house").textContent = student.house;
    modal.dataset.house = student.house;
    modal.querySelector("object").setAttribute("data", "images/" + student.house.toLowerCase() + ".png");
    console.log("images/" + student.house + ".png");
    modalBg.addEventListener("click", (e) => {
      closeModal();
    });
  }

  //close modal
  function closeModal() {
    let modalBg = document.querySelector(".modal-bg");
    modalBg.classList.add("hide");
  }

  //   // append clone to list
  document.querySelector("#studentlist").appendChild(clone);
}
function displayList(students) {
  // clear the list
  document.querySelector("#studentlist").innerHTML = "";
  students.forEach(displayStudent);
  document.querySelector(".number").textContent = "The number of students is: " + students.length;
  document.querySelector(".number2").textContent = "The number of expelled students is: " + arrayExpelled.length;

}
