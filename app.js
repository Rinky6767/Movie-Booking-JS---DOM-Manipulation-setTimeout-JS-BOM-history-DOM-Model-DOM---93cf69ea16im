import { fetchMovieAvailability, fetchMovieList } from "./api.js";

let main = document.querySelector("main.content");
let parentbook = document.getElementById("booker");
let data = [];
let selected = [];
let ch = false;
let btn = document.getElementById("book-ticket-btn");
btn.addEventListener("click", booking);
let checkhead = 0;
let head;
let number = document.createElement("input");
let email = document.createElement("input");
let promise = fetchMovieList();
promise.then((res) => {
  data = res;
  console.log("data1: " + data[0]);
  if (checkhead === 1) {
    main.removeChild(head);
  }
  let movies = document.createElement("div");
  movies.classList.add("movie-holder");

  for (let i = 0; i < data.length; i++) {
    let anchor = document.createElement("a");
    anchor.classList.add("movie-link");
    anchor.classList.add("arrange");
    anchor.setAttribute("href", "/" + data[i].email);

    let div = document.createElement("div");
    div.classList.add("movie");
    div.setAttribute("data-id", data[i].name);
    div.addEventListener("click", seatBooking);
    anchor.appendChild(div);
    let div2 = document.createElement("div");
    div2.classList.add("movie-img-wrapper");
    let urls = data[i].imgUrl;
    div2.style.backgroundImage = "url( " + urls + ")";
    div.appendChild(div2);
    let movname = document.createElement("h4");
    movname.textContent = data[i].name;
    div.appendChild(movname);
    movies.appendChild(anchor);
  }
  main.appendChild(movies);
});

if (data.length === 0 || data === undefined) {
  head = document.createElement("h1");
  head.id = "loader";
  head.textContent = "Loding...";
  main.appendChild(head);
  checkhead = 1;
}

function seatBooking(event) {
  event.preventDefault();
  let name = event.currentTarget.getAttribute("data-id");
  console.log("mail: " + name);
  let promise = fetchMovieAvailability(name);
  promise.then((res) => {
    let data2 = res;
    let bookerh = document.querySelector(".v-none");
    bookerh.classList.remove("v-none");
    bookerh.classList.add("v-bl");
    //grid show
    displayGrid(data2);
  });
}

function displayGrid(data2) {
  console.log("data: " + data2);
  let gridHolder = document.querySelector("#booker-grid-holder");
  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  gridHolder.appendChild(div1);
  gridHolder.appendChild(div2);
  let table1 = document.createElement("table");
  let table2 = document.createElement("table");
  div1.classList.add("booking-grid");
  div2.classList.add("booking-grid");
  //create cells
  let c = 0;
  for (let i = 1; i <= 4; i++) {
    let tr = document.createElement("tr");
    for (let j = 1; j <= 3; j++) {
      let td = document.createElement("td");
      let button = document.createElement("button");
      button.addEventListener("click", seatSelected);
      td.appendChild(button);
      c = c + 1;
      if (data2.includes(c)) {
        button.classList.add("unavailable-seat");
        button.setAttribute("disabled", "true");
      } else {
        button.classList.add("available-seat");
      }
      button.textContent = c;
      button.id = "booking-grid-" + c;
      tr.appendChild(td);
      console.log("cell: " + c + " " + i);
    }
    table1.appendChild(tr);
  }

  div1.appendChild(table1);

  c = 12;
  for (let i = 1; i <= 4; i++) {
    let tr = document.createElement("tr");
    for (let j = 1; j <= 3; j++) {
      let td = document.createElement("td");
      let button = document.createElement("button");
      button.addEventListener("click", seatSelected);
      td.appendChild(button);
      c = c + 1;
      if (data2.includes(c)) {
        button.classList.add("unavailable-seat");
        button.setAttribute("disabled", "true");
      } else {
        button.classList.add("available-seat");
      }
      button.textContent = c;
      button.id = "booking-grid-" + c;
      tr.appendChild(td);
      console.log("cell: " + c + " " + i);
    }
    table2.appendChild(tr);
  }

  div2.appendChild(table2);
}

