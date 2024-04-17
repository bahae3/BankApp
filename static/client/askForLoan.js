// This is for the first icon (months)
const months_info = document.querySelector("#months-info");
const month_text = document.querySelector("#month-info-text");

months_info.addEventListener("mouseover", mouseOver1);
months_info.addEventListener("mouseout", mouseOut1);

function mouseOver1() {
  month_text.style.display = "block";
}

function mouseOut1() {
  month_text.style.display = "none";
}

// This is for the second icon (approval)
const loans_info = document.querySelector("#loans-info");
const loans_text = document.querySelector("#loans-info-text");

loans_info.addEventListener("mouseover", mouseOver2);
loans_info.addEventListener("mouseout", mouseOut2);

function mouseOver2() {
  loans_text.style.display = "block";
}

function mouseOut2() {
  loans_text.style.display = "none";
}