"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {
  console.log("ready");

  loadJSON();
}

function loadJSON() {
  console.log("loadJSON");
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((r) => r.json())
    .then((jsonData) => {
      // loaded --> prepare objects
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

    // const firstSpace = fullname.indexOf(" ");
    // const lastSpace = fullname.lastIndexOf(" ");
    // // firstName
    // if (firstSpace == -1) {
    //   student.firstName = fullname;
    // } else {
    //   student.firstName = fullname.substring(0, firstSpace);
    // }
    // student.firstName = fullname.substring(0, firstSpace);
    // student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();

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

    // const hyphen = student.lastName.includes("-");
    //  if( hyphen == 7){

    //     student.lastName = student.lastName.substring(7, 8).toUpperCase() + student.lastName.substring(8).toLowerCase();

    //   }

    student.house = house;
    student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();

    if (fullname.indexOf(" ") == -1) {
      student.image = student.lastName.toLowerCase() + `_${student.firstName.substring(0, 1).toLowerCase()}` + `.png`;
    } else {
      student.image = student.lastName.substring(fullname.indexOf(" ") + 1).toLowerCase() + `_${student.firstName.substring(0, 1).toLowerCase()}` + `.png`;
    }
    allStudents.push(student);
  });

  displayList();
  console.log("allStudents", allStudents);
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  //   // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  //   // set clone data
  clone.querySelector("[data-field=name]").textContent = student.firstName;
  clone.querySelector("[data-field=middle]").textContent = student.middleName;
  clone.querySelector("[data-field=last]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  // clone.querySelector("[data-field=image] img").src = `images/${
  //   student.lastName
  // }_${student.firstName[0]}.png`;
  if (student.lastName.includes("-")) {
    clone.querySelector("[data-field=image] img").src = `../images/${student.lastName.substring(student.lastName.indexOf("-") + 1)}_${student.firstName[0]}.png`;
  } else {
    clone.querySelector("[data-field=image] img").src = `../images/${student.lastName}_${student.firstName[0]}.png`;
  }
  if (student.lastName.includes("Patil")) {
    clone.querySelector("[data-field=image] img").src = `../images/${student.lastName}_${student.firstName}.png`;
  }
  //   // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