function seatSelected(event) {
  let num = event.target.textContent;
  if (!ch) {
    if (btn.hasAttribute("class")) {
      btn.classList.remove("v-none");
      btn.classList.add("books");
      console.log("removed");
    }
  }
  ch = true;
  console.log(num);
  if (selected.includes(num)) {
    let index = selected.indexOf(num);
    selected.splice(index, 1);
    event.target.removeAttribute("style");
  } else {
    selected.push(num);

    event.target.classList.add("selected-seat");
    event.target.setAttribute("style", " border: 4px solid rgb(0, 0, 0) ;");
  }
  if (selected.length === 0) {
    btn.classList.remove("books");
    btn.classList.add("v-none");
  }
  console.log("seats: " + selected);
}

function booking(event) {
  let newcontent = document.createElement("div");
  newcontent.id = "confirm-purchase";
  newcontent.style.display = "flex";
  newcontent.style.justifyContent = "center";
  newcontent.style.alignItems = "center";
  newcontent.style.flexDirection = "column";
  let h3 = document.createElement("h3");
  h3.style.margin = "20px";
  h3.textContent = `Confirm your booking for seat numbers:${selected.join(
    ","
  )}`;
  let form = document.createElement("form");
  form.style.display = "flex";
  form.style.justifyContent = "center";
  form.style.alignItems = "center";
  form.style.flexDirection = "column";
  form.style.margin = "20px";
  form.id = "customer-detail-form";

  //input
  let ediv = document.createElement("div");
  ediv.style.display = "flex";

  email.style.margin = "10px";
  let label1 = document.createElement("label");
  label1.setAttribute("for", "em");
  label1.textContent = "Enter your Email id:";
  label1.style.margin = "5px";
  email.id = "email";
  email.setAttribute("type", "email");
  email.setAttribute("name", "email");
  email.setAttribute("required", "");
  ediv.appendChild(label1);
  ediv.appendChild(email);
  form.appendChild(ediv);

  let ndiv = document.createElement("div");
  ndiv.style.display = "flex";

  number.style.margin = "10px";
  let label2 = document.createElement("label");
  label2.textContent = "Enter your phone number:";
  label2.style.margin = "4px";
  ndiv.appendChild(label2);
  number.setAttribute("type", "tel");
  number.setAttribute("name", "number");
  number.setAttribute("required", "");
  number.setAttribute("pattern", "[0-9]{3}[0-9]{2}[0-9]{3}[0-9]{2}");
  ndiv.appendChild(number);
  form.appendChild(ndiv);

  let sbtn = document.createElement("button");
  sbtn.textContent = "Purchase";
  sbtn.addEventListener("click", successBooking);
  newcontent.appendChild(h3);
  form.appendChild(sbtn);
  newcontent.appendChild(form);
  document.body.removeChild(parentbook);
  document.body.appendChild(newcontent);
}

function successBooking() {
  let parentel = document.querySelector("#confirm-purchase");
  document.body.removeChild(parentel);
  let newcontent3 = document.createElement("div");
  newcontent3.style.display = "flex";
  newcontent3.style.flexDirection = "column";
  newcontent3.style.justifyContent = "center";
  newcontent3.style.alignItems = "center";
  newcontent3.style.margin = "10px";
  newcontent3.id = "Success";
  newcontent3.textContent = "Booking details";
  let seatdiv = document.createElement("h3");
  seatdiv.textContent = `Seats: ${selected.join(",")}`;
  newcontent3.appendChild(seatdiv);

  let numdiv = document.createElement("h3");
  numdiv.textContent = "Phone number: " + number.value;
  newcontent3.appendChild(numdiv);

  let emdiv = document.createElement("h3");
  emdiv.textContent = "Email number: " + email.value;
  newcontent3.appendChild(emdiv);
  document.body.appendChild(newcontent3);
}

